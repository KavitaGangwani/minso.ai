import AdminSidebar from '@/components/AdminSidebar';
import '@/app/home.css';

// Admin dashboard layout containing sidebar and main container with ambient glowing background
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="adm-root">
      {/* ── Ambient glowing orbs & dot grid (matching homepage and chat theme) ── */}
      <div className="orb adm-scene-orb1" aria-hidden="true" />
      <div className="orb adm-scene-orb2" aria-hidden="true" />
      <div className="hero-grid adm-scene-grid" aria-hidden="true" />
      <div className="adm-scene-fade-top" aria-hidden="true" />

      {/* ── Dashboard shell: Glass sidebar + main content ── */}
      <div className="adm-shell">
        <AdminSidebar />
        <main className="am">{children}</main>
      </div>
    </div>
  );
}
