import * as React from 'react';
import { mergeRefs } from '../utils/merge-refs';

// Only the attributes that decide which tokens and density apply. Portals mount under body, outside
// the subtree that carries them, so the overlay would otherwise fall back to the root theme.
const IDENTITY_ATTRIBUTES = ['data-mizu-identity', 'data-mizu-density', 'data-theme'] as const;

/**
 * Copies each identity attribute from the nearest ancestor of `from` that sets it onto `to`.
 * An attribute the caller already set on `to` wins, so an explicit prop is never overwritten.
 */
export function copyPortalIdentity(from: Element | null | undefined, to: Element | null): void {
  if (!from || !to) return;
  for (const attr of IDENTITY_ATTRIBUTES) {
    if (to.hasAttribute(attr)) continue;
    const owner = from.closest(`[${attr}]`);
    if (owner) to.setAttribute(attr, owner.getAttribute(attr) ?? '');
  }
}

/**
 * Hidden marker rendered where a portal is declared. Radix mounts the portal under body, so the
 * marker is the only place left in the tree that still sits inside the caller's identity wrapper.
 */
const PortalAnchor = React.forwardRef<HTMLSpanElement>((_props, ref) => (
  <span ref={ref} hidden aria-hidden="true" data-mizu-portal-anchor="" />
));
PortalAnchor.displayName = 'PortalAnchor';

/**
 * Identity for a portal that Radix mounts under body.
 *
 * Render `anchor` next to the Radix portal and apply `ref` (or `applyIdentity`) to the element that
 * ends up in body. Pass `source` to read identity from an existing element, such as the trigger input,
 * instead of rendering a marker.
 */
export function usePortalIdentity<T extends Element>(
  forwardedRef?: React.Ref<T>,
  source?: React.RefObject<Element | null>,
) {
  const markerRef = React.useRef<HTMLSpanElement>(null);
  const sourceRef: React.RefObject<Element | null> = source ?? markerRef;
  const applyIdentity = React.useCallback(
    (node: Element | null) => copyPortalIdentity(sourceRef.current, node),
    [sourceRef],
  );
  const ref = React.useMemo(
    () => mergeRefs<T>(applyIdentity as React.Ref<T>, forwardedRef),
    [applyIdentity, forwardedRef],
  );
  const anchor = source ? null : <PortalAnchor ref={markerRef} />;
  return { anchor, ref, applyIdentity };
}
