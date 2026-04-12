'use client';

import './settings.css';
import Link from 'next/link';
import { ArrowLeft, Check, X, Sparkles, Trash2, AlertTriangle } from 'lucide-react';
import { Badge, Button } from '@aspect/react';
import { ThemeToggle } from '@/components/theme-toggle';

interface Profile {
  id: string;
  name: string;
  archetype: string | null;
  domain: string | null;
  isPublic: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

interface SettingsPageProps {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  };
  plan: {
    isPro: boolean;
    currentPeriodEnd: Date | null;
  };
  aiLimit: number;
  profiles: Profile[];
}

const FREE_LIMITS = [
  { label: '10 design language knobs', included: true },
  { label: '6 archetype presets', included: true },
  { label: 'JSON, CSS, Tailwind v4, HTML export', included: true },
  { label: '5 AI messages per hour', included: true },
  { label: 'Pro archetypes + domain packs', included: false },
  { label: 'Next.js starter export', included: false },
  { label: 'Unlimited AI messages', included: false },
];

const PRO_LIMITS = [
  { label: 'All design language knobs', included: true },
  { label: '14 archetype presets (6 free + 8 Pro)', included: true },
  { label: 'All export formats + Next.js starter', included: true },
  { label: 'Unlimited AI messages', included: true },
  { label: '5 domain packs (finance, healthcare, dev-tools, commerce, HR)', included: true },
  { label: 'Push to GitHub (coming soon)', included: true },
];

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function SettingsPage({ user, plan, aiLimit, profiles }: SettingsPageProps) {
  return (
    <div className="settings-layout">
      <header className="settings-layout__header">
        <Link href="/craft" className="settings-layout__back">
          <ArrowLeft size={14} />
          Back to craft
        </Link>
        <span className="settings-layout__title">Settings</span>
        <div className="settings-layout__spacer" />
        <ThemeToggle size="sm" />
      </header>

      <main className="settings-layout__main">
        <div className="settings-page">
          <div>
            <h1 className="settings-page__heading">Settings</h1>
            <p className="settings-page__subheading">
              Manage your account, subscription, and saved work.
            </p>
          </div>

          {/* Profile section */}
          <section className="settings-section">
            <h2 className="settings-section__title">Profile</h2>
            <div className="settings-section__body">
              <div className="settings-field">
                <span className="settings-field__label">Name</span>
                <span className="settings-field__value">{user.name}</span>
              </div>
              <div className="settings-field">
                <span className="settings-field__label">Email</span>
                <span className="settings-field__value">{user.email}</span>
              </div>
              <div className="settings-field">
                <span className="settings-field__label">Member since</span>
                <span className="settings-field__value">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </section>

          {/* Plan section */}
          <section className="settings-section">
            <h2 className="settings-section__title">Plan</h2>
            <div className={`settings-plan${plan.isPro ? ' settings-plan--pro' : ''}`}>
              <div className="settings-plan__header">
                <span className="settings-plan__name">{plan.isPro ? 'Pro' : 'Free'}</span>
                <Badge tone={plan.isPro ? 'success' : 'neutral'}>
                  {plan.isPro ? 'Active' : 'Current plan'}
                </Badge>
              </div>

              <p className="settings-plan__desc">
                {plan.isPro
                  ? 'You have full access to all craft features, Pro archetypes, domain packs, and unlimited AI messages.'
                  : 'You have access to the core editor, 6 archetype presets, and 5 AI messages per hour. Upgrade to unlock everything.'}
              </p>

              <div className="settings-plan__limits">
                {(plan.isPro ? PRO_LIMITS : FREE_LIMITS).map((item) => (
                  <div key={item.label} className="settings-plan__limit-row">
                    {item.included ? (
                      <Check
                        size={14}
                        className="settings-plan__limit-icon settings-plan__limit-icon--included"
                        aria-label="Included"
                      />
                    ) : (
                      <X
                        size={14}
                        className="settings-plan__limit-icon settings-plan__limit-icon--excluded"
                        aria-label="Not included"
                      />
                    )}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              {plan.isPro && plan.currentPeriodEnd ? (
                <p className="settings-plan__renewal">
                  Renews on {formatDate(plan.currentPeriodEnd)}
                </p>
              ) : null}

              <div className="settings-plan__actions">
                {plan.isPro ? (
                  <Button asChild variant="secondary" size="sm">
                    <Link href="/pricing">Manage subscription</Link>
                  </Button>
                ) : (
                  <Button asChild variant="primary" size="sm">
                    <Link href="/pricing">
                      <Sparkles size={14} />
                      <span style={{ marginInlineStart: '0.375rem' }}>Upgrade to Pro</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </section>

          {/* Usage section */}
          <section className="settings-section">
            <h2 className="settings-section__title">Usage</h2>
            <div className="settings-section__body">
              <div className="settings-usage">
                <div className="settings-usage__row">
                  <span className="settings-usage__label">AI messages this hour</span>
                  <span className="settings-usage__value">
                    {plan.isPro ? 'Unlimited' : `— / ${aiLimit}`}
                  </span>
                </div>
                {!plan.isPro ? (
                  <div className="settings-usage__bar-track">
                    <div className="settings-usage__bar-fill" style={{ width: '0%' }} />
                  </div>
                ) : null}
                {!plan.isPro ? (
                  <p className="settings-usage__label">
                    Usage resets every hour. Upgrade to Pro for unlimited AI messages.
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          {/* Saved profiles */}
          <section className="settings-section">
            <h2 className="settings-section__title">Saved profiles ({profiles.length})</h2>
            <div className="settings-section__body">
              {profiles.length === 0 ? (
                <p className="settings-profiles__empty">
                  No saved profiles yet. Go to the craft editor and save your first design language.
                </p>
              ) : (
                <div className="settings-profiles__list">
                  {profiles.map((profile) => (
                    <div key={profile.id} className="settings-profiles__item">
                      <div className="settings-profiles__item-info">
                        <span className="settings-profiles__item-name">{profile.name}</span>
                        <span className="settings-profiles__item-meta">
                          {profile.archetype ? <span>{profile.archetype}</span> : null}
                          {profile.domain ? <span>{profile.domain}</span> : null}
                          <span>Updated {formatDate(profile.updatedAt)}</span>
                        </span>
                      </div>
                      <div className="settings-profiles__item-actions">
                        {profile.isPublic ? (
                          <Badge tone="info" size="sm">
                            Public
                          </Badge>
                        ) : null}
                        {profile.likes > 0 ? (
                          <Badge tone="neutral" size="sm">
                            {profile.likes} {profile.likes === 1 ? 'like' : 'likes'}
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Danger zone */}
          <section className="settings-section settings-section--danger">
            <h2 className="settings-section__title settings-section__title--danger">Danger zone</h2>
            <div className="settings-danger">
              <div className="settings-danger__header">
                <AlertTriangle size={16} className="settings-danger__icon" />
                <h3 className="settings-danger__title">Delete account</h3>
              </div>
              <p className="settings-danger__desc">
                Permanently delete your account, all saved profiles, and subscription data. This
                action cannot be undone.
              </p>
              <div>
                <Button variant="destructive" size="sm" disabled>
                  <Trash2 size={14} />
                  <span style={{ marginInlineStart: '0.375rem' }}>Delete account</span>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
