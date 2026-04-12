'use client';

import './export-panel.css';
import { useState } from 'react';
import { Download, FileJson, FileCode, Globe, Package } from 'lucide-react';
import { Badge } from '@aspect/react';
import { useCraftStore } from '@/store/craft-store';
import { exportProfile, type ExportFormat } from '@/lib/craft/exporter';

interface FormatOption {
  id: ExportFormat;
  label: string;
  description: string;
  icon: React.ReactNode;
  pro: boolean;
}

const FORMATS: FormatOption[] = [
  {
    id: 'json',
    label: 'mizu.language.json',
    description:
      'The full profile — tokens, identity, pages, entities. Import into any mizu project.',
    icon: <FileJson size={20} />,
    pro: false,
  },
  {
    id: 'css',
    label: 'theme.css',
    description: 'Pure CSS with --mizu-* variable overrides. Drop into any project.',
    icon: <FileCode size={20} />,
    pro: false,
  },
  {
    id: 'tailwind',
    label: 'Tailwind v4 @theme',
    description: 'A @theme block mapping your tokens to Tailwind utilities.',
    icon: <FileCode size={20} />,
    pro: false,
  },
  {
    id: 'html-demo',
    label: 'Single-page HTML demo',
    description: 'A self-contained HTML file showing your DS in action. Share it with anyone.',
    icon: <Globe size={20} />,
    pro: false,
  },
];

export function ExportPanel() {
  const profile = useCraftStore((s) => s.profile);
  const [selected, setSelected] = useState<Set<ExportFormat>>(new Set(['json', 'css']));
  const [downloaded, setDownloaded] = useState(false);

  const toggle = (id: ExportFormat) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleExport = () => {
    const formats = Array.from(selected);
    const files = exportProfile(profile, formats);

    if (files.length === 1) {
      downloadFile(files[0].path, files[0].content);
    } else {
      import('jszip').then(({ default: JSZip }) => {
        const zip = new JSZip();
        for (const f of files) zip.file(f.path, f.content);
        zip.generateAsync({ type: 'blob' }).then((blob) => {
          downloadBlob(`${profile.name.replace(/\s+/g, '-').toLowerCase()}.zip`, blob);
        });
      });
    }
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="craft-export">
      <header className="craft-export__header">
        <Badge tone="neutral">Ship</Badge>
        <h1 className="craft-export__title">Export your design system</h1>
        <p className="craft-export__lede">
          Pick the formats you need. Free tier exports tokens, CSS, and a standalone HTML demo. Pro
          tier adds a full Next.js monorepo, GitHub push, and shareable live links.
        </p>
      </header>

      <div className="craft-export__formats">
        {FORMATS.map((fmt) => (
          <button
            key={fmt.id}
            type="button"
            className="craft-export__format"
            data-active={selected.has(fmt.id) || undefined}
            data-pro={fmt.pro || undefined}
            onClick={() => toggle(fmt.id)}
            disabled={fmt.pro}
          >
            <span className="craft-export__format-icon">{fmt.icon}</span>
            <span className="craft-export__format-body">
              <span className="craft-export__format-label">
                {fmt.label}
                {fmt.pro ? <Badge tone="warning">Pro</Badge> : null}
              </span>
              <span className="craft-export__format-desc">{fmt.description}</span>
            </span>
            <span className="craft-export__format-check">{selected.has(fmt.id) ? '✓' : ''}</span>
          </button>
        ))}

        <button type="button" className="craft-export__format" data-pro disabled>
          <span className="craft-export__format-icon">
            <Package size={20} />
          </span>
          <span className="craft-export__format-body">
            <span className="craft-export__format-label">
              Full Next.js monorepo <Badge tone="warning">Pro</Badge>
            </span>
            <span className="craft-export__format-desc">
              Complete monorepo with packages/tokens, packages/css, packages/react, apps/docs,
              apps/storybook — all pre-configured with your design language.
            </span>
          </span>
        </button>
      </div>

      <div className="craft-export__actions">
        <button
          type="button"
          className="craft-export__download-btn"
          onClick={handleExport}
          disabled={selected.size === 0}
        >
          <Download size={16} />
          {downloaded
            ? 'Downloaded!'
            : `Export ${selected.size} file${selected.size !== 1 ? 's' : ''}`}
        </button>
      </div>

      <section className="craft-export__summary">
        <h2 className="craft-export__summary-title">Profile summary</h2>
        <dl className="craft-export__summary-dl">
          <dt>Name</dt>
          <dd>{profile.name}</dd>
          <dt>Archetype</dt>
          <dd>{profile.archetype ?? 'custom'}</dd>
          <dt>Domain</dt>
          <dd>{profile.app.identity.domain}</dd>
          <dt>Pages</dt>
          <dd>{profile.app.pages.length}</dd>
          <dt>Entities</dt>
          <dd>{profile.app.entities.length}</dd>
          <dt>Components</dt>
          <dd>{profile.app.components.length}</dd>
        </dl>
      </section>
    </div>
  );
}

function downloadFile(name: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  downloadBlob(name, blob);
}

function downloadBlob(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
