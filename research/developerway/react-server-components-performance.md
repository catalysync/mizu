---
title: "React Server Components: Do They Really Improve Performance?"
url: https://www.developerway.com/posts/react-server-components-performance
date: 2025-10-21
slug: react-server-components-performance
---

# React Server Components: Do They Really Improve Performance?

**Published:** 21-10-2025 | **Author:** Nadia Makarevich

## Introduction

React Server Components have become a dominant topic in the React community, yet remain widely misunderstood. The author initially questioned their value proposition, particularly since server-side data fetching existed before Server Components were introduced via Next.js's `getServerSideProps`. This article provides a data-driven comparison of Client-Side Rendering (CSR), Server-Side Rendering (SSR), and React Server Components (RSC) using consistent test conditions.

## Measuring Methodology

The analysis employs Chrome DevTools Performance tab measurements with:
- CPU 6x slowdown
- Network: Slow 4G throttling
- Metrics tracked: Largest Contentful Paint (LCP), sidebar visibility, message visibility, and page interactivity timing

Key measurements compare first-time visitors (no JavaScript cache) versus returning visitors (cached JavaScript). The test project is available on GitHub for replication.

## Client-Side Rendering Performance

Traditional CSR renders an empty HTML shell that JavaScript populates entirely in the browser:

```html
<!doctype html>
<html lang="en">
  <head>
    <script type="module" src="/assets/index-C3kWgjO3.js"></script>
    <link rel="stylesheet" href="/assets/index-C26Og_lN.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

**Initial Load Results:**
- LCP: 4.1s (no cache) / 800ms (cached)
- Sidebar items: 4.7s / 1.5s
- Messages: 5.1s / 2s

The user sees nothing until JavaScript downloads, compiles, and executes. However, CSR offers rapid page transitions (80ms between pages) and minimal infrastructure costs—ideal for hobby projects and single-page applications.

## Server-Side Rendering Without Data Fetching

SSR pre-renders HTML on the server using React's `renderToString` API, sending complete markup immediately:

```tsx
export const serveStatic = async (c) => {
  const html = fs.readFileSync('index.html').toString();
  const HTMLString = renderToString(<App />);
  const htmlWithSSR = html.replace(
    '<div id="root"></div>',
    HTMLString,
  );
  return c.body(htmlWithSSR, 200);
};
```

**Results:**
- LCP: 1.61s / 800ms
- Sidebar items: 4.7s / 1.5s
- Messages: 5.1s / 2s
- Interactivity gap: 2.39s / 100ms

The initial page visibility improves dramatically, but client-side data fetching remains unchanged since `useEffect` hooks only trigger after JavaScript execution. This creates a "no interactivity gap" where the page appears broken for over 2 seconds.

## Server-Side Rendering With Data Fetching

Server-side data fetching requires passing fetched data to React components:

```tsx
export const serveStatic = async (c) => {
  const sidebarPromise = fetch(`/api/sidebar`).then((res) => res.json());
  const messagesPromise = fetch(`/api/messages`).then((res) => res.json());
  const [sidebar, messages] = await Promise.all([
    sidebarPromise,
    messagesPromise,
  ]);
  const HTMLString = renderToString(
    <App messages={messages} sidebar={sidebar} />,
  );
};
```

Data must be embedded in HTML for hydration:

```tsx
const htmlWithData = `
	<script>window.__SSR_DATA__ = ${JSON.stringify({
    sidebar,
    messages,
  })}</script>
	${HTMLString}`;
```

**Results:**
- LCP: 2.16s / 1.24s
- Sidebar items: 2.16s / 1.24s
- Messages: 2.16s / 1.24s
- Interactivity gap: 2.44s / 150ms

Full-page content appears simultaneously, but the synchronous waiting for all data degrades initial rendering time.

## Next.js Pages Router ("Old" Next.js)

The Pages Router abstracts SSR complexity using `getServerSideProps`:

```tsx
export const getServerSideProps = async () => {
  const sidebarPromise = fetch(`/api/sidebar`).then((res) => res.json());
  const messagesPromise = fetch(`/api/messages`).then((res) => res.json());
  const [sidebar, messages] = await Promise.all([
    sidebarPromise,
    messagesPromise,
  ]);
  return { props: { messages, sidebar } };
};
```

**Client Data Fetching Results:**
- LCP: 1.76s / 800ms
- Sidebar items: 3.7s / 1.5s
- Messages: 4.2s / 2s
- Interactivity gap: 1.34s / 100ms

**Server Data Fetching Results:**
- LCP: 2.15s / 1.15s
- All content: 2.15s / 1.15s
- Interactivity gap: 1.35s / 100ms

Code splitting improvements reduce the interactivity gap compared to custom implementations.

## React Server Components: Core Concepts

### Server Components

Traditional React components execute twice: once on the server during pre-rendering, then again on the client for hydration. Server Components eliminate this duplication by running only on the server and transmitting an RSC payload—a serialized component tree—to the client.

This reduces bundle size since component code and dependencies remain server-side, though the article notes practical impact is often minimal when combined with client components.

### Async Components

Server Components support async/await natively for data fetching:

```tsx
const Sidebar = async () => {
  const sidebarResponse = await fetch("/api/sidebar");
  const sidebarData = await sidebarResponse.json();
  return <div>{sidebarData.map(...)}</div>;
};
```

### Streaming

Streaming enables chunk-by-chunk rendering delivery. Instead of waiting for all data, the server sends initial chunks immediately and continues streaming suspended components marked with `<Suspense>` boundaries. This replicates client-side data fetching patterns on the server.

## Next.js App Router: Lift-and-Shift Migration

Migrating to App Router without Server Components using `use client`:

**Results:**
- LCP: 1.28s / 650ms
- Sidebar items: 4.4s / 1.5s
- Messages: 4.9s / 2s
- Interactivity gap: 2.52s / 250ms

App Router delays JavaScript until after CSS loads, improving LCP by ~500ms but degrading other metrics by ~700ms due to increased main thread activity.

## Next.js App Router Without Proper Suspense

Converting to Server Components without adding Suspense boundaries causes React to await all async components synchronously:

**Results:**
- LCP: 1.78s / 1.2s
- All content: 1.78s / 1.2s
- Interactivity gap: 2.42s / 100ms

This pattern mirrors traditional SSR—the entire page waits for all data before rendering.

## Next.js App Router With Suspense Boundaries

Proper implementation wraps async Server Components in `<Suspense>`:

```tsx
<Suspense fallback={<div>Loading inbox...</div>}>
  <InboxWithFixedBundlePage messages={messages} />
</Suspense>
```

**Results:**
- LCP: 1.28s / 750ms
- All content: 1.28s / 1.1s
- Interactivity gap: 2.52s / 50ms

Progressive rendering streams chunks to the client as they become available, dramatically reducing the interactivity gap.

## Key Findings Summary

| Approach | LCP (no cache/cached) | Sidebar (no cache/cached) | Messages (no cache/cached) | Interactivity Gap (no cache/cached) |
|----------|----------------------|--------------------------|----------------------------|------------------------------------|
| Client-Side Rendering | 4.1s / 800ms | 4.7s / 1.5s | 5.1s / 2s | — |
| SSR (Client Fetch) | 1.61s / 800ms | 4.7s / 1.5s | 5.1s / 2s | 2.39s / 100ms |
| SSR (Server Fetch) | 2.16s / 1.24s | 2.16s / 1.24s | 2.16s / 1.24s | 2.44s / 150ms |
| Next.js Pages (Client Fetch) | 1.76s / 800ms | 3.7s / 1.5s | 4.2s / 2s | 1.34s / 100ms |
| Next.js Pages (Server Fetch) | 2.15s / 1.15s | 2.15s / 1.15s | 2.15s / 1.15s | 1.35s / 100ms |
| App Router (Lift-and-shift) | 1.28s / 650ms | 4.4s / 1.5s | 4.9s / 2s | 2.52s / 250ms |
| App Router (Server Fetch, no Suspense) | 1.78s / 1.2s | 1.78s / 1.2s | 1.78s / 1.2s | 2.42s / 100ms |
| App Router (Server Fetch + Suspense) | 1.28s / 750ms | 1.28s / 750ms | 1.28s / 1.1s | 2.52s / 50ms |

## Conclusions

1. **CSR** offers the worst initial load but immediate interactivity after loading and fastest page transitions.

2. **SSR** dramatically improves LCP but creates an unavoidable "no interactivity" gap. The gap size depends on JavaScript quantity.

3. **Server data fetching** shows content faster but delays initial rendering if waiting for all data synchronously.

4. **Migrating to App Router** can paradoxically worsen performance without careful implementation due to JavaScript timing changes.

5. **Server Components alone** provide minimal performance gains without rewritten data fetching. Real improvements require proper Suspense boundaries enabling streaming.

6. **Streaming + Suspense** represents the key innovation, allowing progressive rendering that mirrors client-side patterns but server-executed.

The article emphasizes that React Server Components require significant architectural changes to deliver measurable performance benefits. Simply adopting the framework without restructuring data fetching yields negligible improvements.
