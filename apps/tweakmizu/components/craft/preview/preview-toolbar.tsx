'use client';

import './preview-toolbar.css';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Monitor, Smartphone, Tablet, Sparkles } from 'lucide-react';
import { useCraftStore } from '@/store/craft-store';

type DeviceSize = 'mobile' | 'tablet' | 'desktop';

export function PreviewToolbar() {
  const [device, setDevice] = useState<DeviceSize>('desktop');
  const profileName = useCraftStore((s) => s.profile.name);

  return (
    <>
      <div className="preview-toolbar">
        <Link href="/craft" className="preview-toolbar__back">
          <ArrowLeft size={14} />
          <span>Back to craft</span>
        </Link>
        <span className="preview-toolbar__name">{profileName}</span>
        <div className="preview-toolbar__spacer" />
        <div className="preview-toolbar__devices" role="group" aria-label="Preview viewport">
          <button
            type="button"
            data-active={device === 'mobile' || undefined}
            onClick={() => setDevice('mobile')}
            aria-label="Mobile"
          >
            <Smartphone size={14} />
          </button>
          <button
            type="button"
            data-active={device === 'tablet' || undefined}
            onClick={() => setDevice('tablet')}
            aria-label="Tablet"
          >
            <Tablet size={14} />
          </button>
          <button
            type="button"
            data-active={device === 'desktop' || undefined}
            onClick={() => setDevice('desktop')}
            aria-label="Desktop"
          >
            <Monitor size={14} />
          </button>
        </div>
        <Link href="/pricing" className="preview-toolbar__upgrade">
          <Sparkles size={12} />
          <span>Upgrade</span>
        </Link>
      </div>
      {device !== 'desktop' ? (
        <style>{`
          .craft-preview-root[data-mizu-preview] {
            max-width: ${device === 'mobile' ? '390px' : '768px'};
            margin: 0 auto;
            border-left: 1px solid #e2e8f0;
            border-right: 1px solid #e2e8f0;
            min-height: calc(100dvh - 3rem);
          }
        `}</style>
      ) : null}
    </>
  );
}
