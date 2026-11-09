import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  Sparkles,
  Palette,
  Image as ImageIcon,
  Share2,
  Download,
  Printer,
  Check,
  Calendar,
  Clock,
  MapPin,
  Heart,
  QrCode as QrIcon,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { WeddingThemeId } from '../../types/wedding';
import { WEDDING_THEMES } from '../../data/weddingThemes';
import { DigitalInvitationCard } from '../invitation/DigitalInvitationCard';
import { DiyaIcon, SacredKalash, MandapArch } from '../illustrations/IndianWeddingDecorations';

interface InvitationDesignerProps {
  onBackToDashboard?: () => void;
}

export const InvitationDesigner: React.FC<InvitationDesignerProps> = ({ onBackToDashboard }) => {
  const { currentWedding, updateWedding } = useWedding();

  const [themeId, setThemeId] = useState<WeddingThemeId>(currentWedding.theme || 'royal_maroon');
  const [brideName, setBrideName] = useState(currentWedding.brideName);
  const [groomName, setGroomName] = useState(currentWedding.groomName);
  const [brideFamily, setBrideFamily] = useState(currentWedding.brideFamilyName || '');
  const [groomFamily, setGroomFamily] = useState(currentWedding.groomFamilyName || '');
  const [weddingDate, setWeddingDate] = useState(currentWedding.weddingDate);
  const [weddingTime, setWeddingTime] = useState(currentWedding.weddingTime);
  const [venue, setVenue] = useState(currentWedding.venue);
  const [venueAddress, setVenueAddress] = useState(currentWedding.venueAddress);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(currentWedding.googleMapsUrl || '');
  const [invitationMessage, setInvitationMessage] = useState(currentWedding.invitationMessage);
  const [contactPhone, setContactPhone] = useState(currentWedding.contactPhone);

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Sample guest name for preview
  const [previewGuestName, setPreviewGuestName] = useState('Rahul Sharma');

  // Generate QR Code for this wedding
  useEffect(() => {
    const inviteUrl = `${window.location.origin}/?wedding=${currentWedding.weddingId}`;
    QRCode.toDataURL(inviteUrl, {
      width: 200,
      margin: 1.5,
      color: {
        dark: '#800020',
        light: '#FAF7F2',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [currentWedding.weddingId]);

  const handleSaveAll = () => {
    updateWedding({
      theme: themeId,
      brideName,
      groomName,
      brideFamilyName: brideFamily,
      groomFamilyName: groomFamily,
      weddingDate,
      weddingTime,
      venue,
      venueAddress,
      googleMapsUrl,
      invitationMessage,
      contactPhone,
    });

    setSaveStatus('Invitation changes saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleShareLink = () => {
    const inviteUrl = `${window.location.origin}/?wedding=${currentWedding.weddingId}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const previewWedding = {
    ...currentWedding,
    theme: themeId,
    brideName,
    groomName,
    brideFamilyName: brideFamily,
    groomFamilyName: groomFamily,
    weddingDate,
    weddingTime,
    venue,
    venueAddress,
    googleMapsUrl,
    invitationMessage,
    contactPhone,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5C378]/50">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B45309]">
            <Palette className="w-4 h-4" />
            <span>Digital Wedding Card Studio</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#800020] mt-1">
            Royal Invitation Designer
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5E55] mt-1">
            Customize typography, cultural themes, auspicious timings, and preview your digital card in real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="px-3.5 py-2 text-xs font-semibold text-[#5C4D43] bg-white border border-[#E5C378] hover:bg-[#FAF0D4] rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          )}

          <button
            onClick={handleShareLink}
            className="px-3.5 py-2 text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-[#5C4D43] bg-white border border-[#E5C378] hover:bg-[#FAF0D4] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-[#B45309]" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="px-4.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#800020] to-[#990000] hover:from-[#6B081B] hover:to-[#800020] rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
            <span>Save Invitation</span>
          </button>
        </div>
      </div>

      {saveStatus && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* Workspace Split: Editor Controls (Left) & Real Card Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        
        {/* LEFT COLUMN: Controls & Form Inputs (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Theme Selector */}
          <div className="bg-white p-5 rounded-xl border border-[#E5C378]/70 shadow-xs space-y-3">
            <span className="font-bold text-xs uppercase tracking-wider text-[#800020] block">
              1. Choose Wedding Illustration Theme
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(Object.keys(WEDDING_THEMES) as WeddingThemeId[]).map((tKey) => {
                const th = WEDDING_THEMES[tKey];
                const isSelected = themeId === tKey;
                return (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => setThemeId(tKey)}
                    className={`p-2.5 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-[#800020] bg-[#FAF0D4]/30 shadow-xs scale-102'
                        : 'border-[#E5C378]/40 hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="h-14 rounded overflow-hidden mb-1.5 bg-neutral-100">
                      <img
                        src={th.imageAsset}
                        alt={th.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-serif-luxury font-bold text-xs text-[#800020] block leading-tight">
                      {th.name}
                    </span>
                    <span className="text-[10px] text-[#786C64] line-clamp-1 mt-0.5">
                      {th.tagline}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Couple Details */}
          <div className="bg-white p-5 rounded-xl border border-[#E5C378]/70 shadow-xs space-y-4">
            <span className="font-bold text-xs uppercase tracking-wider text-[#800020] block">
              2. Couple & Family Names
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">Bride's Full Name</label>
                <input
                  type="text"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5C378] rounded-md focus:outline-hidden font-serif-luxury font-bold text-sm text-[#800020]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">Groom's Full Name</label>
                <input
                  type="text"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5C378] rounded-md focus:outline-hidden font-serif-luxury font-bold text-sm text-[#800020]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">Bride's Family Name</label>
                <input
                  type="text"
                  value={brideFamily}
                  onChange={(e) => setBrideFamily(e.target.value)}
                  placeholder="e.g. Sharma Family"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">Groom's Family Name</label>
                <input
                  type="text"
                  value={groomFamily}
                  onChange={(e) => setGroomFamily(e.target.value)}
                  placeholder="e.g. Malhotra Family"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Invitation Wording & Message */}
          <div className="bg-white p-5 rounded-xl border border-[#E5C378]/70 shadow-xs space-y-3">
            <span className="font-bold text-xs uppercase tracking-wider text-[#800020] block">
              3. Custom Invitation Message
            </span>
            <textarea
              rows={3}
              value={invitationMessage}
              onChange={(e) => setInvitationMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5C378] rounded-md focus:outline-hidden font-serif-luxury italic text-[#3D291F]"
            />
          </div>

          {/* Ceremony Schedule & Venue */}
          <div className="bg-white p-5 rounded-xl border border-[#E5C378]/70 shadow-xs space-y-3">
            <span className="font-bold text-xs uppercase tracking-wider text-[#800020] block">
              4. Wedding Ceremony & Venue
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">Ceremony Date</label>
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">Auspicious Time</label>
                <input
                  type="time"
                  value={weddingTime}
                  onChange={(e) => setWeddingTime(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-semibold text-[#3D291F] mb-1">Venue Name</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-semibold text-[#3D291F] mb-1">Venue Address</label>
                <input
                  type="text"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-semibold text-[#3D291F] mb-1">Google Maps URL</label>
                <input
                  type="url"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Scannable QR Code Insert */}
          <div className="bg-white p-5 rounded-xl border border-[#E5C378]/70 shadow-xs flex items-center gap-4">
            {qrDataUrl ? (
              <div className="w-24 h-24 p-1.5 rounded-lg border border-[#E5C378] bg-[#FAF7F2] shrink-0">
                <img src={qrDataUrl} alt="Invitation QR Code" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                <QrIcon className="w-8 h-8 text-neutral-400" />
              </div>
            )}
            <div className="text-xs">
              <span className="font-bold text-[#800020] uppercase tracking-wider block">
                Instant QR Code Verification
              </span>
              <p className="text-[#6B5E55] mt-1 leading-relaxed">
                Guests can scan this QR code with any smartphone camera to open this exact digital wedding card and confirm their attendance.
              </p>
              {qrDataUrl && (
                <a
                  href={qrDataUrl}
                  download={`wedding_qr_${currentWedding.weddingId}.png`}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline mt-1.5"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Print-Ready QR Code</span>
                </a>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Live Card Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#800020] flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#B45309]" />
              Live Digital Card Preview
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#6B5E55]">Sample Guest:</span>
              <input
                type="text"
                value={previewGuestName}
                onChange={(e) => setPreviewGuestName(e.target.value)}
                className="w-32 px-2 py-0.5 text-xs bg-white border border-[#E5C378] rounded"
              />
            </div>
          </div>

          {/* Embedded Card */}
          <div className="sticky top-24">
            <DigitalInvitationCard
              wedding={previewWedding}
              guestName={previewGuestName}
              themeOverride={themeId}
              showRsvpButtons={true}
            />
          </div>
        </div>

      </div>

    </div>
  );
};
