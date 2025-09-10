// @ts-ignore
import Database from 'better-sqlite3';
import { z } from 'zod';

const APP_CONFIG = {
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

export class ConnectionManager {
  private static instance: ConnectionManager;
  private pool: any;
  private activeConnections: number = 0;
  private waitingRequests: number = 0;
  private readonly metrics = {
    totalConnections: 0,
    acquireTime: [] as number[],
    waitTime: [] as number[]
  };

  private constructor(config: Partial<PoolConfig> = {}) {
    const validatedConfig = poolConfigSchema.parse(config);
    
    // Optimize pool settings for production
    this.pool = new Pool({
      min: APP_CONFIG.CONNECTION_POOL.MIN_CONNECTIONS,
      max: APP_CONFIG.CONNECTION_POOL.MAX_CONNECTIONS,
      acquireRetryAttempts: 3,
      acquireRetryDelay: 1000,
      priorityRange: 5,
      idleTimeoutMillis: validatedConfig.idleTimeoutMillis,
      acquireTimeoutMillis: validatedConfig.acquireTimeoutMillis,
      evictionRunIntervalMillis: validatedConfig.evictionRunIntervalMillis,
      
      // Connection validation
      validate: async (connection: any) => {
        try {
          const startTime = Date.now();
          await connection.prepare('SELECT 1').get();
          const duration = Date.now() - startTime;
          
          // Invalidate slow connections
          if (duration > 1000) {
            return false;
          }
          return true;
        } catch {
          return false;
        }
      },

      // Connection factory
      create: async () => {
        const connection = await this.createConnection();
        this.metrics.totalConnections++;
        return connection;
      },

      // Connection destroyer
      destroy: async (connection: any) => {
        await connection.close();
        this.metrics.totalConnections--;
      }
    });

    // Monitor pool health
    setInterval(() => this.monitorPoolHealth(), 60000);
  }

  static getInstance(config?: Partial<PoolConfig>): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager(config);
    }
    return ConnectionManager.instance;
  }

  async getConnection() {
    const startTime = Date.now();
    this.waitingRequests++;

    try {
      const connection = await this.pool.acquire();
      this.activeConnections++;
      this.waitingRequests--;

      // Record metrics
      const acquireTime = Date.now() - startTime;
      this.metrics.acquireTime.push(acquireTime);
      this.metrics.waitTime.push(this.waitingRequests > 0 ? acquireTime : 0);

      return connection;
    } catch (error) {
      this.waitingRequests--;
      throw error;
    }
  }

  async releaseConnection(connection: any) {
    try {
      await this.pool.release(connection);
      this.activeConnections--;
    } catch (error) {
      console.error('Error releasing connection:', error);
      // Force destroy if release fails
      await this.pool.destroy(connection).catch(console.error);
      this.activeConnections--;
    }
  }

  getMetrics() {
    const avgAcquireTime = this.calculateAverage(this.metrics.acquireTime);
    const avgWaitTime = this.calculateAverage(this.metrics.waitTime);

    return {
      poolSize: this.pool.size,
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

  private async createConnection() {
    // Implement actual database connection creation here
    // This is a placeholder for the actual implementation
    return {};
  }
}