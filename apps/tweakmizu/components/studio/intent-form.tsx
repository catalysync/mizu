'use client';

import { Button, Input, Textarea } from '@aspect/react';
import { Sparkles } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { industries, getIndustry } from '@/lib/studio/industries';
import { tones } from '@/lib/studio/tones';
import { intentSpecSchema, type Industry, type IntentSpec, type Tone } from '@/types/studio';
import { cn } from '@/utils/cn';

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-8" aria-label="Studio intent form">
      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-semibold text-foreground">Industry</legend>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((item) => {
            const active = item.id === industry;
            const isPro = item.tier === 'pro';
            return (
              <label
                key={item.id}
                className={cn(
                  'flex cursor-pointer flex-col gap-1 rounded-lg border p-4 transition-colors',
                  active
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-border-strong',
                )}
              >
                <input
                  type="radio"
                  name="industry"
                  value={item.id}
                  checked={active}
                  onChange={() => setIndustry(item.id)}
                  className="sr-only"
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">{item.label}</span>
                  {isPro ? (
                    <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Pro
                    </span>
                  ) : null}
                </div>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </label>
            );
          })}
        </div>
        {locked ? (
          <p className="text-xs text-muted-foreground" role="status">
            {selectedIndustry?.label} is a Pro industry. You can still submit, but generation will
            fall back to a free industry until Pro is wired up.
          </p>
        ) : null}
      </fieldset>

      <div className="grid gap-6 md:grid-cols-2">
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
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-semibold text-foreground">Tone</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {tones.map((item) => {
            const active = item.id === tone;
            return (
              <label
                key={item.id}
                className={cn(
                  'flex cursor-pointer flex-col gap-0.5 rounded-lg border p-3 transition-colors',
                  active
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-border-strong',
                )}
              >
                <input
                  type="radio"
                  name="tone"
                  value={item.id}
                  checked={active}
                  onChange={() => setTone(item.id)}
                  className="sr-only"
                />
                <span className="text-sm font-semibold text-foreground">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="refinement" className="text-sm font-semibold text-foreground">
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
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary" size="lg">
          <Sparkles className="mr-2 h-4 w-4" />
          Generate project
        </Button>
        <span className="text-xs text-muted-foreground">
          Composer wiring lands in the next commit. For now the form validates and logs the spec.
        </span>
      </div>
    </form>
  );
}
