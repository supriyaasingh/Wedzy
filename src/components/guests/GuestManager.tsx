import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Upload,
  Download,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  MessageCircle,
  Layers,
  ArrowUpDown,
  MoreVertical,
  Check,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { Guest, GuestCategory } from '../../types/wedding';
import { exportGuestsToCsv } from '../../utils/csvHelper';
import { DiyaIcon } from '../illustrations/IndianWeddingDecorations';
import { BulkGuestImportModal } from './BulkGuestImportModal';
import { GuestDetailModal } from './GuestDetailModal';
import { EditGuestModal } from './EditGuestModal';

interface GuestManagerProps {
  onOpenRsvpModal: (guest: Guest) => void;
  onOpenAddGuest: () => void;
}

export const GuestManager: React.FC<GuestManagerProps> = ({
  onOpenRsvpModal,
  onOpenAddGuest,
}) => {
  const {
    currentWedding,
    events,
    selectedEventId,
    guests,
    invitations,
    rsvps,
    updateInvitationStatus,
    generateWhatsAppLink,
  } = useWedding();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'families'>('list');
  const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'expected_desc'>('name_asc');

  // Modals
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [detailGuest, setDetailGuest] = useState<Guest | null>(null);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  const selectedEvent = events.find((e) => e.eventId === selectedEventId) || events[0];

  // Helper for RSVP lookup
  const getGuestRsvpInfo = (guestId: string) => {
    const rsvp = rsvps.find((r) => r.guestId === guestId && r.eventId === selectedEventId);
    if (!rsvp) {
      return { status: 'Pending', total: 0, adults: 0, kids: 0, dietary: '' };
    }
    return {
      status: rsvp.attendanceStatus === 'attending' ? 'Attending' : 'Declined',
      total: rsvp.totalAttendees,
      adults: rsvp.adultCount,
      kids: rsvp.childCount,
      dietary: rsvp.dietaryRequirements,
    };
  };

  // Filter & Sort
  const processedGuests = useMemo(() => {
    return guests
      .filter((g) => {
        const matchesSearch =
          g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.phone.includes(searchQuery) ||
          (g.familyName && g.familyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (g.notes && g.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCat = categoryFilter === 'all' || g.category === categoryFilter;

        const rsvp = rsvps.find((r) => r.guestId === g.guestId && r.eventId === selectedEventId);
        const inv = invitations.find((i) => i.guestId === g.guestId);

        let status = 'pending';
        if (rsvp) status = rsvp.attendanceStatus;

        const matchesStatus = statusFilter === 'all' || status === statusFilter;

        return matchesSearch && matchesCat && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
        if (sortBy === 'expected_desc') return b.expectedMembers - a.expectedMembers;
        return 0;
      });
  }, [guests, searchQuery, categoryFilter, statusFilter, sortBy, selectedEventId, rsvps, invitations]);

  // Family Units Grouping
  const familyGroups = useMemo(() => {
    const map = new Map<string, Guest[]>();
    processedGuests.forEach((g) => {
      const fName = g.familyName || `${g.name.split(' ')[0]} Family`;
      if (!map.has(fName)) map.set(fName, []);
      map.get(fName)!.push(g);
    });
    return Array.from(map.entries());
  }, [processedGuests]);

  const handleExportCsv = () => {
    exportGuestsToCsv(guests, `${currentWedding.brideName}_and_${currentWedding.groomName}`, (id) =>
      getGuestRsvpInfo(id)
    );
    setToastMsg('Guest list exported successfully!');
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleWhatsAppSend = (g: Guest) => {
    updateInvitationStatus(g.guestId, 'whatsapp_opened');
    const link = generateWhatsAppLink(g);
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action Controls */}
      <div className="p-6 bg-white rounded-xl border border-[#E5C378]/70 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B45309]">
            <Users className="w-4 h-4" />
            <span>Guest List & RSVP Headquarters</span>
          </div>
          <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#800020] mt-1">
            Guest Management ({guests.length} Families & Units)
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5E55] mt-1">
            Track individual and family-wise attendance, send 1-click WhatsApp invitations, and import bulk contacts via CSV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsBulkImportOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 text-xs font-semibold text-[#5C4D43] bg-white hover:bg-[#FAF7F2] border border-[#E5C378] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#B45309]" />
            <span>Export List</span>
          </button>

          <button
            onClick={onOpenAddGuest}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#800020] to-[#990000] hover:from-[#6B081B] hover:to-[#800020] rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#FDE047]" />
            <span>Add Single Guest</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Filter, Search & View Switcher Toolbar */}
      <div className="p-4 bg-white rounded-xl border border-[#E5C378]/70 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-[#8C7A70] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, phone, or family..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E5C378] rounded-md focus:outline-hidden"
          />
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E5C378] rounded-md focus:outline-hidden"
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

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E5C378] rounded-md focus:outline-hidden"
          >
            <option value="all">All RSVP States</option>
            <option value="attending">Confirmed Attending</option>
            <option value="declined">Declined</option>
            <option value="pending">Pending</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 bg-[#FAF7F2] border border-[#E5C378] rounded-md focus:outline-hidden"
          >
            <option value="name_asc">Name (A → Z)</option>
            <option value="name_desc">Name (Z → A)</option>
            <option value="expected_desc">Expected Party (High → Low)</option>
          </select>

          {/* View Mode Toggle (List vs Families) */}
          <div className="p-0.5 bg-[#FAF0D4] rounded-lg border border-[#E5C378] flex items-center">
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-[#800020] text-white shadow-2xs' : 'text-[#800020]'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('families')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                viewMode === 'families' ? 'bg-[#800020] text-white shadow-2xs' : 'text-[#800020]'
              }`}
            >
              Family Groups
            </button>
          </div>
        </div>

      </div>

      {/* VIEW MODE 1: ALL GUESTS TABLE */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-[#E5C378]/70 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#800020] uppercase font-bold text-[10px] tracking-wider border-b border-[#E5C378]/50">
                <tr>
                  <th className="py-3 px-4">Guest / Family</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">WhatsApp Phone</th>
                  <th className="py-3 px-3">Ceremony RSVP</th>
                  <th className="py-3 px-3">Headcount</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E6D8]">
                {processedGuests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-400">
                      No guests match your search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  processedGuests.map((guest) => {
                    const rsvp = rsvps.find((r) => r.guestId === guest.guestId && r.eventId === selectedEventId);

                    return (
                      <tr key={guest.guestId} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setDetailGuest(guest)}
                            className="font-bold text-[#3D291F] hover:text-[#800020] hover:underline text-left block"
                          >
                            {guest.name}
                          </button>
                          <span className="text-[11px] text-[#786C64]">
                            {guest.familyName || 'Family Unit'}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[11px] bg-[#FAF7F2] border border-[#E5C378]/50 text-[#5C4D43]">
                            {guest.category}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-mono text-[#5C4D43]">
                          {guest.countryCode} {guest.phone}
                        </td>

                        <td className="py-3 px-3">
                          {rsvp ? (
                            rsvp.attendanceStatus === 'attending' ? (
                              <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Attending
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                <XCircle className="w-3 h-3 text-rose-600" />
                                Declined
                              </span>
                            )
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Pending
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-[#3D291F]">
                          {rsvp ? (
                            rsvp.attendanceStatus === 'attending' ? (
                              <span>{rsvp.totalAttendees} ({rsvp.adultCount}A, {rsvp.childCount}C)</span>
                            ) : (
                              <span className="text-neutral-400">0</span>
                            )
                          ) : (
                            <span className="text-neutral-400">~{guest.expectedMembers} exp.</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => handleWhatsAppSend(guest)}
                            title="Open WhatsApp Invitation"
                            className="p-1.5 rounded text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onOpenRsvpModal(guest)}
                            title="Update RSVP response"
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded"
                          >
                            Update RSVP
                          </button>

                          <button
                            onClick={() => setDetailGuest(guest)}
                            title="View guest details"
                            className="p-1.5 rounded text-[#5C4D43] hover:text-[#800020] border border-[#E5C378]"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: FAMILY GROUPS CARD VIEW */}
      {viewMode === 'families' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {familyGroups.map(([familyName, members]) => {
            const primaryContact = members[0];
            const totalExpected = members.reduce((acc, m) => acc + m.expectedMembers, 0);

            // Collective RSVP for selected event
            let confirmedCount = 0;
            let hasAttending = false;
            let hasDeclined = false;

            members.forEach((m) => {
              const r = rsvps.find((r) => r.guestId === m.guestId && r.eventId === selectedEventId);
              if (r?.attendanceStatus === 'attending') {
                confirmedCount += r.totalAttendees;
                hasAttending = true;
              } else if (r?.attendanceStatus === 'declined') {
                hasDeclined = true;
              }
            });

            return (
              <div
                key={familyName}
                className="p-5 rounded-xl border border-[#E5C378]/70 bg-white shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wider block">
                        Family Unit
                      </span>
                      <h4 className="font-serif-luxury text-base font-bold text-[#800020] mt-0.5">
                        {familyName}
                      </h4>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF0D4] text-[#800020] border border-[#E5C378]">
                      {members.length} {members.length === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>

                  <div className="mt-3 text-xs space-y-1.5 text-[#5C4D43]">
                    <div className="flex justify-between">
                      <span className="text-[#8C7A70]">Primary Contact:</span>
                      <strong className="text-[#3D291F]">{primaryContact.name}</strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#8C7A70]">Phone:</span>
                      <span className="font-mono">{primaryContact.countryCode} {primaryContact.phone}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#8C7A70]">Expected Attendees:</span>
                      <span className="font-mono font-bold text-[#800020]">{totalExpected} people</span>
                    </div>

                    <div className="flex justify-between pt-1 border-t border-neutral-100">
                      <span className="text-[#8C7A70]">Ceremony RSVP:</span>
                      {hasAttending ? (
                        <span className="font-bold text-emerald-700">✓ {confirmedCount} Confirmed</span>
                      ) : hasDeclined ? (
                        <span className="font-bold text-rose-700">✕ Declined</span>
                      ) : (
                        <span className="font-semibold text-amber-700">Pending RSVP</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleWhatsAppSend(primaryContact)}
                    className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp Family</span>
                  </button>

                  <button
                    onClick={() => setDetailGuest(primaryContact)}
                    className="p-1.5 text-[#5C4D43] hover:text-[#800020] border border-[#E5C378] rounded"
                    title="View family details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <BulkGuestImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImportComplete={(count) => {
          setToastMsg(`Successfully imported ${count} guests!`);
          setTimeout(() => setToastMsg(''), 3000);
        }}
      />

      <GuestDetailModal
        isOpen={Boolean(detailGuest)}
        guest={detailGuest}
        onClose={() => setDetailGuest(null)}
        onEditGuest={(g) => {
          setDetailGuest(null);
          setEditingGuest(g);
        }}
        onOpenRsvpModal={(g) => {
          setDetailGuest(null);
          onOpenRsvpModal(g);
        }}
      />

      <EditGuestModal
        isOpen={Boolean(editingGuest)}
        guest={editingGuest}
        onClose={() => setEditingGuest(null)}
      />

    </div>
  );
};
