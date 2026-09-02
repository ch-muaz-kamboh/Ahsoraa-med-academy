import React from 'react';
import Image from 'next/image';

interface LogoProps {
  height?: number;
  className?: string;
  showText?: boolean;
}

export default function Logo({
  height = 44,
  className = '',
  showText = false,
}: LogoProps) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
      }}
    >
      <Image
        src="/logo.png"
        alt="Ahsora Med Academy Logo"
        width={height}
        height={height}
        style={{
          height: `${height}px`,
          width: `${height}px`,
          objectFit: 'contain',
          objectPosition: 'center',
          display: 'block',
          flexShrink: 0,
        }}
        priority
      />
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: `${height * 0.38}px`,
              color: '#0B2B5C',
              letterSpacing: '-0.3px',
            }}
          >
            AHSORA
          </span>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: `${height * 0.2}px`,
              color: '#C59B27',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            Meds Academy
          </span>
        </div>
      )}
    </div>
  );
}
