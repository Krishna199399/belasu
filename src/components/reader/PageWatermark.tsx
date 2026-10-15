'use client';

interface PageWatermarkProps {
  userPhone: string;
}

export function PageWatermark({ userPhone }: PageWatermarkProps) {
  const now = new Date().toLocaleDateString('en-IN');
  const text = `${userPhone} · Belesu Confidential · ${now}`;

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-20"
      aria-hidden="true"
    >
      {/* Multiple rotated watermark instances at different positions */}
      {[
        { top: '15%', left: '-10%', opacity: 0.08 },
        { top: '40%', left: '20%', opacity: 0.10 },
        { top: '65%', left: '-5%', opacity: 0.08 },
        { top: '20%', left: '50%', opacity: 0.09 },
        { top: '75%', left: '40%', opacity: 0.08 },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute whitespace-nowrap font-black text-slate-900"
          style={{
            top: pos.top,
            left: pos.left,
            opacity: pos.opacity,
            transform: 'rotate(-35deg)',
            fontSize: '14px',
            letterSpacing: '0.05em',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {text}
        </div>
      ))}
    </div>
  );
}
