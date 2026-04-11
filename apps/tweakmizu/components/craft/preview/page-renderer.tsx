'use client';

import type { Page, Section, Entity } from '@/lib/craft/app-schema';
import type { DesignLanguageProfile } from '@/lib/craft/profile';
import { generateRows, type MockRow } from '@/lib/craft/mock-data';

interface PageRendererProps {
  page: Page;
  profile: DesignLanguageProfile;
}

/**
 * Renders a single page from the profile's composition tree. Every section
 * kind maps to a small purpose-built component that only uses mizu CSS
 * variables — no actual @aspect/react imports — so the preview stays fast,
 * isolated, and styleable entirely through tokens.
 */
export function PageRenderer({ page, profile }: PageRendererProps) {
  return (
    <div className="craft-preview-page">
      {page.composition.header ? (
        <header className="craft-preview-page__header">
          <div>
            <h1 className="craft-preview-page__title">{page.composition.header.title}</h1>
            {page.composition.header.description ? (
              <p className="craft-preview-page__desc">{page.composition.header.description}</p>
            ) : null}
          </div>
          {page.composition.header.actions.length > 0 ? (
            <div className="craft-preview-page__actions">
              {page.composition.header.actions.map((a, i) => (
                <button
                  key={`${a.label}-${i}`}
                  type="button"
                  className="craft-preview-btn"
                  data-variant={a.variant}
                >
                  {a.label}
                </button>
              ))}
            </div>
          ) : null}
        </header>
      ) : null}
      <div className="craft-preview-page__sections">
        {page.composition.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} profile={profile} />
        ))}
      </div>
    </div>
  );
}

function SectionRenderer({
  section,
  profile,
}: {
  section: Section;
  profile: DesignLanguageProfile;
}) {
  switch (section.kind) {
    case 'kpi-row':
      return <KpiRow section={section} />;
    case 'table':
      return <TableSection section={section} profile={profile} />;
    case 'activity-list':
      return <ActivityList />;
    case 'form':
    case 'settings-form':
      return <FormSection />;
    case 'detail-card':
      return <DetailCard section={section} />;
    case 'empty-state':
      return <EmptyState section={section} />;
    case 'text':
      return (
        <section className="craft-preview-section craft-preview-section--text">
          {section.title ? <h2 className="craft-preview-section__title">{section.title}</h2> : null}
          {section.body ? <p>{section.body}</p> : null}
        </section>
      );
    case 'wizard':
      return <WizardSection />;
    default:
      return null;
  }
}

function KpiRow({ section }: { section: Section }) {
  const kpis = section.kpis ?? [];
  return (
    <section className="craft-preview-section craft-preview-section--kpis">
      {kpis.map((k, i) => (
        <div key={`${k.label}-${i}`} className="craft-preview-kpi">
          <div className="craft-preview-kpi__label">{k.label}</div>
          <div className="craft-preview-kpi__value">{k.value}</div>
          {k.delta ? <div className="craft-preview-kpi__delta">{k.delta}</div> : null}
        </div>
      ))}
    </section>
  );
}

function TableSection({ section, profile }: { section: Section; profile: DesignLanguageProfile }) {
  const entity: Entity | undefined = profile.app.entities.find((e) => e.id === section.entityId);
  if (!entity) {
    return (
      <section className="craft-preview-section craft-preview-section--empty">
        <p className="craft-preview-empty">
          No entity bound to this table. Define one to see it populate.
        </p>
      </section>
    );
  }
  const columns = (section.columnIds ?? entity.fields.map((f) => f.id))
    .map((cid) => entity.fields.find((f) => f.id === cid))
    .filter((f): f is (typeof entity.fields)[number] => !!f);
  const rows: MockRow[] = generateRows(entity, 8);
  return (
    <section className="craft-preview-section craft-preview-section--table">
      {section.title ? <h2 className="craft-preview-section__title">{section.title}</h2> : null}
      <div className="craft-preview-table">
        <div
          className="craft-preview-table__head"
          style={{
            gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
          }}
        >
          {columns.map((c) => (
            <div key={c.id} className="craft-preview-table__th">
              {c.label}
            </div>
          ))}
        </div>
        <div className="craft-preview-table__body">
          {rows.map((row) => (
            <div
              key={row.id}
              className="craft-preview-table__row"
              style={{
                gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
              }}
            >
              {columns.map((c) => (
                <div key={c.id} className="craft-preview-table__td">
                  {c.type === 'badge' ? (
                    <span className="craft-preview-badge" data-tone={toneForBadge(row[c.id])}>
                      {row[c.id]}
                    </span>
                  ) : (
                    <span>{row[c.id]}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function toneForBadge(value: string): 'success' | 'warning' | 'danger' | 'neutral' {
  const v = value.toLowerCase();
  if (v === 'active' || v === 'paid' || v === 'approved') return 'success';
  if (v === 'pending' || v === 'sent' || v === 'dormant') return 'warning';
  if (v === 'overdue' || v === 'rejected' || v === 'disputed') return 'danger';
  return 'neutral';
}

function ActivityList() {
  const items = [
    { label: 'Stripe payout received', time: '2h ago', delta: '+$6,200.00' },
    { label: 'New customer added', time: '4h ago', delta: '' },
    { label: 'Invoice INV-0412 sent', time: '5h ago', delta: '$9,600.00' },
    { label: 'Office rent paid', time: 'yesterday', delta: '−$2,400.00' },
  ];
  return (
    <section className="craft-preview-section craft-preview-section--activity">
      <h2 className="craft-preview-section__title">Recent activity</h2>
      <div className="craft-preview-activity">
        {items.map((it, i) => (
          <div key={i} className="craft-preview-activity__item">
            <span className="craft-preview-activity__label">{it.label}</span>
            <span className="craft-preview-activity__time">{it.time}</span>
            <span className="craft-preview-activity__delta">{it.delta}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FormSection() {
  return (
    <section className="craft-preview-section craft-preview-section--form">
      <div className="craft-preview-form">
        <label className="craft-preview-field">
          <span className="craft-preview-field__label">Full name</span>
          <input className="craft-preview-input" defaultValue="Ada Lovelace" />
        </label>
        <label className="craft-preview-field">
          <span className="craft-preview-field__label">Email</span>
          <input type="email" className="craft-preview-input" defaultValue="ada@example.com" />
        </label>
        <label className="craft-preview-field">
          <span className="craft-preview-field__label">Role</span>
          <select className="craft-preview-input" defaultValue="owner">
            <option value="owner">Owner</option>
            <option value="admin">Administrator</option>
            <option value="member">Team member</option>
          </select>
        </label>
        <div className="craft-preview-form__actions">
          <button type="button" className="craft-preview-btn" data-variant="ghost">
            Cancel
          </button>
          <button type="button" className="craft-preview-btn" data-variant="primary">
            Save
          </button>
        </div>
      </div>
    </section>
  );
}

function DetailCard({ section }: { section: Section }) {
  return (
    <section className="craft-preview-section craft-preview-section--detail">
      <div className="craft-preview-card">
        <h2 className="craft-preview-card__title">{section.title ?? 'Detail card'}</h2>
        <p className="craft-preview-card__body">
          {section.body ??
            'Detail content goes here. The AI will fill this in based on the entity bound to this section.'}
        </p>
      </div>
    </section>
  );
}

function EmptyState({ section }: { section: Section }) {
  return (
    <section className="craft-preview-section craft-preview-section--empty-state">
      <div className="craft-preview-empty-state">
        <div className="craft-preview-empty-state__icon">◇</div>
        <h2 className="craft-preview-empty-state__title">{section.title ?? 'Nothing here yet'}</h2>
        <p className="craft-preview-empty-state__body">
          {section.body ?? 'Get started by creating your first item.'}
        </p>
        <button type="button" className="craft-preview-btn" data-variant="primary">
          Create
        </button>
      </div>
    </section>
  );
}

function WizardSection() {
  return (
    <section className="craft-preview-section craft-preview-section--wizard">
      <div className="craft-preview-wizard">
        <div className="craft-preview-wizard__steps">
          {['Details', 'Team', 'Billing', 'Review'].map((s, i) => (
            <div
              key={s}
              className="craft-preview-wizard__step"
              data-active={i === 1 || undefined}
              data-done={i === 0 || undefined}
            >
              <span className="craft-preview-wizard__step-num">{i + 1}</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
        <div className="craft-preview-wizard__body">
          <p>Step 2 of 4 — add your team members.</p>
        </div>
      </div>
    </section>
  );
}
