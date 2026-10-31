'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, Menu, X, ChevronDown, BookOpen, Library, LogOut, User, Laptop, Package, Shield } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { AnnouncementBar } from './AnnouncementBar';

export const Navbar: React.FC = () => {
  const rawPathname = usePathname();
  const pathname = rawPathname || '';
  const { toggleCart, totalItems, subtotal } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobilePurchaseOpen, setMobilePurchaseOpen] = useState(false);
  const [mobileSpokenOpen, setMobileSpokenOpen] = useState(false);
  const [purchaseDropdownOpen, setPurchaseDropdownOpen] = useState(false);
  const [spokenDropdownOpen, setSpokenDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(rawPathname);
  const purchaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const spokenTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (rawPathname !== prevPathname) {
    setPrevPathname(rawPathname);
    setMobileMenuOpen(false);
    setPurchaseDropdownOpen(false);
    setSpokenDropdownOpen(false);
  }

  const handlePurchaseMouseEnter = () => {
    if (purchaseTimeoutRef.current) {
      clearTimeout(purchaseTimeoutRef.current);
      purchaseTimeoutRef.current = null;
    }
    setPurchaseDropdownOpen(true);
  };

  const handlePurchaseMouseLeave = () => {
    if (purchaseTimeoutRef.current) {
      clearTimeout(purchaseTimeoutRef.current);
    }
    purchaseTimeoutRef.current = setTimeout(() => {
      setPurchaseDropdownOpen(false);
    }, 200);
  };

  const handleSpokenMouseEnter = () => {
    if (spokenTimeoutRef.current) {
      clearTimeout(spokenTimeoutRef.current);
      spokenTimeoutRef.current = null;
    }
    setSpokenDropdownOpen(true);
  };

  const handleSpokenMouseLeave = () => {
    if (spokenTimeoutRef.current) {
      clearTimeout(spokenTimeoutRef.current);
    }
    spokenTimeoutRef.current = setTimeout(() => {
      setSpokenDropdownOpen(false);
    }, 200);
  };

  useEffect(() => {
    if (purchaseTimeoutRef.current) {
      clearTimeout(purchaseTimeoutRef.current);
    }
    if (spokenTimeoutRef.current) {
      clearTimeout(spokenTimeoutRef.current);
    }
  }, [rawPathname]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (purchaseTimeoutRef.current) {
        clearTimeout(purchaseTimeoutRef.current);
      }
      if (spokenTimeoutRef.current) {
        clearTimeout(spokenTimeoutRef.current);
      }
    };
  }, []);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setPurchaseDropdownOpen(false);
        setSpokenDropdownOpen(false);
        setUserDropdownOpen(false);
        if (purchaseTimeoutRef.current) {
          clearTimeout(purchaseTimeoutRef.current);
        }
        if (spokenTimeoutRef.current) {
          clearTimeout(spokenTimeoutRef.current);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (rawPathname?.startsWith('/admin')) {
    return null;
  }

  // ── Book Catalog Direct Routes ──
  const saviBooks = [
    { label: 'Class 1 · Savi Kannada', href: '/books/savi-kannada-class-1' },
    { label: 'Class 2 · Savi Kannada', href: '/books/savi-kannada-class-2' },
    { label: 'Class 3 · Savi Kannada', href: '/books/savi-kannada-class-3' },
    { label: 'Class 4 · Savi Kannada', href: '/books/savi-kannada-class-4' },
  ];

  const kaliBooks = [
    { label: 'Class 1 · Kali Kannada', href: '/books/kali-kannada-english-translated-innovative-guidebook-class-1' },
    { label: 'Class 2 · Kali Kannada', href: '/books/kali-kannada-english-translated-innovative-guidebook-class-2' },
    { label: 'Class 3 · Kali Kannada', href: '/books/kali-kannada-english-translated-innovative-guidebook-class-3' },
    { label: 'Class 4 · Kali Kannada', href: '/books/kali-kannada-english-translated-innovative-guidebook-class-4' },
  ];

  const class5Books = [
    { label: 'Class 5 · Siri Kannada', href: '/books/siri-kannada-english-translated-guidebook-class-5' },
    { label: 'Class 5 · Tili Kannada', href: '/books/tili-kannada-english-translated-innovative-guidebook-class-5' },
  ];

  const spokenBooks = [
    { label: 'A Destination to Speak Kannada', href: '/books/a-destination-to-speak-kannada' },
  ];

  interface NavLinkItem {
    label: string;
    href: string;
    isAcademicDropdown?: boolean;
    isSpokenDropdown?: boolean;
    isHighlight?: boolean;
    isDigital?: boolean;
  }

  const navLinks: NavLinkItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'Purchase Academic Books', href: '/books', isAcademicDropdown: true },
    {
      label: 'Destination to Speak Kannada',
      href: '/books/a-destination-to-speak-kannada',
      isSpokenDropdown: true,
      isHighlight: true,
    },
    { label: 'Videos', href: '/videos' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 py-1">
            <img
              src="/Belesu-logo1.png"
              alt="Belesu Logo"
              className="h-10 sm:h-14 md:h-16 object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1 text-xs 2xl:text-sm font-bold tracking-wide text-slate-700">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              if (link.isAcademicDropdown) {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={handlePurchaseMouseEnter}
                    onMouseLeave={handlePurchaseMouseLeave}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1 px-3 py-2.5 rounded-lg transition hover:bg-amber-50 hover:text-[#b5834e] ${
                        isActive || purchaseDropdownOpen ? 'text-[#b5834e] bg-amber-50' : ''
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${purchaseDropdownOpen ? 'rotate-180 text-[#b5834e]' : ''}`} />
                    </Link>
                    {purchaseDropdownOpen && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/3 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                        onMouseEnter={handlePurchaseMouseEnter}
                        onMouseLeave={handlePurchaseMouseLeave}
                      >
                        <div className="w-[780px] bg-white rounded-2xl shadow-2xl border border-stone-200 py-5">
                        <div className="grid grid-cols-3 gap-6 px-6">
                          
                          {/* Column 1: Savi Series */}
                          <div>
                            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-stone-200">
                              <span className="text-base">📘</span>
                              <div>
                                <div className="text-xs font-black uppercase tracking-wider text-slate-800">
                                  Savi Kannada
                                </div>
                                <div className="text-[11px] text-slate-500 font-medium">
                                  Classes 1–4
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              {saviBooks.map((book) => (
                                <Link
                                  key={book.href}
                                  href={book.href}
                                  onClick={() => setPurchaseDropdownOpen(false)}
                                  className="flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800 rounded-lg transition group"
                                >
                                  <span>{book.label}</span>
                                  <span className="text-slate-300 group-hover:text-amber-600 transition">→</span>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Column 2: Kali Series */}
                          <div>
                            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-stone-200">
                              <span className="text-base">📙</span>
                              <div>
                                <div className="text-xs font-black uppercase tracking-wider text-slate-800">
                                  Kali Kannada
                                </div>
                                <div className="text-[11px] text-slate-500 font-medium">
                                  Classes 1–4
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              {kaliBooks.map((book) => (
                                <Link
                                  key={book.href}
                                  href={book.href}
                                  onClick={() => setPurchaseDropdownOpen(false)}
                                  className="flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800 rounded-lg transition group"
                                >
                                  <span>{book.label}</span>
                                  <span className="text-slate-300 group-hover:text-amber-600 transition">→</span>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Column 3: Class 5 Series & Digital Books */}
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-stone-200">
                                <span className="text-base">📗</span>
                                <div>
                                  <div className="text-xs font-black uppercase tracking-wider text-slate-800">
                                    Class 5 Series
                                  </div>
                                  <div className="text-[11px] text-slate-500 font-medium">
                                    Classes 5 · Siri &amp; Tili Kannada
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1">
                                {class5Books.map((book) => (
                                  <Link
                                    key={book.href}
                                    href={book.href}
                                    onClick={() => setPurchaseDropdownOpen(false)}
                                    className="flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800 rounded-lg transition group"
                                  >
                                    <span>{book.label}</span>
                                    <span className="text-slate-300 group-hover:text-amber-600 transition">→</span>
                                  </Link>
                                ))}
                              </div>
                            </div>

                            <div className="pt-1">
                              <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-stone-200">
                                <span className="text-base">💻</span>
                                <div>
                                  <div className="text-xs font-black uppercase tracking-wider text-indigo-700">
                                    Digital Books
                                  </div>
                                  <div className="text-[11px] text-indigo-600 font-medium">
                                    Classes 6–10 · Web Reader
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <Link
                                  href="/digital/kannada-class-6-guide"
                                  onClick={() => setPurchaseDropdownOpen(false)}
                                  className="flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition group border border-transparent hover:border-indigo-100"
                                >
                                  <div>
                                    <span className="font-bold text-slate-900 block">Class 6 Digital Guidebook</span>
                                    <span className="text-[10px] text-slate-500">Official Web Edition</span>
                                  </div>
                                  <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                                    Available
                                  </span>
                                </Link>

                                <Link
                                  href="/digital"
                                  onClick={() => setPurchaseDropdownOpen(false)}
                                  className="flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition group"
                                >
                                  <div>
                                    <span className="block">Classes 7–10 Digital</span>
                                    <span className="text-[10px] text-slate-400">Curriculum Roadmap</span>
                                  </div>
                                  <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded">
                                    Coming Soon
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>

                        </div>

                        {/* Bottom: Browse All Books Button */}
                        <div className="border-t border-stone-200 mt-4 pt-3 px-6 flex items-center justify-between text-xs">
                          <Link
                            href="/books"
                            onClick={() => setPurchaseDropdownOpen(false)}
                            className="flex items-center gap-1.5 font-black text-amber-700 hover:text-amber-800 transition py-1"
                          >
                            <span>Browse All Books Catalog (10 Books)</span>
                            <span>→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                );
              }

              if (link.isSpokenDropdown) {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={handleSpokenMouseEnter}
                    onMouseLeave={handleSpokenMouseLeave}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1.5 px-2.5 2xl:px-3 py-2 rounded-lg font-bold text-slate-800 hover:text-[#b5834e] hover:bg-amber-50 transition whitespace-nowrap ${
                        isActive || spokenDropdownOpen ? 'text-[#b5834e] bg-amber-50' : ''
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded-full leading-none shadow-2xs">
                        NEW
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                          spokenDropdownOpen ? 'rotate-180 text-[#b5834e]' : ''
                        }`}
                      />
                    </Link>

                    {spokenDropdownOpen && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                        onMouseEnter={handleSpokenMouseEnter}
                        onMouseLeave={handleSpokenMouseLeave}
                      >
                        <div className="w-[320px] bg-white rounded-2xl shadow-2xl border border-stone-200 p-4">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">
                            Spoken Kannada
                          </div>
                          <Link
                            href="/books/a-destination-to-speak-kannada"
                            onClick={() => setSpokenDropdownOpen(false)}
                            className="flex items-center justify-between p-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-amber-50 hover:text-amber-800 transition group"
                          >
                            <span className="leading-snug pr-2">A Destination to Speak Kannada</span>
                            <span className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full leading-none">
                                NEW
                              </span>
                              <span className="text-slate-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition">
                                →
                              </span>
                            </span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (link.isDigital) {
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-2.5 2xl:px-3 py-2.5 rounded-lg font-extrabold transition hover:bg-indigo-50 hover:text-indigo-700 whitespace-nowrap ${
                      isActive ? 'text-indigo-700 bg-indigo-50' : 'text-indigo-600'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                    <span className="text-[8px] bg-indigo-500 text-white font-black px-1 py-0.5 rounded-full leading-none">NEW</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-2.5 2xl:px-3 py-2.5 rounded-lg transition hover:bg-amber-50 hover:text-[#b5834e] whitespace-nowrap ${
                    isActive ? 'text-[#b5834e] bg-amber-50' : ''
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: User + BUY NOW + Cart + Hamburger */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">

            {/* User button (My Library / Login) */}
            {user ? (
              <div className="relative" onMouseLeave={() => setUserDropdownOpen(false)}>
                <button
                  onMouseEnter={() => setUserDropdownOpen(true)}
                  onClick={() => setUserDropdownOpen((o) => !o)}
                  className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-50 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {user.name.split(' ')[0]}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {userDropdownOpen && (
                  <div className="absolute top-full right-0 w-52 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50">
                    {user.isAdmin ? (
                      <Link href="/admin" onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-amber-700 bg-amber-50/70 hover:bg-amber-100 transition">
                        <Shield className="w-3.5 h-3.5 text-amber-600" /> Admin Portal
                      </Link>
                    ) : (
                      <>
                        <Link href="/library" onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition">
                          <Library className="w-3.5 h-3.5" /> My Library
                        </Link>
                        <Link href="/profile?tab=orders" onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition">
                          <Package className="w-3.5 h-3.5" /> Purchase History
                        </Link>
                      </>
                    )}
                    <div className="border-t border-stone-100 mt-1 pt-1">
                      <button onClick={() => { logout(); setUserDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition">
                        <LogOut className="w-3.5 h-3.5" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login"
                className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-50 transition">
                <User className="w-3.5 h-3.5" /> Login
              </Link>
            )}

            {/* BUY NOW — hidden on small screens */}
            <Link
              href="/books"
              className="hidden md:inline-flex items-center justify-center bg-[#b5834e] hover:bg-[#996d3f] text-white text-xs font-black px-5 py-2.5 rounded-lg uppercase tracking-wider shadow-sm transition whitespace-nowrap"
            >
              BUY NOW
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#b5834e] p-2 rounded-lg hover:bg-stone-50 transition cursor-pointer whitespace-nowrap min-h-[44px]"
              aria-label="Open Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">
                {totalItems} / {formatPrice(subtotal)}
              </span>
            </button>

            {/* Hamburger — visible below xl */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2.5 text-slate-700 hover:bg-stone-100 rounded-lg transition min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle Mobile Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Rolling Announcement Bar — Positioned Below Menu */}
      <AnnouncementBar />

      {/* Mobile Off-Canvas Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] xl:hidden overflow-hidden overscroll-contain">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-[88vw] max-w-sm bg-white shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center"
              >
                <img
                  src="/Belesu-logo1.png"
                  alt="Belesu Logo"
                  className="h-10 object-contain"
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-stone-200/60 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Nav List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5 touch-scroll">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                if (link.isAcademicDropdown) {
                  return (
                    <div key={link.label} className="rounded-xl border border-stone-200 overflow-hidden bg-stone-50/50">
                      <button
                        onClick={() => setMobilePurchaseOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between px-3.5 py-3 text-left font-bold text-sm text-slate-800 hover:bg-amber-50/70 transition min-h-[44px]"
                        aria-expanded={mobilePurchaseOpen}
                      >
                        <span className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-amber-600" />
                          <span>{link.label}</span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                            mobilePurchaseOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {mobilePurchaseOpen && (
                        <div className="px-3 pb-3 pt-1 space-y-3 border-t border-stone-200 bg-white">
                          
                          {/* Savi Series */}
                          <div className="pt-2">
                            <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-black uppercase tracking-wider text-slate-700 bg-amber-50 rounded-md mb-1.5">
                              <span>📘</span>
                              <span>Savi Kannada (Classes 1–4)</span>
                            </div>
                            <div className="space-y-0.5 pl-1">
                              {saviBooks.map((book) => (
                                <Link
                                  key={book.href}
                                  href={book.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition min-h-[40px] flex items-center"
                                >
                                  {book.label}
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Kali Series */}
                          <div className="pt-1 border-t border-stone-100">
                            <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100/60 rounded-md mb-1.5">
                              <span>📙</span>
                              <span>Kali Kannada (Classes 1–4)</span>
                            </div>
                            <div className="space-y-0.5 pl-1">
                              {kaliBooks.map((book) => (
                                <Link
                                  key={book.href}
                                  href={book.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition min-h-[40px] flex items-center"
                                >
                                  {book.label}
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Class 5 Series */}
                          <div className="pt-1 border-t border-stone-100">
                            <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-black uppercase tracking-wider text-slate-800 bg-stone-100 rounded-md mb-1.5">
                              <span>📗</span>
                              <span>Class 5 (Siri & Tili Kannada)</span>
                            </div>
                            <div className="space-y-0.5 pl-1">
                              {class5Books.map((book) => (
                                <Link
                                  key={book.href}
                                  href={book.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition min-h-[40px] flex items-center"
                                >
                                  {book.label}
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Spoken Kannada */}
                          <div className="pt-1 border-t border-stone-100">
                            <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-black uppercase tracking-wider text-slate-800 bg-stone-100 rounded-md mb-1.5">
                              <span>🗣️</span>
                              <span>General / Spoken Kannada</span>
                            </div>
                            <div className="space-y-0.5 pl-1">
                              {spokenBooks.map((book) => (
                                <Link
                                  key={book.href}
                                  href={book.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition min-h-[40px] flex items-center"
                                >
                                  {book.label}
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Digital Books */}
                          <div className="pt-1 border-t border-stone-100">
                            <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 rounded-md mb-1.5">
                              <span>💻</span>
                              <span>Digital Books (Classes 6–10)</span>
                            </div>
                            <div className="space-y-1 pl-1">
                              <Link
                                href="/digital/kannada-class-6-guide"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100 transition min-h-[40px]"
                              >
                                <span>Class 6 Digital Guidebook</span>
                                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-black">Available</span>
                              </Link>
                              <Link
                                href="/digital"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition min-h-[40px]"
                              >
                                <span>Browse Digital Platform</span>
                                <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-black">NEW</span>
                              </Link>
                            </div>
                          </div>

                          {/* All Books Link */}
                          <div className="pt-2 border-t border-stone-100">
                            <Link
                              href="/books"
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-center py-2.5 text-xs font-black text-amber-700 hover:bg-amber-50 rounded-lg transition"
                            >
                              Browse All Books Catalog (10 Books) →
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                if (link.isSpokenDropdown) {
                  return (
                    <div key={link.label} className="rounded-xl border border-stone-200 overflow-hidden bg-stone-50/50">
                      <button
                        onClick={() => setMobileSpokenOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between px-3.5 py-3 text-left font-bold text-sm text-slate-800 hover:bg-amber-50/70 transition min-h-[44px]"
                        aria-expanded={mobileSpokenOpen}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">🗣️</span>
                          <span>{link.label}</span>
                          <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded-full leading-none">
                            NEW
                          </span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                            mobileSpokenOpen ? 'rotate-180 text-amber-700' : ''
                          }`}
                        />
                      </button>

                      {mobileSpokenOpen && (
                        <div className="px-3 pb-3 pt-2 space-y-1 border-t border-stone-200 bg-white">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 pt-1 mb-1">
                            Spoken Kannada
                          </div>
                          <Link
                            href="/books/a-destination-to-speak-kannada"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between p-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-800 hover:bg-amber-50 hover:text-amber-800 transition group"
                          >
                            <span className="leading-snug pr-2">A Destination to Speak Kannada</span>
                            <span className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full leading-none">
                                NEW
                              </span>
                              <span className="text-slate-400 group-hover:text-amber-700 transition">
                                →
                              </span>
                            </span>
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition min-h-[44px] ${
                      isActive
                        ? 'text-amber-800 bg-amber-50 font-bold border border-amber-200/60'
                        : 'text-slate-700 hover:bg-stone-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{link.label}</span>
                      {link.isHighlight && (
                        <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded-full leading-none">
                          NEW
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}

              {/* User Account / Auth Section */}
              <div className="pt-3 border-t border-stone-200 mt-2 space-y-1">
                {user ? (
                  <>
                    <div className="px-3 py-2 flex items-center gap-2.5 bg-stone-100 rounded-xl mb-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800 truncate">{user.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{user.email}</div>
                      </div>
                    </div>

                    {user.isAdmin ? (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition min-h-[44px]"
                      >
                        <Shield className="w-4 h-4 text-amber-600" /> Admin Portal
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/library"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition min-h-[44px]"
                        >
                          <Library className="w-4 h-4 text-slate-500" /> My Library
                        </Link>
                        <Link
                          href="/profile?tab=orders"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition min-h-[44px]"
                        >
                          <Package className="w-4 h-4 text-slate-500" /> Purchase History
                        </Link>
                      </>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition text-left min-h-[44px]"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 transition min-h-[44px]"
                  >
                    <User className="w-4 h-4" /> Login / Create Account
                  </Link>
                )}
              </div>
            </div>

            {/* Drawer Footer with BUY NOW CTA */}
            <div className="p-4 border-t border-stone-200 bg-stone-50/90 pb-safe">
              <Link
                href="/books"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center py-3.5 px-4 bg-[#b5834e] hover:bg-[#996d3f] active:scale-98 text-white text-xs font-black rounded-xl uppercase tracking-wider shadow-md transition min-h-[48px]"
              >
                BUY NOW
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
