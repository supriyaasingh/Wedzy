import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X } from 'lucide-react';

interface CinematicCurtainOpeningProps {
  onComplete: () => void;
  logoSrc?: string;
}

export const CinematicCurtainOpening: React.FC<CinematicCurtainOpeningProps> = ({
  onComplete,
  logoSrc = '/assets/wedding_guest_logo.png',
}) => {
  // Animation Phase State:
  // 'closed'    -> 0s to 1s: Curtains closed, velvet texture & gold embroidery visible
  // 'opening'   -> 1s to 2.4s: Curtains slide back symmetrically with fold bunching
  // 'logo'      -> 2.2s to 4.4s: Curtains open, logo revealed with scale-up & shimmer
  // 'fadeout'   -> 4.4s to 5.0s: Cinematic curtain overlay fades into app
  // 'done'      -> 5.0s: Removed from DOM, app fully active
  const [phase, setPhase] = useState<'closed' | 'opening' | 'logo' | 'fadeout' | 'done'>('closed');
  const [logoLoaded, setLogoLoaded] = useState(false);
  const timeoutRefs = useRef<number[]>([]);

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach((id) => clearTimeout(id));
    timeoutRefs.current = [];
  };

  const handleSkip = () => {
    clearAllTimeouts();
    setPhase('fadeout');
    try {
      sessionStorage.setItem('weddingguest_curtain_intro_seen', 'true');
    } catch {}
    const t = window.setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 350);
    timeoutRefs.current.push(t);
  };

  useEffect(() => {
    // 1. Accessibility: Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        handleSkip();
        return;
      }
    }

    // 2. Preload Logo Image
    const img = new Image();
    img.src = logoSrc;
    img.onload = () => setLogoLoaded(true);
    img.onerror = () => {
      // Fallback path in case primary path differs in specific environment
      img.src = '/assets/wedding_guest_logo_512.png';
      setLogoLoaded(true);
    };

    // 3. Cinematic Orchestration Timeline:
    // T = 1.0s: Curtains begin opening
    const tOpen = window.setTimeout(() => {
      setPhase('opening');
    }, 1000);
    timeoutRefs.current.push(tOpen);

    // T = 2.1s: Logo reveal starts
    const tLogo = window.setTimeout(() => {
      setPhase('logo');
    }, 2100);
    timeoutRefs.current.push(tLogo);

    // T = 4.3s: Begin smooth fadeout into application
    const tFade = window.setTimeout(() => {
      setPhase('fadeout');
      try {
        sessionStorage.setItem('weddingguest_curtain_intro_seen', 'true');
      } catch {}
    }, 4300);
    timeoutRefs.current.push(tFade);

    // T = 4.9s: Complete animation and unmount
    const tDone = window.setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 4900);
    timeoutRefs.current.push(tDone);

    // Safety timeout: Maximum 6.0s hard cutoff prevents blocking app under any condition
    const tSafety = window.setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 6000);
    timeoutRefs.current.push(tSafety);

    return () => {
      clearAllTimeouts();
    };
  }, [logoSrc, onComplete]);

  if (phase === 'done') return null;

  const isOpening = phase === 'opening' || phase === 'logo' || phase === 'fadeout';

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden select-none bg-[#1F0207] transition-opacity duration-700 ease-out ${
        phase === 'fadeout' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        height: '100dvh',
        width: '100vw',
      }}
      aria-label="WeddingGuest Cinematic Opening"
      role="banner"
    >
      {/* Skip Button (Accessible, sleek royal aesthetic) */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 z-[120] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#FDE047] bg-black/60 hover:bg-black/80 border border-[#D4AF37]/60 shadow-lg flex items-center gap-1.5 backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
        title="Skip intro animation"
      >
        <span>Skip Intro</span>
        <X className="w-3.5 h-3.5 text-[#FDE047]" />
      </button>

      {/* ========================================================= */}
      {/* STAGE BACKDROP (Revealed Behind the Opening Curtains)     */}
      {/* ========================================================= */}
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
        
        {/* Warm Golden Palace Ambient Lighting */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#3D030C] via-[#240106] to-[#120003]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 45%, rgba(254, 240, 138, 0.22) 0%, rgba(217, 119, 6, 0.16) 35%, rgba(45, 2, 9, 0.95) 75%),
              radial-gradient(circle at 50% 10%, rgba(253, 224, 71, 0.15) 0%, transparent 50%)
            `,
          }}
        />

        {/* Subtle Decorative Golden Mandap Arch Glow in Background */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
          <div className="w-[680px] h-[680px] rounded-full border border-[#D4AF37]/40 blur-xs" />
          <div className="absolute w-[800px] h-[800px] rounded-full border border-[#D4AF37]/20 blur-sm" />
        </div>

        {/* Ambient Warm Golden Dust / Sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-[#FDE047] blur-[0.5px] animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-[#FDE047] blur-[0.5px] animate-pulse delay-300" />
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 rounded-full bg-[#F59E0B] blur-[0.5px] animate-pulse delay-700" />
          <div className="absolute bottom-1/4 right-1/3 w-2 h-2 rounded-full bg-[#FDE047] blur-[0.5px] animate-pulse delay-500" />
        </div>

        {/* ========================================================= */}
        {/* LOGO REVEAL (Original User Logo Asset with Shimmer & Scale) */}
        {/* ========================================================= */}
        <div
          className={`relative z-20 flex flex-col items-center justify-center p-4 max-w-lg w-full transition-all duration-1000 ease-out ${
            phase === 'logo' || phase === 'fadeout'
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-90 translate-y-4'
          }`}
        >
          {/* Logo Frame with Golden Aura and Royal WG Presentation */}
          <div className="relative group max-w-[340px] sm:max-w-[420px] md:max-w-[460px] w-full p-2 flex flex-col items-center">
            
            {/* Ambient Radial Spotlight behind WG Logo */}
            <div className="absolute inset-0 bg-radial from-[#F59E0B]/30 via-[#D97706]/15 to-transparent blur-2xl pointer-events-none rounded-3xl" />

            {/* The Actual Burgundy-and-Gold WeddingGuest WG Logo */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-2 border-[#E5C378]/80 bg-[#360309] backdrop-blur-xs">
              <img
                src={logoSrc}
                alt="WeddingGuest — Every Guest. Every Moment. Perfectly Planned."
                className="w-full h-full object-contain block select-none rounded-3xl"
                loading="eager"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('wedding_guest_logo_512.png')) {
                    target.src = '/assets/wedding_guest_logo_512.png';
                  }
                }}
              />

              {/* Shimmer Sweep Animation Across Logo */}
              <div
                className={`absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full rounded-3xl ${
                  phase === 'logo' ? 'animate-[curtainShimmer_1.8s_ease-in-out_infinite]' : ''
                }`}
                style={{
                  transform: 'skewX(-20deg)',
                }}
              />
            </div>

            {/* Subtle Golden Caption Accent */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs tracking-widest text-[#E5C378] font-cinzel opacity-90">
              <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
              <span className="text-[11px] uppercase font-bold text-[#FDE047] tracking-widest">Auspicious Wedding Platform</span>
              <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* TOP DECORATIVE VALANCE / PELMET WITH HANGING GOLD TASSELS */}
      {/* ========================================================= */}
      <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none flex flex-col items-center">
        
        {/* Scalloped Maroon Valance Header */}
        <div className="w-full h-12 sm:h-16 bg-gradient-to-b from-[#2A0207] via-[#52040E] to-[#3B0209] shadow-md border-b-2 border-[#D4AF37] relative flex items-center justify-between px-2">
          
          {/* Gold Zari Border Ribbon */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#8C5806] via-[#FDE047] to-[#8C5806]" />
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#FFF2A3] to-[#D4AF37] opacity-80" />

          {/* Scallop Drape Pattern */}
          <svg className="w-full h-8 absolute -bottom-8 left-0 right-0 text-[#3B0209] drop-shadow-sm" viewBox="0 0 1200 32" preserveAspectRatio="none">
            <path
              d="M0,0 Q75,32 150,0 Q225,32 300,0 Q375,32 450,0 Q525,32 600,0 Q675,32 750,0 Q825,32 900,0 Q975,32 1050,0 Q1125,32 1200,0 L1200,0 L0,0 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Row of Traditional Hanging Gold Tassels (Latkans) */}
        <div className="w-full flex justify-around px-2 sm:px-6 -mt-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center animate-sway" style={{ animationDelay: `${i * 180}ms` }}>
              {/* Gold cord */}
              <div className="w-0.5 h-6 sm:h-10 bg-gradient-to-b from-[#FDE047] to-[#B45309]" />
              {/* Gold bell bead */}
              <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-gradient-to-tr from-[#8C5806] via-[#FDE047] to-[#D4AF37] shadow-sm border border-[#78350F]" />
              {/* Tassel flare */}
              <div
                className="w-4 sm:w-6 h-5 sm:h-7 bg-gradient-to-b from-[#FDE047] via-[#D4AF37] to-[#8C5806] shadow-sm"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* LEFT CURTAIN PANEL                                        */}
      {/* ========================================================= */}
      <div
        className="absolute top-0 left-0 bottom-0 w-1/2 z-30 transition-transform will-change-transform flex"
        style={{
          transform: isOpening
            ? 'translateX(-100%) scaleX(0.88)'
            : 'translateX(0%) scaleX(1)',
          transformOrigin: 'left center',
          transitionDuration: '1450ms',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: isOpening ? 'none' : '6px 0 24px rgba(0,0,0,0.8)',
        }}
      >
        <div className="relative w-full h-full overflow-hidden flex flex-col justify-between">
          
          {/* Deep Maroon Velvet Fabric with Realistic Undulating Folds */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                repeating-linear-gradient(
                  90deg,
                  #280105 0%,
                  #42030B 5%,
                  #680816 10%,
                  #830B1E 13%,
                  #680816 16%,
                  #42030B 21%,
                  #280105 26%
                )
              `,
            }}
          />

          {/* Velvet Sheen & Depth Lighting Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
            style={{
              background: `
                radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.28) 0%, transparent 60%),
                linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 20%, rgba(0,0,0,0.85) 100%)
              `,
            }}
          />

          {/* Left Vertical Gold Embroidered Border (At the Meeting Edge - Right of Panel) */}
          <div className="absolute top-0 right-0 bottom-0 w-12 sm:w-16 md:w-20 bg-gradient-to-l from-[#360206] to-transparent flex items-center justify-end z-20">
            {/* The Intricate Golden Zardozi Seam Ribbon */}
            <div className="w-8 sm:w-10 md:w-12 h-full bg-gradient-to-r from-[#B45309] via-[#FDE047] to-[#D4AF37] border-l border-[#8C5806] shadow-xl flex flex-col items-center justify-around py-4">
              {/* Repeating Auspicious Gold Motif Stamp */}
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center opacity-90 my-1">
                  <div className="w-4 h-4 rounded-full border-2 border-[#5B0616] bg-[#FAF0D4] flex items-center justify-center shadow-inner">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#800020]" />
                  </div>
                  <div className="w-1 h-3 bg-[#5B0616] my-0.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Left Bottom Heavy Gold Zari Embroidery */}
          <div className="relative z-20 w-full p-3 sm:p-5 bg-gradient-to-t from-[#1F0104] via-[#4A030C] to-transparent border-t-2 border-[#D4AF37]">
            <div className="h-6 sm:h-8 w-full bg-gradient-to-r from-[#8C5806] via-[#FDE047] to-[#B45309] rounded-t-sm shadow-md flex items-center justify-around px-2">
              <span className="text-[10px] font-bold text-[#5B0616] uppercase tracking-widest hidden sm:inline">
                ✦ ROYAL MAROON VELVET ✦
              </span>
              <div className="w-full flex justify-between px-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 rotate-45 bg-[#5B0616] border border-[#FDE047]" />
                ))}
              </div>
            </div>
            {/* Bullion Fringe Bottom */}
            <div className="w-full h-3 bg-gradient-to-b from-[#D4AF37] to-[#78350F] opacity-90" />
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT CURTAIN PANEL                                       */}
      {/* ========================================================= */}
      <div
        className="absolute top-0 right-0 bottom-0 w-1/2 z-30 transition-transform will-change-transform flex"
        style={{
          transform: isOpening
            ? 'translateX(100%) scaleX(0.88)'
            : 'translateX(0%) scaleX(1)',
          transformOrigin: 'right center',
          transitionDuration: '1450ms',
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: isOpening ? 'none' : '-6px 0 24px rgba(0,0,0,0.8)',
        }}
      >
        <div className="relative w-full h-full overflow-hidden flex flex-col justify-between">
          
          {/* Deep Maroon Velvet Fabric with Realistic Undulating Folds */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                repeating-linear-gradient(
                  90deg,
                  #280105 0%,
                  #42030B 5%,
                  #680816 10%,
                  #830B1E 13%,
                  #680816 16%,
                  #42030B 21%,
                  #280105 26%
                )
              `,
            }}
          />

          {/* Velvet Sheen & Depth Lighting Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.28) 0%, transparent 60%),
                linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 20%, rgba(0,0,0,0.85) 100%)
              `,
            }}
          />

          {/* Right Vertical Gold Embroidered Border (At the Meeting Edge - Left of Panel) */}
          <div className="absolute top-0 left-0 bottom-0 w-12 sm:w-16 md:w-20 bg-gradient-to-r from-[#360206] to-transparent flex items-center justify-start z-20">
            {/* The Intricate Golden Zardozi Seam Ribbon */}
            <div className="w-8 sm:w-10 md:w-12 h-full bg-gradient-to-r from-[#D4AF37] via-[#FDE047] to-[#B45309] border-r border-[#8C5806] shadow-xl flex flex-col items-center justify-around py-4">
              {/* Repeating Auspicious Gold Motif Stamp */}
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center opacity-90 my-1">
                  <div className="w-4 h-4 rounded-full border-2 border-[#5B0616] bg-[#FAF0D4] flex items-center justify-center shadow-inner">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#800020]" />
                  </div>
                  <div className="w-1 h-3 bg-[#5B0616] my-0.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Bottom Heavy Gold Zari Embroidery */}
          <div className="relative z-20 w-full p-3 sm:p-5 bg-gradient-to-t from-[#1F0104] via-[#4A030C] to-transparent border-t-2 border-[#D4AF37]">
            <div className="h-6 sm:h-8 w-full bg-gradient-to-r from-[#B45309] via-[#FDE047] to-[#8C5806] rounded-t-sm shadow-md flex items-center justify-around px-2">
              <div className="w-full flex justify-between px-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-2.5 h-2.5 rotate-45 bg-[#5B0616] border border-[#FDE047]" />
                ))}
              </div>
              <span className="text-[10px] font-bold text-[#5B0616] uppercase tracking-widest hidden sm:inline">
                ✦ ROYAL MAROON VELVET ✦
              </span>
            </div>
            {/* Bullion Fringe Bottom */}
            <div className="w-full h-3 bg-gradient-to-b from-[#D4AF37] to-[#78350F] opacity-90" />
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* CENTER ORNATE ROYAL BROOCH / CLASP (Separates upon opening) */}
      {/* ========================================================= */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-35 pointer-events-none transition-all duration-700 ease-out ${
          isOpening ? 'opacity-0 scale-150 blur-xs' : 'opacity-100 scale-100'
        }`}
      >
        <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-tr from-[#8C5806] via-[#FDE047] to-[#D4AF37] p-1 shadow-2xl border-2 border-[#FFE58F] flex items-center justify-center animate-pulse">
          <div className="w-full h-full rounded-full overflow-hidden bg-[#360309] border border-[#FDE047] flex items-center justify-center shadow-inner">
            <img
              src="/assets/wedding_guest_logo_192.png"
              alt="Wedding Emblem"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
