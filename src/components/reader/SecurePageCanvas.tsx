'use client';

import React, { useEffect, useRef, useState } from 'react';

interface SecurePageCanvasProps {
  imageUrl: string;
  pageNumber: number;
  userPhone: string;
  darkMode?: boolean;
}

/**
 * SecurePageCanvas
 * 
 * Hardware-accelerated canvas renderer for digital textbook pages.
 * - Eliminates HTML <img> tags to completely block iOS/Android "Save to Photos" & "Copy Image" sheets.
 * - Bakes the user's phone number and DRM watermark directly into canvas pixel data.
 * - Completely prevents iOS Live Text OCR and context callout sheets.
 */
export function SecurePageCanvas({
  imageUrl,
  pageNumber,
  userPhone,
  darkMode = false,
}: SecurePageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(1.414);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsLoaded(false);
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (isCancelled) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: false });
      if (!ctx) return;

      const width = img.naturalWidth || img.width || 800;
      const height = img.naturalHeight || img.height || 1130;
      canvas.width = width;
      canvas.height = height;
      setAspectRatio(height / width);

      // 1. Draw page textbook page
      ctx.drawImage(img, 0, 0, width, height);

      // 2. Indelibly burn student identity watermark directly into pixel buffer
      const displayId = userPhone && userPhone !== 'Anonymous' ? userPhone : 'Belesu Student';
      const watermarkText = `${displayId} • Belesu DRM Protected • Do Not Copy`;

      ctx.save();
      const fontSize = Math.max(14, Math.round(width / 45));
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.fillStyle = darkMode ? 'rgba(255, 255, 255, 0.16)' : 'rgba(15, 23, 42, 0.14)';
      ctx.rotate((-26 * Math.PI) / 180);

      const stepY = fontSize * 7;
      const stepX = fontSize * 24;

      for (let y = -height; y < height * 2; y += stepY) {
        for (let x = -width; x < width * 2; x += stepX) {
          ctx.fillText(watermarkText, x, y);
        }
      }
      ctx.restore();

      setIsLoaded(true);
    };

    img.onerror = () => {
      if (isCancelled) return;
      setIsLoaded(true);
    };

    img.src = imageUrl;

    return () => {
      isCancelled = true;
    };
  }, [imageUrl, userPhone, darkMode]);

  return (
    <div
      className="relative w-full overflow-hidden select-none drm-protected-container"
      style={{
        aspectRatio: `${1} / ${aspectRatio}`,
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-auto block select-none pointer-events-none drm-protected-container"
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
        onContextMenu={(e) => e.preventDefault()}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-100/80 flex items-center justify-center animate-pulse">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto" />
            <p className="text-[11px] text-stone-500 font-mono font-medium">
              Rendering Page {pageNumber}...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
