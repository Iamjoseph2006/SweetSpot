# Contributing Guide

## Branch strategy
- `main`: production-ready code.
- `develop`: integration branch.
- `feature/<short-description>`: new features.
- `fix/<short-description>`: bug fixes.

## Commit convention
Use conventional commits:
- `feat:` for features
- `fix:` for bug fixes
- `refactor:` for structure improvements
- `test:` for test additions or updates
- `docs:` for documentation
- `ci:` for automation/workflow changes

Examples:
- `feat: add admin product delete flow`
- `fix: handle expired jwt token in auth storage`
- `test: add auth storage token expiry unit test`

## Pull requests
1. Open PR against `develop`.
2. Fill out PR template completely.
3. Ensure CI passes before requesting review.
