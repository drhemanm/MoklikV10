import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  className?: string;
}

export function Image({ alt, className = '', ...props }: ImageProps) {
  return (
    <img
      alt={alt}
      className={className}
      {...props}
    />
  );
}