import React from 'react';
import Image from 'next/image';

interface LogoProps {
  height?: number;
  className?: string;
}

export default function Logo({
  height = 44,
  className = '',
}: LogoProps) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        src="/logo.png"
        alt="Asora Med Academy Logo"
        width={height * 3} // Approximate width assuming 3:1 ratio
        height={height}
        style={{
          height: `${height}px`,
          width: 'auto',
          mixBlendMode: 'multiply', // Removes white background
          filter: 'contrast(1.1)', // Enhances the colors slightly
        }}
        priority
      />
    </div>
  );
}
