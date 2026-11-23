'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Bot, MessageCircle, Phone, RotateCcw, SendHorizontal, ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { BOOKS_DATA } from '@/data/mockData';
import { DIGITAL_BOOKS_DATA, HIDE_DIGITAL_CLASS_6 } from '@/data/digitalBooksData';
import type { BookProduct, DigitalBook } from '@/types';
import {
  type BotReply,
  type ChatBookCard,
  type ChatCatalog,
  type ChatLink,
  getBotReply,
  SUPPORT_HOURS,
  welcomeReply,
  whatsappLink,
} from './chatbotBrain';

interface ChatMessage extends Omit<BotReply, 'intent'> {
  id: string;
  role: 'bot' | 'user';
}

const STORAGE_KEY = 'belesu-chat-v1';

const visibleDigital = (books: DigitalBook[]) =>
  books.filter((b) => !b.isComingSoon && !(HIDE_DIGITAL_CLASS_6 && b.slug === 'kannada-class-6-guide'));

const STATIC_CATALOG: ChatCatalog = {
  physical: BOOKS_DATA,
  digital: visibleDigital(DIGITAL_BOOKS_DATA),
};

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function botMessage(reply: BotReply): ChatMessage {
  return { id: newId(), role: 'bot', text: reply.text, books: reply.books, links: reply.links, chips: reply.chips };
}

function loadHistory(): ChatMessage[] | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? (parsed as ChatMessage[]) : null;
  } catch {
    return null;
  }
}

function saveHistory(messages: ChatMessage[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-60)));
  } catch {
    /* storage unavailable (private mode) – chat still works */
  }
}

function track(event: string, params: Record<string, string>) {
  try {
    (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.('event', event, params);
  } catch {
    /* analytics is optional */
  }
}

// ─── Rich text: **bold**, line breaks and "• " bullets ──────────────────────
function renderInline(line: string, keyPrefix: string) {
  return line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`${keyPrefix}-${i}`} className="font-semibold text-slate-900">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>
    )
  );
}

function RichText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        if (line.startsWith('• ')) {
          return (
            <div key={i} className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              <span>{renderInline(line.slice(2), `l${i}`)}</span>
            </div>
          );
        }
        return <p key={i}>{renderInline(line, `l${i}`)}</p>;
      })}
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────
function BotAvatar() {
  return (
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm">
      <Bot className="h-4 w-4" />
    </div>
  );
}

function BookCard({
  book,
  onAdd,
  onNavigate,
}: {
  book: ChatBookCard;
  onAdd: (book: ChatBookCard) => void;
  onNavigate: () => void;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-amber-100 bg-white p-2.5 shadow-xs">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={book.cover}
        alt=""
        loading="lazy"
        className="h-[72px] w-[54px] flex-shrink-0 rounded-md border border-slate-100 bg-amber-50 object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] font-semibold leading-snug text-slate-900">{book.title}</p>
          {book.kind === 'digital' && (
            <span className="flex-shrink-0 rounded-full bg-sky-50 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-700">
              Digital
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[13px]">
          <span className="font-bold text-orange-600">₹{book.price}</span>
          {book.originalPrice && book.originalPrice > book.price && (
            <span className="ml-1.5 text-xs text-slate-400 line-through">₹{book.originalPrice}</span>
          )}
        </p>
        <div className="mt-auto flex gap-1.5 pt-1.5">
          <Link
            href={book.href}
            onClick={onNavigate}
            className="rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition hover:border-amber-300 hover:text-amber-700"
          >
            View details
          </Link>
          {book.inStock ? (
            <button
              type="button"
              onClick={() => onAdd(book)}
              className="inline-flex items-center gap-1 rounded-lg bg-orange-500 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-orange-600 active:scale-95"
            >
              <ShoppingCart className="h-3 w-3" /> Add to cart
            </button>
          ) : (
            <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function LinkButton({ link, onNavigate }: { link: ChatLink; onNavigate: () => void }) {
  const isWhatsApp = link.variant === 'whatsapp';
  const isPhone = link.href.startsWith('tel:');
  const className = `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
    isWhatsApp
      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
      : 'border border-amber-200 bg-white text-amber-800 hover:bg-amber-50'
  }`;
  const icon = isWhatsApp ? (
    <MessageCircle className="h-3.5 w-3.5" />
  ) : isPhone ? (
    <Phone className="h-3.5 w-3.5" />
  ) : null;

  if (link.external) {
    return (
      <a href={link.href} target={isPhone ? undefined : '_blank'} rel="noreferrer" className={className}>
        {icon}
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} onClick={onNavigate} className={className}>
      {link.label} <span aria-hidden>→</span>
    </Link>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <BotAvatar />
      <div className="flex gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-xs">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500"
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Panel ──────────────────────────────────────────────────────────────────
export default function ChatbotPanel({ onClose }: { onClose: () => void }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [catalog, setCatalog] = useState<ChatCatalog>(STATIC_CATALOG);
  const [messages, setMessages] = useState<ChatMessage[]>(
    () => loadHistory() ?? [botMessage(welcomeReply(user?.name))]
  );
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refresh catalogue with live stock (physical) and live prices (digital).
  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([
      fetch('/api/books', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/digital/books', { cache: 'no-store' }).then((r) => r.json()),
    ]).then(([phys, dig]) => {
      if (cancelled) return;
      setCatalog((prev) => ({
        physical:
          phys.status === 'fulfilled' && Array.isArray(phys.value?.books) && phys.value.books.length
            ? (phys.value.books as BookProduct[])
            : prev.physical,
        digital:
          dig.status === 'fulfilled' && Array.isArray(dig.value?.books) && dig.value.books.length
            ? visibleDigital(dig.value.books as DigitalBook[])
            : prev.digital,
      }));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => saveHistory(messages), [messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  // Focus the input on desktop only (avoids popping the keyboard on phones).
  useEffect(() => {
    if (window.matchMedia('(min-width: 640px)').matches) inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onClose]);

  const productsById = useMemo(() => {
    const map = new Map<string, { product: BookProduct | DigitalBook; type: 'physical' | 'digital' }>();
    catalog.physical.forEach((p) => map.set(p.id, { product: p, type: 'physical' }));
    catalog.digital.forEach((d) => map.set(d.id, { product: d, type: 'digital' }));
    return map;
  }, [catalog]);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim().slice(0, 300);
      if (!text || typing) return;
      setInput('');
      setMessages((prev) => [...prev, { id: newId(), role: 'user', text }]);
      setTyping(true);

      const reply = getBotReply(text, catalog);
      track('chatbot_reply', { intent: reply.intent });

      const delay = 450 + Math.min(reply.text.length * 3, 700);
      timerRef.current = setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [...prev, botMessage(reply)]);
      }, delay);
    },
    [catalog, typing]
  );

  const handleAdd = (card: ChatBookCard) => {
    const entry = productsById.get(card.id);
    if (!entry) return;
    addToCart(entry.product, entry.type);
    track('chatbot_add_to_cart', { item: card.title });
    onClose(); // the cart drawer opens automatically
  };

  const restart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTyping(false);
    setMessages([botMessage(welcomeReply(user?.name))]);
  };

  const lastBotIndex = messages.map((m) => m.role).lastIndexOf('bot');

  return (
    <div
      role="dialog"
      aria-label="Belesu chat assistant"
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white shadow-2xl sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(640px,calc(100dvh-48px))] sm:w-[390px] sm:rounded-2xl sm:border sm:border-slate-200"
      style={{ animation: 'belesuChatIn 220ms ease-out' }}
    >
      <style>{`@keyframes belesuChatIn{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}`}</style>

      {/* Header */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-stone-900 via-stone-800 to-amber-900 px-4 py-3.5 text-white">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white p-0.5 ring-2 ring-amber-400/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Belesu-logo1-square.png" alt="Belesu" className="h-full w-full rounded-full object-contain" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-stone-900 bg-emerald-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-[15px] font-bold">Belesu Book Assistant</p>
            <span className="rounded border border-amber-400/40 bg-amber-400/15 px-1.5 py-px text-[10px] font-semibold text-amber-300">
              Guidebooks
            </span>
          </div>
          <p className="text-[11px] text-stone-300">Online • Replies instantly</p>
        </div>
        <button
          type="button"
          onClick={restart}
          aria-label="Restart conversation"
          title="Restart conversation"
          className="rounded-lg p-2 text-stone-300 transition hover:bg-white/10 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="rounded-lg p-2 text-stone-300 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} aria-live="polite" className="flex-1 space-y-4 overflow-y-auto overscroll-contain bg-stone-50 px-4 py-4">
        {messages.map((m, idx) =>
          m.role === 'user' ? (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[80%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-gradient-to-br from-orange-500 to-amber-600 px-3.5 py-2.5 text-sm text-white shadow-sm">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={m.id} className="flex items-start gap-2">
              <BotAvatar />
              <div className="min-w-0 max-w-[85%] space-y-2">
                <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-slate-700 shadow-xs">
                  <RichText text={m.text} />
                </div>

                {m.books && m.books.length > 0 && (
                  <div className="space-y-2">
                    {m.books.map((b) => (
                      <BookCard key={`${m.id}-${b.id}`} book={b} onAdd={handleAdd} onNavigate={onClose} />
                    ))}
                  </div>
                )}

                {m.links && m.links.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {m.links.map((l) => (
                      <LinkButton key={`${m.id}-${l.label}`} link={l} onNavigate={onClose} />
                    ))}
                  </div>
                )}

                {idx === lastBotIndex && !typing && m.chips && m.chips.length > 0 && (
                  <div className="flex flex-col items-start gap-1.5 pt-0.5">
                    {m.chips.map((c) => (
                      <button
                        key={`${m.id}-${c}`}
                        type="button"
                        onClick={() => send(c)}
                        className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-left text-xs font-medium text-amber-900 transition hover:border-amber-300 hover:bg-amber-100 active:scale-[0.98]"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        )}
        {typing && <TypingIndicator />}
      </div>

      {/* Footer strip */}
      <div className="flex items-center justify-between border-t border-amber-100 bg-amber-50/70 px-4 py-2 text-[11px]">
        <span className="text-slate-500">Karnataka syllabus · Classes 1–6</span>
        <a
          href={whatsappLink('Hello Belesu Team, I have a question about your guidebooks.')}
          target="_blank"
          rel="noreferrer"
          title={SUPPORT_HOURS}
          className="font-semibold text-emerald-700 hover:text-emerald-800"
        >
          Talk to our team on WhatsApp →
        </a>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-3 pb-[max(12px,env(safe-area-inset-bottom))]"
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={300}
          placeholder="Ask about books, class, price, delivery…"
          aria-label="Type your question"
          className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100 sm:text-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || typing}
          aria-label="Send"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md transition hover:brightness-110 active:scale-95 disabled:opacity-40"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
