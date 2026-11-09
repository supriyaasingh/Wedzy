import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ variant?: 'navbar' | 'banner' | 'pill' }> = ({
  variant = 'navbar',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // If already running in standalone PWA mode, hide
  if (isInstalled || isDismissed) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'banner') {
      return (
        <div className="bg-gradient-to-r from-[#800020] via-[#990000] to-[#800020] text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs border-b border-[#D4AF37]/40">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#FDE047] shrink-0" />
            <span>
              <strong className="font-semibold text-[#FDE047]">Install WeddingGuest App:</strong> Enjoy instant offline guest access and fast RSVP tracking.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={install}
              className="px-3 py-1 bg-[#D4AF37] hover:bg-[#B8860B] text-[#3D291F] font-bold rounded-md shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install Now</span>
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 text-white/70 hover:text-white"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:from-[#B8860B] hover:to-[#D97706] text-[#3D291F] font-bold text-xs rounded-lg shadow-xs transition-transform active:scale-95"
        title="Install WeddingGuest on your device"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow (WebKit beforeinstallprompt is not supported)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF0D4] hover:bg-[#F5E5BE] text-[#800020] border border-[#D4AF37] font-semibold text-xs rounded-lg transition-colors"
          title="Install on iPhone / iPad"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Add to Home Screen</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-[#FAF7F2] border-2 border-[#D4AF37] p-6 shadow-2xl relative text-left">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1 text-[#6B5E55] hover:text-[#800020]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#800020] flex items-center justify-center text-[#FDE047]">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="font-serif-luxury text-base font-bold text-[#800020]">
                  Install on iPhone / iPad
                </h3>
              </div>

              <p className="text-xs text-[#5C4D43] mb-4">
                Install WeddingGuest to your home screen for full offline RSVP management and fast door check-ins:
              </p>

              <div className="space-y-3 bg-white p-3.5 rounded-xl border border-[#E5C378] text-xs text-[#3D291F]">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#800020] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    1
                  </span>
                  <div className="flex-1">
                    Tap the <strong className="font-bold text-[#800020] inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5 inline" /> Share</strong> button in your Safari bottom bar.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#800020] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    2
                  </span>
                  <div className="flex-1">
                    Scroll down and tap <strong className="font-bold text-[#800020] inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 inline" /> Add to Home Screen</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#800020] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    3
                  </span>
                  <div className="flex-1">
                    Tap <strong className="font-bold text-[#800020]">Add</strong> in the top-right corner to launch anytime.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2 bg-[#800020] hover:bg-[#6B081B] text-white font-bold text-xs rounded-lg transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop button to guide user or show standalone status
  return (
    <button
      onClick={() => {
        alert('To install WeddingGuest on your desktop, click the install icon in your browser address bar (top right).');
      }}
      className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF0D4] hover:bg-[#F5E5BE] text-[#800020] border border-[#D4AF37] font-semibold text-xs rounded-lg transition-colors"
      title="Install WeddingGuest on your device"
    >
      <Download className="w-3.5 h-3.5 text-[#800020]" />
      <span>Install App</span>
    </button>
  );
};
