---
'@aspect/react': minor
---

add Icon primitive + curated lucide-react re-exports. `Icon` wraps any LucideIcon with mizu defaults (`currentColor`, `size: 16`, decorative `aria-hidden` when no label). `wrapIcon(name, glyph)` factory pre-binds a specific glyph. Existing 6 hand-coded icons (ChevronDown / ChevronRight / X / Check / Search / ArrowRight) now route through lucide-react under the same export names. New curated set: HomeIcon, FolderIcon, TableIcon, PlusIcon, PlayIcon, LogOutIcon, RefreshIcon, TrashIcon. **Adds `lucide-react` as a peer dependency** (>=0.400.0).
