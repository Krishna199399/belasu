'use client';

import React from 'react';

interface PageWatermarkProps {
  userPhone: string;
  darkMode?: boolean;
}

export function PageWatermark({ userPhone, darkMode = false }: PageWatermarkProps) {
  const displayId = userPhone && userPhone !== 'Anonymous' ? userPhone : 'Belesu Student';
  const text = `${displayId} • Protected by Belesu DRM • Do Not Copy`;

  // Dense 7x4 staggered diagonal repeating watermark matrix
  const rows = [6, 20, 34, 48, 62, 76, 90];
  const cols = [-15, 20, 55, 90];

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-25"
      aria-hidden="true"
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      {rows.map((top, rIdx) =>
        cols.map((left, cIdx) => (
          <div
            key={`${rIdx}-${cIdx}`}
            className={`absolute whitespace-nowrap font-mono font-bold tracking-wider ${
              darkMode ? 'text-white/20' : 'text-slate-900/18'
            }`}
            style={{
              top: `${top}%`,
              left: `${left + (rIdx % 2 === 0 ? 0 : 15)}%`,
              transform: 'rotate(-28deg)',
              fontSize: '11px',
              letterSpacing: '0.05em',
              userSelect: 'none',
              WebkitUserSelect: 'none',
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
