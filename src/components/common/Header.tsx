import React, { useState } from 'react';
import { Menu, X, Sparkles, HeartHandshake } from 'lucide-react';
import { DiyaIcon } from '../illustrations/IndianWeddingDecorations';

import { useWedding } from '../../context/WeddingContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface HeaderProps {
  currentView: 'landing' | 'dashboard' | 'create-wedding' | 'rsvp-preview';
  onNavigate: (view: 'landing' | 'dashboard' | 'create-wedding' | 'rsvp-preview') => void;
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  onReplayIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenAuthModal,
  onOpenProfileModal,
  onReplayIntro,
}) => {
  const { currentUser } = useWedding();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Wedding Themes', href: '#themes' },
    { label: 'Food Calculator', href: '#food-calculator' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5C378]/40 shadow-xs transition-all">
      {/* Top Auspicious Gold Marigold Border Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#F59E0B]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          
          {/* Zone 1: Brand Wordmark (Single text element, royal styling) */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#800020] to-[#5B0616] flex items-center justify-center shadow-sm border border-[#E5C378]/60 group-hover:scale-105 transition-transform">
              <DiyaIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#800020] group-hover:text-[#5B0616] transition-colors leading-none">
                WeddingGuest
              </span>
              <span className="text-[10px] tracking-wider font-medium text-[#B45309] uppercase mt-0.5">
                Celebrate More · Waste Less
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Single-line, concise) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A3228]">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="whitespace-nowrap shrink-0 hover:text-[#800020] transition-colors relative py-1 hover:border-b-2 hover:border-[#D4AF37]"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action, PWA Install & Auth */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Curtain Intro Replay Button */}
            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                title="Watch Royal Curtain Opening & Logo Reveal"
                className="px-2.5 py-1.5 text-xs font-semibold text-[#800020] bg-[#FAF0D4]/80 hover:bg-[#FAF0D4] border border-[#E5C378] rounded-md transition-all flex items-center gap-1.5 shadow-2xs whitespace-nowrap group"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B45309] group-hover:rotate-12 transition-transform" />
                <span className="hidden md:inline">Curtain Intro</span>
              </button>
            )}

            {/* PWA Install Button */}
            <PWAInstallButton variant="navbar" />

            {currentView === 'landing' ? (
              <>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-4 py-2 text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-md transition-colors whitespace-nowrap shadow-2xs"
                >
                  Explore Demo
                </button>
                <button
                  onClick={() => onNavigate('create-wedding')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#800020] to-[#990000] hover:from-[#6B081B] hover:to-[#800020] rounded-md shadow-sm transition-all hover:shadow-md flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
                  Create Wedding
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('landing')}
                  className="px-3.5 py-2 text-xs font-medium text-[#4A3228] hover:text-[#800020] transition-colors whitespace-nowrap"
                >
                  Back to Home
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    currentView === 'dashboard'
                      ? 'bg-[#800020] text-white shadow-xs'
                      : 'bg-[#FAF0D4] text-[#800020] border border-[#E5C378]'
                  }`}
                >
                  Live Dashboard
                </button>
              </>
            )}

            {/* User Auth Profile Button */}
            {currentUser ? (
              <button
                onClick={onOpenProfileModal}
                title="Host Account & Profile Settings"
                className="flex items-center gap-2 p-1 pr-2.5 rounded-full bg-[#FAF0D4] border border-[#E5C378] hover:bg-[#F5E3B5] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#800020] text-[#FDE68A] font-bold text-xs flex items-center justify-center">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'H'}
                </div>
                <span className="text-xs font-semibold text-[#800020] max-w-[100px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3 py-2 text-xs font-bold text-[#800020] hover:text-[#5B0616] hover:underline whitespace-nowrap"
              >
                Host Login
              </button>
            )}
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3 py-1.5 text-xs font-semibold text-[#800020] bg-[#FAF0D4] border border-[#E5C378] rounded-md"
            >
              Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#800020] hover:bg-[#F5EBE0] focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E5C378]/50 bg-[#FAF7F2] px-4 pt-3 pb-6 shadow-xl space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-left py-2 px-3 text-sm font-medium text-[#4A3228] hover:bg-[#F5EBE0] hover:text-[#800020] rounded-md"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E5C378]/30 flex flex-col gap-2">
            <div className="flex justify-center pb-1">
              <PWAInstallButton variant="navbar" />
            </div>
            {onReplayIntro && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onReplayIntro();
                }}
                className="w-full py-2 px-3 text-center text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-md shadow-2xs flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
                <span>Watch Curtain Opening Intro</span>
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('dashboard');
              }}
              className="w-full py-2.5 px-4 text-center text-sm font-semibold text-[#800020] bg-[#FAF0D4] border border-[#E5C378] rounded-md shadow-2xs"
            >
              Open Live Wedding Dashboard
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('create-wedding');
              }}
              className="w-full py-2.5 px-4 text-center text-sm font-semibold text-white bg-gradient-to-r from-[#800020] to-[#990000] rounded-md shadow-sm flex items-center justify-center gap-2"
            >
              <HeartHandshake className="w-4 h-4 text-[#FDE047]" />
              Create Your Wedding
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
