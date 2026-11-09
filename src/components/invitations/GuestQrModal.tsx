import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Download,
  Copy,
  Check,
  ExternalLink,
  QrCode as QrIcon,
  Sparkles,
  Heart,
  Share2,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { Guest } from '../../types/wedding';
import { SacredKalash, DiyaIcon } from '../illustrations/IndianWeddingDecorations';

interface GuestQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
}

export const GuestQrModal: React.FC<GuestQrModalProps> = ({
  isOpen,
  onClose,
  guest,
}) => {
  const { currentWedding, getGuestInvitation } = useWedding();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const invitation = guest ? getGuestInvitation(guest.guestId) : undefined;
  const token = invitation?.uniqueToken || '';
  const rsvpUrl = typeof window !== 'undefined' ? `${window.location.origin}/?rsvp=${token}` : '';

  useEffect(() => {
    if (!isOpen || !token) return;

    QRCode.toDataURL(rsvpUrl, {
      width: 280,
      margin: 1.5,
      color: {
        dark: '#800020',
        light: '#FAF7F2',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code:', err));
  }, [isOpen, token, rsvpUrl]);

  if (!isOpen || !guest) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(rsvpUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `wedding-qr-${guest.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-2xl border-2 border-[#E5C378] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Auspicious Gold Strip */}
        <div className="h-2 bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#800020]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#6B5E55] hover:text-[#800020] hover:bg-[#FAF0D4] rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 text-center space-y-4">
          
          {/* Header Motif */}
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FAF0D4] border border-[#E5C378] text-[#800020] shadow-xs">
            <SacredKalash className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#B45309]">
              Personalized Wedding QR Pass
            </span>
            <h3 className="font-serif-luxury text-xl font-bold text-[#800020] mt-0.5">
              {guest.name}
            </h3>
            {guest.familyName && (
              <p className="text-xs text-[#5C4D43] font-medium">
                {guest.familyName} · {guest.expectedMembers} Expected Members
              </p>
            )}
          </div>

          {/* QR Card Container */}
          <div
            ref={cardRef}
            className="p-5 rounded-xl bg-white border-2 border-[#E5C378]/70 shadow-sm mx-auto max-w-xs space-y-3"
          >
            <div className="text-[11px] font-serif-luxury font-bold text-[#800020] flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{currentWedding.brideName} & {currentWedding.groomName}</span>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            </div>

            {/* QR Image */}
            <div className="flex justify-center p-2 bg-[#FAF7F2] rounded-lg border border-[#E5C378]/40">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR code for ${guest.name}`}
                  className="w-48 h-48 object-contain rounded"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-xs text-[#8C7A70]">
                  Generating QR Code...
                </div>
              )}
            </div>

            <div className="text-[10px] text-[#6B5E55]">
              Scan to view digital invitation & confirm party headcount for wedding ceremonies.
            </div>

            <div className="pt-1 border-t border-[#E5C378]/30 font-mono text-[9px] text-[#8C7A70] truncate">
              Token: {token}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDownloadQr}
                className="py-2 px-3 text-xs font-bold text-white bg-[#800020] hover:bg-[#6B081B] rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#FDE047]" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="py-2 px-3 text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            <a
              href={`/?rsvp=${token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 text-xs font-medium text-[#5C4D43] hover:text-[#800020] hover:bg-[#FAF0D4]/50 rounded-lg flex items-center justify-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview RSVP Page in New Tab</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
