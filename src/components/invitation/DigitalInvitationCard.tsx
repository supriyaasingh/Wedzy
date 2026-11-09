import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Phone, Sparkles, Share2, Check, ExternalLink, QrCode } from 'lucide-react';
import { Wedding, WeddingThemeId } from '../../types/wedding';
import { WEDDING_THEMES } from '../../data/weddingThemes';
import { MandapArch, DiyaIcon, CornerOrnament, MarigoldGarland } from '../illustrations/IndianWeddingDecorations';

interface DigitalInvitationCardProps {
  wedding: Wedding;
  guestName?: string;
  themeOverride?: WeddingThemeId;
  rsvpToken?: string;
  onOpenRsvpModal?: () => void;
  showRsvpButtons?: boolean;
}

export const DigitalInvitationCard: React.FC<DigitalInvitationCardProps> = ({
  wedding,
  guestName,
  themeOverride,
  rsvpToken,
  onOpenRsvpModal,
  showRsvpButtons = true,
}) => {
  const activeThemeId = themeOverride || wedding.theme || 'royal_maroon';
  const theme = WEDDING_THEMES[activeThemeId] || WEDDING_THEMES.royal_maroon;
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date(wedding.weddingDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mx-auto max-w-lg w-full">
      {/* Decorative Outer Shadow & Foil Matting */}
      <div className="p-3 sm:p-5 rounded-2xl bg-gradient-to-b from-[#FAF0D4] via-[#FDF8EE] to-[#F5E3B5] border-2 border-[#E5C378] shadow-2xl">
        
        {/* Main Card Container */}
        <div 
          className="relative rounded-xl border border-[#D4AF37]/80 p-5 sm:p-8 overflow-hidden text-center transition-all duration-300"
          style={{
            backgroundColor: activeThemeId === 'minimal_gold' ? '#FFFFFF' : theme.cardBg,
            color: activeThemeId === 'minimal_gold' ? '#2C1810' : theme.textColor,
          }}
        >
          {/* Subtle Royal Damask Overlay */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, #D4AF37 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* 4 Corner Ornaments */}
          <CornerOrnament position="tl" className="absolute top-2 left-2 w-7 h-7 text-[#D4AF37]" />
          <CornerOrnament position="tr" className="absolute top-2 right-2 w-7 h-7 text-[#D4AF37]" />
          <CornerOrnament position="bl" className="absolute bottom-2 left-2 w-7 h-7 text-[#D4AF37]" />
          <CornerOrnament position="br" className="absolute bottom-2 right-2 w-7 h-7 text-[#D4AF37]" />

          {/* Header Mandap & Auspicious Blessing */}
          <div className="relative z-10 pt-2">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#E5C378] mb-1">
              <DiyaIcon className="w-4 h-4" />
              <span>|| SHREE GANESHAYA NAMAHA ||</span>
              <DiyaIcon className="w-4 h-4" />
            </div>

            <MandapArch className="w-44 sm:w-56 mx-auto h-auto my-1" />

            <div className="text-xs uppercase tracking-widest text-[#E5C378]/90 font-medium mt-1">
              {wedding.brideFamilyName && wedding.groomFamilyName
                ? `${wedding.brideFamilyName} & ${wedding.groomFamilyName} Cordially Invite You`
                : 'Joyfully Request The Pleasure Of Your Company'}
            </div>
          </div>

          {/* Personal Guest Greeting if provided */}
          {guestName && (
            <div className="my-3 py-1.5 px-4 rounded-md bg-black/15 inline-block border border-[#D4AF37]/40">
              <span className="text-xs sm:text-sm font-serif-luxury italic text-[#FDE68A]">
                To our dearest: <strong className="font-semibold text-white">{guestName} & Family</strong>
              </span>
            </div>
          )}

          {/* Bride and Groom Names */}
          <div className="my-4 py-2 border-y border-[#D4AF37]/40">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-[#FDE047] drop-shadow-xs">
              {wedding.brideName}
            </h2>
            <div className="my-1 text-sm font-script text-xl text-[#FDE68A]">
              weds
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-[#FDE047] drop-shadow-xs">
              {wedding.groomName}
            </h2>
          </div>

          {/* Cultural Theme Hand-Drawn Illustration Banner */}
          <div className="relative my-4 rounded-lg overflow-hidden border border-[#D4AF37]/50 shadow-md bg-black/20">
            <img
              src={theme.imageAsset}
              alt={theme.name}
              referrerPolicy="no-referrer"
              className="w-full h-44 sm:h-52 object-cover object-center transform hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center p-2.5">
              <span className="text-[11px] font-medium text-[#FDE68A] tracking-wide uppercase drop-shadow-sm">
                ✦ {theme.tagline} ✦
              </span>
            </div>
          </div>

          {/* Invitation Message */}
          <p className="text-xs sm:text-sm italic font-serif-luxury text-white/90 max-w-sm mx-auto leading-relaxed px-2">
            "{wedding.invitationMessage}"
          </p>

          <MarigoldGarland className="my-4" />

          {/* Date, Time & Venue Block */}
          <div className="space-y-3 text-xs sm:text-sm bg-black/20 p-4 rounded-lg border border-[#D4AF37]/30 text-left">
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-[#FDE047] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">{formattedDate}</span>
                <span className="text-white/70 text-[11px]">Auspicious Muhurat</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#FDE047] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">{wedding.weddingTime} onwards</span>
                <span className="text-white/70 text-[11px]">Baraat Arrival & Pheras</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#FDE047] shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-white block">{wedding.venue}</span>
                <span className="text-white/70 text-[11px] block">{wedding.venueAddress}</span>
                {wedding.googleMapsUrl && (
                  <a
                    href={wedding.googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#FDE68A] underline hover:text-white mt-1"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* RSVP Deadline Callout */}
          <div className="mt-4 text-[11px] text-[#FDE68A] font-medium">
            Kind RSVP requested by{' '}
            <strong className="underline text-white">
              {new Date(wedding.rsvpDeadline).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </strong>{' '}
            to help us prepare the feast.
          </div>

          {/* RSVP Action Buttons if enabled */}
          {showRsvpButtons && (
            <div className="mt-6 pt-4 border-t border-[#D4AF37]/40 space-y-2.5">
              <div className="text-xs uppercase tracking-wider text-[#FDE047] font-bold">
                Will you be joining us to celebrate?
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={onOpenRsvpModal}
                  className="py-2.5 px-3 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:from-[#B45309] hover:to-[#D4AF37] text-[#5B0616] font-bold text-xs rounded-md shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  YES, I'LL BE THERE!
                </button>
                <button
                  onClick={onOpenRsvpModal}
                  className="py-2.5 px-3 bg-black/40 hover:bg-black/60 text-white/90 border border-[#D4AF37]/50 font-medium text-xs rounded-md transition-all"
                >
                  SORRY, CAN'T MAKE IT
                </button>
              </div>
            </div>
          )}

          {/* Footer Card Ribbon */}
          <div className="mt-6 pt-3 flex items-center justify-between text-[10px] text-white/60 border-t border-white/10">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#FDE047]" />
              {wedding.contactPhone}
            </span>
            <button
              onClick={handleShareLink}
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
              <span>{copied ? 'Link Copied!' : 'Share Invitation'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
