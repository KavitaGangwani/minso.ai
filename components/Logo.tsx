import Link from 'next/link';

// Logo component with the yellow hard-hat SVG icon and MINSO.AI text
export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <Link href="/" className="logo">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        {/* Hard hat dome */}
        <path d="M4 22a12 12 0 0 1 24 0z" fill="#FFB81C" />
        {/* Hard hat brim */}
        <rect x="2" y="22" width="28" height="4" rx="1.5" fill="#FFB81C" />
        {/* Hard hat center rib */}
        <rect x="14" y="7" width="4" height="15" fill="#1A1300" opacity=".55" />
      </svg>
      MINSO.AI
    </Link>
  );
}
