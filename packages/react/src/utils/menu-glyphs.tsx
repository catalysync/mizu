// Indicator glyphs shared by DropdownMenu and ContextMenu checkable items.

export function MenuCheckGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function MenuDotGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="8" height="8" fill="currentColor">
      <circle cx="12" cy="12" r="6" />
    </svg>
  );
}
