---
title: "React State Management in 2025: What You Actually Need"
url: https://www.developerway.com/posts/react-state-management-2025
date: 2025-09-25
slug: react-state-management-2025
---

# React State Management in 2025: What You Actually Need

**Published:** 25-09-2025
**Author:** Nadia Makarevich

## Overview

This comprehensive article challenges the conventional wisdom about state management in modern React applications. The author argues that most developers don't actually need traditional state management libraries like Redux. Instead, she recommends breaking state into different categories and using specialized solutions for each.

## Key Sections

### Why Make a State Management Decision?

The author emphasizes that there is no universally "best" solution—it always depends on context. She addresses three scenarios:

1. **Learning for career advancement**: Study popular libraries by examining job postings and understanding core React concepts
2. **Existing projects**: Understand current pain points before switching solutions
3. **New projects**: Thoughtfully evaluate options with clear criteria

### State Concerns That Don't Need Libraries

#### Remote State

For data fetching from backends, the author recommends **TanStack Query** or **SWR** instead of managing this through state libraries. These handle:

- Loading and error states
- Request deduplication
- Caching and invalidation
- Pagination and optimistic updates

As she notes: *"If you ever implemented any of the above manually, you'll cry right now"* when switching to these tools.

#### URL State

Query parameters should be managed with **nuqs**, which provides seamless synchronization between URL and internal state without manual implementation.

#### Local State

Component-specific state (dropdowns, tooltips, visibility toggles) should use React's built-in `useState` or `useReducer`.

### Shared State Solutions

When state must be shared across unrelated components, the author presents progressive solutions:

**Props Drilling**: Viable for 2-3 levels, but becomes messy with deeper hierarchies.

**Context API**: Excellent for 1-2 shared states application-wide, but suffers from "Provider Hell" when overused. Multiple providers create organizational confusion, and the biggest issue is performance—context changes trigger re-renders of all consumers regardless of whether they use the changed data.

### Evaluating State Management Libraries

The author compares popular options against specific criteria:

**Simplicity**
- Redux: Too much boilerplate
- Redux Toolkit: Better but still complex
- **Zustand**: Minimal setup, hooks-based
- MobX: Signals/observables paradigm shift
- Jotai: Abstract "atoms" concept
- XState: State machines complexity

**Other Criteria**
- Single or zero providers
- Selective re-renders based on state usage
- React compatibility (hooks, SSR, Server Components)
- Active maintenance and community support

### The Winning Stack

For most applications, the author recommends:

1. **TanStack Query** -> Remote/API state
2. **nuqs** -> URL query parameters
3. **Zustand** -> Shared application state

This combination handles approximately 90% of typical state management needs while keeping complexity minimal.

## Key Insight on Reconciliation

The article includes a deep dive into React's reconciliation algorithm, explaining why conditionally rendering different components causes unmounting, while rendering the same component with different props only triggers re-renders. This technical understanding is crucial for predicting component behavior.

## Bottom Line

The author's core message: *"Most of the time, especially if you're not implementing the next Figma, you don't need a state management library at all."* Instead, categorize your state by concern and select appropriate tools for each category.
