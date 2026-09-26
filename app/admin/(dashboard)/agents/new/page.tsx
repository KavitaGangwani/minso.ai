import { Metadata } from 'next';
import Link from 'next/link';
import CreateAgentForm from '@/components/CreateAgentForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'New Agent – MINSO.AI Admin',
  description: 'Create and configure a new mining AI agent.',
};

export default function NewAgentPage() {
  return (
    <>
      <p>
        <Link href="/admin/agents" style={{ color: 'var(--mute)' }}>
          ← Agents
        </Link>
      </p>
      <h2>New Agent</h2>
      <p className="sub">Create a new mining intelligence agent and assign its knowledge base.</p>

      <CreateAgentForm />
    </>
  );
}
