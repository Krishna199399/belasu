'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface CheckoutStepperProps {
  currentStep: 1 | 2 | 3;
}

interface StepItem {
  step: 1 | 2 | 3;
  label: string;
}

const STEPS: StepItem[] = [
  { step: 1, label: 'Cart' },
  { step: 2, label: 'Details & Payment' },
  { step: 3, label: 'Confirmation' },
];

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-xl mx-auto py-4 sm:py-6 px-4">
      <div className="flex items-center justify-between relative">
        {STEPS.map((item, index) => {
          const isCompleted = item.step < currentStep;
          const isActive = item.step === currentStep;
          const isUpcoming = item.step > currentStep;

          return (
            <React.Fragment key={item.step}>
              {/* Step Node */}
              <div className="flex flex-col items-center relative z-10">
                {isCompleted ? (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#2e7d32] text-white flex items-center justify-center shadow-xs transition-colors">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.8]" />
                  </div>
                ) : isActive ? (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#eab308] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center shadow-xs ring-4 ring-amber-100 transition-colors">
                    {item.step}
                  </div>
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-stone-300 text-stone-400 font-bold text-xs sm:text-sm flex items-center justify-center transition-colors">
                    {item.step}
                  </div>
                )}

                <span
                  className={`mt-2 text-[11px] sm:text-xs font-bold tracking-tight text-center whitespace-nowrap ${
                    isActive
                      ? 'text-slate-900 font-extrabold'
                      : isCompleted
                      ? 'text-slate-900 font-bold'
                      : 'text-stone-400 font-medium'
                  }`}
                >
                  {item.label}
                </span>
              </div>

              {/* Connecting Line between steps */}
              {index < STEPS.length - 1 && (
                <div className="flex-1 h-[2.5px] mx-2 sm:mx-4 -mt-6 sm:-mt-6 relative bg-stone-200">
                  <div
                    className={`h-full transition-all duration-300 ${
                      item.step < currentStep ? 'bg-[#2e7d32]' : 'bg-transparent'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutStepper;
