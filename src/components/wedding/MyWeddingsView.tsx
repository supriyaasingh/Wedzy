import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Edit2,
  ExternalLink,
  Layers,
  Users,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { Wedding } from '../../types/wedding';
import { WEDDING_THEMES } from '../../data/weddingThemes';
import { DiyaIcon, SacredKalash, MandapArch } from '../illustrations/IndianWeddingDecorations';

interface MyWeddingsViewProps {
  onCreateNew: () => void;
  onOpenDesigner: () => void;
}

export const MyWeddingsView: React.FC<MyWeddingsViewProps> = ({ onCreateNew, onOpenDesigner }) => {
  const {
    weddings,
    currentWedding,
    setCurrentWeddingId,
    deleteWedding,
    guests,
    events,
  } = useWedding();

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-[#E5C378]/70 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B45309]">
            <SacredKalash className="w-4 h-4" />
            <span>Host Wedding Portfolio</span>
          </div>
          <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#800020] mt-1">
            My Weddings ({weddings.length})
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5E55] mt-1">
            Manage multiple weddings under your account, switch active dashboards, or customize digital invitations.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#800020] to-[#990000] hover:from-[#6B081B] hover:to-[#800020] rounded-lg shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#FDE047]" />
          <span>Create Another Wedding</span>
        </button>
      </div>

      {/* Weddings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weddings.map((w) => {
          const isCurrent = w.weddingId === currentWedding.weddingId;
          const themeInfo = WEDDING_THEMES[w.theme] || WEDDING_THEMES.royal_maroon;
          const weddingGuests = guests.filter((g) => g.weddingId === w.weddingId);
          const weddingEvents = events.filter((e) => e.weddingId === w.weddingId);

          return (
            <div
              key={w.weddingId}
              className={`rounded-xl border-2 transition-all bg-white overflow-hidden flex flex-col justify-between shadow-xs ${
                isCurrent
                  ? 'border-[#800020] ring-2 ring-[#800020]/20 shadow-md'
                  : 'border-[#E5C378]/60 hover:border-[#D4AF37]'
              }`}
            >
              {/* Card Banner Image */}
              <div className="h-32 bg-neutral-100 relative overflow-hidden">
                <img
                  src={themeInfo.imageAsset}
                  alt={themeInfo.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3">
                  <span className="text-[11px] font-bold text-[#FDE047] uppercase tracking-wide">
                    {themeInfo.name}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#800020]">
                    {w.brideName} & {w.groomName}
                  </h3>
                  <div className="text-xs text-[#786C64]">
                    {w.brideFamilyName && w.groomFamilyName
                      ? `${w.brideFamilyName} · ${w.groomFamilyName}`
                      : 'Wedding Celebration'}
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-[#5C4D43]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#B45309]" />
                      <span>{w.weddingDate} · {w.weddingTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
                      <span className="truncate">{w.venue}</span>
                    </div>
                    <div className="flex items-center gap-4 pt-1 font-mono text-[11px] text-[#800020]">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {weddingGuests.length} Guests
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        {weddingEvents.length} Ceremonies
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-[#F0E6D8] flex items-center justify-between gap-2">
                  {isCurrent ? (
                    <button
                      onClick={onOpenDesigner}
                      className="px-3 py-1.5 text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-md transition-colors flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit & Customize</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentWeddingId(w.weddingId)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#800020] hover:bg-[#6B081B] rounded-md transition-colors"
                    >
                      Switch to This Wedding
                    </button>
                  )}

                  {weddings.length > 1 && (
                    <div>
                      {confirmDeleteId === w.weddingId ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              deleteWedding(w.weddingId);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-1 text-[10px] font-bold text-white bg-rose-600 rounded"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 text-[10px] bg-neutral-200 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(w.weddingId)}
                          title="Delete wedding"
                          className="p-1.5 text-neutral-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
