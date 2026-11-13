'use client';

import { use, useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  User as UserIcon,
  Lock,
  MessageCircle,
  RotateCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

type Step = 'phone' | 'otp';

export default function LoginPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const { redirect: redirectTo } = use(searchParams);
  const { sendOtp, retryOtp, verifyOtp, user } = useAuth();
  const { cart, syncCart } = useCart();
  const router = useRouter();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [devMessage, setDevMessage] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const [reqId, setReqId] = useState<string>('');

  const otpInputRef = useRef<HTMLInputElement>(null);
  const hasLoggedInRef = useRef(false);

  // Restore state if Mobile Safari reloaded when switching to WhatsApp
  useEffect(() => {
    try {
      const savedPhone = sessionStorage.getItem('belasu_auth_phone');
      const savedName = sessionStorage.getItem('belasu_auth_name');
      const savedReqId = sessionStorage.getItem('belasu_otp_reqId');
      const savedStep = sessionStorage.getItem('belasu_auth_step');

      if (savedPhone) setPhone(savedPhone);
      if (savedName) setName(savedName);
      if (savedReqId) setReqId(savedReqId);
      if (savedStep === 'otp') setStep('otp');
    } catch {}
  }, []);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      router.replace(redirectTo || '/library');
    }
  }, [user, redirectTo, router]);

  // Handle Resend countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, resendCountdown]);

  // Focus OTP input on step change
  useEffect(() => {
    if (step === 'otp' && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  // Clear state when switching phone number
  const handleResetToPhone = useCallback(() => {
    setStep('phone');
    setOtp('');
    setError('');
    setSuccessNotice('');
    setReqId('');
    setResendCountdown(0);
    try {
      sessionStorage.removeItem('belasu_otp_reqId');
      sessionStorage.removeItem('belasu_auth_step');
    } catch {}
  }, []);

  if (user) return null;

  const handleSendOtp = async () => {
    if (!name.trim()) {
      setError('Please enter parent name');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setSuccessNotice('');
    setIsLoading(true);
    setDevMessage('');

    try {
      const result = await sendOtp(phone, name.trim());
      setIsLoading(false);

      if (result.success) {
        setStep('otp');
        setResendCountdown(30);
        if (result.reqId) {
          setReqId(result.reqId);
          try {
            sessionStorage.setItem('belasu_otp_reqId', result.reqId);
          } catch {}
        }
        try {
          sessionStorage.setItem('belasu_auth_phone', phone);
          sessionStorage.setItem('belasu_auth_name', name.trim());
          sessionStorage.setItem('belasu_auth_step', 'otp');
        } catch {}

        // Instantly save cart as abandoned lead if customer drops off at OTP screen
        if (cart.length > 0) {
          syncCart(phone, name.trim());
        }

        if (result.message?.includes('[DEV MODE]')) {
          setDevMessage(result.message);
        }
      } else {
        setError(result.error || 'Failed to send WhatsApp verification code. Please try again.');
      }
    } catch (e: unknown) {
      setIsLoading(false);
      const errMsg = e instanceof Error ? e.message : 'Network error sending WhatsApp OTP. Please try again.';
      setError(errMsg);
    }
  };

  const handleResendOtp = async (channel: '12' | '11' = '12') => {
    if (isLoading) return;
    setIsLoading(true);
    setError('');
    setSuccessNotice('');

    try {
      const result = await retryOtp(phone, channel);
      setIsLoading(false);

      if (result.success) {
        setResendCountdown(30);
        if (result.reqId) {
          setReqId(result.reqId);
          try {
            sessionStorage.setItem('belasu_otp_reqId', result.reqId);
          } catch {}
        }
        setSuccessNotice(channel === '11' ? 'SMS code sent successfully!' : 'WhatsApp code resent successfully!');
      } else {
        setError(result.error || 'Failed to resend verification code. Please try again.');
      }
    } catch (e: unknown) {
      setIsLoading(false);
      const errMsg = e instanceof Error ? e.message : 'Network error resending verification code.';
      setError(errMsg);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4 || otp.length > 6) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    setError('');
    setSuccessNotice('');
    setIsLoading(true);

    const activeReqId = reqId || (typeof window !== 'undefined' ? sessionStorage.getItem('belasu_otp_reqId') : '') || '';

    try {
      const result = await verifyOtp(phone, otp, name.trim(), activeReqId);
      setIsLoading(false);

      if (result.success) {
        hasLoggedInRef.current = true;
        try {
          sessionStorage.removeItem('belasu_otp_reqId');
          sessionStorage.removeItem('belasu_auth_step');
          sessionStorage.removeItem('belasu_auth_phone');
          sessionStorage.removeItem('belasu_auth_name');
        } catch {}
        router.replace(redirectTo || '/library');
      } else {
        setError(result.error || 'Incorrect verification code. Please check and try again.');
      }
    } catch (e: unknown) {
      setIsLoading(false);
      const errMsg = e instanceof Error ? e.message : 'Verification failed. Please check your connection and try again.';
      setError(errMsg);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-gradient-to-br from-amber-50/70 via-stone-50 to-orange-50/40 py-10 sm:py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 bg-amber-200/35 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"
      />

      <div className="relative w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Matching Belesu Visual Comparison Banner */}
          <div className="order-2 lg:order-1 lg:col-span-7 flex flex-col items-center">
            <div className="w-full max-w-lg lg:max-w-none bg-white rounded-3xl p-3 sm:p-4 border border-amber-200/80 shadow-2xl shadow-amber-900/10 overflow-hidden group">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-100">
                <Image
                  src="/login-banner.jpg"
                  alt="Your Child Studies: Kannada Text Book Class 1 to 6 - Belesu Kannada Guide Book Comparison"
                  width={1024}
                  height={1024}
                  priority
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Sign In Card */}
          <div className="order-1 lg:order-2 lg:col-span-5 w-full max-w-md mx-auto">
            {/* Belesu Brand Logo Header */}
            <div className="text-center mb-6">
              <Link href="/" className="inline-block transition hover:opacity-90">
                <img
                  src="/Belesu-logo1.png"
                  alt="Belesu Logo"
                  className="h-16 xs:h-20 sm:h-20 w-auto max-w-[280px] sm:max-w-xs mx-auto object-contain"
                />
              </Link>
            </div>

            {/* Interactive Sign In Card */}
            <div className="bg-white/95 backdrop-blur-xl border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-900/10 transition-all">
              
              {/* Card Header */}
              <div className="text-center space-y-2.5 pb-6 border-b border-stone-100">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-500/30">
                  {step === 'phone' ? (
                    <Phone className="w-6 h-6 stroke-[2.2]" />
                  ) : (
                    <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                  )}
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {step === 'phone' ? 'Sign In with Mobile' : 'Verify WhatsApp OTP'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {step === 'phone'
                      ? 'Enter your phone number for instant WhatsApp OTP.'
                      : `Enter the 6-digit verification code sent to your WhatsApp on +91 ${phone}`}
                  </p>
                </div>

                {/* Redirect Notice Badge */}
                {redirectTo && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/70 text-amber-800 text-[11px] font-semibold">
                    <span>✨</span>
                    <span>Direct access to your selected book after login</span>
                  </div>
                )}
              </div>

              {/* Form Content */}
              <div className="pt-6 space-y-5">
                {step === 'phone' ? (
                  <>
                    <div className="space-y-3.5">
                      
                      {/* Mandatory Parent Name Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <UserIcon className="w-3.5 h-3.5 text-amber-600" />
                          <span>
                            Parent Name <span className="text-red-500 font-bold">*</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter parent name"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (error) setError('');
                          }}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                          className="w-full bg-stone-50 hover:bg-stone-50/80 focus:bg-white border border-stone-200 focus:border-amber-500 text-slate-900 text-sm px-4 py-3 rounded-xl focus:outline-none transition shadow-2xs"
                        />
                      </div>

                      {/* 10-Digit Mobile Number Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-amber-600" />
                            <span>Mobile Phone Number</span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-bold bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                            <MessageCircle className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                            <span>WhatsApp OTP</span>
                          </span>
                        </label>

                        <div className="flex rounded-xl shadow-2xs overflow-hidden border border-stone-200 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition">
                          <div className="flex items-center gap-1.5 px-3.5 bg-stone-100/80 border-r border-stone-200 text-xs font-bold text-slate-700 shrink-0">
                            <span>🇮🇳</span>
                            <span>+91</span>
                          </div>
                          <input
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel"
                            placeholder="Enter 10-digit number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                            className="flex-1 bg-stone-50 hover:bg-stone-50/80 focus:bg-white text-slate-900 text-sm sm:text-base font-semibold px-3.5 py-3 focus:outline-none transition tracking-wider"
                          />
                          {phone.length === 10 && (
                            <div className="flex items-center pr-3 bg-stone-50 text-emerald-600">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Error Banner */}
                    {error && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Send OTP Primary CTA */}
                    <button
                      onClick={() => handleSendOtp()}
                      disabled={isLoading || phone.length !== 10}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3.5 px-6 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 active:scale-[0.99] transition cursor-pointer text-sm"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending WhatsApp OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Verification Code</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {/* Privacy & Safe Note */}
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 text-center">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>Your phone number is secure and never shared.</span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Dev Mode Notification Banner */}
                    {devMessage && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-2">
                        <span className="font-semibold">{devMessage}</span>
                        <button
                          type="button"
                          onClick={() => setOtp('123456')}
                          className="px-2.5 py-1 bg-amber-200/80 hover:bg-amber-300/80 text-amber-950 font-bold rounded-md text-[10px] transition cursor-pointer"
                        >
                          Auto-fill
                        </button>
                      </div>
                    )}

                    {/* Success notification banner */}
                    {successNotice && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                        <span>{successNotice}</span>
                      </div>
                    )}

                    {/* 4 to 6-Digit OTP Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>Enter 6-Digit WhatsApp Code</span>
                        <button
                          type="button"
                          onClick={handleResetToPhone}
                          className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                        >
                          Change Number
                        </button>
                      </label>

                      <input
                        ref={otpInputRef}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="••••••"
                        value={otp}
                        maxLength={6}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                        className="w-full bg-stone-50 hover:bg-stone-50/80 focus:bg-white border-2 border-stone-200 focus:border-amber-500 text-slate-900 text-2xl sm:text-3xl font-black font-mono tracking-[0.4em] sm:tracking-[0.5em] text-center py-3.5 rounded-xl focus:outline-none transition shadow-2xs"
                      />
                    </div>

                    {/* Error Banner */}
                    {error && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Verify Primary CTA */}
                    <button
                      onClick={handleVerifyOtp}
                      disabled={isLoading || otp.length < 4}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3.5 px-6 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 active:scale-[0.99] transition cursor-pointer text-sm"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Verifying Code...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify & Access Library</span>
                        </>
                      )}
                    </button>

                    {/* Resend OTP & Back Controls */}
                    <div className="pt-1 flex flex-col items-center gap-2.5 text-xs">
                      {resendCountdown > 0 ? (
                        <p className="text-slate-400 font-medium">
                          Resend code in <strong className="text-slate-700 font-mono">{resendCountdown}s</strong>
                        </p>
                      ) : (
                        <div className="flex flex-wrap items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleResendOtp('12')}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1.5 font-bold text-amber-700 hover:text-amber-800 transition cursor-pointer"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            <span>Resend WhatsApp OTP</span>
                          </button>

                          <span className="text-slate-300">|</span>

                          <button
                            type="button"
                            onClick={() => handleResendOtp('11')}
                            disabled={isLoading}
                            className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-800 transition cursor-pointer"
                          >
                            <span>Send via SMS</span>
                          </button>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleResetToPhone}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium transition cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Use a different phone number</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>

            {/* Terms and Privacy Footer Note */}
            <p className="mt-6 text-center text-xs text-slate-500">
              By signing in, you agree to Belesu&apos;s{' '}
              <Link href="/terms-and-conditions/" className="text-amber-700 hover:underline">
                Terms of Use
              </Link>{' '}
              and{' '}
              <Link href="/privacy-policy/" className="text-amber-700 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>

            {/* Direct Support WhatsApp Link */}
            <div className="mt-3 text-center">
              <a
                href="https://wa.me/918105829199?text=Hi%2C%20I%20need%20help%20logging%20into%20Belesu%20Bookstore"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-800 font-semibold hover:text-emerald-900 transition"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Need help? Chat with WhatsApp Support</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
