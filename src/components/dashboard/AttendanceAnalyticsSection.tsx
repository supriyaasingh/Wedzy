import React, { useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  UtensilsCrossed,
  PieChart,
  TrendingUp,
  Sparkles,
  Layers,
  Baby,
  UserCheck,
  Salad,
  Calendar,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { DiyaIcon, SacredKalash } from '../illustrations/IndianWeddingDecorations';

interface AttendanceAnalyticsSectionProps {
  onSelectEvent?: (eventId: string) => void;
}

export const AttendanceAnalyticsSection: React.FC<AttendanceAnalyticsSectionProps> = ({
  onSelectEvent,
}) => {
  const {
    currentWedding,
    events,
    selectedEventId,
    setSelectedEventId,
    guests,
    rsvps,
    foodBufferPercentage,
    getEventFoodCalculation,
  } = useWedding();

  const selectedEvent = events.find((e) => e.eventId === selectedEventId) || events[0];
  const foodStats = getEventFoodCalculation(selectedEventId);

  // Overall Wedding Metrics across all events
  const overallMetrics = useMemo(() => {
    let totalConfirmedAcrossEvents = 0;
    let totalDeclinedAcrossEvents = 0;
    let totalPendingAcrossEvents = 0;

    events.forEach((ev) => {
      const stats = getEventFoodCalculation(ev.eventId);
      totalConfirmedAcrossEvents += stats.confirmedAttendees;
      totalDeclinedAcrossEvents += stats.declinedFamilies;
      totalPendingAcrossEvents += stats.pendingFamilies;
    });

    return {
      totalConfirmedAcrossEvents,
      totalDeclinedAcrossEvents,
      totalPendingAcrossEvents,
    };
  }, [events, getEventFoodCalculation]);

  // Dietary Preferences Breakdown for the selected ceremony
  const dietaryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {
      'Pure Vegetarian (No Onion/Garlic / Sattvic)': 0,
      'Jain Vegetarian': 0,
      'Vegetarian (North/South Indian)': 0,
      'Non-Vegetarian': 0,
      'Vegan': 0,
      'Gluten-Free / Allergen Sensitive': 0,
      'Standard Catering / Unspecified': 0,
    };

    rsvps
      .filter((r) => r.eventId === selectedEventId && r.attendanceStatus === 'attending')
      .forEach((r) => {
        const diet = r.dietaryRequirements?.trim();
        if (diet && counts[diet] !== undefined) {
          counts[diet] += r.totalAttendees;
        } else if (diet) {
          counts[diet] = (counts[diet] || 0) + r.totalAttendees;
        } else {
          counts['Standard Catering / Unspecified'] += r.totalAttendees;
        }
      });

    return Object.entries(counts).filter(([_, count]) => count > 0);
  }, [rsvps, selectedEventId]);

  // Proportional percentages for selected event
  const totalFamilies = guests.length || 1;
  const confirmedPct = Math.round((foodStats.confirmedFamilies / totalFamilies) * 100);
  const declinedPct = Math.round((foodStats.declinedFamilies / totalFamilies) * 100);
  const pendingPct = Math.max(0, 100 - confirmedPct - declinedPct);

  // Adults vs Kids ratio
  const confirmedTotal = foodStats.confirmedAttendees || 1;
  const adultsPct = Math.round((foodStats.confirmedAdults / confirmedTotal) * 100);
  const kidsPct = Math.round((foodStats.confirmedChildren / confirmedTotal) * 100);

  return (
    <div className="space-y-6">
      
      {/* Top Auspicious Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5C378]/50 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#FAF0D4] border border-[#E5C378] flex items-center justify-center text-[#800020]">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif-luxury text-lg font-bold text-[#800020]">
              Attendance Distribution & Catering Insights
            </h3>
            <p className="text-xs text-[#6B5E55]">
              Real-time response breakdown for {selectedEvent.eventName} ({selectedEvent.eventDate})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#5C4D43]">Ceremony:</span>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="px-3 py-1.5 font-bold text-xs bg-white border border-[#E5C378] rounded-lg focus:outline-hidden text-[#800020]"
          >
            {events.map((ev, idx) => (
              <option key={`${ev.eventId || 'evt'}_${idx}`} value={ev.eventId}>
                {ev.eventName} ({ev.eventDate})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid: Response Ratio Bars + Adult/Child Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Response Ratio Breakdown (Confirmed / Pending / Declined) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#E5C378]/70 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#3D291F] flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>Family Attendance Ratio ({guests.length} Total Families)</span>
            </h4>
            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {confirmedPct}% Confirmed
            </span>
          </div>

          {/* Segmented Proportional Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-4 w-full rounded-full bg-[#F0E6D8] overflow-hidden flex border border-[#E5C378]/40 shadow-inner">
              <div
                style={{ width: `${confirmedPct}%` }}
                className="bg-emerald-600 transition-all duration-500 hover:brightness-110"
                title={`Confirmed: ${foodStats.confirmedFamilies} families (${confirmedPct}%)`}
              />
              <div
                style={{ width: `${pendingPct}%` }}
                className="bg-amber-500 transition-all duration-500 hover:brightness-110"
                title={`Pending: ${foodStats.pendingFamilies} families (${pendingPct}%)`}
              />
              <div
                style={{ width: `${declinedPct}%` }}
                className="bg-rose-500 transition-all duration-500 hover:brightness-110"
                title={`Declined: ${foodStats.declinedFamilies} families (${declinedPct}%)`}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-[#5C4D43] font-medium pt-1">
              <span className="flex items-center gap-1 text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                <span>Confirmed ({foodStats.confirmedFamilies})</span>
              </span>
              <span className="flex items-center gap-1 text-amber-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>Pending ({foodStats.pendingFamilies})</span>
              </span>
              <span className="flex items-center gap-1 text-rose-800">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span>Declined ({foodStats.declinedFamilies})</span>
              </span>
            </div>
          </div>

          {/* Adult vs Child Attendees Ratio */}
          <div className="pt-3 border-t border-[#F0E6D8] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#3D291F] flex items-center gap-1.5">
                <Baby className="w-4 h-4 text-[#800020]" />
                <span>Adult vs Child Ratio ({foodStats.confirmedAttendees} Confirmed Guests)</span>
              </span>
              <span className="font-mono text-[11px] text-[#786C64]">
                {foodStats.confirmedAdults} Adults · {foodStats.confirmedChildren} Kids
              </span>
            </div>

            {/* Split Bar */}
            <div className="h-3 w-full rounded-full bg-[#F0E6D8] overflow-hidden flex border border-[#E5C378]/40">
              <div
                style={{ width: `${adultsPct}%` }}
                className="bg-[#800020] transition-all duration-500"
                title={`Adults: ${foodStats.confirmedAdults} (${adultsPct}%)`}
              />
              <div
                style={{ width: `${kidsPct}%` }}
                className="bg-[#D4AF37] transition-all duration-500"
                title={`Children: ${foodStats.confirmedChildren} (${kidsPct}%)`}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-[#786C64] font-medium">
              <span className="flex items-center gap-1 text-[#800020] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#800020] inline-block" />
                <span>Adults ({adultsPct}%) — Regular Banquet Catering</span>
              </span>
              <span className="flex items-center gap-1 text-[#B45309] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] inline-block" />
                <span>Kids ({kidsPct}%) — Half/Mild Portions</span>
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Dietary Breakdown for this Ceremony */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#E5C378]/70 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#3D291F] flex items-center gap-1.5">
                <Salad className="w-4 h-4 text-emerald-700" />
                <span>Dietary Meal Distribution</span>
              </h4>
              <span className="text-[10px] text-[#8C7A70]">For caterer's kitchen</span>
            </div>
            <p className="text-[11px] text-[#6B5E55] mt-1">
              Confirmed guests for {selectedEvent.eventName} broken down by meal preparation preference:
            </p>

            <div className="mt-3 space-y-2">
              {dietaryBreakdown.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#8C7A70] bg-[#FAF7F2] rounded-xl border border-[#E5C378]/40">
                  No confirmed attendees yet for this ceremony.
                </div>
              ) : (
                dietaryBreakdown.map(([diet, count]) => {
                  const pct = Math.round((count / foodStats.confirmedAttendees) * 100) || 0;
                  return (
                    <div
                      key={diet}
                      className="p-2.5 bg-[#FAF7F2] rounded-lg border border-[#E5C378]/40 text-xs flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-[#3D291F] block truncate">
                          {diet}
                        </span>
                        <span className="text-[10px] text-[#786C64]">
                          {pct}% of attendees
                        </span>
                      </div>
                      <span className="font-mono text-sm font-bold text-[#800020] bg-white px-2 py-0.5 rounded border border-[#E5C378] shrink-0">
                        {count} plates
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-[#F0E6D8] text-[11px] text-[#5C4D43] flex items-center justify-between">
            <span>Safety buffer applied:</span>
            <strong className="text-[#800020] font-mono">+{foodStats.bufferPercentage}% ({foodStats.recommendedPlates} total to cook)</strong>
          </div>
        </div>

      </div>

      {/* Side-by-Side Comparative Ceremonies Matrix */}
      <div className="bg-white rounded-2xl border border-[#E5C378]/70 shadow-xs overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-[#FAF0D4] via-white to-[#FAF0D4] border-b border-[#E5C378]/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#800020]" />
            <h4 className="font-serif-luxury text-sm font-bold text-[#800020]">
              Comparative Multi-Ceremony Food Planning Matrix
            </h4>
          </div>
          <span className="text-[11px] text-[#5C4D43]">
            {events.length} Ceremonies · Buffer: {foodBufferPercentage}%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#E5C378]/60 text-[#800020] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Ceremony</th>
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3 text-center">Confirmed Families</th>
                <th className="py-3 px-3 text-center">Adults</th>
                <th className="py-3 px-3 text-center">Kids</th>
                <th className="py-3 px-3 text-center">Total Confirmed</th>
                <th className="py-3 px-4 text-right">Plates to Cook ⌈C × (1+B%)⌉</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E6D8]">
              {events.map((ev, idx) => {
                const s = getEventFoodCalculation(ev.eventId);
                const isSelected = ev.eventId === selectedEventId;

                return (
                  <tr
                    key={`${ev.eventId || 'evt'}_${idx}`}
                    onClick={() => {
                      setSelectedEventId(ev.eventId);
                      if (onSelectEvent) onSelectEvent(ev.eventId);
                    }}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#FAF0D4]/60 font-semibold' : 'hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#800020]" />
                        )}
                        <span className="text-[#3D291F] font-bold">{ev.eventName}</span>
                      </div>
                      <span className="text-[10px] text-[#786C64] block">
                        {ev.venue}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-[#5C4D43] whitespace-nowrap">
                      <div>{ev.eventDate}</div>
                      <div className="text-[10px] text-[#786C64]">{ev.startTime}</div>
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-800">
                      {s.confirmedFamilies}
                    </td>

                    <td className="py-3 px-3 text-center font-mono text-[#5C4D43]">
                      {s.confirmedAdults}
                    </td>

                    <td className="py-3 px-3 text-center font-mono text-[#5C4D43]">
                      {s.confirmedChildren}
                    </td>

                    <td className="py-3 px-3 text-center font-mono font-bold text-[#800020]">
                      {s.confirmedAttendees}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <span className="inline-block font-mono font-black text-sm text-[#800020] bg-[#FAF0D4] px-2.5 py-1 rounded-md border border-[#E5C378]">
                        {s.recommendedPlates} plates
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
