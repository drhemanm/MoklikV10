import React from 'react';
import { motion } from 'framer-motion';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  className?: string;
}

export function Image({ alt, className = '', ...props }: ImageProps) {
  return (
    <motion.div className={`img-3d ${className}`}>
      <motion.img
        alt={alt}
        {...props}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}