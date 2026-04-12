'use client';

import './preview-dock.css';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Monitor, Smartphone, Tablet, ExternalLink, Maximize2 } from 'lucide-react';
import { useCraftStore } from '@/store/craft-store';

type DeviceSize = 'mobile' | 'tablet' | 'desktop';

const DEVICE_WIDTHS: Record<DeviceSize, string> = {
  mobile: '390px',
  tablet: '768px',
  desktop: '100%',
};

export function PreviewDock() {
  const pages = useCraftStore((s) => s.profile.app?.pages ?? []);
  const [currentPage, setCurrentPage] = useState(pages[0]?.path ?? '/');
  const [device, setDevice] = useState<DeviceSize>('desktop');

  // Guard: if pages shrink (e.g. user removed some), snap back
  const activePath = useMemo(() => {
    if (pages.some((p) => p.path === currentPage)) return currentPage;
    return pages[0]?.path ?? '/';
  }, [pages, currentPage]);

  const src = '/preview' + (activePath === '/' ? '' : activePath);

  return (
    <div className="craft-dock">
      <div className="craft-dock__toolbar">
        <select
          className="craft-dock__page-select"
          value={activePath}
          onChange={(e) => setCurrentPage(e.target.value)}
          aria-label="Select preview page"
        >
          {pages.map((p) => (
            <option key={p.id} value={p.path}>
              {p.title}
            </option>
          ))}
        </select>
        <div className="craft-dock__spacer" />
        <div className="craft-dock__devices" role="group" aria-label="Preview device size">
          <button
            type="button"
            data-active={device === 'mobile' || undefined}
            onClick={() => setDevice('mobile')}
            aria-label="Mobile preview"
          >
            <Smartphone size={14} />
          </button>
          <button
            type="button"
            data-active={device === 'tablet' || undefined}
            onClick={() => setDevice('tablet')}
            aria-label="Tablet preview"
          >
            <Tablet size={14} />
          </button>
          <button
            type="button"
            data-active={device === 'desktop' || undefined}
            onClick={() => setDevice('desktop')}
            aria-label="Desktop preview"
          >
            <Monitor size={14} />
          </button>
        </div>
        <Link
          href={`/preview${activePath === '/' ? '' : activePath}`}
          target="_blank"
          className="craft-dock__open"
          aria-label="Open preview in new tab"
        >
          <ExternalLink size={14} />
        </Link>
      </div>
      <div
        className="craft-dock__viewport"
        data-device={device}
        style={{ '--craft-dock-width': DEVICE_WIDTHS[device] } as React.CSSProperties}
      >
        <iframe title="Live preview" src={src} className="craft-dock__frame" />
      </div>
    </div>
  );
}
