# @aspect/tokens

Design tokens for the mizu design system, authored in [DTCG format](https://tr.designtokens.org/format/) and compiled by [Style Dictionary 5](https://styledictionary.com/).

## Outputs

| Export                | Format                | Usage                                               |
| --------------------- | --------------------- | --------------------------------------------------- |
| `@aspect/tokens/css`  | CSS custom properties | `@import "@aspect/tokens/css";`                     |
| `@aspect/tokens/json` | Flat JSON             | `import tokens from "@aspect/tokens/json";`         |
| `@aspect/tokens/ts`   | ES module             | `import { colorBlue500 } from "@aspect/tokens/ts";` |
| `@aspect/tokens/rn`   | React Native          | `import { colorBlue500 } from "@aspect/tokens/rn";` |

## Build

```bash
pnpm build
```

Token sources live in `src/base/`, `src/semantic/`, and `src/component/`. Build config is at `build/config.mjs`.
