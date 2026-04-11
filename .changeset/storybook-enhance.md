---
'@aspect/storybook': patch
---

enhance storybook shell: welcome page as the first entry, branded manager theme, decorator stack (mizu theme + reduced motion + density + strict mode), Tailwind-aligned viewports (xs/sm/md/lg/xl/2xl), WCAG 2.1 AA a11y config, co-located MDX docs via `@storybook/addon-docs`, and interaction story template using `storybook/test` play() functions. Introduces the `*.interaction.stories.tsx` filename convention with `IGNORE_TESTS=true` opt-out for pure visual regression runs.
