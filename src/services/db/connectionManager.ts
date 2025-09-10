// @ts-ignore
import Database, { Database as DatabaseType } from 'better-sqlite3';
import { z } from 'zod';

const CONNECTION_CONFIG = {
  CONNECTION_POOL: {
    MIN_CONNECTIONS: 2,
    MAX_CONNECTIONS: 10
  }
};

const poolConfigSchema = z.object({
  min: z.number().min(1).max(10).default(2),
  max: z.number().min(5).max(50).default(10),
  idleTimeoutMillis: z.number().min(1000).max(300000).default(30000),
  acquireTimeoutMillis: z.number().min(1000).max(60000).default(10000),
  evictionRunIntervalMillis: z.number().min(1000).max(300000).default(30000)
});

export type PoolConfig = z.infer<typeof poolConfigSchema>;

interface PoolConnection {
  connection: DatabaseType;
  inUse: boolean;
  created: number;
}

export class ConnectionManager {
  private static instance: ConnectionManager;
  private connections: PoolConnection[] = [];
  private activeConnections: number = 0;
  private waitingRequests: number = 0;
  private metrics = {
    totalConnections: 0,
    acquireTime: [] as number[],
    waitTime: [] as number[]
  };

  private constructor(_config: Partial<PoolConfig> = {}) {
    
    // Initialize minimum connections
    for (let i = 0; i < CONNECTION_CONFIG.CONNECTION_POOL.MIN_CONNECTIONS; i++) {
      this.connections.push({
        connection: this.createConnection(),
        inUse: false,
        created: Date.now()
      });
    }

    // Monitor pool health
    setInterval(() => this.monitorPoolHealth(), 60000);
  }

  static getInstance(config?: Partial<PoolConfig>): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager(config);
    }
    return ConnectionManager.instance;
  }

  async getConnection(): Promise<DatabaseType> {
    const startTime = Date.now();
    this.waitingRequests++;

    try {
      // Find available connection
      let poolConnection = this.connections.find(conn => !conn.inUse);
      
      if (!poolConnection && this.connections.length < CONNECTION_CONFIG.CONNECTION_POOL.MAX_CONNECTIONS) {
        // Create new connection if under limit
        poolConnection = {
          connection: this.createConnection(),
          inUse: false,
          created: Date.now()
        };
        this.connections.push(poolConnection);
      }
      
      if (!poolConnection) {
        throw new Error('No available connections');
      }
      
      poolConnection.inUse = true;
      this.activeConnections++;
      this.waitingRequests--;

      // Record metrics
      const acquireTime = Date.now() - startTime;
      this.metrics.acquireTime.push(acquireTime);
      this.metrics.waitTime.push(this.waitingRequests > 0 ? acquireTime : 0);

      return poolConnection.connection;
    } catch (error) {
      this.waitingRequests--;
      throw error;
    }
  }

  async releaseConnection(connection: DatabaseType) {
    try {
      const poolConnection = this.connections.find(conn => conn.connection === connection);
      if (poolConnection) {
        poolConnection.inUse = false;
      }
      this.activeConnections--;
    } catch (error) {
      console.error('Error releasing connection:', error);
      this.activeConnections--;
    }
  }

  getMetrics() {
    const avgAcquireTime = this.calculateAverage(this.metrics.acquireTime);
    const avgWaitTime = this.calculateAverage(this.metrics.waitTime);

    return {
      poolSize: this.connections.length,
      activeConnections: this.activeConnections,
      waitingRequests: this.waitingRequests,
      totalConnections: this.metrics.totalConnections,
      averageAcquireTime: avgAcquireTime,
      averageWaitTime: avgWaitTime
    };
  }

  private async monitorPoolHealth() {
    const metrics = this.getMetrics();
    
    // Log warnings for potential issues
    if (metrics.waitingRequests > metrics.poolSize * 0.5) {
      console.warn('High number of waiting requests:', metrics.waitingRequests);
    }

    if (metrics.averageWaitTime > 1000) {
      console.warn('High average wait time:', metrics.averageWaitTime);
    }

    if (metrics.activeConnections === metrics.poolSize) {
      console.warn('Pool at maximum capacity');
    }

    // Reset metrics arrays periodically to prevent memory growth
    if (this.metrics.acquireTime.length > 1000) {
      this.metrics.acquireTime = this.metrics.acquireTime.slice(-1000);
    }
    if (this.metrics.waitTime.length > 1000) {
      this.metrics.waitTime = this.metrics.waitTime.slice(-1000);
    }
  }

  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }

  private createConnection(): DatabaseType {
    // Implement actual database connection creation here
    // This is a placeholder for the actual implementation
    return new Database(':memory:');
  }
}