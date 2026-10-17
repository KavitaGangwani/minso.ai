import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import SignInForm from '@/components/SignInForm';
import HeroPit from '@/components/HeroPit';
import '@/app/home.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Sign In – MINSO.AI',
  description: 'Sign in to the MINSO.AI admin console.',
};

export default async function AdminSignInPage() {
  const isAuthenticated = await getSession();

  if (isAuthenticated) {
    redirect('/admin/agents');
  }

  return (
    <div className="signin-page-root">
      {/* ── Animated pit mine scene ── */}
      <div className="signin-scene" aria-hidden="true">
        <HeroPit />
      </div>

      {/* ── Ambient orbs ── */}
      <div className="orb signin-scene-orb1" aria-hidden="true" />
      <div className="orb signin-scene-orb2" aria-hidden="true" />

      {/* ── Grid overlay ── */}
      <div className="hero-grid signin-scene-grid" aria-hidden="true" />

      {/* ── Gradient fades (top and bottom) ── */}
      <div className="signin-scene-fade-top"   aria-hidden="true" />
      <div className="signin-scene-fade-bottom" aria-hidden="true" />

      {/* ── Sign-in form ── */}
      <SignInForm />
    </div>
  );
}
