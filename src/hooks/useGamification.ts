// src/hooks/useGamification.ts
import { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth.js';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  dateEarned?: Date;
}

export interface UserStats {
  level: number;
  xp: number;
  xpForNextLevel: number;
  streak: number;
  longestStreak: number;
  totalProblems: number;
  accuracy: number;
  studyTime: number;
  badgesEarned: number;
  totalBadges: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  unlocked: boolean;
  progress?: number;
  target?: number;
  dateEarned?: Date;
}

export function useGamification() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpForNextLevel: 1000,
    streak: 0,
    longestStreak: 0,
    totalProblems: 0,
    accuracy: 0,
    studyTime: 0,
    badgesEarned: 0,
    totalBadges: 0
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserGamification();
    }
  }, [user]);

  const loadUserGamification = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Listen to real-time updates from Firebase
      const userRef = doc(db, 'users', user.uid);
      
      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const gamificationData = userData.gamification || {};
          
          // Convert Firebase data to our stats format
          const firebaseStats = {
            level: gamificationData.level || 1,
            xp: gamificationData.xp || 0,
            xpForNextLevel: 1000, // Calculate based on level
            streak: gamificationData.streak?.current || 0,
            longestStreak: gamificationData.streak?.longest || 0,
            totalProblems: 0, // We'll track this separately later
            accuracy: 85, // Default for now
            studyTime: Math.round((gamificationData.studyTime?.total || 0) / 60), // Convert minutes to hours
            badgesEarned: gamificationData.achievements?.length || 0,
            totalBadges: 10 // Total available badges
          };
          
          setStats(firebaseStats);
          
          // Set initial empty arrays for badges and achievements
          // We'll populate these with actual data later
          setBadges([]);
          setAchievements([]);
        }
        setIsLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error loading gamification data:', error);
      setIsLoading(false);
    }
  };

  const addXP = async (amount: number, reason: string = 'Activity completed') => {
    if (!user) return { success: false };
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const newXP = stats.xp + amount;
      const newLevel = Math.floor(newXP / 1000) + 1;
      const leveledUp = newLevel > stats.level;
      
      // Update Firebase
      await updateDoc(userRef, {
        'gamification.xp': newXP,
        'gamification.level': newLevel,
        'lastActive': serverTimestamp()
      });
      
      if (leveledUp) {
        console.log(`🎉 Leveled up to ${newLevel}!`);
        // Could trigger level up notification here
      }
      
      console.log(`✅ Added ${amount} XP for: ${reason}`);
      return { success: true, newXP, newLevel, leveledUp };
    } catch (error) {
      console.error('❌ Error adding XP:', error);
      return { success: false };
    }
  };

  const incrementStreak = async () => {
    if (!user) return { success: false };
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const today = new Date();
      const lastStudyDate = new Date(); // We'll get this from Firebase later
      
      // Check if it's a new day
      const isNewDay = today.toDateString() !== lastStudyDate.toDateString();
      
      if (isNewDay) {
        const newStreak = stats.streak + 1;
        const newLongestStreak = Math.max(newStreak, stats.longestStreak);
        
        await updateDoc(userRef, {
          'gamification.streak.current': newStreak,
          'gamification.streak.longest': newLongestStreak,
          'gamification.streak.lastStudyDate': serverTimestamp(),
          'lastActive': serverTimestamp()
        });
        
        console.log(`🔥 Streak updated to ${newStreak} days!`);
        
        // Check for streak achievements
        if (newStreak === 3) {
          await addXP(50, 'First 3-day streak!');
        } else if (newStreak === 7) {
          await addXP(100, 'Week-long streak!');
        } else if (newStreak === 30) {
          await addXP(500, 'Month-long streak!');
        }
        
        return { success: true, newStreak };
      }
      
      return { success: true, newStreak: stats.streak };
    } catch (error) {
      console.error('❌ Error incrementing streak:', error);
      return { success: false };
    }
  };

  const trackStudyTime = async (minutes: number) => {
    if (!user) return { success: false };
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const newTotalMinutes = (stats.studyTime * 60) + minutes;
      
      await updateDoc(userRef, {
        'gamification.studyTime.total': newTotalMinutes,
        'gamification.studyTime.daily': {
          [new Date().toDateString()]: minutes
        },
        'lastActive': serverTimestamp()
      });
      
      console.log(`⏱️ Tracked ${minutes} minutes of study time`);
      return { success: true, totalMinutes: newTotalMinutes };
    } catch (error) {
      console.error('❌ Error tracking study time:', error);
      return { success: false };
    }
  };

  const unlockAchievement = async (achievementId: string) => {
    if (!user) return { success: false };
    
    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Add achievement to user's achievements array
      await updateDoc(userRef, {
        'gamification.achievements': [...(stats.badgesEarned ? [] : []), achievementId],
        'lastActive': serverTimestamp()
      });
      
      console.log(`🏆 Achievement unlocked: ${achievementId}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Error unlocking achievement:', error);
      return { success: false };
    }
  };

  // Placeholder functions for compatibility
  const unlockBadge = async (badgeId: string) => {
    return { success: true };
  };

  const updateProgress = async (progressId: string, progress: number) => {
    return { success: true };
  };

  const updateBadgeProgress = async (badgeId: string, progress: number) => {
    return { success: true };
  };

  const dismissAchievementNotification = () => {
    setNewAchievement(null);
  };

  return {
    badges,
    stats,
    achievements,
    newAchievement,
    isLoading,
    addXP,
    incrementStreak,
    trackStudyTime,
    unlockAchievement,
    unlockBadge,
    updateProgress,
    updateBadgeProgress,
    dismissAchievementNotification
  };
}
