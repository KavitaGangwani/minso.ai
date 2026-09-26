import AdminSidebar from '@/components/AdminSidebar';

// Admin dashboard layout containing sidebar and main container
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="adm">
      <AdminSidebar />
      <main className="am">{children}</main>
    </div>
  );
}
