import React, { useState, useEffect } from 'react';
import { BookOpen, Target, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AvatarCharacter } from './AvatarCharacter';

interface AvatarAssistantProps {
  topic?: string;
  isThinking?: boolean;
  message?: string;
}

export function AvatarAssistant({ topic, isThinking = false, message }: AvatarAssistantProps) {
  const [currentTip, setCurrentTip] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [mood, setMood] = useState<'happy' | 'thinking' | 'excited' | 'explaining'>('happy');

  useEffect(() => {
    if (isThinking) {
      setMood('thinking');
    } else if (message?.includes('Great!') || message?.includes('Well done!')) {
      setMood('excited');
    } else if (message) {
      setMood('explaining');
    } else {
      setMood('happy');
    }
  }, [isThinking, message]);

  useEffect(() => {
    if (topic) {
      const tips = [
        `Remember to review the key concepts in ${topic} before attempting complex problems.`,
        `Practice is key! Try solving different types of ${topic} problems regularly.`,
        `Don't forget to check past exam papers for common ${topic} questions.`,
        `Break down complex ${topic} problems into smaller, manageable steps.`,
        `Create mind maps to connect different aspects of ${topic}.`
      ];
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      setCurrentTip(randomTip);
    }
  }, [topic]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="bg-white rounded-xl shadow-lg p-4 max-w-sm border border-blue-100">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16">
                <AvatarCharacter isThinking={isThinking} mood={mood} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    Moklik Assistant
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsVisible(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-gray-600 leading-relaxed"
                >
                  {message || currentTip}
                </motion.p>

                {topic && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-3 flex items-center space-x-2 text-xs text-gray-500"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Currently studying: {topic}</span>
                  </motion.div>
                )}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex items-center justify-between text-xs text-gray-500"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 bg-blue-50 px-2 py-1 rounded-full"
              >
                <Target className="w-4 h-4 text-blue-600" />
                <span>Focus Mode</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 bg-yellow-50 px-2 py-1 rounded-full"
              >
                <Star className="w-4 h-4 text-yellow-600" />
                <span>Study Streak: 1 day</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}