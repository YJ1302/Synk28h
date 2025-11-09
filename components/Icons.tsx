import React from 'react';

export const LogoIcon = ({ className }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className || ''}`}>
    <svg 
      viewBox="0 0 40 40" 
      className="h-8 w-8" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M30 10C30 15.5228 25.5228 20 20 20C14.4772 20 10 15.5228 10 10" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round"/>
      <path d="M10 30C10 24.4772 14.4772 20 20 20C25.5228 20 30 24.4772 30 30" stroke="#F97316" strokeWidth="5" strokeLinecap="round"/>
    </svg>
    <span className="text-2xl font-bold text-brand-title tracking-tight">Synk</span>
  </div>
);

export const AnimatedLogoIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 40 40" 
    className={className || "h-24 w-24"} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <style>{`
      .synk-logo-top-arc {
        transform-origin: 20px 20px;
        animation: synk-swing-in-top 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }
      .synk-logo-bottom-arc {
        transform-origin: 20px 20px;
        animation: synk-swing-in-bottom 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s forwards;
        opacity: 0;
      }
      @keyframes synk-swing-in-top {
        from { transform: rotate(-180deg) scale(0.5); opacity: 0; }
        to { transform: rotate(0deg) scale(1); opacity: 1; }
      }
      @keyframes synk-swing-in-bottom {
        from { transform: rotate(180deg) scale(0.5); opacity: 0; }
        to { transform: rotate(0deg) scale(1); opacity: 1; }
      }
    `}</style>
    <path className="synk-logo-top-arc" d="M30 10C30 15.5228 25.5228 20 20 20C14.4772 20 10 15.5228 10 10" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round"/>
    <path className="synk-logo-bottom-arc" d="M10 30C10 24.4772 14.4772 20 20 20C25.5228 20 30 24.4772 30 30" stroke="#F97316" strokeWidth="5" strokeLinecap="round"/>
  </svg>
);

export const SynkIcon = ({ className }: { className?: string }) => (
    <svg 
      viewBox="0 0 40 40" 
      className={className || "h-6 w-6"} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M30 10C30 15.5228 25.5228 20 20 20C14.4772 20 10 15.5228 10 10" stroke="#3B82F6" strokeWidth="5" strokeLinecap="round"/>
      <path d="M10 30C10 24.4772 14.4772 20 20 20C25.5228 20 30 24.4772 30 30" stroke="#F97316" strokeWidth="5" strokeLinecap="round"/>
    </svg>
);

export const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const PracticeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export const ConnectIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export const LockIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

export const SparklesIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m10-16l-3 3m5 0l-3-3m3 3l-3 3M19 17l3 3m-5 0l3-3m-3 3l-3-3" />
    </svg>
);

export const PhoneIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

export const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
);

export const WorkshopIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export const EmergencyIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

export const HeartHandIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const MedicalCrossIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

export const ShieldIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.606 11.955 11.955 0 019 2.606 12.02 12.02 0 00-2.382-9.016z" />
  </svg>
);

export const PoliceBadgeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const FireIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014A8.003 8.003 0 0121 10.986C21 15.207 17.657 18.657 17.657 18.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.343 17.657a8 8 0 010-11.314" />
  </svg>
);


export const Avatar1 = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 120" className={className || "w-16 h-16"} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="60" fill="#FBCFE8"/>
    <g transform="translate(10 5)">
      <path d="M32 100 C 40 40, 95 45, 95 90 C 95 105, 80 105, 32 100 Z" fill="#BE185D" />
      <path d="M40 95 C 40 60, 65 50, 75 60 C 90 75, 80 100, 40 95 Z" fill="#FCE7F3" />
      <path d="M35 80 C 25 50, 60 30, 80 50 C 75 30, 50 35, 35 80 Z" fill="#9D174D" />
      <path d="M58 73 C 62 70, 68 70, 72 73" stroke="#831843" strokeWidth="4" strokeLinecap="round" />
      <path d="M55 84 Q 62 88, 69 84" stroke="#831843" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

export const Avatar2 = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 120" className={className || "w-16 h-16"} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="60" fill="#A5F3FC"/>
    <g transform="translate(0 5)">
      <path d="M35 45 C 40 25, 80 25, 85 45 L 85 60 Q 80 65, 60 65 Q 40 65, 35 60 Z" fill="#0891B2" />
      <circle cx="60" cy="70" r="35" fill="#ECFEFF"/>
      <circle cx="48" cy="68" r="8" fill="#CFFAFE" />
      <circle cx="48" cy="68" r="4" fill="#0E7490" />
      <circle cx="72" cy="68" r="8" fill="#CFFAFE" />
      <circle cx="72" cy="68" r="4" fill="#0E7490" />
      <path d="M45 85 C 55 95, 65 95, 75 85" stroke="#0E7490" strokeWidth="5" strokeLinecap="round" fill="none" />
    </g>
  </svg>
);

export const Avatar3 = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 120" className={className || "w-16 h-16"} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="60" fill="#E9D5FF"/>
    <g transform="translate(0 -5)">
      <rect x="30" y="40" width="60" height="60" rx="10" fill="#F3E8FF"/>
      <path d="M30 50 L 30 30 L 90 30 L 90 50" stroke="#5B21B6" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="42" y="70" fontFamily="monospace" fontSize="18" fill="#6D28D9" fontWeight="bold">10</text>
      <text x="68" y="70" fontFamily="monospace" fontSize="18" fill="#6D28D9" fontWeight="bold">01</text>
      <line x1="45" y1="85" x2="75" y2="85" stroke="#6D28D9" strokeWidth="5" strokeLinecap="round"/>
    </g>
  </svg>
);

export const Avatar4 = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 120 120" className={className || "w-16 h-16"} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="60" fill="#D1FAE5"/>
    <g transform="translate(0 5)">
      <path d="M35 60 C 35 30, 85 30, 85 60" stroke="#064E3B" strokeWidth="8" strokeLinecap="round" fill="none"/>
      <rect x="27" y="55" width="16" height="25" rx="8" fill="#065F46"/>
      <rect x="77" y="55" width="16" height="25" rx="8" fill="#065F46"/>
      <circle cx="60" cy="70" r="30" fill="#ECFDF5"/>
      <path d="M48 70 C 50 67, 54 67, 56 70" stroke="#065F46" strokeWidth="4" strokeLinecap="round"/>
      <path d="M64 70 C 66 67, 70 67, 72 70" stroke="#065F46" strokeWidth="4" strokeLinecap="round"/>
      <path d="M50 82 Q 60 88, 70 82" stroke="#065F46" strokeWidth="4" strokeLinecap="round" fill="none"/>
    </g>
  </svg>
);