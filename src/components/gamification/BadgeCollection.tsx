import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Filter } from 'lucide-react';
import { DigitalBadge, Badge } from './DigitalBadge.js';
import Confetti from 'react-confetti';

interface BadgeCollectionProps {
  badges: Badge[];
  onClose?: () => void;
}

export function BadgeCollection({ badges, onClose }: BadgeCollectionProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [showConfetti, setShowConfetti] = useState(false);

  const filteredBadges = badges.filter(badge => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return badge.unlocked;
    if (filter === 'locked') return !badge.unlocked;
    return true;
  });

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    if (badge.unlocked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 relative">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Award className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Your Badge Collection</h2>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
      
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700">Filter:</span>
        </div>
        
        <div className="flex space-x-2">
          {['all', 'unlocked', 'locked'].map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option as any)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filter === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="ml-auto text-sm text-gray-600">
          {badges.filter(b => b.unlocked).length} of {badges.length} earned
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredBadges.map((badge) => (
          <DigitalBadge
            key={badge.id}
            badge={badge}
            onClick={() => handleBadgeClick(badge)}
            showDetails
          />
        ))}
      </div>
      
      {filteredBadges.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No badges found</h3>
          <p className="text-gray-600">
            {filter === 'unlocked' 
              ? "You haven't earned any badges yet. Keep learning to unlock achievements!"
              : filter === 'locked'
              ? "No locked badges to display. You've earned them all!"
              : "No badges available in your collection."}
          </p>
        </div>
      )}
      
      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex flex-col items-center">
                <DigitalBadge badge={selectedBadge} size="lg" />
                
                <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
                  {selectedBadge.name}
                </h3>
                
                <span className={`
                  text-sm px-3 py-1 rounded-full mb-4
                  ${selectedBadge.rarity === 'common' ? 'bg-gray-100 text-gray-800' : ''}
                  ${selectedBadge.rarity === 'uncommon' ? 'bg-green-100 text-green-800' : ''}
                  ${selectedBadge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' : ''}
                  ${selectedBadge.rarity === 'epic' ? 'bg-purple-100 text-purple-800' : ''}
                  ${selectedBadge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' : ''}
                `}>
                  {selectedBadge.rarity.charAt(0).toUpperCase() + selectedBadge.rarity.slice(1)}
                </span>
                
                <p className="text-gray-600 text-center mb-4">
                  {selectedBadge.description}
                </p>
                
                {selectedBadge.unlocked ? (
                  <div className="text-green-600 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    <span>
                      Earned on {selectedBadge.dateEarned?.toLocaleDateString() || 'Unknown date'}
                    </span>
                  </div>
                ) : (
                  <div className="text-gray-600">
                    {selectedBadge.progress !== undefined && selectedBadge.maxProgress && (
                      <div className="w-full">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{selectedBadge.progress} / {selectedBadge.maxProgress}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(selectedBadge.progress / selectedBadge.maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}