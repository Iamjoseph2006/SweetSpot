# Contributing Guide

## Branch strategy
- `feature/<short-description>` for new functionality.
- `fix/<short-description>` for bug fixes.
- Keep `main` always releasable.

## Commit convention
Use Conventional Commits prefixes:
- `feat:` new feature.
- `fix:` bug fix.
- `refactor:` architecture/internal improvements.
- `test:` test additions or updates.
- `docs:` docs only.

Examples:
- `feat: add admin delete product flow`
- `fix: handle expired jwt token in auth storage`
- `test: add backend auth middleware unit tests`

## Pull requests
1. Rebase your branch with target branch.
2. Ensure CI is green.
3. Fill `.github/pull_request_template.md`.
4. Keep PR focused and small.
