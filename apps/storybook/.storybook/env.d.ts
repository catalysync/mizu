/// <reference types="vite/client" />

// Ambient module declarations for side-effect CSS imports from @aspect/*.
// Storybook's Vite config resolves these at build time, but TypeScript
// needs declarations to stop reporting "Cannot find module" errors.

declare module '@aspect/css';
declare module '@aspect/css/typography';
declare module '@aspect/css/themes/*';
declare module '@aspect/tokens/css';
declare module '@aspect/finance/css';
declare module '@aspect/finance/themes/*';
declare module '@aspect/commerce/css';
