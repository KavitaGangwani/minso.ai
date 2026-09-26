import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import SignInForm from '@/components/SignInForm';

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

  return <SignInForm />;
}
