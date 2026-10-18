'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, Menu, X, ChevronDown, BookOpen, Library, LogOut, User, Laptop, Package, MapPin, Shield } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const rawPathname = usePathname();
  const [pathname, setPathname] = useState('');
  const { toggleCart, totalItems, subtotal } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [purchaseDropdownOpen, setPurchaseDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (rawPathname) setPathname(rawPathname);
  }, [rawPathname]);

  if (rawPathname?.startsWith('/admin')) {
    return null;
  }

  const physicalBookCategories = [
    { label: 'Savi Kannada Class 1', href: '/books?series=Savi&grade=1' },
    { label: 'Savi Kannada Class 2', href: '/books?series=Savi&grade=2' },
    { label: 'Savi Kannada Class 3', href: '/books?series=Savi&grade=3' },
    { label: 'Savi Kannada Class 4', href: '/books?series=Savi&grade=4' },
    { label: 'Kali Kannada Class 1', href: '/books?series=Kali&grade=1' },
    { label: 'Kali Kannada Class 2', href: '/books?series=Kali&grade=2' },
    { label: 'Kali Kannada Class 3', href: '/books?series=Kali&grade=3' },
    { label: 'Kali Kannada Class 4', href: '/books?series=Kali&grade=4' },
    { label: 'Siri Kannada Class 5', href: '/books?series=Siri&grade=5' },
    { label: 'Tili Kannada Class 5', href: '/books?series=Tili&grade=5' },
  ];

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'Purchase Books', href: '/books', isDropdown: true },
    { label: 'Videos', href: '/videos' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 py-1">
            <img
              src="/Belesu-logo1.png"
              alt="Belesu Logo"
              className="h-14 sm:h-16 object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-bold tracking-wide text-slate-700">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              if (link.isDropdown) {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setPurchaseDropdownOpen(true)}
                    onMouseLeave={() => setPurchaseDropdownOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1 px-3 py-2.5 rounded-lg transition hover:bg-amber-50 hover:text-[#b5834e] ${
                        isActive ? 'text-[#b5834e] bg-amber-50' : ''
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${purchaseDropdownOpen ? 'rotate-180' : ''}`} />
                    </Link>
                    {purchaseDropdownOpen && (
                      <div className="absolute top-full left-0 w-[520px] bg-white rounded-xl shadow-2xl border border-stone-200 py-4 z-50 mt-1">
                        <div className="grid grid-cols-2 gap-6 px-4">
                          {/* Left Column: Hard Copy Books */}
                          <div>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-stone-200 border-b">
                              <span className="text-lg">📚</span>
                              <div>
                                <div className="text-xs font-black uppercase tracking-wider text-slate-700">
                                  Hard Copy Books
                                </div>
                                <div className="text-xs text-slate-600 font-semibold">
                                  Classes 1-5
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Link
                                href="/books?series=Savi&grade=1"
                                onClick={() => setPurchaseDropdownOpen(false)}
                                className="flex items-center justify-between px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition group"
                              >
                                <span>Class 1 · Savi Kannada</span>
                              </Link>
                              <Link
                                href="/books?series=Savi&grade=2"
                                onClick={() => setPurchaseDropdownOpen(false)}
                                className="flex items-center justify-between px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition group"
                              >
                                <span>Class 2 · Savi Kannada</span>
                              </Link>
                              <Link
                                href="/books?series=Savi&grade=3"
                                onClick={() => setPurchaseDropdownOpen(false)}
                                className="flex items-center justify-between px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition group"
                              >
                                <span>Class 3 · Savi Kannada</span>
                              </Link>
                              <Link
                                href="/books?series=Savi&grade=4"
                                onClick={() => setPurchaseDropdownOpen(false)}
                                className="flex items-center justify-between px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition group"
                              >
                                <span>Class 4 · Savi Kannada</span>
                              </Link>
                              <Link
                                href="/books?series=Siri&grade=5"
                                onClick={() => setPurchaseDropdownOpen(false)}
                                className="flex items-center justify-between px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition group"
                              >
                                <span>Class 5 · Siri / Tili Kannada</span>
                              </Link>
                            </div>
                          </div>

                          {/* Right Column: Digital Books */}
                          <div>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-200">
                              <span className="text-lg">💻</span>
                              <div>
                                <div className="text-xs font-black uppercase tracking-wider text-indigo-700">
                                  Digital Books
                                </div>
                                <div className="text-xs text-indigo-600 font-semibold">
                                  Classes 6-10
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Link
                                href="/digital"
                                onClick={() => setPurchaseDropdownOpen(false)}
                                className="flex items-center justify-between px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition group"
                              >
                                <span>Class 6</span>
                                <span className="text-slate-400 group-hover:text-indigo-600 transition">→</span>
                              </Link>
                              <Link
                                href="/digital"
                                onClick={() => setPurchaseDropdownOpen(false)}
                                className="flex items-center justify-between px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition group"
                              >
                                <span>Class 7</span>
                                <span className="text-slate-400 group-hover:text-indigo-600 transition">→</span>
                              </Link>
                              <Link
                                href="/digital"
                                onClick={() => setPurchaseDropdownOpen(false)}
                                className="flex items-center justify-between px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition group"
                              >
                                <span>Class 8</span>
                                <span className="text-slate-400 group-hover:text-indigo-600 transition">→</span>
                              </Link>
                              <Link
                                href="/digital"
                                onClick={() => setPurchaseDropdownOpen(false)}
                                className="flex items-center justify-between px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition group"
                              >
                                <span>Class 9</span>
                                <span className="text-slate-400 group-hover:text-indigo-600 transition">→</span>
                              </Link>
                              <Link
                                href="/digital"
                                onClick={() => setPurchaseDropdownOpen(false)}
                                className="flex items-center justify-between px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition group"
                              >
                                <span>Class 10</span>
                                <span className="text-slate-400 group-hover:text-indigo-600 transition">→</span>
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Bottom: Browse All Books Button */}
                        <div className="border-t border-stone-200 mt-4 pt-3 px-4">
                          <Link
                            href="/books"
                            onClick={() => setPurchaseDropdownOpen(false)}
                            className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-black text-slate-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                          >
                            <span>[ Browse All Books → ]</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if ((link as { isHighlight?: boolean }).isHighlight) {
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex items-center gap-1 px-4 py-3 rounded-lg font-extrabold text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition ${
                      isActive ? 'bg-amber-50' : ''
                    }`}
                  >
                    {link.label}
                    <span className="text-[8px] bg-amber-500 text-white font-black px-1 py-0.5 rounded-full leading-none">
                      NEW
                    </span>
                  </Link>
                );
              }

              if ((link as { isDigital?: boolean }).isDigital) {
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg font-extrabold transition hover:bg-indigo-50 hover:text-indigo-700 ${
                      isActive ? 'text-indigo-700 bg-indigo-50' : 'text-indigo-600'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    {link.label}
                    <span className="text-[8px] bg-indigo-500 text-white font-black px-1 py-0.5 rounded-full leading-none">NEW</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-2.5 rounded-lg transition hover:bg-amber-50 hover:text-[#b5834e] ${
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
                    {user.isAdmin && (
                      <Link href="/admin" onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-amber-700 bg-amber-50/70 hover:bg-amber-100 transition border-b border-stone-100">
                        <Shield className="w-3.5 h-3.5 text-amber-600" /> Admin Portal
                      </Link>
                    )}
                    <Link href="/library" onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition">
                      <Library className="w-3.5 h-3.5" /> My Library
                    </Link>
                    <Link href="/profile?tab=orders" onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition">
                      <Package className="w-3.5 h-3.5" /> Purchase History
                    </Link>
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
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#b5834e] transition cursor-pointer whitespace-nowrap"
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
              className="xl:hidden p-2 text-slate-700 hover:bg-stone-100 rounded-lg transition"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-stone-200 px-5 py-5 shadow-xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              // If it's the Books dropdown, show expanded view in mobile
              if (link.isDropdown) {
                return (
                  <div key={link.label} className="space-y-2 pb-2">
                    <div className="px-3 py-2 text-sm font-black text-slate-900 border-b border-stone-200">
                      {link.label}
                    </div>
                    {/* Hard Copy Books */}
                    <div className="space-y-1">
                      <div className="px-3 py-2 flex items-center gap-2 bg-amber-50 rounded-lg mx-2">
                        <span className="text-base">📚</span>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                          Hard Copy (1-5)
                        </span>
                      </div>
                      <div className="pl-2 space-y-0.5">
                        {physicalBookCategories.map((cat) => (
                          <Link
                            key={cat.label}
                            href={cat.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition"
                          >
                            {cat.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    {/* Digital Books */}
                    <div className="space-y-1 pt-2">
                      <div className="px-3 py-2 flex items-center gap-2 bg-indigo-50 rounded-lg mx-2">
                        <span className="text-base">💻</span>
                        <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
                          Digital (6-10)
                        </span>
                      </div>
                      <div className="pl-2">
                        <Link
                          href="/digital"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition"
                        >
                          <span>Browse All Digital Books</span>
                          <span className="ml-auto text-xs bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-black">NEW</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }
              
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                    (link as { isHighlight?: boolean }).isHighlight
                      ? 'text-amber-600 font-extrabold hover:bg-amber-50'
                      : (link as { isDigital?: boolean }).isDigital
                      ? 'text-indigo-600 font-extrabold hover:bg-indigo-50'
                      : 'text-slate-700 hover:bg-stone-50 hover:text-[#b5834e]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.label}
                    {(link as { isHighlight?: boolean }).isHighlight && (
                      <span className="text-xs bg-amber-500 text-white font-black px-1.5 py-0.5 rounded-full">NEW</span>
                    )}
                    {(link as { isDigital?: boolean }).isDigital && (
                      <span className="text-xs bg-indigo-500 text-white font-black px-1.5 py-0.5 rounded-full">NEW</span>
                    )}
                  </span>
                </Link>
              );
            })}
            {user ? (
              <>
                {user.isAdmin && (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 transition flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-600" /> Admin Portal
                  </Link>
                )}
                <Link href="/library" onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition flex items-center gap-2">
                  <Library className="w-4 h-4" /> My Library
                </Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="px-3 py-2.5 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 transition text-left flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition flex items-center gap-2">
                <User className="w-4 h-4" /> Login / Sign Up
              </Link>
            )}
            <div className="pt-3 mt-2 border-t border-stone-100">
              <Link
                href="/books"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-[#b5834e] hover:bg-[#996d3f] text-white text-sm font-black px-4 py-3 rounded-xl uppercase tracking-wider transition"
              >
                BUY NOW
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
