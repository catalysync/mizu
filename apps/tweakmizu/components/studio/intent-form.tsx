'use client';

import { getIndustry, industries } from '@/lib/studio/industries';
import { tones } from '@/lib/studio/tones';
import { intentSpecSchema, type Industry, type IntentSpec, type Tone } from '@/types/studio';
import { cn } from '@/utils/cn';
import { Button, Grid, Inline, Input, Stack, Textarea } from '@aspect/react';
import { Sparkles } from 'lucide-react';
import { useState, type FormEvent } from 'react';

interface Props {
  onSubmit?: (spec: IntentSpec) => void;
}

export function IntentForm({ onSubmit }: Props) {
  const [industry, setIndustry] = useState<Industry>('cloud');
  const [tone, setTone] = useState<Tone>('technical');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [refinement, setRefinement] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedIndustry = getIndustry(industry);
  const locked = selectedIndustry?.tier === 'pro';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const raw: IntentSpec = {
      productName: productName.trim(),
      description: description.trim(),
      industry,
      stack: 'next-app-router',
      tone,
      density: 'default',
      pages: selectedIndustry?.defaultPages ?? [],
      refinement: refinement.trim() || undefined,
    };

    const result = intentSpecSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join('.');
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit?.(result.data);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Studio intent form">
      <Stack gap="2rem">
        <Stack as="fieldset" gap="0.75rem">
          <legend className="text-foreground text-sm font-semibold">Industry</legend>
          <Grid gap="0.75rem" min="16rem">
            {industries.map((item) => {
              const active = item.id === industry;
              const isPro = item.tier === 'pro';
              const inputId = `industry-${item.id}`;
              return (
                <label
                  key={item.id}
                  htmlFor={inputId}
                  aria-label={item.label}
                  className={cn(
                    'cursor-pointer rounded-lg border p-4 transition-colors',
                    active
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-border-strong',
                  )}
                >
                  <Stack gap="0.25rem" align="start">
                    <input
                      id={inputId}
                      type="radio"
                      name="industry"
                      value={item.id}
                      checked={active}
                      onChange={() => setIndustry(item.id)}
                      className="sr-only"
                    />
                    <Inline
                      gap="0.5rem"
                      align="center"
                      style={{ justifyContent: 'space-between', width: '100%' }}
                    >
                      <span className="text-foreground text-sm font-semibold">{item.label}</span>
                      {isPro ? (
                        <span className="bg-muted text-muted-foreground rounded-sm px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase">
                          Pro
                        </span>
                      ) : null}
                    </Inline>
                    <span className="text-muted-foreground text-xs">{item.description}</span>
                  </Stack>
                </label>
              );
            })}
          </Grid>
          {locked ? (
            <p className="text-muted-foreground text-xs" role="status">
              {selectedIndustry?.label} is a Pro industry. You can still submit, but generation will
              fall back to a free industry until Pro is wired up.
            </p>
          ) : null}
        </Stack>

        <Grid gap="1.5rem" min="18rem">
          <Input
            label="Product name"
            value={productName}
            onChange={(event) => setProductName(event.target.value)}
            placeholder="my-cloud-dashboard"
            required
            error={errors.productName}
            maxLength={80}
          />
          <Input
            label="One-sentence description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Heroku-style PaaS for deploying Next.js apps"
            required
            error={errors.description}
            maxLength={240}
          />
        </Grid>

        <Stack as="fieldset" gap="0.75rem">
          <legend className="text-foreground text-sm font-semibold">Tone</legend>
          <Grid gap="0.5rem" min="14rem">
            {tones.map((item) => {
              const active = item.id === tone;
              const inputId = `tone-${item.id}`;
              return (
                <label
                  key={item.id}
                  htmlFor={inputId}
                  aria-label={item.label}
                  className={cn(
                    'cursor-pointer rounded-lg border p-3 transition-colors',
                    active
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-border-strong',
                  )}
                >
                  <Stack gap="0.125rem" align="start">
                    <input
                      id={inputId}
                      type="radio"
                      name="tone"
                      value={item.id}
                      checked={active}
                      onChange={() => setTone(item.id)}
                      className="sr-only"
                    />
                    <span className="text-foreground text-sm font-semibold">{item.label}</span>
                    <span className="text-muted-foreground text-xs">{item.description}</span>
                  </Stack>
                </label>
              );
            })}
          </Grid>
        </Stack>

        <Stack gap="0.5rem">
          <label htmlFor="refinement" className="text-foreground text-sm font-semibold">
            Extra constraints <span className="text-muted-foreground">(optional)</span>
          </label>
          <Textarea
            id="refinement"
            rows={3}
            value={refinement}
            onChange={(event) => setRefinement(event.target.value)}
            placeholder="e.g. no purple accents, sidebar expanded by default, include a dark mode toggle"
            maxLength={500}
          />
        </Stack>

        <Inline gap="0.75rem" align="center">
          <Button type="submit" variant="primary" size="lg">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate project
          </Button>
          <span className="text-muted-foreground text-xs">
            Composer wiring is live — the form creates a plan and navigates to the project view.
          </span>
        </Inline>
      </Stack>
    </form>
  );
}
