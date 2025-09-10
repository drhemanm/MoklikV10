import { 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  UserCredential
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { RateLimiter } from '../rateLimit.js';
import { BruteForceProtection } from '../security/bruteForceProtection.js';
import { PasswordPolicy } from '../security/passwordPolicy.js';
import { SessionManager } from '../security/sessionManager.js';
import { auth, googleProvider } from '../../config/firebase.js';
import { db } from '../../config/firebase.js';
import { userService } from './user.js';

const bruteForceProtection = new BruteForceProtection();
const sessionManager = new SessionManager();

const rateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5, // 5 attempts per window
  blockDuration: 60 * 60 * 1000 // 1 hour block
});

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public remainingAttempts?: number,
    public msBeforeNext?: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function signInWithEmailPassword(
  email: string,
  password: string,
  ip: string,
  userAgent: string
): Promise<UserCredential> {
  // Check for brute force attempts
  const bruteForceCheck = bruteForceProtection.checkAttempt(ip, userAgent);
  if (bruteForceCheck.blocked) {
    throw new AuthError(
      bruteForceCheck.reason || 'Access blocked',
      'auth/access-blocked'
    );
  }

  // Check rate limiting
  const rateLimit = rateLimiter.isRateLimited(ip);
  if (rateLimit.limited) {
    throw new AuthError(
      'Too many login attempts. Please try again later.',
      'auth/too-many-requests',
      rateLimit.remainingAttempts,
      rateLimit.msBeforeNext
    );
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Create session
    const deviceId = crypto.randomUUID();
    sessionManager.createSession(result.user.uid, deviceId, ip, userAgent);
    
    rateLimiter.reset(ip); // Reset on successful login
    bruteForceProtection.clearSuspiciousIP(ip);
    
    return result;
  } catch (error: any) {
    // Don't count certain errors against rate limit
    if (!['auth/user-not-found', 'auth/wrong-password'].includes(error.code)) {
      rateLimiter.reset(ip);
    }
    throw error;
  }
}

export async function createUserWithEmailPassword(
  email: string,
  password: string
): Promise<UserCredential> {
  // Validate password strength
  const passwordCheck = PasswordPolicy.validatePassword(password);
  if (!passwordCheck.valid) {
    throw new AuthError(
      passwordCheck.error || 'Invalid password',
      'auth/weak-password'
    );
  }

  // Check for common passwords
  if (PasswordPolicy.isCommonPassword(password)) {
    throw new AuthError(
      'This password is too common. Please choose a stronger password.',
      'auth/common-password'
    );
  }

  // Create user
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await userService.createUserProfile(result.user.uid, email);
  return result;
}

export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Create user profile if it's a new user
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      await userService.createUserProfile(result.user.uid, result.user.email!);
    }
    
    return result;
  } catch (error) {
    console.error('Google sign in error:', error instanceof Error ? error.message : error);
    throw error;
  }
}