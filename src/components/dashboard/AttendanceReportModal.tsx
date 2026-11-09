import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  Calendar,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  FileText,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { SacredKalash, DiyaIcon } from '../illustrations/IndianWeddingDecorations';

interface AttendanceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AttendanceReportModal: React.FC<AttendanceReportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentWedding, events, guests, rsvps, getEventFoodCalculation, foodBufferPercentage } =
    useWedding();

  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const headers = [
      'Guest Name',
      'Family Name',
      'Category',
      'Phone Number',
      ...events.map((e) => `"${e.eventName} Status"`),
      ...events.map((e) => `"${e.eventName} Headcount"`),
      'Dietary Requirements',
      'Blessings / Wishes',
    ];

    const rows = guests.map((g) => {
      const eventStatuses = events.map((ev) => {
        const rsvp = rsvps.find((r) => r.guestId === g.guestId && r.eventId === ev.eventId);
        if (!rsvp) return '"Pending"';
        return rsvp.attendanceStatus === 'attending' ? '"Attending"' : '"Declined"';
      });

      const eventHeadcounts = events.map((ev) => {
        const rsvp = rsvps.find((r) => r.guestId === g.guestId && r.eventId === ev.eventId);
        if (!rsvp || rsvp.attendanceStatus !== 'attending') return '0';
        return String(rsvp.totalAttendees);
      });

      // Find first dietary or combine
      const diets = rsvps
        .filter((r) => r.guestId === g.guestId && r.dietaryRequirements)
        .map((r) => r.dietaryRequirements);
      const uniqueDiets = Array.from(new Set(diets)).join('; ');

      const messages = rsvps
        .filter((r) => r.guestId === g.guestId && r.additionalMessage)
        .map((r) => r.additionalMessage);
      const combinedMessage = Array.from(new Set(messages)).join(' | ');

      return [
        `"${g.name}"`,
        `"${g.familyName || ''}"`,
        `"${g.category}"`,
        `"${g.countryCode} ${g.phone}"`,
        ...eventStatuses,
        ...eventHeadcounts,
        `"${uniqueDiets}"`,
        `"${combinedMessage.replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wedding-attendance-manifest-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl border-2 border-[#E5C378] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#800020] text-white px-6 py-4 border-b border-[#D4AF37] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#5B0616] border border-[#E5C378] flex items-center justify-center text-[#FDE68A]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-[#FDE047]">
                Official Wedding Attendance & Catering Manifest
              </h3>
              <p className="text-xs text-white/80">
                {currentWedding.brideName} & {currentWedding.groomName} · {currentWedding.venue} · {currentWedding.weddingDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-full ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Catering Summary Snapshot Across All Ceremonies */}
        <div className="p-4 bg-[#FAF7F2] border-b border-[#E5C378]/50 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[#800020] uppercase tracking-wider text-[11px]">
              Ceremonies Summary:
            </span>
            {events.map((ev, idx) => {
              const s = getEventFoodCalculation(ev.eventId);
              return (
                <div
                  key={`${ev.eventId || 'evt'}_${idx}`}
                  className="px-2.5 py-1 bg-white rounded-md border border-[#E5C378]/60 text-[11px]"
                >
                  <strong className="text-[#3D291F]">{ev.eventName}:</strong>{' '}
                  <span className="text-emerald-700 font-bold">{s.confirmedAttendees} confirmed</span>{' '}
                  <span className="text-[#800020] font-mono">({s.recommendedPlates} plates)</span>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-[#786C64]">
            Food Buffer: <strong className="text-[#800020] font-mono">{foodBufferPercentage}%</strong> applied
          </div>
        </div>

        {/* Manifest Table */}
        <div className="p-6 overflow-y-auto flex-1">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#800020] uppercase font-bold text-[10px] tracking-wider border-b border-[#E5C378]/70 sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Guest & Family</th>
                <th className="py-2.5 px-2">Category</th>
                <th className="py-2.5 px-2">Phone</th>
                {events.map((ev, idx) => (
                  <th key={`${ev.eventId || 'evt'}_${idx}`} className="py-2.5 px-2 text-center">
                    {ev.eventName.split('&')[0]}
                  </th>
                ))}
                <th className="py-2.5 px-3">Dietary</th>
                <th className="py-2.5 px-3">Blessings / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E6D8]">
              {guests.map((g) => {
                const diets = rsvps
                  .filter((r) => r.guestId === g.guestId && r.dietaryRequirements)
                  .map((r) => r.dietaryRequirements);
                const uniqueDiets = Array.from(new Set(diets)).join(', ');

                const messages = rsvps
                  .filter((r) => r.guestId === g.guestId && r.additionalMessage)
                  .map((r) => r.additionalMessage);
                const combinedMessage = Array.from(new Set(messages)).join(' | ');

                return (
                  <tr key={g.guestId} className="hover:bg-[#FAF7F2]/50">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-[#3D291F]">{g.name}</div>
                      <div className="text-[10px] text-[#8C7A70]">{g.familyName || 'Family Unit'}</div>
                    </td>

                    <td className="py-2.5 px-2">
                      <span className="text-[10px] bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#E5C378]/50">
                        {g.category}
                      </span>
                    </td>

                    <td className="py-2.5 px-2 font-mono text-[11px] text-[#5C4D43] whitespace-nowrap">
                      {g.countryCode} {g.phone}
                    </td>

                    {events.map((ev, idx) => {
                      const r = rsvps.find(
                        (resp) => resp.guestId === g.guestId && resp.eventId === ev.eventId
                      );

                      if (!r) {
                        return (
                          <td key={`${ev.eventId || 'evt'}_${idx}`} className="py-2.5 px-2 text-center text-amber-700 font-semibold">
                            Pending
                          </td>
                        );
                      }

                      if (r.attendanceStatus === 'attending') {
                        return (
                          <td key={`${ev.eventId || 'evt'}_${idx}`} className="py-2.5 px-2 text-center">
                            <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              ✓ {r.totalAttendees} ({r.adultCount}A, {r.childCount}K)
                            </span>
                          </td>
                        );
                      }

                      return (
                        <td key={`${ev.eventId || 'evt'}_${idx}`} className="py-2.5 px-2 text-center text-rose-700 font-semibold">
                          ✕ 0
                        </td>
                      );
                    })}

                    <td className="py-2.5 px-3 text-[11px] text-[#5C4D43] max-w-[150px] truncate">
                      {uniqueDiets || '-'}
                    </td>

                    <td className="py-2.5 px-3 text-[11px] text-[#5C4D43] italic max-w-[200px] truncate">
                      {combinedMessage ? `"${combinedMessage}"` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E5C378]/60 flex items-center justify-between text-xs text-[#5C4D43] shrink-0">
          <span>
            Report generated from live RSVP synchronizations. Confirmed plates include the {foodBufferPercentage}% safety margin.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-bold text-[#800020] hover:underline"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};
