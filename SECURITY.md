# Security Policy

## Supported versions

Security fixes are published for the latest minor of each currently-supported major of the mizu packages (`@aspect/tokens`, `@aspect/css`, `@aspect/react`, `@aspect/tailwind-preset`, and the domain packs). Older majors are on a best-effort basis.

## Reporting a vulnerability

Please **do not open a public GitHub issue** for security reports.

Report privately via one of the following:

- **Email:** `dami.func@gmail.com` — use the subject line `[mizu security] <short description>`.
- **GitHub security advisory:** [open a private advisory](https://github.com/catalysync/mizu/security/advisories/new) against this repository.

Include enough detail to reproduce the issue — affected package and version, impact, and a minimal repro or proof of concept if you have one.

## What to expect

- **Acknowledgement** within 72 hours of a valid report.
- **Initial assessment** (severity, exploitability, fix scope) within 7 days.
- **Fix and coordinated disclosure** once a patched release is available. We will credit the reporter in release notes unless they request otherwise.

If a report turns out to be out of scope (for example, a vulnerability in an upstream dependency that we do not bundle), we will redirect it to the appropriate project and let the reporter know.

## Out of scope

- Findings in third-party dependencies that are not bundled directly into mizu packages — report those to the dependency owner.
- Issues only reproducible in unsupported browsers or runtimes.
- Theoretical issues without a concrete exploit path.
