import React from 'react';
import { motion } from 'framer-motion';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  className?: string;
}

export function Image({ alt, className = '', ...props }: ImageProps) {
  return (
    <div className={`img-3d ${className}`}>
      <img
        alt={alt}
        {...props}
      />
    </div>
  );
}