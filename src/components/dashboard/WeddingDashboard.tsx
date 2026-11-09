import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  UtensilsCrossed,
  MessageCircle,
  Share2,
  Plus,
  Search,
  Filter,
  Eye,
  TrendingDown,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Send,
  X,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { Guest, GuestCategory } from '../../types/wedding';
import { DiyaIcon, SacredKalash, MarigoldGarland } from '../illustrations/IndianWeddingDecorations';
import { InteractiveFoodCalculatorWidget } from '../landing/InteractiveFoodCalculatorWidget';
import { InvitationDesigner } from '../designer/InvitationDesigner';
import { EventManager } from '../events/EventManager';
import { MyWeddingsView } from '../wedding/MyWeddingsView';
import { GuestManager } from '../guests/GuestManager';
import { InvitationsHub } from '../invitations/InvitationsHub';
import { AttendanceAnalyticsSection } from './AttendanceAnalyticsSection';
import { PendingFollowUpSection } from './PendingFollowUpSection';
import { AttendanceReportModal } from './AttendanceReportModal';
import { CateringManager } from '../food/CateringManager';
import { SeatingPlanner } from '../seating/SeatingPlanner';
import { DayOfCheckIn } from '../checkin/DayOfCheckIn';
import { FileText, Armchair, UserCheck } from 'lucide-react';

interface WeddingDashboardProps {
  onOpenCreateWizard: () => void;
  onOpenGuestRsvp: (guest: Guest) => void;
  onBackToHome: () => void;
}

export const WeddingDashboard: React.FC<WeddingDashboardProps> = ({
  onOpenCreateWizard,
  onOpenGuestRsvp,
  onBackToHome,
}) => {
  const {
    currentWedding,
    events,
    selectedEventId,
    setSelectedEventId,
    guests,
    invitations,
    rsvps,
    foodBufferPercentage,
    setFoodBufferPercentage,
    getEventFoodCalculation,
    addGuest,
    generateWhatsAppLink,
    generateReminderWhatsAppLink,
    updateInvitationStatus,
  } = useWedding();

  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'designer' | 'guests' | 'invitations' | 'food' | 'seating' | 'checkin' | 'weddings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Add Guest Modal State
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestFamily, setNewGuestFamily] = useState('');
  const [newGuestCategory, setNewGuestCategory] = useState<GuestCategory>('Friends');
  const [newGuestExpected, setNewGuestExpected] = useState(2);

  const selectedEvent = events.find((e) => e.eventId === selectedEventId) || events[0];
  const foodStats = getEventFoodCalculation(selectedEventId);

  // Filtered Guests
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.includes(searchQuery) ||
      (g.familyName && g.familyName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || g.category === categoryFilter;

    const inv = invitations.find((i) => i.guestId === g.guestId);
    const rsvp = rsvps.find((r) => r.guestId === g.guestId && r.eventId === selectedEventId);

    let status = 'pending';
    if (rsvp) {
      status = rsvp.attendanceStatus; // 'attending' or 'declined'
    } else if (inv?.sharingStatus === 'not_shared') {
      status = 'not_shared';
    }

    const matchesStatus = statusFilter === 'all' || status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName || !newGuestPhone) return;

    addGuest({
      name: newGuestName,
      phone: newGuestPhone,
      countryCode: '+91',
      familyName: newGuestFamily || `${newGuestName.split(' ')[0]} Family`,
      category: newGuestCategory,
      expectedMembers: newGuestExpected,
    });

    setNewGuestName('');
    setNewGuestPhone('');
    setNewGuestFamily('');
    setNewGuestExpected(2);
    setIsAddGuestModalOpen(false);
  };

  const handleOpenWhatsApp = (guest: Guest) => {
    updateInvitationStatus(guest.guestId, 'whatsapp_opened');
    const link = generateWhatsAppLink(guest);
    window.open(link, '_blank');
  };

  const handleOpenReminderWhatsApp = (guest: Guest) => {
    updateInvitationStatus(guest.guestId, 'whatsapp_opened');
    const link = generateReminderWhatsAppLink(guest);
    window.open(link, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-16">
      
      {/* Dashboard Top Auspicious Banner */}
      <div className="bg-[#800020] text-white border-b-2 border-[#D4AF37] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#5B0616] border border-[#E5C378] flex items-center justify-center shrink-0 shadow-sm">
                <SacredKalash className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#FDE68A] uppercase tracking-wider">
                  <span>Host Dashboard</span>
                  <span>·</span>
                  <span>{currentWedding.theme.replace('_', ' ')}</span>
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#FDE047]">
                  {currentWedding.brideName} & {currentWedding.groomName}
                </h1>
                <p className="text-xs text-white/80">
                  {currentWedding.venue} · {currentWedding.weddingDate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-md transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Attendance Manifest</span>
              </button>
              <button
                onClick={onOpenCreateWizard}
                className="px-3 py-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-md transition-colors"
              >
                + New Wedding
              </button>
              <button
                onClick={onBackToHome}
                className="px-3 py-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-md transition-colors"
              >
                Landing Page
              </button>
            </div>

          </div>

          {/* Event Selector Tabs (Haldi, Mehendi, Wedding, Reception) */}
          <div className="mt-5 pt-3 border-t border-white/15 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-medium text-[#FDE68A] uppercase tracking-wider shrink-0 mr-1">
              Select Ceremony:
            </span>
            {events.map((ev, idx) => (
              <button
                key={`${ev.eventId || 'evt'}_${idx}`}
                onClick={() => setSelectedEventId(ev.eventId)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                  selectedEventId === ev.eventId
                    ? 'bg-[#FDE047] text-[#800020] font-bold shadow-xs'
                    : 'bg-white/10 text-white/90 hover:bg-white/20'
                }`}
              >
                {ev.eventName} ({ev.eventDate})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Navigation Tabs (Overview, Ceremonies, Invitation Studio, Guests, Food, My Weddings) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5C378]/50 pb-3 mb-6 gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'overview', label: 'Real-Time Overview' },
              { id: 'events', label: `Ceremonies (${events.length})` },
              { id: 'designer', label: 'Invitation Studio' },
              { id: 'guests', label: `Guest List (${guests.length})` },
              { id: 'invitations', label: 'WhatsApp Invitations' },
              { id: 'food', label: 'Food Planning' },
              { id: 'seating', label: 'Seating Planner' },
              { id: 'checkin', label: 'Day-of Check-In' },
              { id: 'weddings', label: 'My Weddings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-[#800020] text-white shadow-xs'
                    : 'text-[#5C4D43] hover:bg-[#FAF0D4] hover:text-[#800020]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddGuestModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#800020] to-[#990000] hover:from-[#6B081B] hover:to-[#800020] rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#FDE047]" />
            <span>Add Guest</span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: REAL-TIME OVERVIEW WITH REAL STATISTIC CARDS (Part 9, Section 20)
            ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Live Statistic Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              
              {/* Card 1: Confirmed Attendees */}
              <div className="p-4 rounded-xl bg-white border border-[#E5C378]/70 shadow-xs">
                <span className="text-[11px] font-semibold text-[#8C7A70] uppercase tracking-wider block">
                  Confirmed Attendees
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-[#800020] mt-1 tabular-nums">
                  {foodStats.confirmedAttendees}
                </div>
                <div className="text-[11px] text-[#5C4D43] mt-1">
                  {foodStats.confirmedAdults} adults · {foodStats.confirmedChildren} kids
                </div>
              </div>

              {/* Card 2: Recommended Food Plates */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#FAF0D4] to-[#FDF8EE] border-2 border-[#D4AF37] shadow-xs">
                <span className="text-[11px] font-semibold text-[#800020] uppercase tracking-wider block flex items-center gap-1">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  Food Plates to Cook
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-black text-[#800020] mt-1 tabular-nums">
                  {foodStats.recommendedPlates}
                  <span className="text-xs font-normal text-[#800020] ml-1">plates</span>
                </div>
                <div className="text-[11px] text-[#B45309] font-medium mt-1">
                  Includes {foodStats.bufferPercentage}% safety buffer
                </div>
              </div>

              {/* Card 3: Confirmed Families */}
              <div className="p-4 rounded-xl bg-white border border-[#E5C378]/70 shadow-xs">
                <span className="text-[11px] font-semibold text-[#8C7A70] uppercase tracking-wider block">
                  Confirmed Families
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-emerald-700 mt-1 tabular-nums">
                  {foodStats.confirmedFamilies}
                </div>
                <div className="text-[11px] text-emerald-800 mt-1">
                  Attending {selectedEvent.eventName}
                </div>
              </div>

              {/* Card 4: Pending Families */}
              <div className="p-4 rounded-xl bg-white border border-[#E5C378]/70 shadow-xs">
                <span className="text-[11px] font-semibold text-[#8C7A70] uppercase tracking-wider block">
                  Pending Responses
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-amber-700 mt-1 tabular-nums">
                  {foodStats.pendingFamilies}
                </div>
                <div className="text-[11px] text-[#8C7A70] mt-1">
                  Awaiting WhatsApp confirmation
                </div>
              </div>

              {/* Card 5: Declined Families */}
              <div className="p-4 rounded-xl bg-white border border-[#E5C378]/70 shadow-xs">
                <span className="text-[11px] font-semibold text-[#8C7A70] uppercase tracking-wider block">
                  Declined Families
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-rose-700 mt-1 tabular-nums">
                  {foodStats.declinedFamilies}
                </div>
                <div className="text-[11px] text-rose-800 mt-1">
                  Excluded from food orders
                </div>
              </div>

            </div>

            {/* Quick Action Strip & Food Wastage Insight */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left: Food Waste Prevention Formula in action */}
              <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-[#E5C378]/70 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DiyaIcon className="w-5 h-5 text-[#800020]" />
                    <h3 className="font-serif-luxury text-lg font-bold text-[#800020]">
                      Active Food Calculation: {selectedEvent.eventName}
                    </h3>
                  </div>
                  <span className="text-xs bg-[#FAF0D4] text-[#800020] px-2.5 py-1 rounded border border-[#E5C378] font-mono font-bold">
                    Buffer: {foodBufferPercentage}%
                  </span>
                </div>

                <p className="text-xs text-[#6B5E55] leading-relaxed">
                  Only confirmed guests are factored into the catering requirement. The formula calculates:{' '}
                  <strong className="text-[#3D291F]">
                    ⌈{foodStats.confirmedAttendees} confirmed × (1 + {foodBufferPercentage}%)⌉ = {foodStats.recommendedPlates} plates.
                  </strong>
                </p>

                {/* Buffer Slider */}
                <div className="p-4 bg-[#FAF7F2] rounded-lg border border-[#E5C378]/40">
                  <div className="flex justify-between items-center mb-1 text-xs font-semibold text-[#3D291F]">
                    <span>Adjust Buffer Percentage:</span>
                    <span className="font-mono text-[#800020]">{foodBufferPercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={foodBufferPercentage}
                    onChange={(e) => setFoodBufferPercentage(Number(e.target.value))}
                    className="w-full accent-[#800020] h-2 bg-[#F0E6D8] rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#8C7A70] mt-1 font-mono">
                    <span>0% (Exact Count)</span>
                    <span className="text-[#800020] font-bold">5% (Recommended for Indian Weddings)</span>
                    <span>30%</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-[#5C4D43] border-t border-[#F0E6D8]">
                  <span>Total Families in Guest List: <strong className="text-[#3D291F]">{guests.length}</strong></span>
                  <span>Ceremony Date: <strong className="text-[#800020]">{selectedEvent.eventDate}</strong></span>
                </div>
              </div>

              {/* Right: Quick WhatsApp Guest Inviter Widget */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#FAF0D4] via-[#FDF8EE] to-[#F5E3B5] p-6 rounded-xl border border-[#E5C378] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#075E54]">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>WhatsApp Invitation Engine</span>
                  </div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#800020] mt-1">
                    Send Invitations & Reminders
                  </h3>
                  <p className="text-xs text-[#5C4D43] mt-1.5 leading-relaxed">
                    Personalized links let guests respond with 1 tap. Responses update this dashboard in real time.
                  </p>

                  <div className="mt-4 space-y-2">
                    {guests.slice(0, 3).map((g) => {
                      const inv = invitations.find((i) => i.guestId === g.guestId);
                      const rsvp = rsvps.find((r) => r.guestId === g.guestId && r.eventId === selectedEventId);
                      return (
                        <div
                          key={g.guestId}
                          className="p-2.5 bg-white rounded-lg border border-[#E5C378]/60 flex items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <span className="font-bold text-[#3D291F] block">{g.name}</span>
                            <span className="text-[10px] text-[#8C7A70]">
                              {rsvp
                                ? rsvp.attendanceStatus === 'attending'
                                  ? `✓ Confirmed (${rsvp.totalAttendees})`
                                  : '✕ Declined'
                                : inv?.sharingStatus === 'whatsapp_opened'
                                ? 'WhatsApp Opened'
                                : 'Pending Invite'}
                            </span>
                          </div>
                          <button
                            onClick={() => handleOpenWhatsApp(g)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded flex items-center gap-1"
                          >
                            <Send className="w-3 h-3 text-[#25D366]" />
                            <span>Send</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5C378]/40 flex justify-between items-center text-xs">
                  <button
                    onClick={() => setActiveTab('guests')}
                    className="text-[#800020] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View all {guests.length} guests</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsAddGuestModalOpen(true)}
                    className="text-xs font-semibold text-[#800020] bg-white px-2.5 py-1 rounded border border-[#E5C378]"
                  >
                    + Add New Guest
                  </button>
                </div>
              </div>

            </div>

            {/* Live Visual Attendance Distribution, Adult vs Child, and Dietary Breakdown (Part 9, Section 20) */}
            <AttendanceAnalyticsSection onSelectEvent={(id) => setSelectedEventId(id)} />

            {/* Pending Guest Follow-up Command Center */}
            <PendingFollowUpSection />

          </div>
        )}

        {/* ========================================================
            TAB: GUEST LIST & FAMILY-WISE MANAGEMENT (Part 6)
            ======================================================== */}
        {activeTab === 'guests' && (
          <GuestManager
            onOpenRsvpModal={onOpenGuestRsvp}
            onOpenAddGuest={() => setIsAddGuestModalOpen(true)}
          />
        )}

        {/* ========================================================
            TAB: WHATSAPP INVITATIONS HUB & DISPATCH TRACKER (Part 7)
            ======================================================== */}
        {activeTab === 'invitations' && (
          <InvitationsHub onOpenGuestRsvp={onOpenGuestRsvp} />
        )}

        {/* ========================================================
            TAB: WEDDING CEREMONIES / EVENT MANAGER
            ======================================================== */}
        {activeTab === 'events' && (
          <EventManager />
        )}

        {/* ========================================================
            TAB: INVITATION DESIGNER & QR STUDIO
            ======================================================== */}
        {activeTab === 'designer' && (
          <InvitationDesigner onBackToDashboard={() => setActiveTab('overview')} />
        )}

        {/* ========================================================
            TAB: FOOD PLANNING & CATERING OPERATIONS (Part 8, 10)
            ======================================================== */}
        {activeTab === 'food' && (
          <CateringManager />
        )}

        {/* ========================================================
            TAB: SEATING PLANNER (Part 9)
            ======================================================== */}
        {activeTab === 'seating' && (
          <SeatingPlanner />
        )}

        {/* ========================================================
            TAB: DAY-OF GUEST CHECK-IN & DOOR ADMISSION (Part 9)
            ======================================================== */}
        {activeTab === 'checkin' && (
          <DayOfCheckIn />
        )}

        {/* ========================================================
            TAB: MY WEDDINGS PORTFOLIO
            ======================================================== */}
        {activeTab === 'weddings' && (
          <MyWeddingsView
            onCreateNew={onOpenCreateWizard}
            onOpenDesigner={() => setActiveTab('designer')}
          />
        )}

      </div>

      {/* Add Guest Modal */}
      {isAddGuestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] rounded-xl border-2 border-[#E5C378] shadow-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsAddGuestModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-[#6B5E55] hover:text-[#800020]"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif-luxury text-lg font-bold text-[#800020] mb-4">
              Add New Wedding Guest
            </h3>
            <form onSubmit={handleAddGuestSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">Guest Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Singhania"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">WhatsApp Phone Number *</label>
                <div className="flex gap-2">
                  <span className="px-2.5 py-2 bg-[#FAF0D4] border border-[#E5C378] rounded-md font-mono font-bold text-[#800020]">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    value={newGuestPhone}
                    onChange={(e) => setNewGuestPhone(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">Family Group Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Singhania Family"
                  value={newGuestFamily}
                  onChange={(e) => setNewGuestFamily(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3D291F] mb-1">Category</label>
                  <select
                    value={newGuestCategory}
                    onChange={(e) => setNewGuestCategory(e.target.value as GuestCategory)}
                    className="w-full px-2.5 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden"
                  >
                    <option value="Bride's family">Bride's Family</option>
                    <option value="Groom's family">Groom's Family</option>
                    <option value="Friends">Friends</option>
                    <option value="Relatives">Relatives</option>
                    <option value="Colleagues">Colleagues</option>
                    <option value="Neighbours">Neighbours</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#3D291F] mb-1">Expected Members</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newGuestExpected}
                    onChange={(e) => setNewGuestExpected(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-md focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#800020] hover:bg-[#6B081B] text-white font-bold rounded-lg shadow-sm"
                >
                  Save Guest & Generate WhatsApp Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendance Report & Catering Manifest Modal */}
      <AttendanceReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

    </div>
  );
};
