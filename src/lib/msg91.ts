/**
 * MSG91 OTP Widget SDK Loader and Configuration
 */

export const MSG91_CONFIG = {
  widgetId: process.env.NEXT_PUBLIC_MSG91_WIDGET_ID || '366a45776b7a393936333337',
  tokenAuth: process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH || '586335TnpNGKx14of6ae675f2P1',
};

declare global {
  interface Window {
    initSendOTP?: (config: Record<string, unknown>) => void;
    sendOtp?: (
      identifier: string,
      success?: (data: unknown) => void,
      failure?: (err: unknown) => void
    ) => void;
    retryOtp?: (
      channel?: string,
      success?: (data: unknown) => void,
      failure?: (err: unknown) => void
    ) => void;
    verifyOtp?: (
      otp: string,
      success?: (data: unknown) => void,
      failure?: (err: unknown) => void
    ) => void;
  }
}

let scriptLoadPromise: Promise<boolean> | null = null;

export function loadMsg91OtpScript(
  onSuccess: (data: unknown) => void,
  onFailure: (err: unknown) => void
): Promise<boolean> {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  if (typeof window.sendOtp === 'function') {
    return Promise.resolve(true);
  }

  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise((resolve) => {
    const configuration = {
      widgetId: MSG91_CONFIG.widgetId,
      tokenAuth: MSG91_CONFIG.tokenAuth,
      exposeMethods: true,
      success: (data: unknown) => {
        onSuccess(data);
      },
      failure: (error: unknown) => {
        onFailure(error);
      },
    };

    const urls = [
      'https://verify.msg91.com/otp-provider.js',
      'https://verify.phone91.com/otp-provider.js',
    ];

    let i = 0;
    function attempt() {
      const s = document.createElement('script');
      s.src = urls[i];
      s.async = true;
      s.onload = () => {
        if (typeof window.initSendOTP === 'function') {
          try {
            window.initSendOTP(configuration);
          } catch (initErr) {
            console.error('[MSG91] Error calling initSendOTP:', initErr);
          }
        }
        resolve(true);
      };
      s.onerror = () => {
        i++;
        if (i < urls.length) {
          attempt();
        } else {
          console.warn('[MSG91] Failed to load OTP provider scripts');
          resolve(false);
        }
      };
      document.head.appendChild(s);
    }

    attempt();
  });

  return scriptLoadPromise;
}

