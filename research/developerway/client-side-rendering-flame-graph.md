---
title: "Client-Side Rendering in Flame Graphs"
url: https://www.developerway.com/posts/client-side-rendering-flame-graph
date: 2025-02-18
slug: client-side-rendering-flame-graph
---

# Client-Side Rendering in Flame Graphs

**Published:** 18-02-2025
**Author:** Nadia Makarevich

## Introduction

This article explores client-side rendering patterns and performance analysis using flame graphs. It's part of the "Non-React Stuff for React Developers" series and builds on previous performance measurement work.

## Client-Side Rendering Definition

Client-side rendering occurs when an application delivers an empty HTML file with JavaScript that generates all DOM content in the browser. A typical setup includes:

```html
<html lang="en">
  <head>
    <script type="module" src="/assets/index.js"></script>
    <link rel="stylesheet" href="/assets/index.css" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

React then executes code similar to:

```javascript
const domElements = ReactDoYourThing(App);
const rootDomElement = document.getElementById('root');
rootDomElement.appendChild(domElements);
```

## Understanding Flame Graphs

A flame graph visualizes an application's call stack relative to time (measured in milliseconds). The metaphor of a developer's daily commute illustrates the concept:

- Main function: "goToWork" (30 minutes total)
- Child function: "petADog" (4 minutes)
- Child function: "getSomeCoffee" (10 minutes, includes nested "orderCoffee")

### Key Metrics

**Total Time:** The complete execution duration including all child functions.

**Self Time:** The difference between total time and children execution time. For "Walk to the office," this represents actual walking time (30 - 4 - 10 = 16 minutes).

Performance optimization involves analyzing these metrics and calculating trade-offs. Removing the "coffee" task saves time but impacts developer quality of life.

## Reading Flame Charts in DevTools

When analyzing a simple "go to work" script:

1. Blue bar: "Parse HTML" execution
2. Long yellow bar: JavaScript execution containing all function calls
3. Purple block: Layout calculations
4. Metrics trigger only after JavaScript completes

The article notes: "Until the JavaScript finished its work, there was no content on the page, so the FCP/LCP metrics couldn't be triggered."

Chrome extensions significantly clutter performance graphs. Using incognito mode eliminates this visual noise.

## Real Application Analysis

For a typical client-side rendered React app:

1. Parse HTML (tiny blue bar)
2. Two long JavaScript bars from the React application
3. Large Layout block (representing the entire page)
4. FCP/LCP metrics trigger only after JavaScript execution completes

Comparing this to server-rendered pages (like MDN documentation) shows a reversed pattern: Layout and Paint occur immediately after HTML parsing, with JavaScript loading afterward.

## Performance Implications

**Downsides of client-side rendering:**

- "The initial load and LCP metric might suffer, even when scripts are cached" - users see blank pages until JavaScript executes
- Complete dependency on JavaScript; disabling it renders the page blank

**Advantages:**

- Simple deployment as static files with zero hosting costs
- No backend scaling concerns
- Exceptional interaction performance through Single-Page Applications (SPAs)

The article concludes: "Sometimes, no one cares whether the app loads in 1 second...especially if there is cute animation while loading happens."

---

**Study Project:** Available at [github.com/developerway/reading-flame-graph](https://github.com/developerway/reading-flame-graph)

**Key Takeaway:** Understanding flame graphs enables developers to identify performance bottlenecks and make informed trade-off decisions about rendering strategies.
