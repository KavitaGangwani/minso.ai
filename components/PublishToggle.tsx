'use client';

import { useState, useTransition } from 'react';
import { togglePublishAction } from '@/lib/admin-actions';

interface PublishToggleProps {
  agentId: string;
  initialPublished: boolean;
  onStatusChange?: (published: boolean) => void;
}

// Switch toggle component for publishing/unpublishing an agent
export default function PublishToggle({
  agentId,
  initialPublished,
  onStatusChange,
}: PublishToggleProps) {
  const [published, setPublished] = useState(initialPublished);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextState = e.target.checked;
    setPublished(nextState);
    if (onStatusChange) {
      onStatusChange(nextState);
    }

    startTransition(async () => {
      await togglePublishAction(agentId, nextState);
    });
  };

  return (
    <label className="sw" style={{ opacity: isPending ? 0.7 : 1 }}>
      <input
        type="checkbox"
        checked={published}
        onChange={handleChange}
        aria-label="Published"
        disabled={isPending}
      />
      <i />
    </label>
  );
}
