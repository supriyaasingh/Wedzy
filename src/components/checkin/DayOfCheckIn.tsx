import React, { useState, useMemo } from 'react';
import {
  QrCode as QrIcon,
  Search,
  CheckCircle2,
  AlertTriangle,
  Users,
  Clock,
  Download,
  Check,
  X,
  RotateCcw,
  Sparkles,
  MapPin,
  Calendar,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { Guest, GuestCheckIn } from '../../types/wedding';
import { SacredKalash, DiyaIcon } from '../illustrations/IndianWeddingDecorations';

export const DayOfCheckIn: React.FC = () => {
  const {
    currentWedding,
    events,
    selectedEventId,
    setSelectedEventId,
    guests,
    invitations,
    rsvps,
    seatingTables,
    checkIns,
    checkInGuest,
    undoCheckIn,
    isGuestCheckedIn,
  } = useWedding();

  const selectedEvent = events.find((e) => e.eventId === selectedEventId) || events[0];

  const [searchInput, setSearchInput] = useState('');
  const [activeGuest, setActiveGuest] = useState<Guest | null>(null);
  const [headcountPresent, setHeadcountPresent] = useState<number>(2);
  const [successToast, setSuccessToast] = useState('');

  // Door Attendance Stats for this ceremony
  const doorStats = useMemo(() => {
    // Confirmed RSVP count for this event
    const confirmedRsvps = rsvps.filter(
      (r) => r.eventId === selectedEventId && r.attendanceStatus === 'attending'
    );
    const totalExpectedConfirmed = confirmedRsvps.reduce((acc, r) => acc + r.totalAttendees, 0);

    // Checked-in records for this event
    const eventCheckIns = checkIns.filter((c) => c.eventId === selectedEventId);
    const totalAdmitted = eventCheckIns.reduce((acc, c) => acc + c.attendeesPresent, 0);

    const pendingAdmissions = Math.max(0, totalExpectedConfirmed - totalAdmitted);
    const progressPct = totalExpectedConfirmed
      ? Math.min(100, Math.round((totalAdmitted / totalExpectedConfirmed) * 100))
      : 0;

    return {
      totalExpectedConfirmed,
      totalAdmitted,
      admittedFamilies: eventCheckIns.length,
      pendingAdmissions,
      progressPct,
      eventCheckIns,
    };
  }, [rsvps, checkIns, selectedEventId]);

  // Search filtered guests
  const searchResults = useMemo(() => {
    if (!searchInput.trim()) return [];

    const query = searchInput.toLowerCase().trim();
    const cleanDigits = query.replace(/[^0-9]/g, '');

    return guests.filter((g) => {
      const inv = invitations.find((i) => i.guestId === g.guestId);
      const matchesToken = inv?.uniqueToken?.toLowerCase().includes(query);
      const matchesName = g.name.toLowerCase().includes(query);
      const matchesFamily = g.familyName && g.familyName.toLowerCase().includes(query);
      const matchesPhone = cleanDigits && g.phone.replace(/[^0-9]/g, '').includes(cleanDigits);

      return matchesToken || matchesName || matchesFamily || matchesPhone;
    });
  }, [guests, invitations, searchInput]);

  // When selecting a guest to inspect/admit
  const handleSelectGuest = (g: Guest) => {
    setActiveGuest(g);
    const existingCheckIn = isGuestCheckedIn(g.guestId, selectedEventId);
    const rsvp = rsvps.find((r) => r.guestId === g.guestId && r.eventId === selectedEventId);

    if (existingCheckIn) {
      setHeadcountPresent(existingCheckIn.attendeesPresent);
    } else if (rsvp && rsvp.attendanceStatus === 'attending') {
      setHeadcountPresent(rsvp.totalAttendees);
    } else {
      setHeadcountPresent(g.expectedMembers || 2);
    }
  };

  const handleConfirmAdmission = () => {
    if (!activeGuest) return;

    checkInGuest(activeGuest.guestId, selectedEventId, headcountPresent);
    setSuccessToast(`✓ Admitted ${activeGuest.name} with ${headcountPresent} guests!`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleUndoAdmission = () => {
    if (!activeGuest) return;
    undoCheckIn(activeGuest.guestId, selectedEventId);
    setSuccessToast(`Admission undone for ${activeGuest.name}`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleExportCheckInLog = () => {
    const headers = ['Guest Name', 'Family Name', 'Phone', 'Category', 'Table Assigned', 'Attendees Admitted', 'Checked In At'];
    const rows = doorStats.eventCheckIns.map((ci) => {
      const g = guests.find((item) => item.guestId === ci.guestId);
      const table = seatingTables.find((t) => t.assignedGuestIds.includes(ci.guestId));

      return [
        `"${g?.name || 'Guest'}"`,
        `"${g?.familyName || ''}"`,
        `"${g?.phone || ''}"`,
        `"${g?.category || ''}"`,
        `"${table?.tableName || 'Unassigned'}"`,
        ci.attendeesPresent,
        `"${new Date(ci.checkedInAt).toLocaleTimeString('en-US')}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `door-checkin-manifest-${selectedEvent.eventName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find table assigned for active guest
  const activeGuestTable = useMemo(() => {
    if (!activeGuest) return null;
    return seatingTables.find((t) => t.assignedGuestIds.includes(activeGuest.guestId));
  }, [activeGuest, seatingTables]);

  const activeGuestCheckIn = activeGuest
    ? isGuestCheckedIn(activeGuest.guestId, selectedEventId)
    : undefined;

  const activeGuestRsvp = activeGuest
    ? rsvps.find((r) => r.guestId === activeGuest.guestId && r.eventId === selectedEventId)
    : undefined;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5C378]/70 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF0D4] border border-[#E5C378] flex items-center justify-center text-[#800020] shadow-2xs shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#800020]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B45309]">
                Wedding Day Entrance Operations
              </span>
              <span className="text-[11px] text-[#8C7A70]">·</span>
              <span className="text-[11px] text-[#5C4D43] font-medium">
                QR Verification & Usher Terminal
              </span>
            </div>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#800020]">
              Day-of QR Check-In & Guest Reception
            </h2>
            <p className="text-xs text-[#6B5E55] mt-0.5">
              Rapidly scan or search arriving guests, verify party size, guide them to their assigned tables, and prevent duplicate admissions.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleExportCheckInLog}
            className="px-3.5 py-2 text-xs font-semibold text-[#5C4D43] hover:text-[#800020] bg-white hover:bg-[#FAF7F2] border border-[#E5C378] rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Door Log (CSV)</span>
          </button>
        </div>
      </div>

      {/* Ceremony Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-[#800020] uppercase tracking-wider shrink-0 mr-1">
          Ceremony Door:
        </span>
        {events.map((ev, idx) => (
          <button
            key={`${ev.eventId || 'evt'}_${idx}`}
            onClick={() => {
              setSelectedEventId(ev.eventId);
              setActiveGuest(null);
            }}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              selectedEventId === ev.eventId
                ? 'bg-[#800020] text-white shadow-xs'
                : 'bg-white text-[#5C4D43] border border-[#E5C378]/70 hover:bg-[#FAF0D4] hover:text-[#800020]'
            }`}
          >
            {ev.eventName} ({ev.eventDate})
          </button>
        ))}
      </div>

      {/* 4 Door Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E5C378]/70 shadow-xs">
          <span className="text-[11px] font-semibold text-[#8C7A70] uppercase tracking-wider block">
            Confirmed Attendees
          </span>
          <div className="font-mono text-2xl font-bold text-[#3D291F] mt-1 tabular-nums">
            {doorStats.totalExpectedConfirmed}
          </div>
          <span className="text-[10px] text-[#5C4D43]">Expected at the door</span>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-300 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" />
            Admitted Present
          </span>
          <div className="font-mono text-2xl font-bold text-emerald-900 mt-1 tabular-nums">
            {doorStats.totalAdmitted}
          </div>
          <span className="text-[10px] text-emerald-700">
            {doorStats.admittedFamilies} families checked in
          </span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">
            Awaiting Arrival
          </span>
          <div className="font-mono text-2xl font-bold text-amber-900 mt-1 tabular-nums">
            {doorStats.pendingAdmissions}
          </div>
          <span className="text-[10px] text-amber-700">Yet to arrive</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5C378]/70 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#8C7A70] uppercase tracking-wider block">
              Admission Progress
            </span>
            <div className="font-mono text-2xl font-bold text-[#800020] mt-1 tabular-nums">
              {doorStats.progressPct}%
            </div>
          </div>
          <div className="w-full bg-[#FAF7F2] h-2 rounded-full overflow-hidden border border-[#E5C378]/40 mt-1">
            <div
              style={{ width: `${doorStats.progressPct}%` }}
              className="bg-emerald-600 h-full transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Scanner / Search Left vs Admission Verification Spotlight Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: QR Scan Simulator & Search Bar */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#E5C378]/70 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5C378]/40 pb-2.5">
            <h3 className="font-serif-luxury text-sm font-bold text-[#800020] flex items-center gap-1.5">
              <QrIcon className="w-4 h-4 text-[#800020]" />
              <span>QR Scanner & Guest Lookup</span>
            </h3>
            <span className="text-[10px] text-[#786C64]">Fast reception</span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#8C7A70] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Scan token QR or type name / phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border-2 border-[#E5C378] rounded-xl text-xs focus:outline-hidden focus:border-[#800020] text-[#3D291F]"
            />
          </div>

          {/* Quick-Pick Guest Roster for Ushens */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#800020]">
              <span>{searchInput ? 'Search Results' : 'Quick Reception List'}</span>
              <span className="text-[#8C7A70] font-normal lowercase">
                {searchInput ? `${searchResults.length} matches` : 'click to verify'}
              </span>
            </div>

            <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
              {(searchInput ? searchResults : guests.slice(0, 8)).map((g) => {
                const checked = isGuestCheckedIn(g.guestId, selectedEventId);
                const isSelected = activeGuest?.guestId === g.guestId;

                return (
                  <button
                    key={g.guestId}
                    type="button"
                    onClick={() => handleSelectGuest(g)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#FAF0D4] border-[#800020] shadow-2xs'
                        : 'bg-[#FAF7F2] border-[#E5C378]/60 hover:bg-[#FAF0D4]/50'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-[#3D291F] truncate">{g.name}</strong>
                        {checked && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-[#786C64] block truncate">
                        {g.familyName || 'Family Unit'} · {g.category} · {g.phone}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                      checked
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-white text-[#5C4D43] border border-[#E5C378]'
                    }`}>
                      {checked ? `✓ Admitted (${checked.attendeesPresent})` : 'Awaiting Entry'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Admission Verification Spotlight Card */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border-2 border-[#E5C378] shadow-sm flex flex-col justify-between space-y-4">
          {activeGuest ? (
            <div className="space-y-5">
              
              {/* Toast message if present */}
              {successToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successToast}</span>
                </div>
              )}

              {/* Duplicate Prevention Alert if already checked in */}
              {activeGuestCheckIn && (
                <div className="p-3.5 bg-amber-50 border-2 border-amber-300 text-amber-900 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Duplicate Entry Alert: Guest Already Checked In</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    This guest was admitted at <strong className="font-mono">{new Date(activeGuestCheckIn.checkedInAt).toLocaleTimeString()}</strong> with <strong className="font-mono">{activeGuestCheckIn.attendeesPresent}</strong> guests.
                  </p>
                </div>
              )}

              {/* Guest Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5C378]/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FAF0D4] border-2 border-[#E5C378] flex items-center justify-center font-bold text-base text-[#800020] shrink-0">
                    {activeGuest.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif-luxury text-lg font-bold text-[#3D291F]">
                        {activeGuest.name}
                      </h3>
                      <span className="text-[10px] font-semibold text-[#800020] bg-[#FAF0D4] px-2 py-0.5 rounded border border-[#E5C378]">
                        {activeGuest.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#5C4D43] mt-0.5">
                      {activeGuest.familyName || 'Family Unit'} · {activeGuest.countryCode} {activeGuest.phone}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-[#8C7A70] block">
                    Ceremony RSVP
                  </span>
                  <span className={`inline-block font-mono font-bold text-xs px-2 py-0.5 rounded mt-0.5 ${
                    activeGuestRsvp?.attendanceStatus === 'attending'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {activeGuestRsvp?.attendanceStatus === 'attending'
                      ? `Confirmed (${activeGuestRsvp.totalAttendees} expected)`
                      : 'Pending RSVP'}
                  </span>
                </div>
              </div>

              {/* Assigned Table Highlight */}
              <div className="p-3.5 bg-gradient-to-r from-[#FAF0D4] to-[#FDF8EE] rounded-xl border border-[#E5C378] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#800020] block">
                    Table Seating Placement
                  </span>
                  <strong className="text-sm font-bold text-[#3D291F] block mt-0.5">
                    {activeGuestTable ? activeGuestTable.tableName : 'Unassigned Table (Free Seating)'}
                  </strong>
                </div>
                <span className="text-xs font-semibold text-[#800020] bg-white px-2.5 py-1 rounded border border-[#E5C378]">
                  Guide Guest Here →
                </span>
              </div>

              {/* Attendees Present Counter */}
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5C378]/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-bold text-xs text-[#3D291F] block">
                      Number of Attendees Present at Door *
                    </label>
                    <span className="text-[10px] text-[#786C64]">
                      Verify actual count arriving with this family
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHeadcountPresent((prev) => Math.max(1, prev - 1))}
                      className="w-9 h-9 rounded-lg bg-white border border-[#E5C378] text-[#800020] font-bold text-base hover:bg-[#FAF0D4] flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="font-mono text-xl font-bold text-[#3D291F] w-8 text-center tabular-nums">
                      {headcountPresent}
                    </span>
                    <button
                      type="button"
                      onClick={() => setHeadcountPresent((prev) => Math.min(20, prev + 1))}
                      className="w-9 h-9 rounded-lg bg-white border border-[#E5C378] text-[#800020] font-bold text-base hover:bg-[#FAF0D4] flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Admission Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmAdmission}
                  className="w-full sm:flex-1 py-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 text-[#FDE047]" />
                  <span>
                    {activeGuestCheckIn ? 'Update Admitted Count' : 'Confirm Check-In & Admit Entry'}
                  </span>
                </button>

                {activeGuestCheckIn && (
                  <button
                    type="button"
                    onClick={handleUndoAdmission}
                    className="w-full sm:w-auto px-4 py-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Undo Check-In</span>
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#FAF0D4] text-[#800020] flex items-center justify-center mx-auto border border-[#E5C378]">
                <QrIcon className="w-7 h-7" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-[#3D291F]">
                Ready for Guest Arrival
              </h3>
              <p className="text-xs text-[#786C64] max-w-sm mx-auto">
                Scan an arriving guest's QR code or select them from the list on the left to verify attendance and table placement.
              </p>
            </div>
          )}

          {/* Door Status Footer */}
          <div className="pt-3 border-t border-[#E5C378]/40 flex items-center justify-between text-[11px] text-[#5C4D43]">
            <span>Door Reception Active for: <strong className="text-[#800020]">{selectedEvent.eventName}</strong></span>
            <span>Venue: {selectedEvent.venue}</span>
          </div>
        </div>

      </div>

      {/* Recent Chronological Door Admission Feed */}
      <div className="bg-white rounded-2xl border border-[#E5C378]/70 shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#E5C378]/40 pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#800020]" />
            <h3 className="font-serif-luxury text-sm font-bold text-[#800020]">
              Recent Door Admissions Feed ({doorStats.admittedFamilies} Families)
            </h3>
          </div>
          <span className="text-[11px] text-[#786C64]">Real-time arrival log</span>
        </div>

        <div className="space-y-2">
          {doorStats.eventCheckIns.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#8C7A70] bg-[#FAF7F2] rounded-xl border border-[#E5C378]/40">
              No guests have arrived through this ceremony door yet.
            </div>
          ) : (
            doorStats.eventCheckIns.map((ci) => {
              const g = guests.find((item) => item.guestId === ci.guestId);
              const table = seatingTables.find((t) => t.assignedGuestIds.includes(ci.guestId));

              return (
                <div
                  key={ci.checkInId}
                  className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E5C378]/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                      ✓
                    </div>
                    <div>
                      <strong className="text-[#3D291F] block">{g?.name || 'Guest'}</strong>
                      <span className="text-[10px] text-[#786C64]">
                        {g?.familyName || 'Family Unit'} · Table: <strong className="text-[#800020]">{table?.tableName || 'Unassigned'}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {ci.attendeesPresent} Admitted
                    </span>
                    <span className="text-[10px] text-[#8C7A70] block mt-0.5 font-mono">
                      {new Date(ci.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
