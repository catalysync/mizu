# RFC-003: Compositional shell over monolithic AppLayout

Status: accepted
Date: 2025-12-01

## Context

Design systems need an application shell (header, sidebar, content area). Two approaches exist: a monolithic `AppLayout` with slot props (Cloudscape), or independent composable components (Carbon UIShell).

## Decision

Mizu uses independent shell components: `AppHeader`, `AppSidebar`, `AppContent`, `AppBreadcrumbs`, `AppLayout`. They can be assembled in any combination. No required structure.

## Alternatives considered

- **Cloudscape-style monolithic AppLayout**: Single component with `header`, `navigation`, `content`, `tools` slot props. Rejected because 8 of 9 surveyed design systems abandoned this pattern — the host app needs to own the chrome. Polaris deprecated their `Frame` for this reason.

## Consequences

- Host apps have full control over shell composition
- Shell components work independently (e.g., `AppSidebar` without `AppHeader`)
- Trade-off: no built-in responsive collapse behavior — the host app controls breakpoint logic
