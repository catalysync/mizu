'use client';

import type { Plan } from '@/lib/studio/composer';
import { Button, Inline, Stack, Textarea } from '@aspect/react';
import { Sparkles, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';

interface Props {
  plan: Plan;
  onRefined: (plan: Plan) => void;
  onClose: () => void;
}

export function RefineModal({ plan, onRefined, onClose }: Props) {
  const [refinement, setRefinement] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!refinement.trim()) return;

    setBusy(true);
    setError(null);

    try {
      const response = await fetch('/api/studio/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, refinement: refinement.trim() }),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(`Refine failed: ${text}`);
        return;
      }

      const data = (await response.json()) as {
        plan: Plan;
        source: 'claude' | 'unchanged';
        error?: string;
      };

      if (data.source === 'unchanged' && data.error) {
        setError(data.error);
        return;
      }

      onRefined(data.plan);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Refine project"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: 'var(--mizu-surface-default)',
          borderRadius: 'var(--mizu-radius-lg)',
          border: '1px solid var(--mizu-border-default)',
          padding: '1.5rem',
          width: '100%',
          maxWidth: '32rem',
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="1rem">
            <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
              <h2 className="text-foreground text-lg font-semibold">Refine with AI</h2>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </Inline>

            <p className="text-muted-foreground text-sm">
              Describe what you want to change. Claude will re-compose the plan, keeping everything
              that still makes sense.
            </p>

            <Textarea
              rows={4}
              value={refinement}
              onChange={(event) => setRefinement(event.target.value)}
              placeholder="e.g. swap the billing page for an admin settings page, add a team members table"
              maxLength={1000}
              aria-label="Refinement instructions"
            />

            {error ? (
              <p className="text-danger text-sm" role="alert">
                {error}
              </p>
            ) : null}

            <Inline gap="0.5rem" align="center">
              <Button type="submit" variant="primary" loading={busy} disabled={!refinement.trim()}>
                <Sparkles className="mr-2 h-4 w-4" />
                Refine plan
              </Button>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </Inline>
          </Stack>
        </form>
      </div>
    </div>
  );
}
