import React, { useState, useEffect } from 'react';
import { WeddingProvider, useWedding } from './context/WeddingContext';
import { Header } from './components/common/Header';
import { LandingPage } from './components/landing/LandingPage';
import { WeddingDashboard } from './components/dashboard/WeddingDashboard';
import { CreateWeddingWizard } from './components/wedding/CreateWeddingWizard';
import { GuestRsvpModal } from './components/rsvp/GuestRsvpModal';
import { GuestRsvpPortal } from './components/rsvp/GuestRsvpPortal';
import { DigitalInvitationCard } from './components/invitation/DigitalInvitationCard';
import { AuthModal } from './components/auth/AuthModal';
import { UserProfileModal } from './components/auth/UserProfileModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { Guest } from './types/wedding';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

function WeddingGuestApp() {
  const { currentWedding, getGuestByToken, guests } = useWedding();

  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'create-wedding' | 'rsvp-preview'>('landing');
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [isRsvpModalOpen, setIsRsvpModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedGuestForRsvp, setSelectedGuestForRsvp] = useState<Guest | undefined>(undefined);

  // Check URL token (e.g. ?rsvp=tok_sharma_9811)
  const [urlToken, setUrlToken] = useState<string | null>(null);
  const [tokenGuestData, setTokenGuestData] = useState<ReturnType<typeof getGuestByToken>>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('rsvp');
    if (token) {
      setUrlToken(token);
      const data = getGuestByToken(token);
      if (data) {
        setTokenGuestData(data);
        setSelectedGuestForRsvp(data.guest);
      }
      setCurrentView('rsvp-preview');
    }
  }, []);

  const handleOpenGuestRsvp = (guest: Guest) => {
    setSelectedGuestForRsvp(guest);
    setCurrentView('rsvp-preview');
  };

  const handleOpenGeneralRsvp = () => {
    setSelectedGuestForRsvp(guests[0]);
    setCurrentView('rsvp-preview');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      {/* Top Bar Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'create-wedding') {
            setIsCreateWizardOpen(true);
          } else {
            setCurrentView(view);
          }
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onExploreDemo={() => setCurrentView('dashboard')}
            onCreateWedding={() => setIsCreateWizardOpen(true)}
            onOpenRsvpModal={handleOpenGeneralRsvp}
          />
        )}

        {currentView === 'dashboard' && (
          <WeddingDashboard
            onOpenCreateWizard={() => setIsCreateWizardOpen(true)}
            onOpenGuestRsvp={handleOpenGuestRsvp}
            onBackToHome={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'rsvp-preview' && (
          <GuestRsvpPortal
            token={urlToken || undefined}
            guest={selectedGuestForRsvp}
            onBackToHome={() => setCurrentView('landing')}
          />
        )}
      </main>

      {/* Modals */}
      <CreateWeddingWizard
        isOpen={isCreateWizardOpen}
        onClose={() => setIsCreateWizardOpen(false)}
        onWeddingCreated={() => {
          setIsCreateWizardOpen(false);
          setCurrentView('dashboard');
        }}
      />

      <GuestRsvpModal
        isOpen={isRsvpModalOpen}
        onClose={() => setIsRsvpModalOpen(false)}
        guest={selectedGuestForRsvp}
        onRsvpComplete={() => {
          // Dashboard or preview automatically reactive
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => {
          // Auth state updated
        }}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onLoggedOut={() => {
          setCurrentView('landing');
        }}
      />

      {/* Offline Mode Indicator Banner */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <WeddingProvider>
      <WeddingGuestApp />
    </WeddingProvider>
  );
}
