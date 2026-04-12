'use client';

import './preview-dock.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Monitor, Smartphone, Tablet, ExternalLink, Maximize2, X, Sun, Moon } from 'lucide-react';
import { useCraftStore } from '@/store/craft-store';

type DeviceSize = 'mobile' | 'tablet' | 'desktop';

const DEVICE_WIDTHS: Record<DeviceSize, string> = {
  mobile: '390px',
  tablet: '768px',
  desktop: '100%',
};

// The iframe always loads /preview once. Page switching happens via the store
// + BroadcastChannel — no iframe navigation, no flash.
const IFRAME_SRC = '/preview';

export function PreviewDock() {
  const pages = useCraftStore((s) => s.profile.app?.pages ?? []);
  const previewPath = useCraftStore((s) => s.previewPath);
  const setPreviewPath = useCraftStore((s) => s.setPreviewPath);
  const previewDark = useCraftStore((s) => s.previewDark);
  const setPreviewDark = useCraftStore((s) => s.setPreviewDark);
  const [device, setDevice] = useState<DeviceSize>('desktop');
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Default to first page if current previewPath doesn't match any page
  const activePath = pages.some((p) => p.path === previewPath)
    ? previewPath
    : (pages[0]?.path ?? '/');

  const handlePageChange = useCallback(
    (path: string) => {
      setPreviewPath(path);
    },
    [setPreviewPath],
  );

  const openFullscreen = useCallback(() => {
    dialogRef.current?.showModal();
  }, []);

  const closeFullscreen = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  // Close on backdrop click
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClick = (e: MouseEvent) => {
      if (e.target === dialog) dialog.close();
    };
    dialog.addEventListener('click', handleClick);
    return () => dialog.removeEventListener('click', handleClick);
  }, []);

  const deviceButtons = (
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
  );

  const pageSelect = (
    <select
      className="craft-dock__page-select"
      value={activePath}
      onChange={(e) => handlePageChange(e.target.value)}
      aria-label="Select preview page"
    >
      {pages.map((p) => (
        <option key={p.id} value={p.path}>
          {p.title}
        </option>
      ))}
    </select>
  );

  return (
    <>
      <div className="craft-dock">
        <div className="craft-dock__toolbar">
          {pageSelect}
          <div className="craft-dock__spacer" />
          {deviceButtons}
          <button
            type="button"
            className="craft-dock__open"
            onClick={() => setPreviewDark(!previewDark)}
            aria-label={previewDark ? 'Preview light mode' : 'Preview dark mode'}
            title={previewDark ? 'Switch preview to light' : 'Switch preview to dark'}
          >
            {previewDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            type="button"
            className="craft-dock__open"
            onClick={openFullscreen}
            aria-label="Fullscreen preview"
          >
            <Maximize2 size={14} />
          </button>
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
          <iframe title="Live preview" src={IFRAME_SRC} className="craft-dock__frame" />
        </div>
      </div>

      {/* Fullscreen dialog — native <dialog> so it doesn't break page layout */}
      <dialog ref={dialogRef} className="craft-dock__dialog">
        <div className="craft-dock__dialog-inner">
          <div className="craft-dock__toolbar">
            {pageSelect}
            <div className="craft-dock__spacer" />
            {deviceButtons}
            <button
              type="button"
              className="craft-dock__open"
              onClick={closeFullscreen}
              aria-label="Close fullscreen preview"
            >
              <X size={14} />
            </button>
          </div>
          <div
            className="craft-dock__viewport craft-dock__viewport--fullscreen"
            data-device={device}
            style={{ '--craft-dock-width': DEVICE_WIDTHS[device] } as React.CSSProperties}
          >
            <iframe
              title="Live preview (fullscreen)"
              src={IFRAME_SRC}
              className="craft-dock__frame"
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
