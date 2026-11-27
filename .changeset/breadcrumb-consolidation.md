---
'@mizunagara/react': minor
'@mizunagara/css': patch
---

`AppBreadcrumbs` is now the one breadcrumb to use: it renders an ordered list and takes a `maxVisible` prop that collapses the middle crumbs into an ellipsis on long paths. The span-based `Breadcrumb`, `BreadcrumbLink` and `BreadcrumbCurrent` are deprecated and log a development warning; they still work and are not removed, so no change is needed yet, but new code should use `AppBreadcrumbs`.
