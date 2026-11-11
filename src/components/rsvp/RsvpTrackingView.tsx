import React, { useState, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  MessageCircle,
  Calendar,
  UtensilsCrossed,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { Guest, EventRSVP } from '../../types/wedding';
import { DiyaIcon } from '../illustrations/IndianWeddingDecorations';

interface RsvpTrackingViewProps {
  onOpenGuestRsvp?: (guest: Guest) => void;
  onOpenCustomQuestions?: () => void;
}

export const RsvpTrackingView: React.FC<RsvpTrackingViewProps> = ({
  onOpenGuestRsvp,
  onOpenCustomQuestions,
}) => {
  const {
    currentWedding,
    events,
    selectedEventId,
    setSelectedEventId,
    guests,
    invitations,
    rsvps,
    customQuestions,
    generateReminderWhatsAppLink,
    updateInvitationStatus,
  } = useWedding();

  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'declined' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGuestId, setExpandedGuestId] = useState<string | null>(null);

  // Scoped to current wedding
  const weddingGuests = useMemo(() => {
    return guests.filter((g) => g.weddingId === currentWedding.weddingId);
  }, [guests, currentWedding.weddingId]);

  const selectedEvent = events.find((e) => e.eventId === selectedEventId) || events[0];

  // Calculate high-level summary counts for selected ceremony
  const stats = useMemo(() => {
    let confirmedAttending = 0;
    let confirmedAdults = 0;
    let confirmedChildren = 0;
    let declinedCount = 0;
    let pendingCount = 0;

    weddingGuests.forEach((g) => {
      const rsvp = rsvps.find((r) => r.guestId === g.guestId && r.eventId === selectedEventId);
      if (rsvp) {
        if (rsvp.attendanceStatus === 'attending') {
          confirmedAttending += 1;
          confirmedAdults += rsvp.adultCount;
          confirmedChildren += rsvp.childCount;
        } else if (rsvp.attendanceStatus === 'declined') {
          declinedCount += 1;
        } else {
          pendingCount += 1;
        }
      } else {
        pendingCount += 1;
      }
    });

    return {
      totalInvited: weddingGuests.length,
      confirmedAttending,
      confirmedAdults,
      confirmedChildren,
      totalAttendees: confirmedAdults + confirmedChildren,
      declinedCount,
      pendingCount,
    };
  }, [weddingGuests, rsvps, selectedEventId]);

  // Filtered guest list for table
  const filteredList = useMemo(() => {
    return weddingGuests.filter((g) => {
      const matchesSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.phone.includes(searchQuery) ||
        (g.familyName && g.familyName.toLowerCase().includes(searchQuery.toLowerCase()));

      const rsvp = rsvps.find((r) => r.guestId === g.guestId && r.eventId === selectedEventId);

      let status: 'attending' | 'declined' | 'pending' = 'pending';
      if (rsvp) {
        status = rsvp.attendanceStatus === 'attending' ? 'attending' : rsvp.attendanceStatus === 'declined' ? 'declined' : 'pending';
      }

      const matchesStatus = statusFilter === 'all' || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [weddingGuests, searchQuery, rsvps, selectedEventId, statusFilter]);

  const handleSendReminder = (guest: Guest) => {
    updateInvitationStatus(guest.guestId, 'whatsapp_opened');
    const link = generateReminderWhatsAppLink(guest);
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Ceremony Selector & Questions Shortcut */}
      <div className="p-4 bg-white rounded-2xl border border-[#E5C378]/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309]">
            Ceremony Attendance Tracking
          </span>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="font-serif-luxury text-xl font-bold text-[#800020]">
              {selectedEvent ? selectedEvent.eventName : 'All Ceremonies'}
            </h3>
            <span className="text-xs text-[#5C4D43]">
              ({selectedEvent?.eventDate} · {selectedEvent?.venue})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {events.map((ev) => (
            <button
              key={ev.eventId}
              onClick={() => setSelectedEventId(ev.eventId)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                selectedEventId === ev.eventId
                  ? 'bg-[#800020] text-white shadow-xs'
                  : 'bg-[#FAF0D4] text-[#800020] border border-[#E5C378] hover:bg-[#F5E3B5]'
              }`}
            >
              {ev.eventName}
            </button>
          ))}
          {onOpenCustomQuestions && (
            <button
              onClick={onOpenCustomQuestions}
              className="px-3 py-1.5 text-xs font-semibold text-[#800020] bg-white border border-[#E5C378] hover:bg-[#FAF7F2] rounded-xl flex items-center gap-1 shrink-0"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Custom Questions</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards Grid (Requirement 6) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        
        {/* Total Invited */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5C378]/70 shadow-xs">
          <span className="text-[11px] font-semibold text-[#8C7A70] uppercase tracking-wider block">
            Total Invited
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-[#3D291F] mt-1">
            {stats.totalInvited}
          </div>
          <span className="text-[11px] text-[#786C64]">Families / Groups</span>
        </div>

        {/* Accepted / Attending */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border-2 border-emerald-300 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Accepted Attending
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-black text-emerald-800 mt-1">
            {stats.totalAttendees}
            <span className="text-xs font-normal text-emerald-700 ml-1">people</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">
            {stats.confirmedAdults} adults · {stats.confirmedChildren} children
          </span>
        </div>

        {/* Awaiting Response / Pending */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300 shadow-xs">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Awaiting Response
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-black text-amber-800 mt-1">
            {stats.pendingCount}
          </div>
          <span className="text-[11px] text-amber-700 font-semibold">
            Follow-up reminders ready
          </span>
        </div>

        {/* Declined */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5C378]/70 shadow-xs">
          <span className="text-[11px] font-semibold text-[#8C7A70] uppercase tracking-wider block flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            Declined
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-rose-700 mt-1">
            {stats.declinedCount}
          </div>
          <span className="text-[11px] text-[#786C64]">Zero plates allocated</span>
        </div>

        {/* Confirmed Families */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FAF0D4] to-[#FDF8EE] border border-[#E5C378] shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-[#800020] uppercase tracking-wider block flex items-center gap-1">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            Confirmed Families
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-black text-[#800020] mt-1">
            {stats.confirmedAttending}
          </div>
          <span className="text-[11px] text-[#B45309] font-medium">
            of {stats.totalInvited} invited
          </span>
        </div>

      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-[#E5C378]/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All Guests (${weddingGuests.length})` },
            { id: 'attending', label: `Attending (${stats.confirmedAttending})` },
            { id: 'pending', label: `Awaiting Response (${stats.pendingCount})` },
            { id: 'declined', label: `Declined (${stats.declinedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? 'bg-[#800020] text-white shadow-2xs'
                  : 'bg-[#FAF7F2] text-[#5C4D43] hover:bg-[#FAF0D4] hover:text-[#800020]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#FAF7F2] border border-[#E5C378] rounded-xl text-xs focus:outline-hidden focus:border-[#800020]"
          />
        </div>

      </div>

      {/* Guests RSVP Table */}
      <div className="bg-white rounded-2xl border border-[#E5C378]/70 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#800020] font-bold text-[10px] uppercase tracking-wider border-b border-[#E5C378]/60">
              <tr>
                <th className="py-3 px-4">Guest & Family Unit</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">RSVP Status</th>
                <th className="py-3 px-4">Headcount Breakdown</th>
                <th className="py-3 px-4">Diet Preference</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 italic">
                    No guests found matching the selected filter.
                  </td>
                </tr>
              ) : (
                filteredList.map((g) => {
                  const rsvp = rsvps.find((r) => r.guestId === g.guestId && r.eventId === selectedEventId);
                  const inv = invitations.find((i) => i.guestId === g.guestId);
                  const isAttending = rsvp?.attendanceStatus === 'attending';
                  const isDeclined = rsvp?.attendanceStatus === 'declined';
                  const isPending = !rsvp || rsvp.attendanceStatus === 'pending';
                  const isExpanded = expandedGuestId === g.guestId;

                  // Custom answers if any
                  const hasCustomAnswers = rsvp?.customAnswers && Object.keys(rsvp.customAnswers).length > 0;

                  return (
                    <React.Fragment key={g.guestId}>
                      <tr className="hover:bg-[#FAF7F2]/60 transition-colors">
                        
                        {/* Guest Name & Family */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#FAF0D4] border border-[#E5C378] flex items-center justify-center font-bold text-[#800020] text-xs shrink-0">
                              {g.name.charAt(0)}
                            </div>
                            <div>
                              <strong className="text-[#3D291F] block text-xs">{g.name}</strong>
                              <span className="text-[10px] text-[#8C7A70]">
                                {g.familyName || 'Family Unit'} · {g.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="py-3 px-4 font-mono text-[11px] text-[#5C4D43]">
                          {g.countryCode} {g.phone}
                        </td>

                        {/* RSVP Status */}
                        <td className="py-3 px-4">
                          {isAttending && (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Attending
                            </span>
                          )}
                          {isDeclined && (
                            <span className="inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                              <XCircle className="w-3.5 h-3.5 text-rose-500" />
                              Declined
                            </span>
                          )}
                          {isPending && (
                            <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              {inv?.sharingStatus === 'whatsapp_opened' ? 'Opened (Pending)' : 'Awaiting Reply'}
                            </span>
                          )}
                        </td>

                        {/* Headcount */}
                        <td className="py-3 px-4">
                          {isAttending && rsvp ? (
                            <div>
                              <span className="font-bold text-[#3D291F] font-mono text-xs">
                                {rsvp.totalAttendees} Total
                              </span>
                              <span className="text-[10px] text-gray-500 block">
                                ({rsvp.adultCount} adults, {rsvp.childCount} kids)
                              </span>
                            </div>
                          ) : isDeclined ? (
                            <span className="text-gray-400 text-[11px]">—</span>
                          ) : (
                            <span className="text-gray-500 text-[11px] italic font-mono">
                              ~{g.expectedMembers} expected
                            </span>
                          )}
                        </td>

                        {/* Dietary */}
                        <td className="py-3 px-4 text-[11px] text-[#5C4D43]">
                          {rsvp?.dietaryRequirements ? (
                            <span className="truncate block max-w-[140px]" title={rsvp.dietaryRequirements}>
                              {rsvp.dietaryRequirements}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isPending && (
                              <button
                                onClick={() => handleSendReminder(g)}
                                className="px-3 py-1.5 bg-[#075E54] hover:bg-[#128C7E] text-white font-bold rounded-lg flex items-center gap-1 text-[11px] shadow-2xs transition-colors"
                              >
                                <MessageCircle className="w-3 h-3 text-[#25D366]" />
                                <span>Remind</span>
                              </button>
                            )}

                            {(hasCustomAnswers || rsvp?.additionalMessage || rsvp?.accompanyingGuests?.length) && (
                              <button
                                onClick={() => setExpandedGuestId(isExpanded ? null : g.guestId)}
                                className="p-1.5 text-[#800020] hover:bg-[#FAF0D4] rounded-lg border border-[#E5C378] text-[11px]"
                                title="View Details"
                              >
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            )}

                            {onOpenGuestRsvp && (
                              <button
                                onClick={() => onOpenGuestRsvp(g)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] rounded-lg border border-[#E5C378]"
                              >
                                Edit RSVP
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>

                      {/* Expandable Details Drawer */}
                      {isExpanded && rsvp && (
                        <tr className="bg-[#FAF7F2]/80">
                          <td colSpan={6} className="p-4 space-y-2 border-b border-[#E5C378]/40">
                            <div className="text-xs space-y-1.5 max-w-xl">
                              {rsvp.accompanyingGuests && rsvp.accompanyingGuests.length > 0 && (
                                <div>
                                  <strong className="text-[#800020]">Accompanying Guests: </strong>
                                  <span className="text-gray-700">{rsvp.accompanyingGuests.join(', ')}</span>
                                </div>
                              )}

                              {rsvp.additionalMessage && (
                                <div>
                                  <strong className="text-[#800020]">Blessing / Message: </strong>
                                  <span className="text-gray-700 italic">"{rsvp.additionalMessage}"</span>
                                </div>
                              )}

                              {/* Custom Question Answers */}
                              {rsvp.customAnswers && Object.keys(rsvp.customAnswers).length > 0 && (
                                <div className="pt-1 space-y-1">
                                  <strong className="text-[#800020] block">Custom Question Responses:</strong>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {Object.entries(rsvp.customAnswers).map(([qId, ans]) => {
                                      const q = customQuestions.find((item) => item.questionId === qId);
                                      return (
                                        <div key={qId} className="p-2 bg-white rounded border border-[#E5C378]/50">
                                          <span className="text-[10px] text-gray-500 block">
                                            {q ? q.questionText : qId}
                                          </span>
                                          <strong className="text-[#3D291F] text-xs font-semibold">
                                            {String(ans)}
                                          </strong>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
