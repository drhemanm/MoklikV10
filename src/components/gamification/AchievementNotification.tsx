import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';
import Confetti from 'react-confetti';

interface AchievementNotificationProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  xpEarned?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementNotification({
  title,
  description,
  icon,
  xpEarned,
  isOpen,
  onClose
}: AchievementNotificationProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-4 right-4 z-50 max-w-sm w-full"
        >
          <div className="relative">
            <Confetti
              width={300}
              height={200}
              recycle={false}
              numberOfPieces={100}
              gravity={0.2}
            />
            
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    {icon || <Award className="w-6 h-6 text-white" />}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-bold text-white">
                      Achievement Unlocked!
                    </h3>
                    <button
                      onClick={onClose}
                      className="text-white text-opacity-70 hover:text-opacity-100"
                    >
                      &times;
                    </button>
                  </div>
                  
                  <p className="text-white text-opacity-90 font-medium mt-1">
                    {title}
                  </p>
                  
                  <p className="text-white text-opacity-80 text-sm mt-1">
                    {description}
                  </p>
                  
                  {xpEarned && (
                    <p className="text-white text-opacity-90 font-medium mt-2">
                      +{xpEarned} XP
                    </p>
                  )}
                </div>
              </div>
              
              <div className="h-1 bg-white bg-opacity-20">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className="h-full bg-white"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}