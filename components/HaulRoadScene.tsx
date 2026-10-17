/**
 * HaulRoadScene – night haul-road closing CTA background (inline SVG).
 * Copied from reference/minso-home-standalone.html.
 * Animations: haul (truck), cage (headframe lift), belt (conveyor), fall (ore), spinslow/spin (wheels).
 */
export default function HaulRoadScene() {
  return (
    <svg
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMax slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="ctaGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0"    style={{ stopColor: 'var(--accent)' }} stopOpacity="0.5" />
          <stop offset="0.55" style={{ stopColor: 'var(--accent-2)' }} stopOpacity="0.16" />
          <stop offset="1"    style={{ stopColor: 'var(--accent-2)' }} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ctaBeam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFE9B0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFE9B0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ctaCone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE9B0" stopOpacity="0.3" />
          <stop offset="1" stopColor="#FFE9B0" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ctaLamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE9B0" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FFE9B0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background glow */}
      <ellipse cx="600" cy="500" rx="660" ry="150" fill="url(#ctaGlow)" />

      {/* Ridge layers */}
      <path d="M0 470 L140 410 L300 450 L470 390 L640 440 L820 400 L1000 445 L1200 405 V700 H0Z" fill="#0F1117" />
      <polyline points="0,470 140,410 300,450 470,390 640,440 820,400 1000,445 1200,405"
        fill="none" strokeWidth="1.6" strokeOpacity="0.3" style={{ stroke: 'var(--accent)' }} />
      <path d="M0 545 L200 505 L380 538 L560 500 L760 534 L960 504 L1200 538 V700 H0Z" fill="#0B0C11" />

      {/* Ground + haul road */}
      <rect y="640" width="1200" height="60" fill="#08090C" />
      <rect y="640" width="1200" height="28" fill="#13151B" />
      <line className="roadr" x1="0" y1="654" x2="1200" y2="654"
        stroke="#F4F1EC" strokeOpacity="0.28" strokeWidth="2" style={{ strokeDasharray: '22 20' }} />

      {/* Shaft headframe */}
      <g strokeLinecap="round">
        <path d="M150 640 L178 430 M214 640 L186 430" stroke="#5A6075" strokeWidth="3" fill="none" />
        <path d="M150 640 L207 590 M214 640 L157 590 M157 590 L201 540 M207 590 L163 540 M163 540 L194 490 M201 540 L170 490 M170 490 L187 440 M194 490 L177 440"
          stroke="#4A4F63" strokeWidth="2" fill="none" />
        <line x1="181" y1="442" x2="181" y2="640" stroke="#6B7085" strokeWidth="1.5" />
        <line x1="197" y1="428" x2="285" y2="592" stroke="#6B7085" strokeWidth="2" />
      </g>
      {/* Moving cage */}
      <g className="cage">
        <rect x="175" y="610" width="12" height="18" rx="2" style={{ fill: 'var(--accent-2)' }} />
      </g>
      <rect x="172" y="414" width="20" height="12" rx="2" fill="#1B1D26" />
      <circle cx="182" cy="424" r="15" fill="none" strokeWidth="3" style={{ stroke: 'var(--accent)' }} />
      <g className="spinslow">
        <path d="M167 424 H197 M182 409 V439 M171.4 413.4 L192.6 434.6 M192.6 413.4 L171.4 434.6"
          stroke="#6B7085" strokeWidth="1.5" fill="none" />
      </g>
      <circle className="beam" cx="182" cy="404" r="3" style={{ fill: 'var(--accent-2)' }} />

      {/* Building */}
      <polygon points="276,592 317,574 358,592" fill="#1B1D26" />
      <rect x="280" y="592" width="74" height="48" rx="2" fill="#14161D" stroke="#fff" strokeOpacity="0.08" />
      <rect className="beam" x="292" y="606" width="16" height="12" style={{ fill: 'var(--accent)' }} opacity="0.85" />
      <rect className="beam" x="324" y="606" width="16" height="12" style={{ fill: 'var(--accent)' }} opacity="0.6" />

      {/* Crusher */}
      <polygon points="800,640 810,582 850,582 860,640" fill="#14161D" stroke="#fff" strokeOpacity="0.08" />
      <polygon points="788,558 872,558 850,584 810,584"
        fill="#1B1D26" strokeWidth="1.5" strokeOpacity="0.45" style={{ stroke: 'var(--accent)' }} />

      {/* Conveyor supports + belt */}
      <path d="M840 640 V620 M900 640 V600 M960 640 V560 M1020 640 V528" stroke="#3A3F52" strokeWidth="3" />
      <line x1="860" y1="598" x2="1034" y2="526" stroke="#1F222C" strokeWidth="12" strokeLinecap="round" />
      <line className="belt" x1="860" y1="593" x2="1034" y2="521" strokeWidth="3" style={{ stroke: 'var(--accent)' }} />

      {/* Stockpile */}
      <polygon points="946,640 1034,548 1122,640" fill="#1B1D26" />
      <polyline points="946,640 1034,548 1122,640"
        fill="none" strokeWidth="1.5" strokeOpacity="0.4" style={{ stroke: 'var(--accent)' }} />
      {/* Falling ore */}
      <g fill="#FFE9B0">
        <circle className="fall" cx="1034" cy="524" r="3" />
        <circle className="fall" cx="1030" cy="524" r="2.5" style={{ animationDelay: '-0.5s' }} />
        <circle className="fall" cx="1038" cy="524" r="2.5" style={{ animationDelay: '-0.95s' }} />
      </g>

      {/* Floodlight pole */}
      <path d="M760 640 V540" stroke="#4A4F63" strokeWidth="3" />
      <polygon className="beam" points="760,546 716,640 804,640" fill="url(#ctaCone)" />
      <circle cx="760" cy="538" r="20" fill="url(#ctaLamp)" />
      <circle cx="760" cy="538" r="3.5" fill="#FFF3D6" />

      {/* Dump truck – haul animation */}
      <g transform="translate(0,660)">
        <g className="haul">
          {/* Headlights beam */}
          <polygon points="148,-58 430,-22 430,-98" fill="url(#ctaBeam)" />
          {/* Exhaust dust */}
          <circle className="dustl" cx="8" cy="-10" r="11" fill="#9AA0B5" opacity="0.4" />
          <circle className="dustl" cx="2" cy="-6"  r="9"  fill="#9AA0B5" opacity="0.4" style={{ animationDelay: '-1.2s' }} />
          {/* Truck body */}
          <rect x="10" y="-52" width="132" height="10" rx="3" fill="#0B0B0E" />
          <polygon points="0,-52 6,-108 100,-96 104,-52" style={{ fill: 'var(--accent)' }} />
          <path d="M24 -52 L28 -104 M48 -52 L50 -102 M72 -52 L74 -99"
            stroke="#0B0B0E" strokeOpacity="0.28" strokeWidth="2" />
          {/* Load */}
          <polygon points="12,-106 26,-124 44,-120 56,-134 74,-124 90,-128 98,-96"
            fill="#1B1D26" strokeWidth="1.5" strokeOpacity="0.5" style={{ stroke: 'var(--accent)' }} />
          {/* Cab */}
          <polygon points="104,-52 104,-92 134,-92 146,-66 146,-52" style={{ fill: 'var(--accent-2)' }} />
          <polygon points="112,-86 130,-86 138,-70 112,-70" fill="#0B0B0E" opacity="0.7" />
          {/* Headlight */}
          <circle cx="146" cy="-58" r="3.5" fill="#FFF3D6" />
          {/* Wheels */}
          <circle cx="34"  cy="-22" r="22" fill="#050507" stroke="#6B7085" strokeWidth="3" />
          <g className="spin">
            <path d="M34 -36 V-8 M20 -22 H48" stroke="#6B7085" strokeWidth="3" fill="none" />
          </g>
          <circle cx="118" cy="-22" r="22" fill="#050507" stroke="#6B7085" strokeWidth="3" />
          <g className="spin">
            <path d="M118 -36 V-8 M104 -22 H132" stroke="#6B7085" strokeWidth="3" fill="none" />
          </g>
        </g>
      </g>
    </svg>
  );
}
