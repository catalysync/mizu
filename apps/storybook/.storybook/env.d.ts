/// <reference types="vite/client" />

// Ambient module declarations for side-effect CSS imports from @mizunagara/*.
// Storybook's Vite config resolves these at build time, but TypeScript
// needs declarations to stop reporting "Cannot find module" errors.

declare module '@mizunagara/css';
declare module '@mizunagara/css/typography';
declare module '@mizunagara/css/themes/*';
declare module '@mizunagara/tokens/css';
declare module '@mizunagara/finance/css';
declare module '@mizunagara/finance/themes/*';
declare module '@mizunagara/commerce/css';
