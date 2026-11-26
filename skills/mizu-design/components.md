# mizu component index

Source: the directories under `packages/react/src/components/`, `packages/react/src/layouts/`, `packages/react/src/shell/`, and `packages/css/src/{components,layouts,shell}/`. `packages/registry/component-registry.json` is not in the repo yet; when it lands, regenerate this table from it.

Column "CSS" is the file in `packages/css/src/`. Column "React" is the export from `packages/react/src/index.ts`, which re-exports each directory.

## Atomic components

| React              | CSS                                | Notes                                                                       |
| ------------------ | ---------------------------------- | --------------------------------------------------------------------------- |
| Accordion          | components/accordion.css           |                                                                             |
| Alert              | components/alert.css               |                                                                             |
| AlertDialog        | components/alert-dialog.css        |                                                                             |
| AnalyticsDashboard | components/analytics-dashboard.css |                                                                             |
| Autocomplete       | components/autocomplete.css        |                                                                             |
| Avatar             | components/avatar.css              |                                                                             |
| Badge              | components/badge.css               |                                                                             |
| Banner             | components/banner.css              |                                                                             |
| Breadcrumb         | components/breadcrumb.css          |                                                                             |
| Button             | components/button.css              | Also holds `.mizu-icon` and `.mizu-icon-button` used by Icon and IconButton |
| Card               | components/card.css                |                                                                             |
| Checkbox           | components/checkbox.css            | Also holds the radio classes used by Radio                                  |
| Collapsible        | components/collapsible.css         |                                                                             |
| Combobox           | components/combobox.css            |                                                                             |
| CommandMenu        | components/command-menu.css        |                                                                             |
| ContextMenu        | components/context-menu.css        |                                                                             |
| DataCollection     | components/data-collection.css     |                                                                             |
| DataTable          | components/data-table.css          |                                                                             |
| DateNavigator      | components/date-navigator.css      |                                                                             |
| DatePicker         | components/date-picker.css         |                                                                             |
| DefinitionList     | components/kv-pairs.css            | Uses `.mizu-definition-list`                                                |
| Drawer             | components/drawer.css              |                                                                             |
| DropdownMenu       | components/dropdown-menu.css       |                                                                             |
| EmptyState         | components/empty-state.css         |                                                                             |
| Field              | components/field.css               |                                                                             |
| Fieldset           | components/fieldset.css            |                                                                             |
| FileInput          | components/file-input.css          |                                                                             |
| FilterBar          | components/filter-bar.css          |                                                                             |
| Form               | components/form.css                |                                                                             |
| Heading            | components/heading.css             |                                                                             |
| HoverCard          | components/hover-card.css          |                                                                             |
| Icon               | components/button.css              | Uses `.mizu-icon`; no separate file                                         |
| IconButton         | components/button.css              | Uses `.mizu-icon-button`; no separate file                                  |
| Input              | components/input.css               |                                                                             |
| Label              | components/label.css               |                                                                             |
| Link               | components/link.css                |                                                                             |
| Modal              | components/dialog.css              | Uses `.mizu-dialog`                                                         |
| NumberInput        | components/number-input.css        |                                                                             |
| PageHeader         | components/page-header.css         |                                                                             |
| Pagination         | components/pagination.css          |                                                                             |
| PasswordInput      | components/password-input.css      |                                                                             |
| Popover            | components/popover.css             |                                                                             |
| Progress           | components/progress.css            |                                                                             |
| PropertyFilter     | components/filter-bar.css          | Uses filter-bar and dropdown-menu classes                                   |
| Radio              | components/checkbox.css            | Uses `.mizu-radio-*` classes                                                |
| ResourceHeader     | components/resource-header.css     |                                                                             |
| ScrollArea         | components/scroll-area.css         |                                                                             |
| SectionHeader      | components/section-header.css      |                                                                             |
| SegmentedControl   | components/segmented-control.css   |                                                                             |
| Select             | components/select.css              |                                                                             |
| Separator          | components/separator.css           |                                                                             |
| Sheet              | components/sheet.css               |                                                                             |
| Skeleton           | components/skeleton.css            |                                                                             |
| Slider             | components/slider.css              |                                                                             |
| Spinner            | components/spinner.css             |                                                                             |
| StepFlow           | components/step-flow.css           |                                                                             |
| Switch             | components/switch.css              |                                                                             |
| Table              | components/table.css               |                                                                             |
| Tabs               | components/tabs.css                |                                                                             |
| Tag                | components/tag.css                 |                                                                             |
| Textarea           | components/textarea.css            |                                                                             |
| TimeInput          | components/time-input.css          |                                                                             |
| Toast              | components/toast.css               |                                                                             |
| ToggleGroup        | components/toggle-group.css        |                                                                             |
| Tooltip            | components/tooltip.css             |                                                                             |

### CSS only (no React component in the barrel)

These CSS blocks exist without a matching `packages/react/src/components/` directory:

- `components/activity-entry.css`
- `components/chat-bubble.css`
- `components/chart.css`
- `components/query-builder.css`
- `components/advanced-query-builder.css`

Use them from plain HTML, or add a React component with a test before relying on them from React.

## Layout primitives

React: `packages/react/src/layouts/`. CSS: `packages/css/src/layouts/`.

| React                                           | CSS                   |
| ----------------------------------------------- | --------------------- |
| Stack                                           | layouts/stack.css     |
| Inline                                          | layouts/inline.css    |
| Grid                                            | layouts/grid.css      |
| Split                                           | layouts/split.css     |
| Center                                          | layouts/center.css    |
| Cluster                                         | layouts/cluster.css   |
| ResizableGroup, ResizablePanel, ResizableHandle | layouts/resizable.css |

## Shell

React: `packages/react/src/shell/`. CSS: `packages/css/src/shell/`.

| React                          | CSS                       |
| ------------------------------ | ------------------------- |
| AppLayout (and `useAppLayout`) | shell/app-layout.css      |
| AppHeader                      | shell/app-header.css      |
| AppSidebar                     | shell/app-sidebar.css     |
| AppContent, AppContentHeader   | shell/app-content.css     |
| AppBreadcrumbs                 | shell/app-breadcrumbs.css |
