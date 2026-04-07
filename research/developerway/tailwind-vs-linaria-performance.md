---
title: "Tailwind vs Linaria: Performance Investigation"
url: https://www.developerway.com/posts/tailwind-vs-linaria-performance
date: 2025-04-17
slug: tailwind-vs-linaria-performance
---

# Tailwind vs Linaria: Performance Investigation

**Published:** 17-04-2025
**Author:** Nadia Makarevich

## Introduction

The article investigates whether Tailwind CSS truly offers superior performance compared to modern alternatives like Linaria. Rather than relying on synthetic benchmarks, the author conducted real-world testing using a fully-styled React application with three pages (Login, Dashboard, Settings).

## Key Findings

### Asset Size Measurements

When comparing production builds:

- **CSS**: Tailwind reduced CSS by 13% (48.25 kB vs 55.69 kB in Linaria)
- **JavaScript**: Tailwind increased by 3% (394.63 kB vs 381.50 kB)
- **HTML (SSR)**: Tailwind increased dramatically—70% on the index page, 162% on settings

### Initial Load Performance (LCP)

The article measured Largest Contentful Paint across two rendering approaches:

**Client-Side Rendering:** No measurable difference between frameworks (2.36s both). The bottleneck was JavaScript execution, not CSS size.

**Server-Side Rendering:** Again, identical metrics (1.4s both) despite the massive HTML size differences, due to compression algorithms effectively handling repetitive text.

## Interaction Performance Discovery

The most surprising finding involved interaction performance. When measuring INP (Interaction to Next Paint) for menu and drawer interactions:

- Tailwind showed approximately 25-50% slower response times than Linaria
- The culprit: Tailwind's base styles include universal selectors (`*`, `::before`, `::after`)

As the author explains: "The browser iterates through DOM elements on a page and...recalculates their styles" when interactions occur, and Tailwind's universal selectors force the browser to evaluate significantly more style rules.

## Conclusion

The author determined that from a performance perspective, both frameworks are "likely fine" for production use. While Tailwind showed minor interaction slowdowns, these remained within acceptable ranges for most users. Development experience, maintenance, and API stability emerged as more practical selection criteria than performance metrics.

The investigation demonstrates that small kilobyte differences rarely impact real-world performance due to compression and that JavaScript execution dominates initial load time in client-rendered applications.
