interface SessionConfig {
  maxConcurrentSessions: number;
  sessionTimeout: number;
}

interface SessionInfo {
  userId: string;
  deviceId: string;
  lastActive: number;
  ip: string;
  userAgent: string;
}

export class SessionManager {
  private sessions: Map<string, SessionInfo[]> = new Map();
  private config: SessionConfig;

  constructor(config?: Partial<SessionConfig>) {
    this.config = {
      maxConcurrentSessions: config?.maxConcurrentSessions || 3,
      sessionTimeout: config?.sessionTimeout || 30 * 60 * 1000 // 30 minutes
    };

    // Cleanup inactive sessions periodically
    setInterval(() => this.cleanupInactiveSessions(), 5 * 60 * 1000);
  }

  createSession(userId: string, deviceId: string, ip: string, userAgent: string): boolean {
    const userSessions = this.sessions.get(userId) || [];
    
    // Remove inactive sessions
    this.cleanupUserSessions(userId);
    
    // Check concurrent session limit
    if (userSessions.length >= this.config.maxConcurrentSessions) {
      // Remove oldest session
      userSessions.sort((a, b) => a.lastActive - b.lastActive);
      userSessions.shift();
    }

    // Add new session
    userSessions.push({
      userId,
      deviceId,
      lastActive: Date.now(),
      ip,
      userAgent
    });

    this.sessions.set(userId, userSessions);
    return true;
  }

  validateSession(userId: string, deviceId: string): boolean {
    const userSessions = this.sessions.get(userId);
    if (!userSessions) return false;

    const session = userSessions.find(s => s.deviceId === deviceId);
    if (!session) return false;

    // Check session timeout
    if (Date.now() - session.lastActive > this.config.sessionTimeout) {
      this.removeSession(userId, deviceId);
      return false;
    }

    // Update last active timestamp
    session.lastActive = Date.now();
    return true;
  }

  removeSession(userId: string, deviceId: string): void {
    const userSessions = this.sessions.get(userId);
    if (!userSessions) return;

    const updatedSessions = userSessions.filter(s => s.deviceId !== deviceId);
    if (updatedSessions.length === 0) {
      this.sessions.delete(userId);
    } else {
      this.sessions.set(userId, updatedSessions);
    }
  }

  private cleanupInactiveSessions(): void {
    const now = Date.now();
    for (const [userId, sessions] of this.sessions.entries()) {
      const activeSessions = sessions.filter(
        session => now - session.lastActive <= this.config.sessionTimeout
      );
      
      if (activeSessions.length === 0) {
        this.sessions.delete(userId);
      } else {
        this.sessions.set(userId, activeSessions);
      }
    }
  }

  private cleanupUserSessions(userId: string): void {
    const userSessions = this.sessions.get(userId);
    if (!userSessions) return;

    const now = Date.now();
    const activeSessions = userSessions.filter(
      session => now - session.lastActive <= this.config.sessionTimeout
    );

    if (activeSessions.length === 0) {
      this.sessions.delete(userId);
    } else {
      this.sessions.set(userId, activeSessions);
    }
  }
}