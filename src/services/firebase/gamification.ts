import { 
  doc, 
  updateDoc, 
  increment, 
  arrayUnion, 
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import type { GamificationState, Achievement, StudyGoal } from '../../types/gamification.js';

export const gamificationService = {
  async initializeUser(userId: string) {
    const userRef = doc(db, 'gamification', userId);
    const initialState: GamificationState = {
      xp: 0,
      level: 1,
      streak: {
        current: 0,
        longest: 0,
        lastStudyDate: Date.now(),
        streakSavers: 3
      },
      studyTime: {
        total: 0,
        daily: {},
        byTopic: {}
      },
      achievements: [],
      goals: [],
      notifications: []
    };

    await setDoc(userRef, initialState);
    return initialState;
  },

  async getState(userId: string): Promise<GamificationState | null> {
    const userRef = doc(db, 'gamification', userId);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? snapshot.data() as GamificationState : null;
  },

  async addXP(userId: string, amount: number) {
    const userRef = doc(db, 'gamification', userId);
    await updateDoc(userRef, {
      xp: increment(amount)
    });
  },

  async updateStreak(userId: string) {
    const userRef = doc(db, 'gamification', userId);
    const state = await this.getState(userId);
    if (!state) return;

    const today = new Date().setHours(0, 0, 0, 0);
    const lastStudy = new Date(state.streak.lastStudyDate).setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));

    let newStreak = state.streak.current;
    if (daysDiff === 1) {
      newStreak += 1;
    } else if (daysDiff > 1) {
      if (daysDiff === 2 && state.streak.streakSavers > 0) {
        await updateDoc(userRef, {
          'streak.streakSavers': increment(-1)
        });
      } else {
        newStreak = 1;
      }
    }

    await updateDoc(userRef, {
      'streak.current': newStreak,
      'streak.longest': Math.max(newStreak, state.streak.longest),
      'streak.lastStudyDate': today
    });
  },

  async logStudyTime(userId: string, topicId: string, minutes: number) {
    const userRef = doc(db, 'gamification', userId);
    const today = new Date().toISOString().split('T')[0];
    const batch = db.batch();
    
    // Update gamification data
    batch.update(userRef, {
      'studyTime.total': increment(minutes),
      [`studyTime.daily.${today}`]: increment(minutes),
      [`studyTime.byTopic.${topicId}`]: increment(minutes)
    });

    // Update user's last active timestamp
    const userProfileRef = doc(db, 'users', userId);
    batch.update(userProfileRef, {
      lastActive: serverTimestamp()
    });

    await batch.commit();
  },

  async unlockAchievement(userId: string, achievement: Achievement) {
    const userRef = doc(db, 'gamification', userId);
    const batch = db.batch();

    const notification = {
      id: crypto.randomUUID(),
      type: 'achievement' as const,
      message: `Achievement Unlocked: ${achievement.title}`,
      timestamp: Date.now(),
      read: false
    };

    batch.update(userRef, {
      achievements: arrayUnion({
        ...achievement,
        unlockedAt: Date.now()
      }),
      notifications: arrayUnion(notification)
    });

    // Update user's last active timestamp
    const userProfileRef = doc(db, 'users', userId);
    batch.update(userProfileRef, {
      lastActive: serverTimestamp()
    });

    await batch.commit();
  },

  async setGoal(userId: string, goal: StudyGoal) {
    const userRef = doc(db, 'gamification', userId);
    await updateDoc(userRef, {
      goals: arrayUnion(goal)
    });
  },

  async updateGoalProgress(userId: string, goalId: string, progress: number) {
    const state = await this.getState(userId);
    if (!state) return;

    const updatedGoals = state.goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress, completed: progress >= goal.target }
        : goal
    );

    const userRef = doc(db, 'gamification', userId);
    await updateDoc(userRef, { goals: updatedGoals });

    // Check if goal was just completed
    const goal = updatedGoals.find(g => g.id === goalId);
    if (goal?.completed && progress >= goal.target) {
      const notification = {
        id: crypto.randomUUID(),
        type: 'goal' as const,
        message: `Goal Completed: Study time goal reached!`,
        timestamp: Date.now(),
        read: false
      };

      await updateDoc(userRef, {
        notifications: arrayUnion(notification)
      });
    }
  }
};