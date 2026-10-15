# Releasing to npm

mizu publishes the public `@mizunagara/*` packages through **npm staged publishing**. CI can stage a version but cannot make it installable. A maintainer approves each staged version on their own machine with two-factor authentication (a passkey). No credential that CI or an automation holds can publish.

```
PR with .changeset/*.md ──► Depot PR checks (node-ts layer, guard, mizu / doctor + boundary)
        │ merge
        ▼
pnpm release:version   (maintainer, local) ──► PR "version packages"
        │ merge
        ▼
Depot npm-release / stage   (secret: NPM_STAGE_TOKEN, stage-only)
        │ build + test packages, then for each @mizunagara/* version not on npm:
        │ pnpm pack → verify tarball → npm stage publish --provenance=false
        ▼
pnpm release:approve   (maintainer, local, passkey)
        │ rebuild the same commit, compare every file with the staged tarball,
        │ npm stage approve (2FA), signed git tags <name>@<version>
        ▼
live on npm
```

## One-time setup (owner)

1. **npm organisation.** Create the free organisation `mizunagara` on npmjs.com (Add Organization → Unlimited public packages). The scope `@mizunagara` does not exist until then, and nothing can be staged.
2. **Two-factor authentication.** On the owner account: Account → Two-Factor Authentication → add a **security key / passkey** (WebAuthn), and select "Authorization and writes". In the organisation settings, require 2FA for all members.
3. **Stage-only token.** Access Tokens → Generate New Token → Granular Access Token:
   - Permissions: **Read and write, stage only** for packages and scopes `@mizunagara`. No organisation permissions.
   - Bypass two-factor authentication: **off**.
   - Expiration: 90 days. Put the rotation date in a calendar.
4. **Depot secret.** Store the token as the Depot CI secret `NPM_STAGE_TOKEN`. Only `.depot/workflows/npm-release.yml` references it; PR workflows get no secrets.
5. **Signed tags.** `git config --global user.signingkey …` and `git config --global tag.gpgSign true` (SSH or GPG signing). Approval creates signed tags; `--no-tags` skips them.

## Each release

1. **Version.** On a clean checkout: `pnpm release:version`. It runs `changeset version` on a fresh branch from `origin/main`, checks that every internal peer range is met, and opens the "version packages" PR. Review the versions and CHANGELOGs, then merge.
2. **Stage.** The push to `main` runs Depot `npm-release / stage`. Its log prints one line per staged package: `staged <name>@<version> tag=<tag> stage_id=<id> sha256=<digest> commit=<sha>`. While changesets are still pending it stages nothing.
3. **Approve.** On your machine, from a clean checkout:

   ```sh
   pnpm install
   npm login                       # passkey
   pnpm release:approve --list     # what is staged
   pnpm release:approve --sha <commit from the stage log>
   ```

   The script rebuilds that commit in a temporary worktree, downloads every staged tarball, and checks it against the registry checksum and file by file against the rebuild. It refuses on any difference, or on a staged version that the commit does not build. Otherwise you type `publish`, approve each version with your passkey (dependency order: tokens, css, tailwind-preset, react, then the packs), and the signed tags are pushed.

4. **Reject** anything unexpected: `npm stage reject <id>` (needs 2FA).

## Rules the scripts enforce

- Only `@mizunagara/*` packages that are not `private` are staged. `@tweakmizu/mcp` is skipped until its scope exists.
- Every internal peer range must be met by the versions being released (`node scripts/release/packages.mjs --check`).
- Every tarball must contain each entry point its `package.json` declares, carry `license: MIT` and the repository URL, and contain no `workspace:` ranges (`scripts/release/verify-tarball.mjs`).
- `publishConfig.provenance` is `true`, so a stray `npm publish` from a laptop fails instead of bypassing approval. Depot CI is not a provenance provider, so the stage step passes `--provenance=false`.
- Changesets that bump only apps (Storybook, docs) never hold a release back; apps need no changeset.

## Later: provenance

npm accepts trusted publishing (OIDC) and provenance only from GitHub-hosted runners, GitLab.com and CircleCI cloud. If GitHub Actions becomes available to the organisation, move only the stage step to a GitHub workflow with `id-token: write`, configure `npm trust` for each package, and keep the approval step unchanged. After that, set every package to "Require two-factor authentication and disallow tokens" and revoke `NPM_STAGE_TOKEN`.
