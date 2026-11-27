# @mizunagara/tokens

Design tokens for the mizu design system, authored in [DTCG format](https://tr.designtokens.org/format/) and compiled by [Style Dictionary 5](https://styledictionary.com/).

## Outputs

| Export                    | Format                | Usage                                                   |
| ------------------------- | --------------------- | ------------------------------------------------------- |
| `@mizunagara/tokens/css`  | CSS custom properties | `@import "@mizunagara/tokens/css";`                     |
| `@mizunagara/tokens/json` | Flat JSON             | `import tokens from "@mizunagara/tokens/json";`         |
| `@mizunagara/tokens/ts`   | ES module             | `import { colorBlue500 } from "@mizunagara/tokens/ts";` |
| `@mizunagara/tokens/rn`   | React Native          | `import { colorBlue500 } from "@mizunagara/tokens/rn";` |

## Build

```bash
pnpm build
```

Token sources live in `src/base/`, `src/semantic/`, and `src/component/`. Build config is at `build/config.mjs`.
