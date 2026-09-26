// Strata rock layer vector artwork for agent cards
export default function StrataGraphic() {
  return (
    <svg className="art" viewBox="0 0 290 92" preserveAspectRatio="none" aria-hidden="true">
      <rect width="290" height="92" fill="var(--rock1)" />
      <rect y="30" width="290" height="20" fill="var(--rock2)" />
      <rect y="50" width="290" height="20" fill="var(--rock3)" />
      <rect y="70" width="290" height="22" fill="var(--rock4)" />
      <path d="M0 86L290 44" stroke="var(--amber)" strokeWidth="6" />
      <polyline
        points="20,30 60,30 60,42 90,42 90,54 200,54 200,42 230,42 230,30 270,30"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2.5"
      />
    </svg>
  );
}
