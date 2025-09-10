import React from 'react';
import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  dateEarned?: Date;
}

interface DigitalBadgeProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  showDetails?: boolean;
}

export function DigitalBadge({ 
  badge, 
  size = 'md', 
  onClick,
  showDetails = false
}: DigitalBadgeProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const rarityColors = {
    common: 'from-gray-200 to-gray-300',
    uncommon: 'from-green-200 to-green-300',
    rare: 'from-blue-200 to-blue-300',
    epic: 'from-purple-200 to-purple-300',
    legendary: 'from-yellow-200 to-yellow-300'
  };

  const rarityBorders = {
    common: 'border-gray-400',
    uncommon: 'border-green-400',
    rare: 'border-blue-400',
    epic: 'border-purple-400',
    legendary: 'border-yellow-400'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`
        ${sizeClasses[size]}
        rounded-full
        flex items-center justify-center
        bg-gradient-to-br ${rarityColors[badge.rarity]}
        border-4 ${rarityBorders[badge.rarity]}
        ${badge.unlocked ? 'opacity-100' : 'opacity-50'}
        shadow-lg
        relative
        overflow-hidden
      `}>
        {!badge.unlocked && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <Lock className="text-white w-1/3 h-1/3" />
          </div>
        )}
        
        <div className={`${badge.color} rounded-full p-2 flex items-center justify-center`}>
          {badge.icon || <Award className="w-8 h-8 text-white" />}
        </div>
        
        {badge.progress !== undefined && badge.maxProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200">
            <div 
              className="h-full bg-blue-600"
              style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
            />
          </div>
        )}
      </div>
      
      {showDetails && (
        <div className="mt-2 text-center">
          <h4 className="font-semibold text-gray-900">{badge.name}</h4>
          <p className="text-xs text-gray-600">{badge.description}</p>
          {badge.dateEarned && (
            <p className="text-xs text-gray-500 mt-1">
              Earned: {badge.dateEarned.toLocaleDateString()}
            </p>
          )}
          <div className="mt-1">
            <span className={`
              text-xs px-2 py-0.5 rounded-full
              ${badge.rarity === 'common' ? 'bg-gray-100 text-gray-800' : ''}
              ${badge.rarity === 'uncommon' ? 'bg-green-100 text-green-800' : ''}
              ${badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' : ''}
              ${badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800' : ''}
              ${badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' : ''}
            `}>
              {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}