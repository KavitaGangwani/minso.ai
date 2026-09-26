export default function AgentIllustration({ type }: { type?: string }) {
  const norm = (type || '').toLowerCase();

  if (norm.includes('law') || norm.includes('legal') || norm.includes('rajasthan')) {
    // Law / Legal / Rajasthan Illustration (Map outline + scales + legal document)
    return (
      <svg
        viewBox="0 0 260 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="agent-card-svg"
        aria-hidden="true"
      >
        {/* Subtle map boundary background */}
        <path
          d="M30 40 L60 20 L95 30 L115 55 L90 85 L50 90 L25 70 Z"
          stroke="#FFB81C"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          opacity="0.4"
        />
        {/* Pin marker on map */}
        <circle cx="70" cy="50" r="3" fill="#FFB81C" />
        <line x1="70" y1="50" x2="130" y2="50" stroke="#FFB81C" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />

        {/* Central Document */}
        <rect x="130" y="22" width="50" height="66" rx="2" stroke="#FFB81C" strokeWidth="1.8" fill="#16191C" />
        <line x1="140" y1="36" x2="170" y2="36" stroke="#FFB81C" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="140" y1="46" x2="166" y2="46" stroke="#FFB81C" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="140" y1="56" x2="170" y2="56" stroke="#FFB81C" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="140" y1="66" x2="158" y2="66" stroke="#FFB81C" strokeWidth="1.5" strokeLinecap="round" />

        {/* Scales of Justice */}
        <path d="M205 32 V78 M192 78 H218" stroke="#FFB81C" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M190 44 H220" stroke="#FFB81C" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M190 44 L184 58 H196 Z" stroke="#FFB81C" strokeWidth="1.4" fill="none" />
        <path d="M220 44 L214 58 H226 Z" stroke="#FFB81C" strokeWidth="1.4" fill="none" />
      </svg>
    );
  }

  if (norm.includes('safety') || norm.includes('sop') || norm.includes('hazard')) {
    // Safety SOP Illustration (Hard hat + Shield / Checklist)
    return (
      <svg
        viewBox="0 0 260 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="agent-card-svg"
        aria-hidden="true"
      >
        {/* Hard Hat */}
        <path
          d="M80 64 C80 40 100 24 125 24 C150 24 170 40 170 64 Z"
          stroke="#FFB81C"
          strokeWidth="2"
          fill="#16191C"
        />
        <path d="M68 64 H182 C184 64 186 66 184 68 L180 72 H70 L66 68 C64 66 66 64 68 64 Z" stroke="#FFB81C" strokeWidth="2" fill="#FFB81C" fillOpacity="0.15" />
        <rect x="120" y="24" width="10" height="24" rx="1" stroke="#FFB81C" strokeWidth="1.5" fill="#FFB81C" />

        {/* Safety checklist card on right */}
        <rect x="188" y="32" width="42" height="52" rx="2" stroke="#FFB81C" strokeWidth="1.5" fill="#16191C" />
        <circle cx="198" cy="46" r="3" stroke="#FFB81C" strokeWidth="1.2" />
        <line x1="206" y1="46" x2="220" y2="46" stroke="#FFB81C" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="198" cy="58" r="3" stroke="#FFB81C" strokeWidth="1.2" />
        <line x1="206" y1="58" x2="220" y2="58" stroke="#FFB81C" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="198" cy="70" r="3" stroke="#FFB81C" strokeWidth="1.2" />
        <line x1="206" y1="70" x2="216" y2="70" stroke="#FFB81C" strokeWidth="1.2" strokeLinecap="round" />

        {/* Ambient sensor lines */}
        <path d="M46 44 Q56 34 66 44" stroke="#FFB81C" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        <path d="M40 38 Q56 24 72 38" stroke="#FFB81C" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      </svg>
    );
  }

  if (norm.includes('operat') || norm.includes('haul') || norm.includes('truck') || norm.includes('fleet')) {
    // Operations / Haul Truck Illustration
    return (
      <svg
        viewBox="0 0 260 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="agent-card-svg"
        aria-hidden="true"
      >
        {/* Haul Truck Body */}
        <path
          d="M80 40 L120 40 L126 52 L170 52 L176 68 L176 78 L74 78 L74 60 Z"
          stroke="#FFB81C"
          strokeWidth="2"
          fill="#16191C"
        />
        {/* Cab */}
        <rect x="145" y="56" width="22" height="14" rx="1" stroke="#FFB81C" strokeWidth="1.5" />
        <line x1="156" y1="56" x2="156" y2="70" stroke="#FFB81C" strokeWidth="1.2" />
        {/* Wheels */}
        <circle cx="95" cy="80" r="12" stroke="#FFB81C" strokeWidth="2.2" fill="#1D2125" />
        <circle cx="95" cy="80" r="5" fill="#FFB81C" />
        <circle cx="155" cy="80" r="12" stroke="#FFB81C" strokeWidth="2.2" fill="#1D2125" />
        <circle cx="155" cy="80" r="5" fill="#FFB81C" />

        {/* Bench strata lines */}
        <line x1="30" y1="92" x2="230" y2="92" stroke="#2A2F35" strokeWidth="2" />
        <path d="M40 92 L60 76 L70 76" stroke="#FFB81C" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
      </svg>
    );
  }

  // Default: Mining Documentation Assistant Illustration
  return (
    <svg
      viewBox="0 0 260 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="agent-card-svg"
      aria-hidden="true"
    >
      {/* Background document stacked */}
      <rect x="90" y="24" width="56" height="66" rx="2" stroke="#2A2F35" strokeWidth="1.5" fill="#16191C" />
      {/* Foreground primary document */}
      <rect x="105" y="16" width="60" height="74" rx="2" stroke="#FFB81C" strokeWidth="2" fill="#1D2125" />
      <line x1="120" y1="32" x2="152" y2="32" stroke="#FFB81C" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="120" y1="44" x2="152" y2="44" stroke="#FFB81C" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="120" y1="56" x2="142" y2="56" stroke="#FFB81C" strokeWidth="1.8" strokeLinecap="round" />

      {/* Verified Stamp / Checkmark Badge */}
      <circle cx="170" cy="74" r="14" stroke="#FFB81C" strokeWidth="2" fill="#16191C" />
      <path d="M164 74 L168 78 L177 69" stroke="#FFB81C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
