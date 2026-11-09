import React from 'react';
import { WifiOff, ShieldCheck } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <aside aria-label="Network Status" className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-[#800020] text-white px-3.5 py-2 text-xs font-medium shadow-2xl border border-[#D4AF37] animate-bounce">
      <span className="flex h-2.5 w-2.5 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FDE047] opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F59E0B]" />
      </span>
      <div className="flex items-center gap-1.5">
        <WifiOff className="w-3.5 h-3.5 text-[#FDE047]" />
        <span>Offline Mode — All guest lists & check-ins work seamlessly from local storage.</span>
      </div>
    </aside>
  );
};
