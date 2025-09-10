import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { studyTips, type StudyTip } from '../../data/studyTips.js';
import { MathRenderer } from '../math/MathRenderer.js';

interface StudyTipsPanelProps {
  currentTopic?: string;
}

export function StudyTipsPanel({ currentTopic }: StudyTipsPanelProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [filteredTips, setFilteredTips] = useState<StudyTip[]>([]);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    // Filter tips based on current topic if provided
    const tips = currentTopic
      ? studyTips.filter(tip => !tip.topic || tip.topic === currentTopic)
      : studyTips;
    setFilteredTips(tips);
    setCurrentTipIndex(0);
  }, [currentTopic]);

  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => 
        prev === filteredTips.length - 1 ? 0 : prev + 1
      );
    }, 10000); // Change tip every 10 seconds

    return () => clearInterval(interval);
  }, [autoPlay, filteredTips.length]);

  const navigateTip = (direction: 'prev' | 'next') => {
    setAutoPlay(false);
    setCurrentTipIndex(prev => {
      if (direction === 'prev') {
        return prev === 0 ? filteredTips.length - 1 : prev - 1;
      } else {
        return prev === filteredTips.length - 1 ? 0 : prev + 1;
      }
    });
  };

  if (filteredTips.length === 0) return null;

  const currentTip = filteredTips[currentTipIndex];
  const categoryColors = {
    concept: 'bg-blue-100 text-blue-800',
    strategy: 'bg-green-100 text-green-800',
    exam: 'bg-purple-100 text-purple-800',
    visualization: 'bg-yellow-100 text-yellow-800',
    mistake: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-900">Did You Know?</h2>
        </div>
        {currentTip.topic && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <BookOpen className="w-4 h-4" />
            <span>{currentTip.topic}</span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentTip.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-800">{currentTip.heading}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[currentTip.category]}`}>
              {currentTip.category}
            </span>
          </div>

          <div className="text-gray-600">
            <MathRenderer content={currentTip.content} />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => navigateTip('prev')}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Previous tip"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex space-x-1">
          {filteredTips.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentTipIndex
                  ? 'bg-blue-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => navigateTip('next')}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Next tip"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}