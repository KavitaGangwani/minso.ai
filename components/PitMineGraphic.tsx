// Open-pit mine cross-section illustration from reference design
export default function PitMineGraphic() {
  return (
    <svg
      viewBox="0 0 600 320"
      role="img"
      aria-label="Cross-section of an open-pit mine with a haul truck on the lowest bench"
    >
      {/* Background panel */}
      <rect width="600" height="320" fill="var(--panel)" />
      {/* Rock layers */}
      <rect y="130" width="600" height="60" fill="var(--rock2)" />
      <rect y="190" width="600" height="50" fill="var(--rock3)" />
      <rect y="240" width="600" height="40" fill="var(--rock4)" />
      <rect y="280" width="600" height="40" fill="#4C555E" />
      {/* Amber haul road seam */}
      <path d="M0 268L600 200L600 218L0 286z" fill="var(--amber)" />
      {/* Pit benches cut-out */}
      <polygon
        points="60,130 130,130 130,160 170,160 170,190 210,190 210,220 250,220 250,250 350,250 350,220 390,220 390,190 430,190 430,160 470,160 470,130 540,130 540,129 60,129"
        fill="var(--panel)"
      />
      {/* Pit bench contour line */}
      <polyline
        points="60,130 130,130 130,160 170,160 170,190 210,190 210,220 250,220 250,250 350,250 350,220 390,220 390,190 430,190 430,160 470,160 470,130 540,130"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="3"
      />
      {/* Haul truck */}
      <rect x="278" y="234" width="34" height="12" fill="var(--ink)" />
      <path d="M312 234h12l6 8v4h-18z" fill="var(--amber)" />
      <circle cx="286" cy="248" r="5" fill="#000" />
      <circle cx="320" cy="248" r="5" fill="#000" />
      {/* Survey / elevation lines */}
      <path
        d="M562 130v-46h30M562 98h30"
        stroke="var(--mute)"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}
