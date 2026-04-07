---
title: "React Key Attribute: Best Practices for Performant Lists"
url: https://www.developerway.com/posts/react-key-attribute
date: 2022-05-09
slug: react-key-attribute
---

# React Key Attribute: Best Practices for Performant Lists

**Published:** 09-05-2022 | **Author:** Nadia Makarevich

## Overview

The React `key` attribute is frequently used without understanding its actual purpose. This comprehensive guide explores how keys work, when to use them, and their performance implications.

## How React Key Attribute Works

React uses the `key` attribute to identify elements among siblings during re-renders. The reconciliation process follows these steps:

1. Generate "before" and "after" snapshots of elements
2. Identify existing elements to reuse rather than recreate
3. Unmount removed items, mount new ones, and update existing ones

Keys are only needed during re-renders for sibling elements in flat lists.

## Why Random Keys Are Problematic

Using randomly generated keys causes severe performance degradation:

```tsx
countries.map((country) => <Item country={country} key={Math.random()} />);
```

This approach regenerates keys on every render, forcing React to treat all items as new. The result: component remounting instead of rerendering—significantly more expensive and breaks `React.memo` optimization.

## Index-Based Keys: The Complications

Using array indices as keys causes issues with dynamic lists where order or size changes.

### The Problem with Sorting

When a list is sorted using index-based keys:
- React perceives `key="0"` as the same item before and after
- Props update but component identity persists
- All items rerender despite `React.memo` wrapping
- Internal state persists with wrong data

Example: Clicking the first item to highlight it, then sorting, will keep the first position selected—even though a different country now occupies that slot.

### When Items Are Added

Inserting items at the list start causes every item to rerender and remount, degrading performance noticeably even with CPU throttling.

## When Index Keys Actually Improve Performance

Counterintuitively, index-based keys excel in specific scenarios: paginated lists where items are completely replaced while maintaining identical list structure.

### The Pagination Use Case

With `key="id"` approach: changing pages unmounts the entire list and mounts fresh items.

With `key="index"` approach: React reuses mounted components and simply updates their data—much faster.

This pattern applies to:
- Autocomplete components
- Search results
- Paginated tables
- Any stateless list replacement scenario

## Key Takeaways

- **Never use random values** as keys—causes items to remount on every render
- **Static lists** (unchanged items/order) can safely use index-based keys
- **Dynamic lists** with potential reordering need unique identifiers (`id`)
- **Paginated lists** with stateless items perform better with index-based keys

The choice depends on list behavior: static, dynamically reordered, or completely replaced.
