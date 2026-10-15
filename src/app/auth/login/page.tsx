'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { X, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

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

  useEffect(() => {
    if (user) router.replace(redirectTo || '/library');
  }, [user, redirectTo, router]);

  if (user) return null;

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) { setError('Enter a valid 10-digit mobile number'); return; }
    setError(''); setIsLoading(true);
    const result = await sendOtp(phone, name);
    setIsLoading(false);
    if (result.success) {
      setStep('otp');
      if (result.message?.includes('[DEV MODE]')) setDevMessage(result.message);
    } else {
      setError(result.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) { setError('Enter the 6-digit OTP'); return; }
    setError(''); setIsLoading(true);
    const result = await verifyOtp(phone, otp, name);
    setIsLoading(false);
    if (result.success) {
      router.replace(redirectTo || '/library');
    } else {
      setError(result.error || 'Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto">
            <Phone className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-2xl font-black text-white">{step === 'phone' ? 'Login to Belesu' : 'Verify OTP'}</h1>
          <p className="text-slate-400 text-sm">
            {step === 'phone' ? 'Access your digital books with your phone number' : `OTP sent to +91 ${phone}`}
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 space-y-4">
          {step === 'phone' ? (
            <>
              <div className="space-y-3">
                <input type="text" placeholder="Your name (optional)" value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-amber-500 placeholder-slate-500 transition" />
                <div className="flex">
                  <span className="flex items-center px-3 bg-slate-700 border border-slate-600 border-r-0 rounded-l-xl text-sm text-slate-400">+91</span>
                  <input type="tel" placeholder="10-digit mobile number" value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                    className="flex-1 bg-slate-900 border border-slate-700 text-white text-sm px-4 py-3 rounded-r-xl focus:outline-none focus:border-amber-500 placeholder-slate-500 transition" />
                </div>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button onClick={handleSendOtp} disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-black py-3.5 rounded-xl transition text-sm">
                {isLoading ? <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
              </button>
            </>
          ) : (
            <>
              {devMessage && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300">{devMessage}</div>
              )}
              <input type="text" inputMode="numeric" placeholder="Enter 6-digit OTP" value={otp} maxLength={6}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                className="w-full bg-slate-900 border border-slate-700 text-white text-2xl font-black px-4 py-3 rounded-xl focus:outline-none focus:border-amber-500 text-center tracking-widest transition" />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button onClick={handleVerifyOtp} disabled={isLoading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-black py-3.5 rounded-xl transition text-sm">
                {isLoading ? <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <><ShieldCheck className="w-4 h-4" /> Verify & Login</>}
              </button>
              <button onClick={() => { setStep('phone'); setOtp(''); setError(''); }}
                className="w-full text-xs text-slate-400 hover:text-white transition py-1">← Change phone number</button>
            </>
          )}
        </div>
        <p className="text-center text-xs text-slate-500">By logging in, you agree to Belesu&apos;s terms of use.</p>
      </div>
    </div>
  );
}
