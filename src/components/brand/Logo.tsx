import React from 'react';
import Image from 'next/image';

interface LogoProps {
  height?: number;
  className?: string;
  showText?: boolean; // Kept for compatibility but SVG handles text beautifully
}

export default function Logo({
  height = 44,
  className = '',
}: LogoProps) {
  // SVG has an aspect ratio of 360/240 = 1.5
  const width = height * 1.5;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
      }}
    >
      <Image
        src="/logo.svg"
        alt="Ahsora Med Academy Logo"
        width={width}
        height={height}
        style={{
          height: `${height}px`,
          width: `${width}px`,
          objectFit: 'contain',
          objectPosition: 'center',
          display: 'block',
          flexShrink: 0,
        }}
        priority
      />
    </div>
  );
}
