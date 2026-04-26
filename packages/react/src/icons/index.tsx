import {
  ArrowRight as LArrowRight,
  Check as LCheck,
  ChevronDown as LChevronDown,
  ChevronRight as LChevronRight,
  Folder as LFolder,
  House as LHouse,
  LogOut as LLogOut,
  Play as LPlay,
  Plus as LPlus,
  RotateCw as LRotateCw,
  Search as LSearch,
  Table as LTable,
  Trash2 as LTrash2,
  X as LX,
} from 'lucide-react';
import { wrapIcon } from '../components/Icon/Icon';

/**
 * Curated icon set re-exported from `lucide-react` through our `Icon` wrapper.
 * Each is pre-bound to a specific glyph so consumers write `<HomeIcon />`
 * instead of `<Icon icon={House} />`.
 *
 * Wrapping (vs raw lucide imports) gives consumers our defaults:
 * `currentColor`, `size: 16`, `aria-hidden` when decorative.
 *
 * Need a glyph that's not here? Two options:
 * 1. Add it here and ship as part of the curated set.
 * 2. Import from `lucide-react` directly + wrap with `<Icon icon={...} />`.
 */

// Existing 6 — kept so callers don't break when migrating from the old path.
export const ChevronDown = wrapIcon('ChevronDown', LChevronDown);
export const ChevronRight = wrapIcon('ChevronRight', LChevronRight);
export const X = wrapIcon('X', LX);
export const Check = wrapIcon('Check', LCheck);
export const Search = wrapIcon('Search', LSearch);
export const ArrowRight = wrapIcon('ArrowRight', LArrowRight);

// New: common product-shell glyphs.
export const HomeIcon = wrapIcon('HomeIcon', LHouse);
export const FolderIcon = wrapIcon('FolderIcon', LFolder);
export const TableIcon = wrapIcon('TableIcon', LTable);
export const PlusIcon = wrapIcon('PlusIcon', LPlus);
export const PlayIcon = wrapIcon('PlayIcon', LPlay);
export const LogOutIcon = wrapIcon('LogOutIcon', LLogOut);
export const RefreshIcon = wrapIcon('RefreshIcon', LRotateCw);
export const TrashIcon = wrapIcon('TrashIcon', LTrash2);
