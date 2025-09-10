import { useState, useEffect } from 'react';
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
    xpForNextLevel: 300,
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
    setIsLoading(true);
    
    try {
      // Initialize with clean state for new users
      const initialBadges: Badge[] = [];
      const initialStats: UserStats = {
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
      };
      const initialAchievements: Achievement[] = [];
      
      setBadges(initialBadges);
      setStats(initialStats);
      setAchievements(initialAchievements);
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addXP = async (amount: number) => {
    if (!user) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newXP = stats.xp + amount;
      const newLevel = Math.floor(newXP / stats.xpForNextLevel) + 1;
      const leveledUp = newLevel > stats.level;
      
      setStats({
        ...stats,
        xp: newXP,
        level: newLevel
      });
      
      if (leveledUp) {
        // Trigger level up notification or animation
        console.log(`Leveled up to ${newLevel}!`);
      }
      
      return { success: true, newXP, newLevel, leveledUp };
    } catch (error) {
      console.error('Error adding XP:', error);
      return { success: false };
    }
  };

  const incrementStreak = async () => {
    if (!user) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newStreak = stats.streak + 1;
      const newLongestStreak = Math.max(newStreak, stats.longestStreak);
      
      setStats({
        ...stats,
        streak: newStreak,
        longestStreak: newLongestStreak
      });
      
      // Check for streak achievements
      if (newStreak === 7) {
        unlockAchievement('ach3');
      }
      
      return { success: true, newStreak };
    } catch (error) {
      console.error('Error incrementing streak:', error);
      return { success: false };
    }
  };

  const unlockAchievement = async (achievementId: string) => {
    if (!user) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const achievement = achievements.find(a => a.id === achievementId);
      if (!achievement || achievement.unlocked) return { success: false };
      
      const updatedAchievements = achievements.map(a => 
        a.id === achievementId
          ? { ...a, unlocked: true, dateEarned: new Date() }
          : a
      );
      
      setAchievements(updatedAchievements);
      setNewAchievement({ ...achievement, unlocked: true, dateEarned: new Date() });
      
      // Add XP reward
      await addXP(achievement.xpReward);
      
      return { success: true, achievement };
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      return { success: false };
    }
  };

  const unlockBadge = async (badgeId: string) => {
    if (!user) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const badge = badges.find(b => b.id === badgeId);
      if (!badge || badge.unlocked) return { success: false };
      
      const updatedBadges = badges.map(b => 
        b.id === badgeId
          ? { ...b, unlocked: true, dateEarned: new Date() }
          : b
      );
      
      setBadges(updatedBadges);
      setStats({
        ...stats,
        badgesEarned: stats.badgesEarned + 1
      });
      
      return { success: true, badge };
    } catch (error) {
      console.error('Error unlocking badge:', error);
      return { success: false };
    }
  };

  const updateProgress = async (achievementId: string, progress: number) => {
    if (!user) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const achievement = achievements.find(a => a.id === achievementId);
      if (!achievement || achievement.unlocked) return { success: false };
      
      const updatedAchievements = achievements.map(a => 
        a.id === achievementId
          ? { ...a, progress }
          : a
      );
      
      setAchievements(updatedAchievements);
      
      // Check if achievement should be unlocked
      if (achievement.target && progress >= achievement.target) {
        await unlockAchievement(achievementId);
      }
      
      return { success: true, progress };
    } catch (error) {
      console.error('Error updating progress:', error);
      return { success: false };
    }
  };

  const updateBadgeProgress = async (badgeId: string, progress: number) => {
    if (!user) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const badge = badges.find(b => b.id === badgeId);
      if (!badge || badge.unlocked) return { success: false };
      
      const updatedBadges = badges.map(b => 
        b.id === badgeId
          ? { ...b, progress }
          : b
      );
      
      setBadges(updatedBadges);
      
      // Check if badge should be unlocked
      if (badge.maxProgress && progress >= badge.maxProgress) {
        await unlockBadge(badgeId);
      }
      
      return { success: true, progress };
    } catch (error) {
      console.error('Error updating badge progress:', error);
      return { success: false };
    }
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
    unlockAchievement,
    unlockBadge,
    updateProgress,
    updateBadgeProgress,
    dismissAchievementNotification
  };
}