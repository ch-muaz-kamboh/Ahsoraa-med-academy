import React from 'react';

interface LogoProps {
  height?: number;
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
  className?: string;
}

export default function Logo({
  height = 44,
  showText = true,
  textColor = '#0F2942',
  subtextColor = '#C59B27',
  className = '',
}: LogoProps) {
  // Scale calculations based on height
  const scale = height / 50;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${10 * scale}px`,
        textDecoration: 'none',
      }}
    >
      {/* Crisp Vector Emblem */}
      <svg
        width={46 * scale}
        height={48 * scale}
        viewBox="0 0 100 105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Main Triangular 'A' in Rich Navy / Teal-Navy */}
        <path
          d="M50 4L12 82H28L50 36L72 82H88L50 4Z"
          fill="#0B2B5C"
        />
        
        {/* Golden Swoosh Arc */}
        <path
          d="M10 52C10 40 32 30 55 24C68 20 80 20 90 28"
          stroke="#D4AF37"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Graduation Cap at Swoosh End */}
        <g transform="translate(74, 12) rotate(12) scale(0.65)">
          <polygon points="20,0 40,8 20,16 0,8" fill="#0B2B5C" />
          <polygon points="12,12 12,22 28,22 28,12 20,15" fill="#0B2B5C" />
          <line x1="36" y1="8" x2="38" y2="24" stroke="#D4AF37" strokeWidth="2" />
          <circle cx="38" cy="25" r="2" fill="#D4AF37" />
        </g>

        {/* Medical Caduceus / Rod of Asclepius & Wings */}
        {/* Wings */}
        <path
          d="M32 46C38 42 46 43 50 47C54 43 62 42 68 46C65 52 58 54 50 50C42 54 35 52 32 46Z"
          fill="#0B2B5C"
        />
        {/* Staff */}
        <line x1="50" y1="42" x2="50" y2="78" stroke="#0B2B5C" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="41" r="3" fill="#D4AF37" />
        
        {/* Entwined Serpents */}
        <path
          d="M45 52C45 48 55 48 55 54C55 60 45 60 45 66C45 72 55 72 55 78"
          stroke="#0B2B5C"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M55 52C55 48 45 48 45 54C45 60 55 60 55 66C55 72 45 72 45 78"
          stroke="#0B2B5C"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Open Book Base */}
        <path
          d="M26 84C34 81 44 80 50 83C56 80 66 81 74 84L70 88C64 85 55 84 50 87C45 84 36 85 30 88L26 84Z"
          fill="#D4AF37"
        />
        <path
          d="M30 78C37 75 45 74 50 77C55 74 63 75 70 78L68 83C62 80 55 79 50 82C45 79 38 80 32 83L30 78Z"
          fill="#0B2B5C"
        />
      </svg>

      {/* Typography Text */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span
            style={{
              fontFamily: "'Playfair Display', 'Cinzel', Georgia, serif",
              fontSize: `${20 * scale}px`,
              fontWeight: 800,
              letterSpacing: '1px',
              color: textColor,
            }}
          >
            AHSORA
          </span>
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: `${9 * scale}px`,
              fontWeight: 700,
              letterSpacing: '3px',
              color: subtextColor,
              textTransform: 'uppercase',
              marginTop: `${2 * scale}px`,
            }}
          >
            MEDS ACADEMY
          </span>
        </div>
      )}
    </div>
  );
}
