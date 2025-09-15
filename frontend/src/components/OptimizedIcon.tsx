import React from 'react';
import Image from 'next/image';

interface OptimizedIconProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const OptimizedIcon: React.FC<OptimizedIconProps> = ({ 
  src, 
  alt, 
  width = 24, 
  height = 24, 
  className = '' 
}) => {
  return (
    <div className={`inline-block ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full"
        priority={false}
        loading="lazy"
      />
    </div>
  );
};

export default OptimizedIcon;