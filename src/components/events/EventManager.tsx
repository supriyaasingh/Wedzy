import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Layers,
  UtensilsCrossed,
  Shirt,
  Info,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { WeddingEvent } from '../../types/wedding';
import { DiyaIcon, SacredKalash } from '../illustrations/IndianWeddingDecorations';

export const EventManager: React.FC = () => {
  const {
    currentWedding,
    events,
    selectedEventId,
    setSelectedEventId,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventFoodCalculation,
  } = useWedding();

  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State for Add / Edit
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(currentWedding.weddingDate);
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('22:00');
  const [venue, setVenue] = useState(currentWedding.venue);
  const [address, setAddress] = useState(currentWedding.venueAddress);
  const [dressCode, setDressCode] = useState('');
  const [description, setDescription] = useState('');
  const [separateRsvp, setSeparateRsvp] = useState(true);
  const [requiredFoodCount, setRequiredFoodCount] = useState(true);

  const startEdit = (ev: WeddingEvent) => {
    setIsEditing(ev.eventId);
    setEventName(ev.eventName);
    setEventDate(ev.eventDate);
    setStartTime(ev.startTime);
    setEndTime(ev.endTime);
    setVenue(ev.venue);
    setAddress(ev.address || '');
    setDressCode(ev.dressCode || '');
    setDescription(ev.description || '');
    setSeparateRsvp(ev.separateRsvp);
    setRequiredFoodCount(ev.requiredFoodCount ?? true);
  };

  const handleSaveEdit = (eventId: string) => {
    updateEvent(eventId, {
      eventName,
      eventDate,
      startTime,
      endTime,
      venue,
      address,
      dressCode,
      description,
      separateRsvp,
      requiredFoodCount,
    });
    setIsEditing(null);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName) return;

    addEvent({
      eventName,
      eventDate,
      startTime,
      endTime,
      venue,
      address,
      dressCode,
      description,
      separateRsvp,
      requiredFoodCount,
    });

    setIsAddOpen(false);
    setEventName('');
    setDressCode('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-xl border border-[#E5C378]/70 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B45309]">
            <Layers className="w-4 h-4" />
            <span>Multi-Function Wedding Itinerary</span>
          </div>
          <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#800020] mt-1">
            Ceremonies & Functions ({events.length})
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5E55] mt-1">
            Manage distinct wedding events (Haldi, Mehendi, Sangeet, Pheras, Reception) with dedicated RSVPs and catering headcounts.
          </p>
        </div>

        <button
          onClick={() => {
            setEventName('');
            setDressCode('');
            setDescription('');
            setIsAddOpen(true);
          }}
          className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#800020] to-[#990000] hover:from-[#6B081B] hover:to-[#800020] rounded-lg shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#FDE047]" />
          <span>Add Ceremony</span>
        </button>
      </div>

      {/* Add Ceremony Drawer/Modal */}
      {isAddOpen && (
        <div className="p-6 bg-[#FAF7F2] rounded-xl border-2 border-[#E5C378] shadow-md space-y-4 animate-in fade-in">
          <div className="flex justify-between items-center border-b border-[#E5C378]/40 pb-3">
            <h3 className="font-serif-luxury text-base font-bold text-[#800020] flex items-center gap-2">
              <DiyaIcon className="w-4 h-4" />
              <span>Add New Wedding Function</span>
            </h3>
            <button
              onClick={() => setIsAddOpen(false)}
              className="p-1 text-[#6B5E55] hover:text-[#800020]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">Function Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sangeet Celebration"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">Dress Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Indo-Western / Glamour"
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">Ceremony Date *</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#3D291F] mb-1">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3D291F] mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#3D291F] mb-1">Venue & Location *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Courtyard, The Oberoi Rajvilas"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#3D291F] mb-1">Ceremony Description</label>
                <textarea
                  rows={2}
                  placeholder="Details about rituals, music, performances, and feasts..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 border border-[#E5C378] bg-white rounded-md font-semibold text-[#5C4D43]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#800020] text-white font-bold rounded-md shadow-sm"
              >
                Save Ceremony
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List of Events Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {events.map((ev, idx) => {
          const stats = getEventFoodCalculation(ev.eventId);
          const isSelected = selectedEventId === ev.eventId;

          if (isEditing === ev.eventId) {
            return (
              <div
                key={`${ev.eventId || 'evt'}_${idx}`}
                className="p-5 bg-white rounded-xl border-2 border-[#800020] shadow-md space-y-3 text-xs"
              >
                <span className="font-bold text-[#800020] text-sm block">Edit Ceremony Details</span>

                <div>
                  <label className="block font-semibold text-[#3D291F] mb-1">Event Name</label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#E5C378] rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-[#3D291F] mb-1">Date</label>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#E5C378] rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#3D291F] mb-1">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-[#E5C378] rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#3D291F] mb-1">Venue</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#E5C378] rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#3D291F] mb-1">Dress Code</label>
                  <input
                    type="text"
                    value={dressCode}
                    onChange={(e) => setDressCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-[#E5C378] rounded"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(null)}
                    className="px-3 py-1.5 bg-neutral-100 rounded text-neutral-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(ev.eventId)}
                    className="px-4 py-1.5 bg-[#800020] text-white rounded font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={`${ev.eventId || 'evt'}_${idx}`}
              className={`p-5 rounded-xl border-2 transition-all bg-white relative flex flex-col justify-between ${
                isSelected
                  ? 'border-[#800020] shadow-md ring-1 ring-[#800020]/20'
                  : 'border-[#E5C378]/60 hover:border-[#D4AF37]'
              }`}
            >
              <div>
                {/* Top strip */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#B45309] font-semibold">
                      <DiyaIcon className="w-3.5 h-3.5" />
                      <span>{new Date(ev.eventDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3 className="font-serif-luxury text-lg font-bold text-[#800020] mt-1">
                      {ev.eventName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(ev)}
                      title="Edit event details"
                      className="p-1.5 text-[#6B5E55] hover:text-[#800020] hover:bg-[#FAF0D4] rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {events.length > 1 && (
                      <button
                        onClick={() => deleteEvent(ev.eventId)}
                        title="Delete event"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Info pills */}
                <div className="mt-3 space-y-1.5 text-xs text-[#5C4D43]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                    <span>{ev.startTime} {ev.endTime ? `to ${ev.endTime}` : 'onwards'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                    <span className="truncate">{ev.venue}</span>
                  </div>

                  {ev.dressCode && (
                    <div className="flex items-center gap-2">
                      <Shirt className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                      <span>Dress code: <strong className="text-[#3D291F]">{ev.dressCode}</strong></span>
                    </div>
                  )}

                  {ev.description && (
                    <p className="text-[11px] text-[#786C64] italic mt-2 border-l-2 border-[#E5C378] pl-2 line-clamp-2">
                      "{ev.description}"
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Food & Attendance Breakdown */}
              <div className="mt-5 pt-3 border-t border-[#F0E6D8] flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-[#8C7A70] block text-[10px] uppercase tracking-wider font-semibold">
                    Catering Requirement
                  </span>
                  <div className="font-mono font-bold text-[#800020] text-sm">
                    {stats.recommendedPlates} plates{' '}
                    <span className="text-neutral-500 font-normal text-xs">
                      ({stats.confirmedAttendees} confirmed)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEventId(ev.eventId)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    isSelected
                      ? 'bg-[#800020] text-white shadow-2xs'
                      : 'bg-[#FAF0D4] text-[#800020] hover:bg-[#F5E3B5] border border-[#E5C378]'
                  }`}
                >
                  {isSelected ? 'Active Ceremony' : 'View Headcount'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
