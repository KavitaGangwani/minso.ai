'use client';

import { useState, useTransition } from 'react';
import { saveInstructionsAction } from '@/lib/admin-actions';

interface AgentInstructionsFormProps {
  agentId: string;
  initialInstructions: string;
}

// Form to edit and save agent prompt instructions
export default function AgentInstructionsForm({
  agentId,
  initialInstructions,
}: AgentInstructionsFormProps) {
  const [instructions, setInstructions] = useState(initialInstructions);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await saveInstructionsAction(agentId, instructions);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  };

  return (
    <div className="box">
      <h3>Instructions</h3>
      <textarea
        aria-label="Instructions"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        rows={4}
      />
      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          className="btn"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? 'Saving...' : 'Save'}
        </button>
        {saved && <span style={{ color: 'var(--ok)', fontSize: '14px' }}>Saved!</span>}
      </div>
    </div>
  );
}
