# Security Remediation Plan — Formizee

> Goal: reduce the ~413 GitHub security alerts to a manageable, reviewed set **without changing public APIs, database schemas, or framework major versions**.

## 0. Baseline and safety rules

1. Create a working branch: `security/remediation-2026`.
2. Keep `pnpm-lock.yaml` committed before every phase so each phase is independently revertible.
3. **No major-version upgrades** in this cycle (Next.js stays 14, React stays 18 for dashboard/web, tRPC stays 10, Tailwind stays 3, Zod stays 3). Only patch/minor updates and transitive overrides.
4. Run after every phase:
   - `pnpm install --frozen-lockfile`
   - `pnpm turbo run lint`
   - `pnpm turbo run test`
   - `pnpm turbo run build --filter api --filter vault --filter dashboard --filter web`
   - `pnpm audit --audit-level=high`
5. Prefer `pnpm update <pkg>@latest` scoped to a workspace over global upgrades.

## 1. Current findings summary

### 1.1 Dependency audit (`pnpm audit`)

- **368 unique advisories** (GitHub reports ~413 alerts because one advisory can affect multiple paths).
- Severity: **18 critical, 140 high, 168 moderate, 42 low**.
- Highest-risk direct dependencies:
  - `next` 14.2.21 — 47 advisories (6 critical, 14 high, 21 moderate, 6 low)
  - `hono` 4.6.6 — 42 advisories (5 high, 35 moderate, 2 low)
  - `next-auth` 5.0.0-beta.20 / `@auth/core` 0.34.2 — 5 advisories (critical/high/moderate)
  - `zod` 3.23.8 — 1 high
  - `wrangler` 3.83.0 — 1 high (plus dev-only impact)
  - `drizzle-orm` 0.36.4 — 1 high
  - `vitest` 2.1.3 — 4 advisories (3 critical, 1 moderate, dev-only)
  - `postcss` 8.4.49 — 4 advisories (2 high, 2 moderate)
  - `sharp` 0.33.5 — 3 high (docs only)
  - `file-type` 19.6.0 — 1 moderate
  - `@trpc/server` 10.45.2 — 1 high
  - `@vercel/flags` 2.6.3 — 1 moderate
  - `@sentry/nextjs` 8.47.0 — 1 low
  - `turbo` 2.3.3 — 2 (1 low, 1 moderate, dev-only)
  - `form-data` 4.0.1 — 2 (1 critical, 1 high, dev-only in `api`)
  - `prismjs` 1.29.0 — 1 moderate
  - `base-x` 5.0.0 — 1 high

- Transitive high/critical hotspots (not direct, but pulled in): `axios`, `undici`, `tar`, `tar-fs`, `fast-uri`, `devalue`, `js-yaml`, `brace-expansion`, `minimatch`, `engine.io`, `socket.io-parser`, `qs`, `body-parser`, `express`, `nanoid`, `picomatch`, `rollup`, `esbuild`, `follow-redirects`.

### 1.2 Code-level findings

| # | Area | Finding | Risk |
|---|------|---------|------|
| C1 | `apps/vault` auth | `VAULT_SECRET` defaults to `""`; if unset in production, an empty `Bearer ` matches. | Critical |
| C2 | `apps/vault` auth | Auth is skipped entirely when `ENVIROMENT === 'development'`, including misconfigured deployments. | High |
| C3 | Dashboard auth | `allowDangerousEmailAccountLinking: true` for Google/GitHub can allow account takeover on email collision. | High |
| C4 | Dashboard JWT | `jsonwebtoken.verify()` is called without `algorithms: ['HS256']`. | Medium |
| C5 | API | `rateLimiter()` is commented out in `newApp()`; only per-route limiters exist. | Medium |
| C6 | API | Rate-limit `keyGenerator` uses spoofable `x-forwarded-for`. | Medium |
| C7 | API CORS | `origin: '*'` on the public API is intentional for form posts, but is also applied to protected/admin routes via shared middleware. | Medium |
| C8 | Web markdown | `getBySlug()` joins a user-controlled slug into a filesystem path (path traversal risk). | Medium |
| C9 | Web markdown | `remark-html` renders raw HTML from markdown without sanitization. | Medium |
| C10 | API errors | Unhandled errors return `err.message` to clients, potentially leaking internals. | Low |
| C11 | Storage uploads | `Content-Disposition` filename is interpolated without escaping. | Low |
| C12 | CI | No Dependabot, CodeQL, secret scanning, or SBOM generation configured. | Process |

## 2. Phase plan

### Phase 0 — Preparation (no code changes except docs)

- Add this plan to the repo.
- Enable GitHub Advanced Security features: Dependabot alerts (already on), Dependabot security updates, CodeQL, secret scanning, push protection.
- Add a `SECURITY.md` contact already exists; keep as-is.
- **Exit criteria:** branch created, CI green.

### Phase 1 — Transitive dependency overrides (lowest risk, highest alert reduction)

**Goal:** clear most alerts that come from nested packages without touching direct APIs.

1. Add a `pnpm.overrides` block to the root `package.json` forcing patched versions for high-risk transitive packages. Start with:
   - `axios` → `1.7.9` or newer
   - `undici` → `6.21.0` or newer
   - `tar` → `7.4.3` or newer
   - `tar-fs` → `3.1.3` or newer
   - `fast-uri` → `3.1.9` or newer
   - `js-yaml` → `4.1.1` or newer
   - `brace-expansion` → `2.0.2` or newer
   - `minimatch` → `9.0.6` or newer (only where already on v9; keep v3 on 3.1.2 for legacy tools)
   - `qs` → `6.13.0` or newer
   - `body-parser` → `1.20.3` or newer
   - `express` → `4.21.2` or newer
   - `follow-redirects` → `1.15.6` or newer
   - `nanoid` → `3.3.8` or newer
   - `picomatch` → `2.3.1` or `4.0.3` (match major)
   - `rollup` → `4.24.0` or newer
   - `esbuild` → `0.24.0` or newer
   - `engine.io` → `6.6.1` or newer
   - `socket.io-parser` → `4.2.5` or newer
   - `devalue` → latest 5.x
2. Run `pnpm install`, then `pnpm audit --audit-level=high`.
3. If an override breaks a tool, remove only that override and document it.
- **Exit criteria:** high/critical transitive alerts reduced; tests green.

### Phase 2 — Patch-level direct dependency updates (no API changes)

Update only within the current minor line for direct runtime dependencies.

| Package | From | Target (minimum) | Workspace(s) |
|---------|------|------------------|--------------|
| `next` | 14.2.21 | latest 14.2.x | `apps/dashboard`, `apps/web`, `internal/email` |
| `hono` | 4.6.6 | 4.11.x | `apps/api`, `apps/vault` |
| `@hono/zod-openapi` | 0.16.4 | latest 0.16/0.17 compatible | `apps/api`, `apps/vault`, `internal/error` |
| `zod` | 3.23.8 | 3.25.x | all |
| `next-auth` | 5.0.0-beta.20 | latest beta.25+ | `apps/dashboard`, `internal/db` |
| `@auth/core` | 0.34.2 | 0.34.x patched | `apps/dashboard` |
| `@auth/drizzle-adapter` | 1.4.2 | 1.7.x | `apps/dashboard` |
| `drizzle-orm` | 0.36.4 | 0.36.x latest (or 0.39.x after review) | `internal/db` |
| `jsonwebtoken` | 9.0.2 | 9.0.3 | `apps/dashboard` |
| `prismjs` | 1.29.0 | 1.30.0 | `apps/web` |
| `sharp` | 0.33.5 | latest 0.33.x | `apps/docs` |
| `file-type` | 19.6.0 | 19.6.x | `apps/api`, `internal/storage` |
| `base-x` | 5.0.0 | 5.0.1 | `internal/id`, `internal/keys` |
| `@sentry/nextjs` | 8.47.0 | latest 8.x | `apps/dashboard` |
| `postcss` | 8.4.49 | 8.4.49+ (or 8.5.x) | `apps/dashboard`, `apps/web`, `internal/ui` |
| `wrangler` | 3.83.0 | latest 3.x | `apps/api`, `apps/vault`, `apps/logdrain` |
| `vitest` + pool | 2.1.3 / 0.5.22 | latest 2.x / 0.5.x | `apps/api`, `apps/vault` |
| `turbo` | 2.3.3 | 2.5.x | root |
| `@vercel/flags` | 2.6.3 | 2.7.x | `apps/dashboard` |

Commands example:
```bash
pnpm --filter @formizee/api update hono@^4.11 zod@^3.25
pnpm --filter @formizee/web update next@14.2.35 prismjs@^1.30
```
- **Exit criteria:** audit high/critical count drops again; all tests pass.

### Phase 3 — Code hardening (no breaking API changes)

Apply the following non-breaking hardening changes.

1. **Vault secret hardening** (`apps/vault/src/lib/middlewares/auth/service.ts`, `apps/vault/src/lib/enviroment/index.ts`)
   - Make `VAULT_SECRET` required in production (`z.string().min(32)` when `ENVIROMENT === 'production'`).
   - Remove the `ENVIROMENT === 'development'` auth bypass; instead allow bypass only when `VAULT_SECRET` is explicitly empty **and** `ENVIROMENT === 'development'` (keep local dev working).
   - Use constant-time comparison (`crypto.timingSafeEqual`) for the bearer token.

2. **JWT algorithm pinning** (`apps/dashboard/src/app/api/linked-emails/verify/route.ts`)
   - Call `verify(token, env().AUTH_SECRET, { algorithms: ['HS256'] })`.

3. **NextAuth account linking** (`apps/dashboard/src/lib/auth/config.ts`)
   - Set `allowDangerousEmailAccountLinking: false` unless a documented OAuth flow requires it; if kept, add an explicit allow-list of trusted providers and log linking events.

4. **Rate limiting** (`apps/api/src/lib/hono/app.ts`, `apps/api/src/lib/middlewares/security/rate-limiter.ts`)
   - Re-enable `rateLimiter()` globally with a generous default (e.g. 300 req/min per IP).
   - Change `keyGenerator` to use `cf-connecting-ip` first, then `x-forwarded-for`, then a hash of user-agent as fallback.
   - Keep public submission endpoints on a separate, higher limit if needed.

5. **CORS scoping** (`apps/api/src/lib/hono/app.ts`)
   - Keep `origin: '*'` only for the public submission router.
   - Restrict protected/admin routers to dashboard and docs origins (as already done in vault).

6. **Path traversal fix** (`apps/web/src/lib/markdown/api.ts`)
   - Validate `slug` with `/^[a-z0-9-]+$/` before joining.
   - Reject `..`, `/`, and `\`.

7. **Markdown sanitization** (`apps/web/src/lib/markdown/transformer.ts`)
   - Add `rehype-sanitize` (or sanitize the HTML output) so raw `<script>`/event handlers are stripped.

8. **Error message sanitization** (`apps/api/src/lib/errors/utils.ts`, `apps/vault` equivalent)
   - In production, return a generic `"Internal server error"` message for unhandled errors while keeping the detailed message in logs.

9. **Upload header hardening** (`internal/storage/src/storage.ts`)
   - Escape `file.name` in `Content-Disposition` (strip quotes/newlines) or use RFC 5987 encoding.

10. **Security headers** (dashboard `next.config.js`, web `next.config.js`)
    - Add `Content-Security-Policy`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.

- **Exit criteria:** all tests pass; manual smoke test of form submission, dashboard login, and vault access.

### Phase 4 — Supply-chain and CI hardening

1. Add `.github/dependabot.yml` for npm (weekly) and GitHub Actions (weekly), grouped by framework.
2. Add a CodeQL workflow (JavaScript/TypeScript) on PR and weekly schedule.
3. Add secret scanning + push protection (GitHub settings).
4. Add `pnpm audit --audit-level=high` to CI (fail on new high/critical).
5. Generate SBOM (`pnpm sbom` or `syft`) as a release artifact.
6. Pin all GitHub Actions to commit SHAs instead of tags.
- **Exit criteria:** CI fails on regressions; alerts trend downward.

### Phase 5 — Major upgrades (separate cycle, opt-in)

These are **not** required to close most alerts but may be needed for full remediation. Treat as separate PRs with migration guides:

- Next.js 14 → 15/16 (App Router changes, async params).
- React 18 → 19.
- tRPC 10 → 11.
- Tailwind 3 → 4.
- Stripe SDK 17 → 23.
- Cloudflare Workers types v4 → v5.

## 3. Breaking-change guardrails

- Every PR must include the test command output.
- Database migrations must be additive only (no column drops/renames).
- Public API response shapes must remain identical (snapshot tests in `apps/api/src/v1/**/*.test.ts`).
- If a dependency update requires code changes, isolate it in its own PR with a rollback note.
- Do not change exported types from `internal/*` packages without a deprecation alias.

## 4. Verification checklist

- [ ] `pnpm audit --audit-level=critical` returns 0.
- [ ] `pnpm audit --audit-level=high` count is below 20 (remaining are dev-only or require major upgrades).
- [ ] `pnpm turbo run test` passes for `api`, `vault`, `dashboard`, `web`, and all `internal/*`.
- [ ] `pnpm turbo run build` passes for `api`, `vault`, `dashboard`, `web`.
- [ ] Manual smoke: create submission, view in dashboard, download file, verify email link, API key create/verify.
- [ ] GitHub security tab alert count reduced from ~413 to < 50.

## 5. Rollback

- Each phase is a separate commit/PR.
- Revert the commit and run `pnpm install --frozen-lockfile` to restore the previous lockfile.
- Keep overrides in a single, clearly commented block so they can be removed independently.

---

**Status:** Plan complete. Ready to start Phase 0/1 on your go-ahead.