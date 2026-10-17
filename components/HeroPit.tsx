/**
 * HeroPit – animated 3D open-pit mine scene (inline SVG, no img src).
 * Copied from reference/minso-home-standalone.html.
 * All animation class names are defined in app/home.css.
 */
export default function HeroPit() {
  return (
    <svg
      viewBox="0 0 1440 1500"
      preserveAspectRatio="xMidYMin slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="haze" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" style={{ stopColor: 'var(--accent)' }} stopOpacity="0.38" />
          <stop offset="1" style={{ stopColor: 'var(--accent)' }} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="flood" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE9B0" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFE9B0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE9B0" stopOpacity="0.3" />
          <stop offset="1" stopColor="#FFE9B0" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="boom" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFF3D6" />
          <stop offset="0.35" style={{ stopColor: 'var(--accent)' }} />
          <stop offset="1" style={{ stopColor: 'var(--accent)' }} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="deep" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.75" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="cam">
        {/* Sky */}
        <rect y="250" width="1440" height="1300" fill="#0A0B0F" />
        <ellipse cx="720" cy="250" rx="760" ry="190" fill="url(#haze)" />
        {/* Horizon ridge */}
        <path d="M0 262 L190 196 L370 242 L600 176 L820 232 L1040 184 L1240 236 L1440 200 V340 H0Z" fill="#0E0F15" />
        {/* Stars */}
        <g fill="#F4F1EC">
          <circle className="twinkle" cx="180"  cy="90"  r="1.5" opacity="0.6" />
          <circle className="twinkle" cx="420"  cy="140" r="1.2" opacity="0.5" />
          <circle className="twinkle" cx="980"  cy="70"  r="1.6" opacity="0.6" />
          <circle className="twinkle" cx="1240" cy="150" r="1.3" opacity="0.5" />
          <circle className="twinkle" cx="760"  cy="40"  r="1.2" opacity="0.5" />
        </g>

        {/* Terraced benches */}
        <g strokeWidth="1.6" style={{ stroke: 'var(--accent)' }} strokeOpacity="0.28">
          <ellipse cx="720" cy="500" rx="760" ry="228"   fill="#1B1E27" />
          <ellipse cx="720" cy="534" rx="675" ry="202.5" fill="#181B23" />
          <ellipse cx="720" cy="568" rx="590" ry="177"   fill="#15171F" />
          <ellipse cx="720" cy="602" rx="505" ry="151.5" fill="#12141B" />
          <ellipse cx="720" cy="636" rx="420" ry="126"   fill="#101118" />
          <ellipse cx="720" cy="670" rx="335" ry="100.5" fill="#0D0E14" />
          <ellipse cx="720" cy="704" rx="250" ry="75"    fill="#0B0C11" />
          <ellipse cx="720" cy="738" rx="165" ry="49.5"  fill="#08090C" />
        </g>
        <ellipse cx="720" cy="740" rx="260" ry="90" fill="url(#deep)" />

        {/* Haul roads – animated dashes circling each bench */}
        <g fill="none" stroke="#F4F1EC" strokeOpacity="0.16" strokeWidth="2">
          <ellipse className="road"  cx="720" cy="517" rx="718" ry="215.4" />
          <ellipse className="roadr" cx="720" cy="551" rx="633" ry="189.9" />
          <ellipse className="road"  cx="720" cy="585" rx="548" ry="164.4" />
          <ellipse className="roadr" cx="720" cy="619" rx="463" ry="138.9" />
          <ellipse className="road"  cx="720" cy="653" rx="378" ry="113.4" />
          <ellipse className="roadr" cx="720" cy="687" rx="293" ry="87.9" />
          <ellipse className="road"  cx="720" cy="721" rx="208" ry="62.4" />
        </g>

        {/* Haul trucks on benches */}
        <g>
          <animateMotion dur="52s" repeatCount="indefinite"
            path="M1353 551 A633 189.9 0 1 1 87 551 A633 189.9 0 1 1 1353 551" />
          <rect x="-12" y="-5"  width="17" height="10" rx="2" style={{ fill: 'var(--accent)' }} />
          <rect x="4"   y="-4"  width="9"  height="8"  rx="2" style={{ fill: 'var(--accent-2)' }} />
          <circle cx="14" cy="0" r="2" fill="#FFF3D6" />
        </g>
        <g>
          <animateMotion dur="40s" repeatCount="indefinite"
            path="M1183 619 A463 138.9 0 1 0 257 619 A463 138.9 0 1 0 1183 619" />
          <rect x="-12" y="-5" width="17" height="10" rx="2" style={{ fill: 'var(--accent)' }} />
          <rect x="4"   y="-4" width="9"  height="8"  rx="2" style={{ fill: 'var(--accent-2)' }} />
          <circle cx="14" cy="0" r="2" fill="#FFF3D6" />
        </g>
        <g>
          <animateMotion dur="40s" begin="-20s" repeatCount="indefinite"
            path="M1183 619 A463 138.9 0 1 0 257 619 A463 138.9 0 1 0 1183 619" />
          <rect x="-12" y="-5" width="17" height="10" rx="2" style={{ fill: 'var(--accent)' }} />
          <rect x="4"   y="-4" width="9"  height="8"  rx="2" style={{ fill: 'var(--accent-2)' }} />
          <circle cx="14" cy="0" r="2" fill="#FFF3D6" />
        </g>
        <g>
          <animateMotion dur="28s" repeatCount="indefinite"
            path="M1013 687 A293 87.9 0 1 1 427 687 A293 87.9 0 1 1 1013 687" />
          <rect x="-12" y="-5" width="17" height="10" rx="2" style={{ fill: 'var(--accent)' }} />
          <rect x="4"   y="-4" width="9"  height="8"  rx="2" style={{ fill: 'var(--accent-2)' }} />
          <circle cx="14" cy="0" r="2" fill="#FFF3D6" />
        </g>
        <g>
          <animateMotion dur="20s" repeatCount="indefinite"
            path="M928 721 A208 62.4 0 1 0 512 721 A208 62.4 0 1 0 928 721" />
          <rect x="-12" y="-5" width="17" height="10" rx="2" style={{ fill: 'var(--accent)' }} />
          <rect x="4"   y="-4" width="9"  height="8"  rx="2" style={{ fill: 'var(--accent-2)' }} />
          <circle cx="14" cy="0" r="2" fill="#FFF3D6" />
        </g>

        {/* Pit floor – excavator */}
        <g>
          <rect x="664" y="740" width="52" height="9" rx="4" fill="#050507" stroke="#6B7085" strokeWidth="1" />
          <rect x="672" y="724" width="32" height="16" rx="3" style={{ fill: 'var(--accent-2)' }} />
          <g className="arm">
            <path d="M690 738 L726 714 L744 724" fill="none" style={{ stroke: 'var(--accent)' }} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M740 719 L752 726 L744 734 L736 727Z" style={{ fill: 'var(--accent)' }} />
          </g>
        </g>
        <circle className="dust"  cx="750" cy="738" r="9" fill="#9AA0B5" opacity="0.4" />
        <circle className="dust2" cx="770" cy="742" r="8" fill="#9AA0B5" opacity="0.4" />
        <circle className="blast" cx="640" cy="722" r="34" fill="url(#boom)" />

        {/* Floodlight towers */}
        <path d="M150 440 V396" stroke="#4A4F63" strokeWidth="3" />
        <polygon className="beam" points="150,402 250,560 90,580" fill="url(#cone)" />
        <circle cx="150" cy="394" r="22" fill="url(#flood)" />
        <circle cx="150" cy="394" r="3.5" fill="#FFF3D6" />

        <path d="M1290 440 V396" stroke="#4A4F63" strokeWidth="3" />
        <polygon className="beam" points="1290,402 1190,560 1350,580" fill="url(#cone)" />
        <circle cx="1290" cy="394" r="22" fill="url(#flood)" />
        <circle cx="1290" cy="394" r="3.5" fill="#FFF3D6" />
      </g>
    </svg>
  );
}
