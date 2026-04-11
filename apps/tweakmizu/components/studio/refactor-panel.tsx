'use client';

import { useState, type FormEvent } from 'react';
import { Button, Inline, Stack, Textarea } from '@aspect/react';
import { Check, Sparkles, X } from 'lucide-react';

interface Props {
  path: string;
  contents: string;
  substrate: Record<string, unknown>;
  onClose: () => void;
}

export function RefactorPanel({ path, contents, substrate, onClose }: Props) {
  const [instruction, setInstruction] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!instruction.trim()) return;

    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/studio/refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, contents, instruction: instruction.trim(), substrate }),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(`Refactor failed: ${text}`);
        return;
      }

      const data = (await response.json()) as { ok: boolean; contents?: string; error?: string };
      if (!data.ok || !data.contents) {
        setError(data.error ?? 'Refactor failed');
        return;
      }
      setResult(data.contents);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
  };

  return (
    <Stack gap="0.75rem" className="rounded-lg border border-border bg-muted/30 p-4">
      <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
        <Inline gap="0.5rem" align="center">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Refactor with AI</span>
          <code className="text-xs text-muted-foreground">{path}</code>
        </Inline>
        <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <X className="h-4 w-4" />
        </Button>
      </Inline>

      <form onSubmit={handleSubmit}>
        <Stack gap="0.5rem">
          <Textarea
            rows={3}
            value={instruction}
            onChange={(event) => setInstruction(event.target.value)}
            placeholder="e.g. swap the inline status badge for a separate StatusPill column, extract the card into its own component"
            maxLength={1000}
            aria-label="Refactor instruction"
          />
          <Inline gap="0.5rem" align="center">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={busy}
              disabled={!instruction.trim()}
            >
              Rewrite file
            </Button>
            {error ? <span className="text-sm text-danger">{error}</span> : null}
          </Inline>
        </Stack>
      </form>

      {result ? (
        <Stack gap="0.5rem">
          <Inline gap="0.5rem" align="center" style={{ justifyContent: 'space-between' }}>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Proposed rewrite
            </span>
            <Button type="button" variant="ghost" size="sm" onClick={handleCopy}>
              <Check className="mr-1 h-4 w-4" />
              Copy
            </Button>
          </Inline>
          <pre className="max-h-[360px] overflow-auto rounded-md bg-background p-3 text-xs leading-relaxed text-foreground">
            {result}
          </pre>
        </Stack>
      ) : null}
    </Stack>
  );
}
