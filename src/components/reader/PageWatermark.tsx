'use client';

import React from 'react';

interface PageWatermarkProps {
  userPhone: string;
  darkMode?: boolean;
}

export function PageWatermark({ userPhone, darkMode = false }: PageWatermarkProps) {
  const displayId = userPhone && userPhone !== 'Anonymous' ? userPhone : 'Belesu Student';
  const text = `${displayId} • Protected by Belesu DRM • Do Not Copy`;

  // Dense 8x4 staggered diagonal repeating watermark matrix optimized for both mobile & desktop
  const rows = [5, 18, 31, 44, 57, 70, 83, 94];
  const cols = [-20, 15, 50, 85];

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-25"
      aria-hidden="true"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
    >
      {rows.map((top, rIdx) =>
        cols.map((left, cIdx) => (
          <div
            key={`${rIdx}-${cIdx}`}
            className={`absolute whitespace-nowrap font-mono font-bold tracking-wider text-[9.5px] sm:text-[11px] ${
              darkMode ? 'text-white/20' : 'text-slate-900/18'
            }`}
            style={{
              top: `${top}%`,
              left: `${left + (rIdx % 2 === 0 ? 0 : 18)}%`,
              transform: 'rotate(-26deg)',
              letterSpacing: '0.04em',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              WebkitTouchCallout: 'none',
              textShadow: darkMode ? '0 0 2px rgba(0,0,0,0.8)' : '0 0 1px rgba(255,255,255,0.7)',
            }}
          >
            {text}
          </div>
        ))
      )}
    </div>
  );
}
