import React from 'react';
import { motion } from 'framer-motion';

interface AvatarCharacterProps {
  isThinking: boolean;
  mood?: 'happy' | 'thinking' | 'excited' | 'explaining';
}

export function AvatarCharacter({ isThinking, mood = 'happy' }: AvatarCharacterProps) {
  const eyeVariants = {
    normal: { scaleY: 1 },
    blink: { scaleY: 0.1 },
    thinking: { x: 2, y: -1 }
  };

  const mouthVariants = {
    happy: { d: "M 15 22 Q 25 28 35 22" },
    thinking: { d: "M 15 25 Q 25 23 35 25" },
    excited: { d: "M 15 22 Q 25 32 35 22" },
    explaining: { d: "M 15 25 Q 25 28 35 25" }
  };

  return (
    <motion.svg
      viewBox="0 0 50 50"
      width="100%"
      height="100%"
      initial={false}
      animate={{ scale: isThinking ? 1.05 : 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Head */}
      <motion.circle
        cx="25"
        cy="25"
        r="20"
        fill="#60A5FA"
        stroke="#2563EB"
        strokeWidth="2"
        animate={{ scale: isThinking ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Eyes */}
      <motion.g>
        <motion.ellipse
          cx="18"
          cy="20"
          rx="3"
          ry="4"
          fill="white"
          stroke="#1E40AF"
          strokeWidth="1"
          animate={isThinking ? "thinking" : "normal"}
          variants={eyeVariants}
          transition={{ duration: 0.2 }}
        />
        <motion.ellipse
          cx="32"
          cy="20"
          rx="3"
          ry="4"
          fill="white"
          stroke="#1E40AF"
          strokeWidth="1"
          animate={isThinking ? "thinking" : "normal"}
          variants={eyeVariants}
          transition={{ duration: 0.2 }}
        />
        
        {/* Pupils */}
        <motion.circle
          cx="18"
          cy="20"
          r="1.5"
          fill="#1E40AF"
          animate={isThinking ? { x: 1, y: -1 } : { x: 0, y: 0 }}
        />
        <motion.circle
          cx="32"
          cy="20"
          r="1.5"
          fill="#1E40AF"
          animate={isThinking ? { x: 1, y: -1 } : { x: 0, y: 0 }}
        />
      </motion.g>

      {/* Mouth */}
      <motion.path
        stroke="#1E40AF"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        variants={mouthVariants}
        animate={mood}
        transition={{ duration: 0.3 }}
      />

      {/* Thinking bubble */}
      {isThinking && (
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <circle cx="42" cy="10" r="2" fill="#2563EB" />
          <circle cx="45" cy="7" r="2.5" fill="#2563EB" />
          <circle cx="48" cy="3" r="3" fill="#2563EB" />
        </motion.g>
      )}
    </motion.svg>
  );
}