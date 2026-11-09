import React from 'react';

// Sacred Mandap Arch Motif
export const MandapArch: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => (
  <svg viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Arch Pillars */}
    <path d="M40 120V40C40 30 50 20 70 20C90 20 100 30 100 40V120" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M360 120V40C360 30 350 20 330 20C310 20 300 30 300 40V120" stroke="#D4AF37" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Decorative Arch Center */}
    <path d="M85 40C120 10 280 10 315 40" stroke="#B45309" strokeWidth="3" fill="none" />
    <path d="M70 45C110 20 290 20 330 45" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
    
    {/* Hanging Marigolds / Kalash Center */}
    <circle cx="200" cy="18" r="8" fill="#F59E0B" />
    <circle cx="200" cy="18" r="4" fill="#DC2626" />
    <path d="M200 26V50" stroke="#D97706" strokeWidth="1.5" strokeDasharray="2 2" />
    <circle cx="200" cy="54" r="5" fill="#E11D48" />

    {/* Hanging side garlands */}
    <circle cx="140" cy="32" r="4" fill="#F59E0B" />
    <path d="M140 36V58" stroke="#D97706" strokeWidth="1" strokeDasharray="2 2" />
    <circle cx="140" cy="62" r="4" fill="#E11D48" />

    <circle cx="260" cy="32" r="4" fill="#F59E0B" />
    <path d="M260 36V58" stroke="#D97706" strokeWidth="1" strokeDasharray="2 2" />
    <circle cx="260" cy="62" r="4" fill="#E11D48" />
  </svg>
);

// Traditional Glowing Diya
export const DiyaIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Diya Base */}
    <path d="M6 24C6 31 12 36 20 36C28 36 34 31 34 24C34 22 28 22 20 22C12 22 6 22 6 24Z" fill="#B45309" />
    <path d="M9 25C9 30 14 34 20 34C26 34 31 30 31 25" stroke="#FDE68A" strokeWidth="1.5" />
    {/* Golden Oil Rim */}
    <ellipse cx="20" cy="23" rx="13" ry="3" fill="#D97706" />
    {/* Flame */}
    <path d="M20 7C20 7 24 13 24 17C24 19.5 22.2 21 20 21C17.8 21 16 19.5 16 17C16 13 20 7 20 7Z" fill="#F59E0B" />
    <path d="M20 11C20 11 22 15 22 17.5C22 19 21.1 20 20 20C18.9 20 18 19 18 17.5C18 15 20 11 20 11Z" fill="#FDE047" />
  </svg>
);

// Sacred Kalash (Auspicious Indian Wedding Symbol)
export const SacredKalash: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Coconut */}
    <ellipse cx="30" cy="18" rx="8" ry="10" fill="#92400E" />
    <path d="M30 8L30 14" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
    
    {/* Mango Leaves */}
    <path d="M22 18C16 14 16 6 20 4C24 10 24 16 22 18Z" fill="#15803D" />
    <path d="M38 18C44 14 44 6 40 4C36 10 36 16 38 18Z" fill="#15803D" />
    <path d="M30 14C30 8 32 3 30 2C28 3 30 8 30 14Z" fill="#16A34A" />

    {/* Pot (Lota / Kalash) */}
    <path d="M20 24H40L44 32C46 38 44 48 30 48C16 48 14 38 16 32L20 24Z" fill="#D97706" stroke="#B45309" strokeWidth="1.5" />
    <ellipse cx="30" cy="24" rx="10" ry="3" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
    
    {/* Sacred Swastik / Red Thread (Mauli) */}
    <circle cx="30" cy="36" r="3" fill="#DC2626" />
    <path d="M19 32H41" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="3 2" />
  </svg>
);

// Traditional Dhol Drum (Festive Punjabi & Indian Wedding Percussion)
export const DholDrumIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Barrel Body */}
    <path d="M16 16C24 14 40 14 48 16L52 48C44 50 20 50 12 48L16 16Z" fill="#92400E" stroke="#78350F" strokeWidth="1.5" />
    {/* Drum Heads */}
    <ellipse cx="14" cy="32" rx="4" ry="16" fill="#FDFBF7" stroke="#B45309" strokeWidth="1.5" />
    <ellipse cx="50" cy="32" rx="4" ry="16" fill="#FDFBF7" stroke="#B45309" strokeWidth="1.5" />
    {/* Ropes (Tuning Strings) */}
    <path d="M16 18L32 49L48 18" stroke="#DC2626" strokeWidth="1.5" />
    <path d="M16 46L32 15L48 46" stroke="#F59E0B" strokeWidth="1.5" />
    {/* Strap */}
    <path d="M14 24C8 12 56 12 50 24" stroke="#B45309" strokeWidth="2" strokeDasharray="2 2" />
  </svg>
);

// Shehnai / Nadaswaram (Auspicious Wedding Horn)
export const ShehnaiIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 12L38 38L48 48C52 44 56 48 54 54C48 56 44 52 48 48L38 38L12 12Z" fill="#B45309" stroke="#78350F" strokeWidth="1.5" />
    <circle cx="20" cy="20" r="1.5" fill="#FDE047" />
    <circle cx="26" cy="26" r="1.5" fill="#FDE047" />
    <circle cx="32" cy="32" r="1.5" fill="#FDE047" />
    {/* Bell flare */}
    <path d="M42 42L54 54" stroke="#D4AF37" strokeWidth="3" />
  </svg>
);

// Rangoli Mandala Pattern
export const RangoliMotif: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="42" stroke="#E5C378" strokeWidth="1.5" strokeDasharray="4 3" />
    <circle cx="50" cy="50" r="32" stroke="#B45309" strokeWidth="1" />
    <circle cx="50" cy="50" r="16" fill="#F59E0B" fillOpacity="0.2" stroke="#D97706" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="6" fill="#DC2626" />
    {/* Petals */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <g key={i} transform={`rotate(${angle} 50 50)`}>
        <path d="M50 20C45 28 55 28 50 20Z" fill="#DC2626" />
        <circle cx="50" cy="14" r="2" fill="#F59E0B" />
      </g>
    ))}
  </svg>
);

// Marigold Toran / Garland Garland Header Divider
export const MarigoldGarland: React.FC<{ className?: string }> = ({ className = 'w-full' }) => (
  <div className={`flex items-center justify-center gap-2 overflow-hidden py-1 ${className}`}>
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-[#F59E0B]"></div>
    <div className="flex items-center gap-1.5 px-2">
      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-sm"></span>
      <span className="w-2 h-2 rounded-full bg-[#E11D48]"></span>
      <span className="w-3 h-3 rounded-full bg-[#D97706] shadow-sm flex items-center justify-center text-[8px] text-white">✦</span>
      <span className="w-2 h-2 rounded-full bg-[#E11D48]"></span>
      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-sm"></span>
    </div>
    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37] to-[#F59E0B]"></div>
  </div>
);

// Floating Marigold & Rose Petals Background Effect
export const FloatingPetals: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0" aria-hidden="true">
      {/* Petal 1 */}
      <div 
        className="absolute top-[8%] left-[6%] w-4 h-4 rounded-[50%_0_50%_0] bg-gradient-to-br from-[#F59E0B] to-[#D97706] opacity-35 animate-float-slow"
        style={{ animationDelay: '0s', animationDuration: '8s' }}
      />
      {/* Petal 2 */}
      <div 
        className="absolute top-[22%] right-[8%] w-5 h-5 rounded-[0_50%_0_50%] bg-gradient-to-br from-[#E11D48] to-[#990000] opacity-30 animate-float-slow"
        style={{ animationDelay: '1.8s', animationDuration: '9.5s' }}
      />
      {/* Petal 3 */}
      <div 
        className="absolute top-[48%] left-[3%] w-3.5 h-3.5 rounded-[50%_0_50%_0] bg-gradient-to-br from-[#FDE047] to-[#F59E0B] opacity-40 animate-float-slow"
        style={{ animationDelay: '3.2s', animationDuration: '7.2s' }}
      />
      {/* Petal 4 */}
      <div 
        className="absolute top-[68%] right-[5%] w-4 h-4 rounded-[50%_50%_0_50%] bg-gradient-to-br from-[#E11D48] to-[#BE185D] opacity-25 animate-float-slow"
        style={{ animationDelay: '2.4s', animationDuration: '11s' }}
      />
      {/* Petal 5 */}
      <div 
        className="absolute top-[88%] left-[12%] w-3 h-3 rounded-[0_50%_50%_0] bg-gradient-to-br from-[#F59E0B] to-[#B45309] opacity-30 animate-float-slow"
        style={{ animationDelay: '4.1s', animationDuration: '8.8s' }}
      />
      {/* Diya Light Glow at Corners */}
      <div className="absolute top-10 left-10 w-48 h-48 rounded-full bg-[#F59E0B]/10 blur-3xl" />
      <div className="absolute top-24 right-10 w-56 h-56 rounded-full bg-[#800020]/10 blur-3xl" />
    </div>
  );
};

// Royal Indian Decorative Card Frame Corner
export const CornerOrnament: React.FC<{ position?: 'tl' | 'tr' | 'bl' | 'br'; className?: string }> = ({
  position = 'tl',
  className = 'w-8 h-8 text-[#D4AF37]',
}) => {
  const rotation = {
    tl: '',
    tr: 'rotate-90',
    br: 'rotate-180',
    bl: '-rotate-90',
  }[position];

  return (
    <svg 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`${className} ${rotation}`}
      aria-hidden="true"
    >
      <path d="M4 36V12C4 7.58 7.58 4 12 4H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 36V16C10 12.68 12.68 10 16 10H36" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
      <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
};
