# RFCs

Request for Comments — documents capturing substantial architectural decisions for mizu.

An RFC is appropriate when a change affects:

- Component API contracts or prop patterns
- Build, bundling, or package structure
- Cross-cutting infrastructure (tokens, theming, i18n, testing)
- Dependency additions or removals that affect consumers

Each RFC is a markdown file in this directory. The filename should be descriptive:
`001-css-first-styling.md`, `002-radix-primitives.md`, etc.

## Format

```
# RFC-NNN: Title
Status: accepted | proposed | superseded
Date: YYYY-MM-DD

## Context
What problem are we solving?

## Decision
What did we decide?

## Alternatives considered
What else could we have done?

## Consequences
What are the trade-offs?
```
