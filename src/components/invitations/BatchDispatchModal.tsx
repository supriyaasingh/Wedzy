import React, { useState, useMemo } from 'react';
import {
  X,
  MessageCircle,
  Send,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Sparkles,
  Users,
  Smartphone,
  CheckCheck,
  Eye,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { Guest, GuestInvitation } from '../../types/wedding';
import { DiyaIcon, SacredKalash } from '../illustrations/IndianWeddingDecorations';

interface BatchDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQr: (guest: Guest) => void;
}

export const BatchDispatchModal: React.FC<BatchDispatchModalProps> = ({
  isOpen,
  onClose,
  onOpenQr,
}) => {
  const {
    currentWedding,
    guests,
    invitations,
    rsvps,
    formatPersonalizedWhatsAppMessage,
    formatPersonalizedReminderMessage,
    generateWhatsAppLink,
    generateReminderWhatsAppLink,
    updateInvitationStatus,
    toggleInvitationMarkedSent,
  } = useWedding();

  const [queueFilter, setQueueFilter] = useState<'unsent' | 'pending_rsvp' | 'all'>('unsent');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [messageMode, setMessageMode] = useState<'invite' | 'reminder'>('invite');
  const [copied, setCopied] = useState(false);

  // Filtered queue of guests
  const queueGuests = useMemo(() => {
    return guests.filter((g) => {
      const inv = invitations.find((i) => i.guestId === g.guestId);
      const isRsvpReceived = inv?.sharingStatus === 'rsvp_received' || rsvps.some((r) => r.guestId === g.guestId);

      if (queueFilter === 'unsent') {
        // Unsent means not yet marked as sent and not received
        return inv?.sharingStatus !== 'marked_sent' && !isRsvpReceived;
      }
      if (queueFilter === 'pending_rsvp') {
        return !isRsvpReceived;
      }
      return true;
    });
  }, [guests, invitations, rsvps, queueFilter]);

  // Keep index within bounds
  const safeIndex = Math.min(currentIndex, Math.max(0, queueGuests.length - 1));
  const currentGuest: Guest | undefined = queueGuests[safeIndex];

  if (!isOpen) return null;

  const currentInv: GuestInvitation | undefined = currentGuest
    ? invitations.find((i) => i.guestId === currentGuest.guestId)
    : undefined;

  const currentRsvp = currentGuest
    ? rsvps.find((r) => r.guestId === currentGuest.guestId)
    : undefined;

  const isMarkedSent = currentInv?.sharingStatus === 'marked_sent';

  const previewMessage = currentGuest
    ? messageMode === 'invite'
      ? formatPersonalizedWhatsAppMessage(currentGuest)
      : formatPersonalizedReminderMessage(currentGuest)
    : '';

  const handleOpenWhatsApp = () => {
    if (!currentGuest) return;
    updateInvitationStatus(currentGuest.guestId, 'whatsapp_opened');
    const link =
      messageMode === 'invite'
        ? generateWhatsAppLink(currentGuest)
        : generateReminderWhatsAppLink(currentGuest);
    window.open(link, '_blank');
  };

  const handleToggleSent = () => {
    if (!currentGuest) return;
    toggleInvitationMarkedSent(currentGuest.guestId);
  };

  const handleSendAndNext = () => {
    handleOpenWhatsApp();
    if (!isMarkedSent && currentGuest) {
      toggleInvitationMarkedSent(currentGuest.guestId);
    }
    if (safeIndex < queueGuests.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(previewMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrev = () => {
    if (safeIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (safeIndex < queueGuests.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-2xl border-2 border-[#E5C378] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#800020] text-white px-6 py-4 border-b border-[#D4AF37] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5B0616] border border-[#E5C378] flex items-center justify-center text-[#FDE68A]">
              <Send className="w-5 h-5 text-[#25D366]" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#FDE047]">
                WhatsApp Rapid Dispatch Queue
              </h3>
              <p className="text-xs text-white/80">
                1-by-1 step through guests to dispatch personalized WhatsApp invitations with 1 tap
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Progress Bar */}
        <div className="bg-white px-6 py-3 border-b border-[#E5C378]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#800020] uppercase tracking-wider">
              Queue:
            </span>
            <select
              value={queueFilter}
              onChange={(e) => {
                setQueueFilter(e.target.value as any);
                setCurrentIndex(0);
              }}
              className="px-2.5 py-1 text-xs font-semibold bg-[#FAF7F2] border border-[#E5C378] rounded-md focus:outline-hidden text-[#3D291F]"
            >
              <option value="unsent">Unsent Invitations Only</option>
              <option value="pending_rsvp">All Pending RSVPs</option>
              <option value="all">All Guests ({guests.length})</option>
            </select>

            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => setMessageMode('invite')}
                className={`px-2.5 py-1 text-xs font-bold rounded ${
                  messageMode === 'invite'
                    ? 'bg-[#800020] text-white'
                    : 'bg-[#FAF0D4] text-[#800020]'
                }`}
              >
                Initial Invite
              </button>
              <button
                onClick={() => setMessageMode('reminder')}
                className={`px-2.5 py-1 text-xs font-bold rounded ${
                  messageMode === 'reminder'
                    ? 'bg-[#800020] text-white'
                    : 'bg-[#FAF0D4] text-[#800020]'
                }`}
              >
                Reminder
              </button>
            </div>
          </div>

          {/* Progress Indicator */}
          {queueGuests.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#800020]">
              <span>
                Guest {safeIndex + 1} of {queueGuests.length}
              </span>
              <div className="w-24 bg-[#FAF0D4] h-2 rounded-full overflow-hidden border border-[#E5C378]">
                <div
                  className="bg-[#800020] h-full transition-all duration-300"
                  style={{
                    width: `${((safeIndex + 1) / queueGuests.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Queue Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {queueGuests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-[#E5C378]/60 p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif-luxury text-lg font-bold text-[#3D291F]">
                Queue Completed!
              </h4>
              <p className="text-xs text-[#6B5E55] max-w-sm mx-auto">
                No guests remaining in this queue filter. All invitations in this list have been processed.
              </p>
              <button
                onClick={() => setQueueFilter('all')}
                className="mt-2 px-4 py-1.5 text-xs font-bold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-lg"
              >
                View All Guests
              </button>
            </div>
          ) : currentGuest ? (
            <div className="space-y-4">
              
              {/* Guest Spotlight Card */}
              <div className="p-4 rounded-xl bg-white border border-[#E5C378] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FAF0D4] border-2 border-[#E5C378] flex items-center justify-center font-bold text-base text-[#800020] shrink-0">
                    {currentGuest.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-[#3D291F]">
                        {currentGuest.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-[#800020] bg-[#FAF0D4] px-2 py-0.5 rounded border border-[#E5C378]">
                        {currentGuest.category}
                      </span>
                    </div>
                    <div className="text-xs text-[#5C4D43] flex items-center gap-2 mt-0.5">
                      <span>{currentGuest.countryCode} {currentGuest.phone}</span>
                      <span>·</span>
                      <span>{currentGuest.familyName || 'Single Family'}</span>
                      <span>·</span>
                      <span>{currentGuest.expectedMembers} expected members</span>
                    </div>
                  </div>
                </div>

                {/* Status Indicator & Mark Sent Toggle */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={handleToggleSent}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-colors ${
                      isMarkedSent
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-white text-[#5C4D43] border-[#E5C378] hover:bg-[#FAF0D4]'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${isMarkedSent ? 'text-amber-800' : 'text-gray-400'}`} />
                    <span>{isMarkedSent ? 'Marked as Sent ✓' : 'Mark as Sent'}</span>
                  </button>

                  <button
                    onClick={() => onOpenQr(currentGuest)}
                    className="p-1.5 text-[#800020] hover:bg-[#FAF0D4] rounded-lg border border-[#E5C378] text-xs font-semibold"
                    title="View QR Code Pass"
                  >
                    QR Pass
                  </button>
                </div>
              </div>

              {/* Message Box */}
              <div className="rounded-xl bg-[#0B141A] p-4 text-[#E9EDEF] border-2 border-[#2A3942] space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                  <span className="text-[#8696A0] font-mono text-[11px] flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-[#25D366]" />
                    WhatsApp Message to {currentGuest.name}:
                  </span>
                  <button
                    onClick={handleCopyMessage}
                    className="text-[11px] text-[#25D366] hover:underline flex items-center gap-1 font-semibold"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Message'}</span>
                  </button>
                </div>

                <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans text-[#E9EDEF] bg-[#005C4B]/90 p-3.5 rounded-lg border border-[#00A884]/30 shadow-inner">
                  {previewMessage}
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                
                {/* Nav buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handlePrev}
                    disabled={safeIndex === 0}
                    className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-semibold text-[#5C4D43] bg-white hover:bg-[#FAF0D4] border border-[#E5C378] rounded-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={safeIndex === queueGuests.length - 1}
                    className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-semibold text-[#5C4D43] bg-white hover:bg-[#FAF0D4] border border-[#E5C378] rounded-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary WhatsApp Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleOpenWhatsApp}
                    className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-white bg-[#075E54] hover:bg-[#128C7E] rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Open in WhatsApp</span>
                  </button>

                  <button
                    onClick={handleSendAndNext}
                    className="flex-1 sm:flex-none px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#800020] to-[#990000] hover:from-[#6B081B] hover:to-[#800020] rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Send & Next →</span>
                  </button>
                </div>

              </div>

            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-white px-6 py-3 border-t border-[#E5C378]/50 flex items-center justify-between text-xs text-[#5C4D43] shrink-0">
          <span>
            Clicking "Open in WhatsApp" opens WhatsApp Web / App directly to this guest's chat with their personalized link.
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 font-semibold text-[#800020] hover:underline"
          >
            Close Queue
          </button>
        </div>

      </div>
    </div>
  );
};
