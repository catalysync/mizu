'use client';

import { archetypes } from '@/lib/craft/archetypes';
import { profileToCss } from '@/lib/craft/profile-to-css';
import { useCraftStore } from '@/store/craft-store';
import { Badge, Button } from '@aspect/react';
import { ArrowRight, Lock, Shuffle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import './archetype-picker.css';
import { useIsPro } from './craft-pro-context';

interface ArchetypePickerProps {
  /** Override navigation after picking an archetype. If omitted, routes to /craft/foundation. */
  onAfterPick?: () => void;
}

export function ArchetypePicker({ onAfterPick }: ArchetypePickerProps = {}) {
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
    if (onAfterPick) {
      onAfterPick();
    } else {
      router.push('/craft/foundation');
    }
  };

  // Shuffle: pick a random archetype (respecting Pro gate)
  const handleShuffle = useCallback(() => {
    const available = archetypes.filter((a) => !a.pro || isPro);
    const current = available.findIndex((a) => a.id === currentArchetype);
    let next = Math.floor(Math.random() * available.length);
    if (next === current && available.length > 1) next = (next + 1) % available.length;
    pickArchetype(available[next].id);
  }, [isPro, currentArchetype, pickArchetype]);

  // Keyboard shortcut: R to shuffle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === 'r' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        handleShuffle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleShuffle]);

  return (
    <div className="craft-archetypes">
      <header className="craft-archetypes__header">
        <div className="craft-archetypes__header-row">
          <h1 className="craft-archetypes__title">Start from an archetype</h1>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleShuffle}
            aria-label="Shuffle archetype (R)"
          >
            <Shuffle size={14} />
            Shuffle
            <kbd className="craft-archetypes__kbd">R</kbd>
          </Button>
        </div>
        <p className="craft-archetypes__lede">
          Each archetype is a starting <strong>design language</strong> — a complete set of choices
          for hue, shape, density, type, motion, voice, and more. Pick the closest one, then tweak
          every knob. Or press <kbd>R</kbd> to shuffle randomly.
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
  const f = archetype.profile.foundation;
  const t = archetype.profile.type;
  return (
    <div className="craft-archetypes__swatch" style={styleObj}>
      {/* Mini app shell */}
      <div className="craft-archetypes__mini-shell">
        {/* Mini sidebar */}
        <div className="craft-archetypes__mini-sidebar">
          <div className="craft-archetypes__mini-logo" />
          <div className="craft-archetypes__mini-nav-item" data-active />
          <div className="craft-archetypes__mini-nav-item" />
          <div className="craft-archetypes__mini-nav-item" />
        </div>
        {/* Mini content */}
        <div className="craft-archetypes__mini-content">
          <div className="craft-archetypes__mini-header">
            <div className="craft-archetypes__mini-heading" />
            <div className="craft-archetypes__mini-btn" />
          </div>
          {/* Mini KPI row */}
          <div className="craft-archetypes__mini-kpis">
            <div className="craft-archetypes__mini-kpi" />
            <div className="craft-archetypes__mini-kpi" />
            <div className="craft-archetypes__mini-kpi" />
          </div>
          {/* Mini table */}
          <div className="craft-archetypes__mini-table">
            <div className="craft-archetypes__mini-row" />
            <div className="craft-archetypes__mini-row" />
            <div className="craft-archetypes__mini-row" />
          </div>
        </div>
      </div>
      {/* Token hints */}
      <div className="craft-archetypes__swatch-meta">
        <span
          style={{
            fontFamily: `"${t.sansFamily}", system-ui, sans-serif`,
            fontSize: '0.625rem',
          }}
        >
          {t.sansFamily}
        </span>
        <span
          className="craft-archetypes__swatch-hue"
          style={{ background: `hsl(${f.brandHue} 60% 48%)` }}
        />
      </div>
    </div>
  );
}
