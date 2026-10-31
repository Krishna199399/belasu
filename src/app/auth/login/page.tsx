'use client';

import { use, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
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
  const { sendOtp, verifyOtp, user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [devMessage, setDevMessage] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  const otpInputRef = useRef<HTMLInputElement>(null);

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

  if (user) return null;

  const handleSendOtp = async (isResend = false) => {
    if (!name.trim()) {
      setError('Please enter parent name');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setIsLoading(true);

    const result = await sendOtp(phone, name.trim());
    setIsLoading(false);

    if (result.success) {
      setStep('otp');
      setResendCountdown(30);
      if (result.message?.includes('[DEV MODE]')) {
        setDevMessage(result.message);
      }
    } else {
      setError(result.error || 'Failed to send verification code. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP code');
      return;
    }
    setError('');
    setIsLoading(true);

    const result = await verifyOtp(phone, otp, name);
    setIsLoading(false);

    if (result.success) {
      router.replace(redirectTo || '/library');
    } else {
      setError(result.error || 'Invalid verification code. Please check and try again.');
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

      <div className="relative w-full max-w-md mx-auto">
        {/* Belesu Brand Logo Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block transition hover:opacity-90">
            <img
              src="/Belesu-logo1.png"
              alt="Belesu Logo"
              className="h-12 sm:h-14 mx-auto object-contain"
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
                    {step === 'phone' ? 'Sign In with Mobile' : 'Verify Mobile Number'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    {step === 'phone'
                      ? 'No password required. Enter your phone number for instant OTP.'
                      : `Enter the 6-digit verification code sent to +91 ${phone}`}
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
                          <span className="text-[11px] text-slate-400 font-medium">WhatsApp / SMS</span>
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
                      onClick={() => handleSendOtp(false)}
                      disabled={isLoading || phone.length !== 10}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3.5 px-6 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 active:scale-[0.99] transition cursor-pointer text-sm"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending OTP...</span>
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

                    {/* 6-Digit OTP Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>Enter 6-Digit Code</span>
                        <button
                          type="button"
                          onClick={() => {
                            setStep('phone');
                            setOtp('');
                            setError('');
                          }}
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
                      disabled={isLoading || otp.length !== 6}
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
                        <button
                          type="button"
                          onClick={() => handleSendOtp(true)}
                          disabled={isLoading}
                          className="inline-flex items-center gap-1.5 font-bold text-amber-700 hover:text-amber-800 transition cursor-pointer"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Resend OTP via WhatsApp</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setStep('phone');
                          setOtp('');
                          setError('');
                        }}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 font-medium transition cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Use a different phone number</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Card Footer: Terms, Privacy, Support */}
              <div className="mt-6 pt-5 border-t border-stone-100 space-y-2 text-center text-xs text-slate-500">
                <p>
                  By signing in, you agree to Belesu&apos;s{' '}
                  <Link href="/policies/terms" className="font-semibold text-slate-700 hover:text-amber-700 underline transition">
                    Terms of Use
                  </Link>{' '}
                  and{' '}
                  <Link href="/policies/privacy" className="font-semibold text-slate-700 hover:text-amber-700 underline transition">
                    Privacy Policy
                  </Link>.
                </p>

                <div className="pt-1">
                  <a
                    href="https://wa.me/919606636804?text=Hello%20Belesu%20Support,%20I%20need%20assistance%20logging%20in%20to%20my%20account."
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Need help? Chat with WhatsApp Support</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
