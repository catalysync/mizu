---
'@mizunagara/css': minor
'@mizunagara/react': minor
---

add `--mizu-app-sidebar-bg` and `--mizu-app-sidebar-width` tokens for the app sidebar, and an `asChild` prop on `AppSidebarItem` so it can render a router link. Sidebar sections are now `role="group"` and are named by their label. Collapsed sidebars keep item and section labels in the accessibility tree (visually hidden), so icon-only links still have names. Nothing is breaking.
