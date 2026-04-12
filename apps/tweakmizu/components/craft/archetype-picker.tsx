'use client';

import './archetype-picker.css';
import { useRouter } from 'next/navigation';
import { Button } from '@aspect/react';
import { ArrowRight, Lock, Sparkles } from 'lucide-react';
import { Badge } from '@aspect/react';
import { archetypes } from '@/lib/craft/archetypes';
import { useCraftStore } from '@/store/craft-store';
import { profileToCss } from '@/lib/craft/profile-to-css';
import { useIsPro } from './craft-pro-context';

export function ArchetypePicker() {
  const router = useRouter();
  const pickArchetype = useCraftStore((s) => s.pickArchetype);
  const currentArchetype = useCraftStore((s) => s.profile.archetype);

  const isPro = useIsPro();

  const handlePick = (id: string) => {
    const arch = archetypes.find((a) => a.id === id);
    if (arch?.pro && !isPro) {
      router.push('/pricing');
      return;
    }
    pickArchetype(id);
    router.push('/craft/foundation');
  };

  return (
    <div className="craft-archetypes">
      <header className="craft-archetypes__header">
        <h1 className="craft-archetypes__title">Start from an archetype</h1>
        <p className="craft-archetypes__lede">
          Each archetype is a starting <strong>design language</strong> — a complete set of choices
          for hue, shape, density, type, motion, voice, and more. Pick the closest one, then tweak
          every knob. Or start from the mizu sample and build yours from scratch.
        </p>
      </header>

      <div className="craft-archetypes__grid">
        {archetypes.map((arch) => (
          <article
            key={arch.id}
            className="craft-archetypes__card"
            data-active={currentArchetype === arch.id || undefined}
          >
            <ArchetypeSwatch archetype={arch} />
            <div className="craft-archetypes__card-body">
              <div className="craft-archetypes__card-head">
                <h2 className="craft-archetypes__card-title">
                  {arch.name}
                  {arch.pro ? <Badge tone="warning">Pro</Badge> : null}
                </h2>
                <span className="craft-archetypes__card-tagline">{arch.tagline}</span>
              </div>
              <p className="craft-archetypes__card-desc">{arch.description}</p>
              <p className="craft-archetypes__card-inspired">Inspired by {arch.inspiredBy}</p>
              <Button
                size="sm"
                variant={
                  arch.pro && !isPro
                    ? 'secondary'
                    : currentArchetype === arch.id
                      ? 'ghost'
                      : 'primary'
                }
                onClick={() => handlePick(arch.id)}
              >
                {arch.pro && !isPro ? (
                  <>
                    <Lock size={14} />
                    Unlock with Pro
                  </>
                ) : currentArchetype === arch.id ? (
                  <>
                    Current · continue <ArrowRight size={14} />
                  </>
                ) : (
                  <>
                    Start here <ArrowRight size={14} />
                  </>
                )}
              </Button>
            </div>
          </article>
        ))}
      </div>

      <aside className="craft-archetypes__prompt">
        <Sparkles size={18} className="craft-archetypes__prompt-icon" />
        <div className="craft-archetypes__prompt-body">
          <h3 className="craft-archetypes__prompt-title">Or describe what you want in words</h3>
          <p className="craft-archetypes__prompt-desc">
            Tell the AI what you&apos;re building — &ldquo;a confident enterprise finance tool that
            doesn&apos;t feel like tax software&rdquo; — and it drafts the whole profile with
            explanations for each knob choice.
          </p>
          <Button variant="secondary" size="sm" onClick={() => router.push('/craft/prompt')}>
            Open prompt panel
          </Button>
        </div>
      </aside>
    </div>
  );
}

function ArchetypeSwatch({ archetype }: { archetype: (typeof archetypes)[number] }) {
  const vars = profileToCss(archetype.profile);
  const styleObj = vars as unknown as React.CSSProperties;
  return (
    <div className="craft-archetypes__swatch" style={styleObj}>
      <div className="craft-archetypes__swatch-row">
        <span className="craft-archetypes__swatch-chip craft-archetypes__swatch-chip--primary" />
        <span className="craft-archetypes__swatch-chip craft-archetypes__swatch-chip--success" />
        <span className="craft-archetypes__swatch-chip craft-archetypes__swatch-chip--warning" />
        <span className="craft-archetypes__swatch-chip craft-archetypes__swatch-chip--danger" />
      </div>
      <div className="craft-archetypes__swatch-mock">
        <div className="craft-archetypes__swatch-btn craft-archetypes__swatch-btn--primary">
          Save
        </div>
        <div className="craft-archetypes__swatch-btn craft-archetypes__swatch-btn--ghost">
          Cancel
        </div>
      </div>
    </div>
  );
}
