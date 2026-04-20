'use client';

import { useStudioStore } from '@/store/studio-store';
import type { ThemeStyleProps } from '@/types/theme';
import { Button, Inline, Stack, Textarea } from '@aspect/react';
import { Sparkles, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';

interface ProposedEdits {
  edits: Partial<ThemeStyleProps>;
  rationale: string;
}

export function CommandPalette() {
  const styles = useStudioStore((state) => state.studioState.styles);
  const setStyles = useStudioStore((state) => state.setStyles);

  const [open, setOpen] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proposed, setProposed] = useState<ProposedEdits | null>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((v) => !v);
      }
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!open) {
      setInstruction('');
      setError(null);
      setProposed(null);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!instruction.trim()) return;
    setBusy(true);
    setError(null);
    setProposed(null);
    try {
      const response = await fetch('/api/studio/edit-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instruction: instruction.trim(), styles }),
      });
      if (!response.ok) {
        const text = await response.text();
        setError(`Edit failed: ${text}`);
        return;
      }
      const data = (await response.json()) as {
        ok: boolean;
        edits?: Partial<ThemeStyleProps>;
        rationale?: string;
        error?: string;
      };
      if (!data.ok || !data.edits) {
        setError(data.error ?? 'Unknown error');
        return;
      }
      setProposed({ edits: data.edits, rationale: data.rationale ?? '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  };

  const handleApply = () => {
    if (!proposed) return;
    setStyles(proposed.edits);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="AI theme command palette"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '8rem',
        zIndex: 200,
      }}
    >
      <div
        style={{
          background: 'var(--mizu-surface-default)',
          borderRadius: 'var(--mizu-radius-lg)',
          border: '1px solid var(--mizu-border-default)',
          padding: '1.25rem',
          width: '100%',
          maxWidth: '32rem',
          boxShadow: 'var(--mizu-shadow-xl)',
        }}
      >
        <Stack gap="0.75rem">
          <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
            <Inline gap="0.375rem" align="center">
              <Sparkles className="text-primary h-4 w-4" />
              <span className="text-foreground text-sm font-semibold">Edit theme with AI</span>
            </Inline>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </Inline>

          <form onSubmit={handleSubmit}>
            <Stack gap="0.5rem">
              <Textarea
                rows={2}
                value={instruction}
                onChange={(event) => setInstruction(event.target.value)}
                placeholder="e.g. warmer palette, cornflower primary, softer radius"
                maxLength={500}
                aria-label="Theme edit instruction"
              />
              <Inline gap="0.5rem" align="center">
                <Button type="submit" variant="primary" size="sm" loading={busy}>
                  Propose edits
                </Button>
                <span className="text-muted-foreground text-xs">
                  Cmd+K to toggle · Esc to close
                </span>
              </Inline>
            </Stack>
          </form>

          {error ? (
            <p className="text-danger text-sm" role="alert">
              {error}
            </p>
          ) : null}

          {proposed ? (
            <Stack gap="0.5rem" className="border-border bg-muted/40 rounded-md border p-3">
              {proposed.rationale ? (
                <p className="text-muted-foreground text-xs">{proposed.rationale}</p>
              ) : null}
              <Stack as="ul" gap="0.25rem" className="list-none p-0 text-xs">
                {Object.entries(proposed.edits).map(([key, value]) => (
                  <li key={key} className="text-foreground font-mono">
                    <strong>{key}</strong>: <span className="text-muted-foreground">{value}</span>
                  </li>
                ))}
              </Stack>
              <Inline gap="0.5rem" align="center">
                <Button variant="primary" size="sm" onClick={handleApply}>
                  Apply {Object.keys(proposed.edits).length} edit
                  {Object.keys(proposed.edits).length === 1 ? '' : 's'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setProposed(null)}>
                  Dismiss
                </Button>
              </Inline>
            </Stack>
          ) : null}
        </Stack>
      </div>
    </div>
  );
}
