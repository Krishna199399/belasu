'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { X, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  redirectAfter?: string;
}

type Step = 'phone' | 'otp';

export function AuthModal({ onClose, redirectAfter }: AuthModalProps) {
  const { sendOtp, verifyOtp } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [devMessage, setDevMessage] = useState('');

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setIsLoading(true);
    const result = await sendOtp(phone, name);
    setIsLoading(false);
    if (result.success) {
      setStep('otp');
      if (result.message?.includes('[DEV MODE]')) {
        setDevMessage(result.message);
      }
    } else {
      setError(result.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Enter the 6-digit OTP');
      return;
    }
    setError('');
    setIsLoading(true);
    const result = await verifyOtp(phone, otp, name);
    setIsLoading(false);
    if (result.success) {
      onClose();
      if (redirectAfter) router.push(redirectAfter);
    } else {
      setError(result.error || 'Invalid OTP');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-slate-800 to-amber-950 p-6 text-center">
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition">
            <X className="w-4 h-4" />
          </button>
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-3">
            <Phone className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-lg font-black text-white">
            {step === 'phone' ? 'Login to Belesu' : 'Enter OTP'}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {step === 'phone' ? 'Enter your phone number to continue' : `OTP sent to +91 ${phone}`}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {step === 'phone' ? (
            <>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">Your Name (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Ravi Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-amber-500 placeholder-slate-500 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">Mobile Number</label>
                  <div className="flex">
                    <span className="flex items-center px-3 bg-slate-700 border border-slate-600 border-r-0 rounded-l-xl text-sm text-slate-400">+91</span>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                      className="flex-1 bg-slate-800 border border-slate-700 text-white text-sm px-4 py-3 rounded-r-xl focus:outline-none focus:border-amber-500 placeholder-slate-500 transition"
                    />
                  </div>
                </div>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-black py-3 rounded-xl transition text-sm"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
              </button>
            </>
          ) : (
            <>
              {devMessage && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-300">
                  {devMessage}
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-slate-400 mb-1 block">6-Digit OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter OTP"
                  value={otp}
                  maxLength={6}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                  className="w-full bg-slate-800 border border-slate-700 text-white text-xl font-black px-4 py-3 rounded-xl focus:outline-none focus:border-amber-500 placeholder-slate-500 text-center tracking-widest transition"
                />
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-black py-3 rounded-xl transition text-sm"
              >
                {isLoading ? <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> : <><ShieldCheck className="w-4 h-4" /> Verify & Login</>}
              </button>
              <button onClick={() => { setStep('phone'); setOtp(''); setError(''); }} className="w-full text-xs text-slate-400 hover:text-white transition py-1">
                ← Change phone number
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
