import React, { useState, useMemo } from 'react';
import {
  MessageCircle,
  Send,
  Users,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Search,
  Filter,
  Download,
  Settings,
  Sparkles,
  QrCode as QrIcon,
  Play,
  RotateCcw,
  CheckCheck,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { Guest, GuestInvitation, GuestCategory } from '../../types/wedding';
import { DiyaIcon, SacredKalash } from '../illustrations/IndianWeddingDecorations';
import { GuestQrModal } from './GuestQrModal';
import { MessageTemplateEditorModal } from './MessageTemplateEditorModal';
import { BatchDispatchModal } from './BatchDispatchModal';

interface InvitationsHubProps {
  onOpenGuestRsvp?: (guest: Guest) => void;
}

export const InvitationsHub: React.FC<InvitationsHubProps> = ({ onOpenGuestRsvp }) => {
  const {
    currentWedding,
    events,
    selectedEventId,
    guests,
    invitations,
    rsvps,
    updateInvitationStatus,
    toggleInvitationMarkedSent,
    generateWhatsAppLink,
    generateReminderWhatsAppLink,
  } = useWedding();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedGuestId, setCopiedGuestId] = useState<string | null>(null);

  // Modals state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [qrModalGuest, setQrModalGuest] = useState<Guest | null>(null);

  // Statistics calculation
  const stats = useMemo(() => {
    let notShared = 0;
    let opened = 0;
    let markedSent = 0;
    let rsvpReceived = 0;

    guests.forEach((g) => {
      const inv = invitations.find((i) => i.guestId === g.guestId);
      const hasRsvp = rsvps.some((r) => r.guestId === g.guestId);

      if (hasRsvp || inv?.sharingStatus === 'rsvp_received') {
        rsvpReceived++;
      } else if (inv?.sharingStatus === 'marked_sent') {
        markedSent++;
      } else if (inv?.sharingStatus === 'whatsapp_opened') {
        opened++;
      } else {
        notShared++;
      }
    });

    return {
      total: guests.length,
      notShared,
      opened,
      markedSent,
      rsvpReceived,
      sentTotal: markedSent + rsvpReceived,
    };
  }, [guests, invitations, rsvps]);

  // Filtered guest list
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchesSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.phone.includes(searchQuery) ||
        (g.familyName && g.familyName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = categoryFilter === 'all' || g.category === categoryFilter;

      const inv = invitations.find((i) => i.guestId === g.guestId);
      const hasRsvp = rsvps.some((r) => r.guestId === g.guestId);

      let effectiveStatus = inv?.sharingStatus || 'not_shared';
      if (hasRsvp) effectiveStatus = 'rsvp_received';

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'not_shared' && effectiveStatus === 'not_shared') ||
        (statusFilter === 'whatsapp_opened' && effectiveStatus === 'whatsapp_opened') ||
        (statusFilter === 'marked_sent' && effectiveStatus === 'marked_sent') ||
        (statusFilter === 'rsvp_received' && effectiveStatus === 'rsvp_received');

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [guests, invitations, rsvps, searchQuery, categoryFilter, statusFilter]);

  const handleCopyLink = (guest: Guest) => {
    const inv = invitations.find((i) => i.guestId === guest.guestId);
    const token = inv?.uniqueToken || '';
    const link = `${window.location.origin}/?rsvp=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedGuestId(guest.guestId);
    setTimeout(() => setCopiedGuestId(null), 2000);
  };

  const handleOpenWhatsApp = (guest: Guest) => {
    updateInvitationStatus(guest.guestId, 'whatsapp_opened');
    const link = generateWhatsAppLink(guest);
    window.open(link, '_blank');
  };

  const handleOpenReminder = (guest: Guest) => {
    updateInvitationStatus(guest.guestId, 'whatsapp_opened');
    const link = generateReminderWhatsAppLink(guest);
    window.open(link, '_blank');
  };

  const handleExportCsv = () => {
    const headers = [
      'Guest Name',
      'Family Name',
      'Phone',
      'Category',
      'Expected Members',
      'Sharing Status',
      'Marked Sent Date',
      'RSVP Status',
      'Confirmed Attendees',
      'Invitation Link',
    ];

    const rows = guests.map((g) => {
      const inv = invitations.find((i) => i.guestId === g.guestId);
      const token = inv?.uniqueToken || '';
      const rsvp = rsvps.find((r) => r.guestId === g.guestId);
      const link = `${window.location.origin}/?rsvp=${token}`;

      let rsvpStatusStr = 'Pending';
      let headcount = '0';
      if (rsvp) {
        rsvpStatusStr = rsvp.attendanceStatus === 'attending' ? 'Attending' : 'Declined';
        headcount = String(rsvp.totalAttendees);
      }

      return [
        `"${g.name}"`,
        `"${g.familyName || ''}"`,
        `"${g.countryCode} ${g.phone}"`,
        `"${g.category}"`,
        g.expectedMembers,
        `"${inv?.sharingStatus || 'not_shared'}"`,
        `"${inv?.markedSentAt || ''}"`,
        `"${rsvpStatusStr}"`,
        headcount,
        `"${link}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wedding-invitations-dispatch-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Controls */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5C378]/70 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF0D4] border border-[#E5C378] flex items-center justify-center text-[#800020] shadow-2xs shrink-0">
            <MessageCircle className="w-6 h-6 text-[#25D366]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B45309]">
                WhatsApp Invitation Engine
              </span>
              <span className="text-[11px] text-[#8C7A70]">·</span>
              <span className="text-[11px] text-[#5C4D43] font-medium">Meta Click-to-Chat</span>
            </div>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#800020]">
              Invitations & Sharing Tracker
            </h2>
            <p className="text-xs text-[#6B5E55] mt-0.5">
              Send personalized WhatsApp digital invitation passes, track dispatch progress, and prevent food wastage.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsBatchModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#800020] to-[#990000] hover:from-[#6B081B] hover:to-[#800020] rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current text-[#FDE047]" />
            <span>Batch WhatsApp Queue</span>
          </button>

          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Customize Message</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 text-xs font-semibold text-[#5C4D43] hover:text-[#800020] bg-white hover:bg-[#FAF7F2] border border-[#E5C378] rounded-lg flex items-center gap-1.5 transition-colors"
            title="Export CSV of all invitation links and dispatch statuses"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 5 Real-Time Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Total Guests */}
        <div className="p-4 rounded-xl bg-white border border-[#E5C378]/70 shadow-xs">
          <span className="text-[11px] font-semibold text-[#8C7A70] uppercase tracking-wider block">
            Total Guest List
          </span>
          <div className="font-mono text-2xl font-bold text-[#3D291F] mt-1 tabular-nums">
            {stats.total}
          </div>
          <div className="text-[11px] text-[#5C4D43] mt-0.5">
            100% tokenized links
          </div>
        </div>

        {/* Not Shared */}
        <div className="p-4 rounded-xl bg-white border border-[#E5C378]/70 shadow-xs">
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
            Not Shared Yet
          </span>
          <div className="font-mono text-2xl font-bold text-gray-700 mt-1 tabular-nums">
            {stats.notShared}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            {stats.total ? Math.round((stats.notShared / stats.total) * 100) : 0}% of guest list
          </div>
        </div>

        {/* WhatsApp Link Opened */}
        <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            WhatsApp Opened
          </span>
          <div className="font-mono text-2xl font-bold text-blue-900 mt-1 tabular-nums">
            {stats.opened}
          </div>
          <div className="text-[11px] text-blue-700 mt-0.5">
            Click-to-chat triggered
          </div>
        </div>

        {/* Marked Sent by Host */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-300 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
            <CheckCheck className="w-3.5 h-3.5 text-amber-700" />
            Marked Sent by Host
          </span>
          <div className="font-mono text-2xl font-bold text-amber-900 mt-1 tabular-nums">
            {stats.markedSent}
          </div>
          <div className="text-[11px] text-amber-800 mt-0.5">
            Verified delivered
          </div>
        </div>

        {/* RSVP Received */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-300 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            RSVP Confirmed
          </span>
          <div className="font-mono text-2xl font-bold text-emerald-900 mt-1 tabular-nums">
            {stats.rsvpReceived}
          </div>
          <div className="text-[11px] text-emerald-800 mt-0.5">
            Counted in food calculation
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-[#E5C378]/70 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8C7A70] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by guest name, phone, or family..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#E5C378] rounded-lg focus:outline-hidden focus:border-[#800020] text-[#3D291F]"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#8C7A70]" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-[#FAF7F2] border border-[#E5C378] rounded-lg focus:outline-hidden text-[#3D291F]"
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

        {/* Status Filter Tabs */}
        <div className="pt-2 border-t border-[#F0E6D8] flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-[#800020] uppercase tracking-wider shrink-0 mr-1">
            Status:
          </span>
          {[
            { id: 'all', label: `All (${guests.length})` },
            { id: 'not_shared', label: `Not Shared (${stats.notShared})` },
            { id: 'whatsapp_opened', label: `Opened (${stats.opened})` },
            { id: 'marked_sent', label: `Marked Sent (${stats.markedSent})` },
            { id: 'rsvp_received', label: `RSVP Received (${stats.rsvpReceived})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-[#800020] text-white shadow-2xs'
                  : 'bg-[#FAF7F2] text-[#5C4D43] hover:bg-[#FAF0D4] hover:text-[#800020]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invitations Table */}
      <div className="bg-white rounded-xl border border-[#E5C378]/70 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E5C378]/70 text-[#800020] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Guest & Family</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">WhatsApp Phone</th>
                <th className="py-3 px-4">Personal RSVP Link</th>
                <th className="py-3 px-3">Sharing Status</th>
                <th className="py-3 px-3 text-center">Mark as Sent</th>
                <th className="py-3 px-4 text-right">Quick Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E6D8]">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#8C7A70]">
                    No guests match your current filters.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const inv = invitations.find((i) => i.guestId === guest.guestId);
                  const token = inv?.uniqueToken || '';
                  const rsvpLink = `${window.location.origin}/?rsvp=${token}`;
                  const rsvp = rsvps.find((r) => r.guestId === guest.guestId);

                  const isRsvpReceived = Boolean(rsvp) || inv?.sharingStatus === 'rsvp_received';
                  const isMarkedSent = inv?.sharingStatus === 'marked_sent';
                  const isOpened = inv?.sharingStatus === 'whatsapp_opened';
                  const isNotShared = !isRsvpReceived && !isMarkedSent && !isOpened;

                  const isCopied = copiedGuestId === guest.guestId;

                  return (
                    <tr
                      key={guest.guestId}
                      className="hover:bg-[#FAF7F2]/60 transition-colors"
                    >
                      {/* Guest & Family */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#3D291F] text-xs">
                          {guest.name}
                        </div>
                        <div className="text-[10px] text-[#8C7A70]">
                          {guest.familyName || 'Single Family'} · {guest.expectedMembers} expected
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-semibold text-[#800020] bg-[#FAF0D4] px-2 py-0.5 rounded border border-[#E5C378]/60 whitespace-nowrap">
                          {guest.category}
                        </span>
                      </td>

                      {/* Phone */}
                      <td className="py-3 px-3 font-mono text-xs text-[#5C4D43] whitespace-nowrap">
                        {guest.countryCode} {guest.phone}
                      </td>

                      {/* RSVP Link & Copy */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 max-w-[220px]">
                          <span className="font-mono text-[11px] text-[#5C4D43] truncate bg-[#FAF7F2] px-2 py-1 rounded border border-[#E5C378]/50 flex-1">
                            ?rsvp={token.substring(0, 14)}...
                          </span>
                          <button
                            onClick={() => handleCopyLink(guest)}
                            className="p-1 text-[#800020] hover:bg-[#FAF0D4] rounded transition-colors shrink-0"
                            title="Copy personalized invitation URL"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Sharing Status Badge */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        {isRsvpReceived ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>RSVP Received</span>
                          </span>
                        ) : isMarkedSent ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300">
                            <CheckCheck className="w-3 h-3 text-amber-700" />
                            <span>Marked Sent</span>
                          </span>
                        ) : isOpened ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                            <ExternalLink className="w-3 h-3 text-blue-600" />
                            <span>Link Opened</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span>Not Shared</span>
                          </span>
                        )}
                      </td>

                      {/* Manual "Mark as Sent" Toggle Switch */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => toggleInvitationMarkedSent(guest.guestId)}
                          disabled={isRsvpReceived}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-all ${
                            isRsvpReceived
                              ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200'
                              : isMarkedSent
                              ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                              : 'bg-white text-[#5C4D43] border-[#E5C378] hover:bg-[#FAF0D4]'
                          }`}
                          title="Host manual toggle to verify the invitation was delivered"
                        >
                          {isMarkedSent ? '✓ Sent' : 'Mark Sent'}
                        </button>
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenWhatsApp(guest)}
                            className="py-1 px-2.5 text-xs font-bold text-white bg-[#075E54] hover:bg-[#128C7E] rounded-md shadow-2xs flex items-center gap-1 transition-all"
                            title="Open WhatsApp chat with prefilled message & link"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                            <span>WhatsApp</span>
                          </button>

                          {!isRsvpReceived && (
                            <button
                              onClick={() => handleOpenReminder(guest)}
                              className="py-1 px-2 text-xs font-medium text-[#075E54] bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md transition-colors"
                              title="Send WhatsApp catering reminder"
                            >
                              <Send className="w-3 h-3" />
                            </button>
                          )}

                          <button
                            onClick={() => setQrModalGuest(guest)}
                            className="p-1 text-[#800020] hover:bg-[#FAF0D4] border border-[#E5C378]/70 rounded-md transition-colors"
                            title="View personalized QR Code pass"
                          >
                            <QrIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Card Explaining Safety Buffer & WhatsApp Flow */}
      <div className="p-4 bg-gradient-to-r from-[#FAF0D4] via-[#FDF8EE] to-[#FAF0D4] rounded-xl border border-[#E5C378] flex items-start gap-3">
        <DiyaIcon className="w-5 h-5 text-[#800020] shrink-0 mt-0.5" />
        <div className="text-xs text-[#5C4D43] leading-relaxed space-y-1">
          <p>
            <strong className="text-[#800020]">Zero-Waste Food Assurance:</strong> When guests open their link and submit headcount, their confirmed responses instantly synchronize with the Food Planning calculator.
          </p>
          <p className="text-[11px] text-[#786C64]">
            WhatsApp click-to-chat complies with Meta's official web linking protocols (<code className="font-mono text-[#800020]">https://wa.me/&lt;phone&gt;?text=&lt;encoded&gt;</code>). Opening the link does not automatically mark the invitation as delivered until you verify it or the guest confirms RSVP.
          </p>
        </div>
      </div>

      {/* Modals */}
      <GuestQrModal
        isOpen={Boolean(qrModalGuest)}
        onClose={() => setQrModalGuest(null)}
        guest={qrModalGuest}
      />

      <MessageTemplateEditorModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />

      <BatchDispatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onOpenQr={(g) => {
          setIsBatchModalOpen(false);
          setQrModalGuest(g);
        }}
      />

    </div>
  );
};
