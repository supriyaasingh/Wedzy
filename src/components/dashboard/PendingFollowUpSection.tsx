import React, { useState, useMemo } from 'react';
import {
  Clock,
  Send,
  MessageCircle,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  Users,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { Guest, GuestCategory } from '../../types/wedding';
import { BatchDispatchModal } from '../invitations/BatchDispatchModal';
import { GuestQrModal } from '../invitations/GuestQrModal';

export const PendingFollowUpSection: React.FC = () => {
  const {
    currentWedding,
    events,
    selectedEventId,
    guests,
    invitations,
    rsvps,
    generateReminderWhatsAppLink,
    updateInvitationStatus,
  } = useWedding();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [qrModalGuest, setQrModalGuest] = useState<Guest | null>(null);

  const selectedEvent = events.find((e) => e.eventId === selectedEventId) || events[0];

  // Identify all pending guests for this ceremony
  const pendingGuests = useMemo(() => {
    return guests.filter((g) => {
      const rsvp = rsvps.find((r) => r.guestId === g.guestId && r.eventId === selectedEventId);
      // Pending if no RSVP submitted yet
      const isPending = !rsvp || rsvp.attendanceStatus === 'pending';

      const matchesSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.phone.includes(searchQuery) ||
        (g.familyName && g.familyName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = categoryFilter === 'all' || g.category === categoryFilter;

      return isPending && matchesSearch && matchesCat;
    });
  }, [guests, rsvps, selectedEventId, searchQuery, categoryFilter]);

  // Days until RSVP deadline
  const daysUntilDeadline = useMemo(() => {
    if (!currentWedding.rsvpDeadline) return null;
    const deadline = new Date(currentWedding.rsvpDeadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [currentWedding.rsvpDeadline]);

  const handleSendReminder = (guest: Guest) => {
    updateInvitationStatus(guest.guestId, 'whatsapp_opened');
    const link = generateReminderWhatsAppLink(guest);
    window.open(link, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5C378]/70 shadow-xs p-6 space-y-5">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5C378]/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-luxury text-lg font-bold text-[#800020]">
                Pending RSVP Follow-Up Command Center
              </h3>
              <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                {pendingGuests.length} Pending for {selectedEvent.eventName}
              </span>
            </div>
            <p className="text-xs text-[#6B5E55] mt-0.5">
              Send polite 1-click WhatsApp reminders with personalized attendance links before the deadline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {daysUntilDeadline !== null && (
            <div className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E5C378] text-xs">
              <span className="text-[#8C7A70]">RSVP Deadline: </span>
              <strong className={daysUntilDeadline <= 5 ? 'text-rose-700' : 'text-[#800020]'}>
                {daysUntilDeadline > 0 ? `${daysUntilDeadline} days remaining` : 'Deadline passed'}
              </strong>
            </div>
          )}

          <button
            onClick={() => setIsBatchModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-700 to-[#800020] hover:from-amber-800 hover:to-[#6B081B] rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current text-[#FDE047]" />
            <span>Nudge All Pending ({pendingGuests.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#8C7A70] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search pending guests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#FAF7F2] border border-[#E5C378] rounded-lg text-xs focus:outline-hidden focus:border-[#800020]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#6B5E55] font-semibold">Filter:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E5C378] rounded-lg text-xs font-semibold text-[#3D291F] focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            <option value="Bride's family">Bride's Family</option>
            <option value="Groom's family">Groom's Family</option>
            <option value="Friends">Friends</option>
            <option value="Relatives">Relatives</option>
            <option value="Colleagues">Colleagues</option>
            <option value="Neighbours">Neighbours</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Pending Guests Cards List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {pendingGuests.length === 0 ? (
          <div className="py-8 text-center bg-[#FAF7F2] rounded-xl border border-[#E5C378]/40 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <div className="text-xs font-bold text-[#3D291F]">
              All Invitations Confirmed!
            </div>
            <p className="text-[11px] text-[#786C64]">
              There are no pending RSVPs for {selectedEvent.eventName} matching your filters.
            </p>
          </div>
        ) : (
          pendingGuests.map((guest) => {
            const inv = invitations.find((i) => i.guestId === guest.guestId);
            const token = inv?.uniqueToken || '';

            return (
              <div
                key={guest.guestId}
                className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5C378]/60 hover:border-[#800020]/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#E5C378] flex items-center justify-center font-bold text-[#800020] text-xs shrink-0">
                    {guest.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-[#3D291F] text-xs">{guest.name}</strong>
                      <span className="text-[10px] text-[#800020] bg-white px-2 py-0.5 rounded border border-[#E5C378]/50">
                        {guest.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#5C4D43] mt-0.5 flex items-center gap-2">
                      <span>{guest.countryCode} {guest.phone}</span>
                      <span>·</span>
                      <span>{guest.familyName || 'Family Unit'}</span>
                      <span>·</span>
                      <span>~{guest.expectedMembers} expected guests</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                    {inv?.sharingStatus === 'whatsapp_opened' ? 'Link Opened (No RSVP)' : 'Awaiting Response'}
                  </span>

                  <button
                    onClick={() => handleSendReminder(guest)}
                    className="py-1.5 px-3 text-xs font-bold text-white bg-[#075E54] hover:bg-[#128C7E] rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Send Reminder</span>
                  </button>

                  <button
                    onClick={() => setQrModalGuest(guest)}
                    className="p-1.5 text-[#800020] hover:bg-white rounded-lg border border-[#E5C378] text-xs"
                    title="View QR Code Pass"
                  >
                    QR
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <BatchDispatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onOpenQr={(g) => {
          setIsBatchModalOpen(false);
          setQrModalGuest(g);
        }}
      />

      <GuestQrModal
        isOpen={Boolean(qrModalGuest)}
        onClose={() => setQrModalGuest(null)}
        guest={qrModalGuest}
      />

    </div>
  );
};
