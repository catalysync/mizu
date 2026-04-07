---
title: "Can You Fetch Data with React Server Actions?"
url: https://www.developerway.com/posts/server-actions-for-data-fetching
date: 2026-01-13
slug: server-actions-for-data-fetching
---

# Can You Fetch Data with React Server Actions?

**Published:** 13-01-2026
**Author:** Nadia Makarevich

## Introduction

Can React Server Actions (now called Server Functions) work for data fetching? This question "pops up from time to time" in developer communities. While Actions might seem unsuitable for fetching, their actual implementation reveals interesting possibilities—and significant drawbacks.

The article focuses specifically on **client-side data fetching**, not Server Components, which handle data retrieval differently.

## What Are React Actions (Server Functions)?

Server Functions are a React feature enabling frontend components to call backend code directly as imported functions, rather than through traditional GET/POST requests.

### Basic Implementation

**Server Action:**
```tsx
'use server';

export const saveSomething = async (data: string) => {
  console.log('SERVER: Action received with data:', data);
  return { success: true };
};
```

**Client Component:**
```tsx
'use client';

import { saveSomething } from './action';
import { Button } from '@/components/ui/button';

export const ClientButton = () => {
  const onClick = async () => {
    const result = await saveSomething('Some data from client');
    console.log('CLIENT: Action result:', result);
  };

  return <Button onClick={onClick}>Click Me to save data</Button>;
};
```

### Key Observation

Behind the scenes, Actions operate as POST requests. The Network panel reveals the underlying HTTP mechanism—no magic occurs, just a clever abstraction providing type safety through TypeScript.

## React Server Actions for Data Fetching: How and Why

Since Actions are POST-based wrappers, they could theoretically replace traditional fetch calls:

```tsx
useEffect(() => {
  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };
  fetchProducts();
}, []);
```

### Potential Benefits

- No manual `JSON.parse()` required
- Type-safe responses without Zod validation
- IDE autocomplete for backend data structures
- Consistency with mutation patterns already using Actions

## Arguments Against Actions for Data Fetching

### "Not Designed for Data Fetching"

This represents a philosophical rather than practical objection. GraphQL successfully uses POST requests for data fetching, establishing precedent.

### No HTTP Header Caching

POST requests don't benefit from browser/CDN cache headers. However, this limitation only affects public data—authenticated requests behind login pages wouldn't use HTTP caching anyway. Client-side caching libraries remain unaffected.

### No Request Memoization

Request memoization is a server-side feature irrelevant to client-side fetching. Data fetching libraries handle client-side caching independently of whether requests use Actions or traditional fetch.

## Performance Testing: Real-World Dashboard

The author tested both approaches using a dashboard with seven REST endpoints and TanStack Query for caching.

### Initial Results (Simple Fetch)

| Metric | Time |
|--------|------|
| LCP (title visible) | 500ms |
| All data visible | 1.7s |

### Results with Server Actions

| Metric | Time |
|--------|------|
| LCP (title visible) | 500ms |
| All data visible | 8s |

### The Critical Finding

Parallel requests converted to sequential processing. React documentation states: "Accordingly, frameworks implementing Server Functions typically process one action at a time." This undocumented-yet-documented behavior severely impacts performance.

Additional debugging challenges include multiple identically-named network requests and malformed RSC payload responses.

## Server Components vs. Client-Side Fetching

The author disputes the notion that client-side fetching should disappear entirely. Understanding fundamentals—"how Server-Side Rendering works, what the difference is between SSR and Server Components"—matters more than dogmatic approach selection.

### Comparative Performance

| Approach | LCP | All Data |
|----------|-----|----------|
| Simple fetch | 500ms | 1.7s |
| Server Actions | 500ms | 8s |
| SSR | 1.3s | 1.3s |
| Server Components | 520ms | 1.2s |

Each approach presents trade-offs between initial paint timing, data visibility, and maintainability.

## Conclusion

While technically possible, using Server Actions for client-side data fetching should be avoided. Sequential request processing creates severe performance degradation when parallel requests are needed.

**Recommendation:** Use standard REST requests combined with TanStack Query (or similar libraries) for client-side data fetching.
