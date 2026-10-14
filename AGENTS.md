<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Continuing this website

Before continuing implementation, read `PROJECT_STATUS.md` and `docs/website-brief.md`. Preserve completed work and update the status file before stopping. The project uses Next.js 16.3.8 for Cloudflare/OpenNext compatibility; do not re-enable Cache Components or partial prefetching without verifying the Worker runtime. The website brief requests npm; use its current lockfile once migration is complete.
