import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  Users,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Trash2,
  MessageCircle,
  Sparkles,
  QrCode as QrIcon,
  CheckCheck,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { Guest, GuestCategory, InvitationSharingStatus } from '../../types/wedding';
import { DiyaIcon } from '../illustrations/IndianWeddingDecorations';
import { GuestQrModal } from '../invitations/GuestQrModal';

interface GuestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest: Guest | null;
  onEditGuest: (guest: Guest) => void;
  onOpenRsvpModal: (guest: Guest) => void;
}

export const GuestDetailModal: React.FC<GuestDetailModalProps> = ({
  isOpen,
  onClose,
  guest,
  onEditGuest,
  onOpenRsvpModal,
}) => {
  const {
    currentWedding,
    events,
    invitations,
    rsvps,
    updateInvitationStatus,
    toggleInvitationMarkedSent,
    generateWhatsAppLink,
    generateReminderWhatsAppLink,
    deleteGuest,
  } = useWedding();

  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  if (!isOpen || !guest) return null;

  const invitation = invitations.find((inv) => inv.guestId === guest.guestId);
  const token = invitation?.uniqueToken || '';
  const rsvpLink = `${window.location.origin}/?rsvp=${token}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(rsvpLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    updateInvitationStatus(guest.guestId, 'whatsapp_opened');
    const link = generateWhatsAppLink(guest);
    window.open(link, '_blank');
  };

  const handleOpenReminder = () => {
    updateInvitationStatus(guest.guestId, 'whatsapp_opened');
    const link = generateReminderWhatsAppLink(guest);
    window.open(link, '_blank');
  };

  const handleDelete = () => {
    deleteGuest(guest.guestId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-2xl border-2 border-[#E5C378] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Gold Border */}
        <div className="h-1.5 bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#F59E0B]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#6B5E55] hover:text-[#800020] hover:bg-[#FAF0D4] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-5">
          
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-[#E5C378]/50 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309] bg-[#FAF0D4] px-2.5 py-0.5 rounded-full border border-[#E5C378]">
                {guest.category}
              </span>
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#800020] mt-1.5">
                {guest.name}
              </h3>
              <span className="text-xs text-[#786C64]">
                Family Group: <strong className="text-[#3D291F]">{guest.familyName || 'Individual'}</strong>
              </span>
            </div>

            <button
              onClick={() => onEditGuest(guest)}
              className="p-2 text-[#800020] bg-white border border-[#E5C378] hover:bg-[#FAF0D4] rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>

          {/* Contact Details & WhatsApp sharing */}
          <div className="bg-white p-4 rounded-xl border border-[#E5C378]/60 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#6B5E55]">WhatsApp Phone:</span>
              <span className="font-mono font-bold text-[#3D291F]">
                {guest.countryCode} {guest.phone}
              </span>
            </div>

            {guest.email && (
              <div className="flex items-center justify-between">
                <span className="text-[#6B5E55]">Email Address:</span>
                <span className="text-[#3D291F]">{guest.email}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-[#6B5E55]">Expected Household Members:</span>
              <span className="font-mono font-bold text-[#800020]">{guest.expectedMembers} people</span>
            </div>

            {guest.notes && (
              <div className="pt-2 border-t border-neutral-100">
                <span className="text-[#8C7A70] block text-[10px] uppercase font-semibold">Notes:</span>
                <p className="text-[#3D291F] italic mt-0.5">{guest.notes}</p>
              </div>
            )}
          </div>

          {/* Personal RSVP Link & WhatsApp Action */}
          <div className="bg-gradient-to-br from-[#FAF0D4] to-[#FDF8EE] p-4 rounded-xl border border-[#E5C378] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#800020] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
                Personal RSVP Link
              </span>
              <button
                onClick={handleCopyLink}
                className="text-xs font-semibold text-[#800020] hover:underline flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-[#E5C378]/70 font-mono text-[11px] text-[#5C4D43] truncate select-all">
              {rsvpLink}
            </div>

            {/* WhatsApp Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleOpenWhatsApp}
                className="py-2 px-3 text-xs font-bold text-white bg-[#075E54] hover:bg-[#128C7E] rounded-lg shadow-2xs flex items-center justify-center gap-1.5 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Send via WhatsApp</span>
              </button>

              <button
                onClick={handleOpenReminder}
                className="py-2 px-3 text-xs font-semibold text-[#075E54] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg flex items-center justify-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Reminder</span>
              </button>
            </div>

            {/* Mark as Sent and QR Pass Row */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={() => toggleInvitationMarkedSent(guest.guestId)}
                className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-colors ${
                  invitation?.sharingStatus === 'marked_sent'
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-[#5C4D43] border-[#E5C378] hover:bg-[#FAF0D4]'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {invitation?.sharingStatus === 'marked_sent' ? 'Marked as Sent ✓' : 'Manual: Mark as Sent'}
                </span>
              </button>

              <button
                onClick={() => setIsQrOpen(true)}
                className="py-1.5 px-3 text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-lg flex items-center gap-1.5"
              >
                <QrIcon className="w-3.5 h-3.5" />
                <span>QR Pass</span>
              </button>
            </div>
          </div>

          {/* Ceremony-Wise RSVP Breakdown */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#800020] block">
              Ceremony Attendance Responses
            </span>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {events.map((ev, idx) => {
                const rsvp = rsvps.find((r) => r.guestId === guest.guestId && r.eventId === ev.eventId);

                return (
                  <div
                    key={`${ev.eventId || 'evt'}_${idx}`}
                    className="p-3 bg-white rounded-lg border border-[#E5C378]/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <strong className="text-[#3D291F] block">{ev.eventName}</strong>
                      <span className="text-[10px] text-[#786C64]">{ev.eventDate}</span>
                    </div>

                    <div>
                      {rsvp ? (
                        rsvp.attendanceStatus === 'attending' ? (
                          <div className="text-right">
                            <span className="text-emerald-700 font-bold flex items-center gap-1 justify-end">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Attending ({rsvp.totalAttendees})
                            </span>
                            <span className="text-[10px] text-[#786C64]">
                              {rsvp.adultCount} adults, {rsvp.childCount} kids
                            </span>
                          </div>
                        ) : (
                          <span className="text-rose-700 font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" />
                            Declined
                          </span>
                        )
                      ) : (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Pending RSVP
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions & Delete */}
          <div className="pt-3 border-t border-[#E5C378]/40 flex items-center justify-between">
            <button
              onClick={() => onOpenRsvpModal(guest)}
              className="px-4 py-2 text-xs font-bold text-white bg-[#800020] hover:bg-[#6B081B] rounded-lg shadow-sm"
            >
              Update RSVP Response
            </button>

            {confirmDelete ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 text-xs font-bold text-white bg-rose-600 rounded"
                >
                  Confirm Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 text-xs bg-neutral-200 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Guest</span>
              </button>
            )}
          </div>

        </div>
      </div>

      <GuestQrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        guest={guest}
      />
    </div>
  );
};
