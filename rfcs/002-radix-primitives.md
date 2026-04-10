# RFC-002: Radix UI for interactive primitives

Status: accepted
Date: 2025-12-01

## Context

Interactive components (modals, tooltips, popovers, dropdowns, accordions, toasts) require complex behavior: focus trapping, escape handling, portal rendering, ARIA management, keyboard navigation. Building these from scratch is error-prone and time-consuming.

## Decision

Wrap Radix UI primitives for all interactive overlay and disclosure components. Mizu provides the visual layer (CSS classes), Radix handles the behavior.

Wrapped primitives: Dialog, Tooltip, Popover, DropdownMenu, Select, Tabs, Checkbox, Radio, Switch, Separator, Accordion, Toast, Progress.

## Alternatives considered

- **Headless UI**: Tailwind-focused, smaller component set, less active maintenance.
- **Downshift / react-aria**: Good for specific use cases (combobox, select) but don't cover the full range we need.
- **Build from scratch**: Maximum control but multiplies maintenance burden and a11y risk.

## Consequences

- Radix is a peer dependency surface — version bumps need testing
- Radix handles all ARIA roles, keyboard navigation, and focus management
- Our components are thin wrappers: Radix primitive + BEM classes + CVA variants
- Trade-off: locked into Radix's API design decisions (e.g., `asChild`, `Portal`, compound component structure)
