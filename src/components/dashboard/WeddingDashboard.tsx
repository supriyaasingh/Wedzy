import React, { useState, useMemo } from 'react';
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
  FileText,
  Armchair,
  UserCheck,
  ChevronDown,
  Calendar,
  Layers,
  HelpCircle,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';
import { useWedding } from '../../context/WeddingContext';
import { Guest, GuestCategory } from '../../types/wedding';
import { DiyaIcon, SacredKalash, MandapArch } from '../illustrations/IndianWeddingDecorations';
import { InvitationDesigner } from '../designer/InvitationDesigner';
import { EventManager } from '../events/EventManager';
import { MyWeddingsView } from '../wedding/MyWeddingsView';
import { GuestManager } from '../guests/GuestManager';
import { InvitationsHub } from '../invitations/InvitationsHub';
import { AttendanceAnalyticsSection } from './AttendanceAnalyticsSection';
import { AttendanceReportModal } from './AttendanceReportModal';
import { CateringManager } from '../food/CateringManager';
import { SeatingPlanner } from '../seating/SeatingPlanner';
import { DayOfCheckIn } from '../checkin/DayOfCheckIn';
import { RsvpTrackingView } from '../rsvp/RsvpTrackingView';
import { CustomQuestionsManager } from '../rsvp/CustomQuestionsManager';

interface WeddingDashboardProps {
  onOpenCreateWizard: () => void;
  onOpenGuestRsvp: (guest: Guest) => void;
  onBackToHome: () => void;
}

type DashboardTab = 
  | 'overview' 
  | 'weddings' 
  | 'guests' 
  | 'invitations' 
  | 'rsvps' 
  | 'events' 
  | 'designer' 
  | 'food' 
  | 'seating' 
  | 'checkin' 
  | 'questions';

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
    updateInvitationStatus,
  } = useWedding();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isMoreToolsOpen, setIsMoreToolsOpen] = useState(false);

  // Add Guest Modal State
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestFamily, setNewGuestFamily] = useState('');
  const [newGuestCategory, setNewGuestCategory] = useState<GuestCategory>('Friends');
  const [newGuestExpected, setNewGuestExpected] = useState(2);

  // Scoped Guests & Stats for active wedding
  const weddingGuests = useMemo(() => {
    return guests.filter((g) => g.weddingId === currentWedding.weddingId);
  }, [guests, currentWedding.weddingId]);

  const selectedEvent = events.find((e) => e.eventId === selectedEventId) || events[0];
  const foodStats = getEventFoodCalculation(selectedEventId);

  // Setup Progress Calculation (Requirement 2 & 1)
  const setupProgress = useMemo(() => {
    const hasWedding = Boolean(currentWedding.brideName && currentWedding.groomName);
    const hasGuests = weddingGuests.length > 0;
    const hasSentInvites = invitations.some((i) => i.sharingStatus !== 'not_shared');
    const hasRsvps = rsvps.some((r) => r.weddingId === currentWedding.weddingId);

    const completedCount = [hasWedding, hasGuests, hasSentInvites, hasRsvps].filter(Boolean).length;
    const percentage = Math.round((completedCount / 4) * 100);

    return {
      hasWedding,
      hasGuests,
      hasSentInvites,
      hasRsvps,
      completedCount,
      percentage,
    };
  }, [currentWedding, weddingGuests, invitations, rsvps]);

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

  const isMoreToolActive = ['food', 'seating', 'checkin', 'events', 'designer', 'questions'].includes(activeTab);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-16">
      
      {/* Top Auspicious Banner */}
      <div className="bg-[#800020] text-white border-b-2 border-[#D4AF37] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#E5C378] flex items-center justify-center shrink-0 shadow-sm bg-[#360309]">
                <img
                  src="/assets/wedding_guest_logo_192.png"
                  alt="WeddingGuest Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#FDE68A] uppercase tracking-wider">
                  <span>Wedding Portal</span>
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
                className="px-3.5 py-1.5 text-xs font-semibold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Manifest Report</span>
              </button>
              <button
                onClick={onOpenCreateWizard}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FDE047]" />
                <span>Setup Wizard</span>
              </button>
              <button
                onClick={onBackToHome}
                className="px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white transition-colors"
              >
                Home
              </button>
            </div>

          </div>

          {/* Ceremony Selector Pills */}
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-medium text-[#FDE68A] uppercase tracking-wider shrink-0 mr-1">
              Active Ceremony:
            </span>
            {events.map((ev, idx) => (
              <button
                key={`${ev.eventId || 'evt'}_${idx}`}
                onClick={() => setSelectedEventId(ev.eventId)}
                className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
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
        
        {/* ========================================================
            CLEAN NAVIGATION BAR (Requirement 7)
            Main: Home, My Weddings, Guests, Invitations, RSVPs
            Secondary: "More Tools" dropdown
            ======================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5C378]/50 pb-3 mb-6 gap-3">
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {/* 1. Home / Overview */}
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-[#800020] text-white shadow-xs'
                  : 'text-[#5C4D43] hover:bg-[#FAF0D4] hover:text-[#800020]'
              }`}
            >
              Home
            </button>

            {/* 2. My Weddings */}
            <button
              onClick={() => setActiveTab('weddings')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'weddings'
                  ? 'bg-[#800020] text-white shadow-xs'
                  : 'text-[#5C4D43] hover:bg-[#FAF0D4] hover:text-[#800020]'
              }`}
            >
              My Weddings
            </button>

            {/* 3. Guests */}
            <button
              onClick={() => setActiveTab('guests')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'guests'
                  ? 'bg-[#800020] text-white shadow-xs'
                  : 'text-[#5C4D43] hover:bg-[#FAF0D4] hover:text-[#800020]'
              }`}
            >
              Guests ({weddingGuests.length})
            </button>

            {/* 4. Invitations */}
            <button
              onClick={() => setActiveTab('invitations')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'invitations'
                  ? 'bg-[#800020] text-white shadow-xs'
                  : 'text-[#5C4D43] hover:bg-[#FAF0D4] hover:text-[#800020]'
              }`}
            >
              Invitations (WhatsApp)
            </button>

            {/* 5. RSVPs */}
            <button
              onClick={() => setActiveTab('rsvps')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'rsvps'
                  ? 'bg-[#800020] text-white shadow-xs'
                  : 'text-[#5C4D43] hover:bg-[#FAF0D4] hover:text-[#800020]'
              }`}
            >
              RSVPs ({rsvps.filter((r) => r.weddingId === currentWedding.weddingId).length})
            </button>

            {/* "More Tools" Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMoreToolsOpen(!isMoreToolsOpen)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1 whitespace-nowrap shrink-0 border ${
                  isMoreToolActive
                    ? 'bg-[#FAF0D4] text-[#800020] border-[#D4AF37]'
                    : 'bg-white text-[#5C4D43] border-[#E5C378]/60 hover:bg-[#FAF0D4]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#B45309]" />
                <span>More Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreToolsOpen && (
                <div
                  className="absolute left-0 mt-2 w-56 bg-white rounded-2xl border border-[#E5C378] shadow-xl p-2 z-40 space-y-1 text-xs animate-in fade-in duration-150"
                  onMouseLeave={() => setIsMoreToolsOpen(false)}
                >
                  <button
                    onClick={() => {
                      setActiveTab('food');
                      setIsMoreToolsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-[#FAF0D4] hover:text-[#800020] ${
                      activeTab === 'food' ? 'bg-[#FAF0D4] text-[#800020] font-bold' : 'text-[#4A3228]'
                    }`}
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5 text-[#800020]" />
                    <span>Catering & Food Planner</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('seating');
                      setIsMoreToolsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-[#FAF0D4] hover:text-[#800020] ${
                      activeTab === 'seating' ? 'bg-[#FAF0D4] text-[#800020] font-bold' : 'text-[#4A3228]'
                    }`}
                  >
                    <Armchair className="w-3.5 h-3.5 text-[#800020]" />
                    <span>Seating Planner</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('checkin');
                      setIsMoreToolsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-[#FAF0D4] hover:text-[#800020] ${
                      activeTab === 'checkin' ? 'bg-[#FAF0D4] text-[#800020] font-bold' : 'text-[#4A3228]'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#800020]" />
                    <span>Day-of QR Check-In</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('events');
                      setIsMoreToolsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-[#FAF0D4] hover:text-[#800020] ${
                      activeTab === 'events' ? 'bg-[#FAF0D4] text-[#800020] font-bold' : 'text-[#4A3228]'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#800020]" />
                    <span>Ceremonies Schedule</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('designer');
                      setIsMoreToolsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-[#FAF0D4] hover:text-[#800020] ${
                      activeTab === 'designer' ? 'bg-[#FAF0D4] text-[#800020] font-bold' : 'text-[#4A3228]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#800020]" />
                    <span>Invitation Studio</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('questions');
                      setIsMoreToolsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-[#FAF0D4] hover:text-[#800020] ${
                      activeTab === 'questions' ? 'bg-[#FAF0D4] text-[#800020] font-bold' : 'text-[#4A3228]'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[#800020]" />
                    <span>Custom RSVP Questions</span>
                  </button>

                  <div className="pt-1 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setIsReportModalOpen(true);
                        setIsMoreToolsOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 text-[#4A3228] hover:bg-[#FAF0D4] hover:text-[#800020]"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#800020]" />
                      <span>Attendance Reports & Export</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Add Guest Button */}
          <button
            onClick={() => setIsAddGuestModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#800020] to-[#990000] hover:from-[#6B081B] hover:to-[#800020] rounded-xl shadow-xs flex items-center gap-1.5 self-end sm:self-center"
          >
            <Plus className="w-3.5 h-3.5 text-[#FDE047]" />
            <span>Add Guest</span>
          </button>
        </div>

        {/* ========================================================
            TAB 1: SIMPLIFIED MAIN USER EXPERIENCE (Requirement 1)
            Focus on 4 Primary Actions & Clean Dashboard
            ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Setup Progress Indicator Card */}
            <div className="p-5 bg-white rounded-2xl border border-[#E5C378]/70 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B45309]" />
                    <h3 className="font-bold text-sm text-[#3D291F]">
                      Wedding Setup Progress: {setupProgress.completedCount} of 4 steps completed ({setupProgress.percentage}%)
                    </h3>
                  </div>
                  <p className="text-xs text-[#6B5E55] mt-0.5">
                    Follow the guided steps below to set up your celebration, invite your loved ones, and track exact food numbers.
                  </p>
                </div>
                <button
                  onClick={onOpenCreateWizard}
                  className="px-3.5 py-1.5 text-xs font-bold text-[#800020] bg-[#FAF0D4] hover:bg-[#F5E3B5] border border-[#E5C378] rounded-xl self-start sm:self-auto shrink-0 transition-colors"
                >
                  Resume Guided Setup
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-[#FAF7F2] rounded-full overflow-hidden border border-[#E5C378]/50">
                <div
                  className="h-full bg-gradient-to-r from-[#800020] via-[#D4AF37] to-emerald-600 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(15, setupProgress.percentage)}%` }}
                />
              </div>

              {/* Progress Step Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${setupProgress.hasWedding ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">1. Wedding Created</span>
                </div>
                <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${setupProgress.hasGuests ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">2. Guests Added ({weddingGuests.length})</span>
                </div>
                <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${setupProgress.hasSentInvites ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">3. Invitations Ready</span>
                </div>
                <div className={`p-2 rounded-lg border flex items-center gap-1.5 ${setupProgress.hasRsvps ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">4. RSVPs Active</span>
                </div>
              </div>
            </div>

            {/* THE FOUR PRIMARY ACTION CARDS (Requirement 1) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif-luxury text-lg font-bold text-[#800020]">
                  Main Wedding Actions
                </h3>
                <span className="text-xs text-[#786C64]">Usable with zero technical knowledge</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Action Card 1: Create Your Wedding */}
                <div
                  onClick={onOpenCreateWizard}
                  className="p-5 rounded-2xl bg-white border-2 border-[#E5C378]/80 hover:border-[#800020] shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="w-11 h-11 rounded-xl bg-[#FAF0D4] border border-[#E5C378] text-[#800020] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <HeartHandshake className="w-6 h-6 text-[#800020]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B45309] block">
                        Action 1
                      </span>
                      <h4 className="font-bold text-base text-[#3D291F] group-hover:text-[#800020] transition-colors mt-0.5">
                        Create Your Wedding
                      </h4>
                      <p className="text-xs text-[#6B5E55] mt-1 leading-relaxed">
                        Bride & groom names, date, venue, theme, and celebration functions.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F0E6D8] mt-4 flex items-center justify-between text-xs font-bold text-[#800020]">
                    <span>Edit or setup details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Action Card 2: Add or Import Guests */}
                <div
                  onClick={() => setActiveTab('guests')}
                  className="p-5 rounded-2xl bg-white border-2 border-[#E5C378]/80 hover:border-[#800020] shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Users className="w-6 h-6 text-blue-700" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                        Action 2
                      </span>
                      <h4 className="font-bold text-base text-[#3D291F] group-hover:text-[#800020] transition-colors mt-0.5">
                        Add or Import Guests
                      </h4>
                      <p className="text-xs text-[#6B5E55] mt-1 leading-relaxed">
                        Add guests manually or import Excel/CSV files with live data preview.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F0E6D8] mt-4 flex items-center justify-between text-xs font-bold text-[#800020]">
                    <span>{weddingGuests.length} guests configured</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Action Card 3: Create & Send Invitations */}
                <div
                  onClick={() => setActiveTab('invitations')}
                  className="p-5 rounded-2xl bg-white border-2 border-[#E5C378]/80 hover:border-[#800020] shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                        Action 3
                      </span>
                      <h4 className="font-bold text-base text-[#3D291F] group-hover:text-[#800020] transition-colors mt-0.5">
                        Create & Send Invitations
                      </h4>
                      <p className="text-xs text-[#6B5E55] mt-1 leading-relaxed">
                        1-click WhatsApp Click-to-Chat with personal links & unique QR codes.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F0E6D8] mt-4 flex items-center justify-between text-xs font-bold text-[#800020]">
                    <span>Send on WhatsApp</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Action Card 4: Track RSVPs */}
                <div
                  onClick={() => setActiveTab('rsvps')}
                  className="p-5 rounded-2xl bg-white border-2 border-[#E5C378]/80 hover:border-[#800020] shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <CheckCircle2 className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                        Action 4
                      </span>
                      <h4 className="font-bold text-base text-[#3D291F] group-hover:text-[#800020] transition-colors mt-0.5">
                        Track RSVPs
                      </h4>
                      <p className="text-xs text-[#6B5E55] mt-1 leading-relaxed">
                        Real-time confirmed attendee counts, adults, children & reminders.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F0E6D8] mt-4 flex items-center justify-between text-xs font-bold text-[#800020]">
                    <span>{foodStats.confirmedAttendees} confirmed attendees</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Summary KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              
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
                  {foodStats.bufferPercentage}% buffer for {selectedEvent.eventName}
                </div>
              </div>

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

              <div className="p-4 rounded-xl bg-white border border-[#E5C378]/70 shadow-xs col-span-2 sm:col-span-1">
                <span className="text-[11px] font-semibold text-[#8C7A70] uppercase tracking-wider block">
                  Declined Families
                </span>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-rose-700 mt-1 tabular-nums">
                  {foodStats.declinedFamilies}
                </div>
                <div className="text-[11px] text-rose-800 mt-1">
                  Excluded from catering orders
                </div>
              </div>

            </div>

            {/* Quick WhatsApp Inviter Widget & Food Calculation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left: Food Waste Prevention Formula in action */}
              <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#E5C378]/70 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DiyaIcon className="w-5 h-5 text-[#800020]" />
                    <h3 className="font-serif-luxury text-lg font-bold text-[#800020]">
                      Food Calculation: {selectedEvent.eventName}
                    </h3>
                  </div>
                  <span className="text-xs bg-[#FAF0D4] text-[#800020] px-2.5 py-1 rounded-lg border border-[#E5C378] font-mono font-bold">
                    Buffer: {foodBufferPercentage}%
                  </span>
                </div>

                <p className="text-xs text-[#6B5E55] leading-relaxed">
                  Only confirmed guests are factored into catering requirements: <strong className="text-[#3D291F]">⌈{foodStats.confirmedAttendees} confirmed × (1 + {foodBufferPercentage}%)⌉ = {foodStats.recommendedPlates} plates.</strong>
                </p>

                {/* Buffer Slider */}
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5C378]/40">
                  <div className="flex justify-between items-center mb-1 text-xs font-semibold text-[#3D291F]">
                    <span>Adjust Safety Buffer:</span>
                    <span className="font-mono text-[#800020] font-bold">{foodBufferPercentage}%</span>
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
                    <span className="text-[#800020] font-bold">5% (Recommended)</span>
                    <span>30%</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-[#5C4D43] border-t border-[#F0E6D8]">
                  <span>Total Families in Guest List: <strong className="text-[#3D291F]">{weddingGuests.length}</strong></span>
                  <button
                    onClick={() => setActiveTab('food')}
                    className="text-[#800020] font-bold hover:underline"
                  >
                    Open Full Catering Planner →
                  </button>
                </div>
              </div>

              {/* Right: Quick WhatsApp Guest Inviter Widget */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#FAF0D4] via-[#FDF8EE] to-[#F5E3B5] p-6 rounded-2xl border border-[#E5C378] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#075E54]">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Quick WhatsApp Inviter</span>
                  </div>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#800020] mt-1">
                    Send Personalised Invitations
                  </h3>
                  <p className="text-xs text-[#5C4D43] mt-1 leading-relaxed">
                    Click-to-chat opens WhatsApp with each guest's name and personal link filled in.
                  </p>

                  <div className="mt-4 space-y-2">
                    {weddingGuests.slice(0, 3).map((g) => {
                      const inv = invitations.find((i) => i.guestId === g.guestId);
                      const rsvp = rsvps.find((r) => r.guestId === g.guestId && r.eventId === selectedEventId);
                      return (
                        <div
                          key={g.guestId}
                          className="p-2.5 bg-white rounded-xl border border-[#E5C378]/60 flex items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <span className="font-bold text-[#3D291F] block">{g.name}</span>
                            <span className="text-[10px] text-[#8C7A70]">
                              {rsvp
                                ? rsvp.attendanceStatus === 'attending'
                                  ? `✓ Confirmed (${rsvp.totalAttendees})`
                                  : '✕ Declined'
                                : inv?.sharingStatus === 'whatsapp_opened'
                                ? 'Opened'
                                : 'Ready to Send'}
                            </span>
                          </div>
                          <button
                            onClick={() => handleOpenWhatsApp(g)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg flex items-center gap-1"
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
                    onClick={() => setActiveTab('invitations')}
                    className="text-[#800020] font-bold hover:underline flex items-center gap-1"
                  >
                    <span>View All Invitations</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsAddGuestModalOpen(true)}
                    className="text-xs font-semibold text-[#800020] bg-white px-2.5 py-1 rounded-lg border border-[#E5C378]"
                  >
                    + Add Guest
                  </button>
                </div>
              </div>

            </div>

            {/* Attendance Analytics & Visual Distribution */}
            <AttendanceAnalyticsSection onSelectEvent={(id) => setSelectedEventId(id)} />

          </div>
        )}

        {/* ========================================================
            TAB 2: GUEST LIST & FAMILY-WISE MANAGEMENT
            ======================================================== */}
        {activeTab === 'guests' && (
          <GuestManager
            onOpenRsvpModal={onOpenGuestRsvp}
            onOpenAddGuest={() => setIsAddGuestModalOpen(true)}
          />
        )}

        {/* ========================================================
            TAB 3: WHATSAPP INVITATIONS HUB & DISPATCH TRACKER
            ======================================================== */}
        {activeTab === 'invitations' && (
          <InvitationsHub onOpenGuestRsvp={onOpenGuestRsvp} />
        )}

        {/* ========================================================
            TAB 4: SIMPLIFIED RSVP TRACKING (Requirement 6)
            ======================================================== */}
        {activeTab === 'rsvps' && (
          <RsvpTrackingView
            onOpenGuestRsvp={onOpenGuestRsvp}
            onOpenCustomQuestions={() => setActiveTab('questions')}
          />
        )}

        {/* ========================================================
            TAB 5: MY WEDDINGS PORTFOLIO
            ======================================================== */}
        {activeTab === 'weddings' && (
          <MyWeddingsView
            onCreateNew={onOpenCreateWizard}
            onOpenDesigner={() => setActiveTab('designer')}
          />
        )}

        {/* ========================================================
            MORE TOOLS: CATERING & FOOD PLANNER
            ======================================================== */}
        {activeTab === 'food' && (
          <CateringManager />
        )}

        {/* ========================================================
            MORE TOOLS: SEATING PLANNER
            ======================================================== */}
        {activeTab === 'seating' && (
          <SeatingPlanner />
        )}

        {/* ========================================================
            MORE TOOLS: DAY-OF CHECK-IN
            ======================================================== */}
        {activeTab === 'checkin' && (
          <DayOfCheckIn />
        )}

        {/* ========================================================
            MORE TOOLS: CEREMONIES SCHEDULE
            ======================================================== */}
        {activeTab === 'events' && (
          <EventManager />
        )}

        {/* ========================================================
            MORE TOOLS: INVITATION STUDIO
            ======================================================== */}
        {activeTab === 'designer' && (
          <InvitationDesigner onBackToDashboard={() => setActiveTab('overview')} />
        )}

        {/* ========================================================
            MORE TOOLS: CUSTOM RSVP QUESTIONS (Requirement 4)
            ======================================================== */}
        {activeTab === 'questions' && (
          <CustomQuestionsManager onClose={() => setActiveTab('overview')} />
        )}

      </div>

      {/* Add Guest Modal */}
      {isAddGuestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF7F2] rounded-2xl border-2 border-[#E5C378] shadow-2xl p-6 w-full max-w-md relative">
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
                  className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#3D291F] mb-1">WhatsApp Phone Number *</label>
                <div className="flex gap-2">
                  <span className="px-2.5 py-2 bg-[#FAF0D4] border border-[#E5C378] rounded-xl font-mono font-bold text-[#800020]">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    value={newGuestPhone}
                    onChange={(e) => setNewGuestPhone(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-[#E5C378] rounded-xl focus:outline-hidden"
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
                  className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-xl focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#3D291F] mb-1">Category</label>
                  <select
                    value={newGuestCategory}
                    onChange={(e) => setNewGuestCategory(e.target.value as GuestCategory)}
                    className="w-full px-2.5 py-2 bg-white border border-[#E5C378] rounded-xl focus:outline-hidden"
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
                    max="15"
                    value={newGuestExpected}
                    onChange={(e) => setNewGuestExpected(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#E5C378] rounded-xl focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#800020] hover:bg-[#6B081B] text-white font-bold rounded-xl shadow-xs"
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
