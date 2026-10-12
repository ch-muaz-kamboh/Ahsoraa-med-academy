'use client';

import React from 'react';
import Image from 'next/image';

export interface LogoProps {
  height?: number;
  className?: string;
  showText?: boolean;
  iconOnly?: boolean;
  variant?: 'light' | 'dark' | 'white' | string;
  style?: React.CSSProperties;
}

export default function Logo({
  height = 44,
  className = '',
  showText = true,
  iconOnly = false,
  variant = 'dark',
  style,
}: LogoProps) {
  const isIconOnly = iconOnly || showText === false;
  
  // Dimensions based on source image ratios
  // Full logo: 1024 x 277 (~3.697 : 1)
  // Emblem icon: 327 x 253 (~1.292 : 1)
  const aspectRatio = isIconOnly ? 1.292 : 3.697;
  const width = Math.round(height * aspectRatio);

  const imageSrc = isIconOnly
    ? '/ahsora-emblem.png'
    : variant === 'light' || variant === 'white'
    ? '/ahsora-logo-white.png'
    : '/ahsora-logo.png';

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        lineHeight: 0,
        ...style,
      }}
    >
      <Image
        src={imageSrc}
        alt="Ahsora Meds Academy"
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
