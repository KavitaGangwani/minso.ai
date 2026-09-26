import { Metadata } from 'next';
import ClientDashboardClient from '@/components/ClientDashboardClient';
import { getClientDeployments, getClientQueries } from '@/lib/clients';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Client Deployments & Embeds – MINSO.AI Admin',
  description: 'Manage client websites using MINSO agents, audit client queries, and inspect vector chunks.',
};

export default async function AdminClientsPage() {
  const clients = await getClientDeployments();
  const queries = await getClientQueries();

  return <ClientDashboardClient initialClients={clients} initialQueries={queries} />;
}
