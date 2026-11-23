'use client';

import React, { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { MessageSquareText, X } from 'lucide-react';
import { hasBottomStickyBar, isFloatingWidgetHidden } from '@/components/shared/floatingWidgets';

// The chat window (and its catalogue data) loads only when the visitor opens it.
const ChatbotPanel = dynamic(() => import('./ChatbotPanel'), { ssr: false });

const SEEN_KEY = 'belesu-chat-seen';
const TEASER_DELAY_MS = 8000;

function readFlag(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function writeFlag(key: string) {
  try {
    sessionStorage.setItem(key, '1');
  } catch {
    /* ignore */
  }
}

export function ChatbotLauncher() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(true); // assume seen until we read storage (avoids SSR flash)
  const [teaser, setTeaser] = useState(false);

  useEffect(() => {
    if (readFlag(SEEN_KEY)) return;
    const t = setTimeout(() => {
      setSeen(false);
      setTeaser(true);
    }, TEASER_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const markSeen = () => {
    writeFlag(SEEN_KEY);
    setSeen(true);
    setTeaser(false);
  };

  const openChat = () => {
    markSeen();
    setOpen(true);
  };

  const closeChat = useCallback(() => setOpen(false), []);

  if (isFloatingWidgetHidden(pathname)) return null;

  // Sits directly above the WhatsApp button (same size, same right edge).
  const position = hasBottomStickyBar(pathname)
    ? 'bottom-[148px] sm:bottom-[152px] lg:bottom-[96px]'
    : 'bottom-[88px] sm:bottom-[96px]';

  return (
    <>
      {open && <ChatbotPanel onClose={closeChat} />}

      {!open && (
        <div className={`fixed ${position} right-4 sm:right-6 z-40 flex items-center gap-3`}>
          {teaser && (
            <div className="relative hidden max-w-[230px] rounded-2xl rounded-br-md border border-amber-100 bg-white py-2.5 pl-3.5 pr-8 text-[13px] leading-snug text-slate-700 shadow-xl sm:block">
              <button type="button" onClick={openChat} className="text-left">
                <strong className="block text-slate-900">Need help choosing?</strong>
                Ask me which guidebook suits your child&apos;s class.
              </button>
              <button
                type="button"
                onClick={markSeen}
                aria-label="Dismiss"
                className="absolute right-1.5 top-1.5 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={openChat}
            aria-label="Open Belesu chat assistant"
            title="Ask Belesu"
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-2xl shadow-orange-500/40 transition-transform hover:scale-110 active:scale-95 sm:h-[60px] sm:w-[60px]"
          >
            <MessageSquareText className="h-6 w-6 sm:h-7 sm:w-7" />
            {!seen && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] font-bold">
                1
              </span>
            )}
          </button>
        </div>
      )}
    </>
  );
}
