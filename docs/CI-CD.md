# GitHub Actions CI/CD Setup

This document describes the CI/CD pipeline setup for the NexUI monorepo.

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)
- **Trigger**: Pull requests to main branch
- **Steps**:
  - pnpm install with caching
  - Lint (fail-fast)
  - Build
  - Test
  - Bundle size check
  - PR comment with bundle size diff

### 2. Release Workflow (`.github/workflows/release.yml`)
- **Trigger**: Push to main branch
- **Steps**:
  - All CI checks
  - Auto-publish to NPM via Changesets
  - Deploy Storybook to GitHub Pages
  - Create GitHub Release with changelog

### 3. Visual Regression Workflow (`.github/workflows/visual-regression.yml`)
- **Trigger**: Pull requests and pushes to main
- **Steps**:
  - Build Storybook
  - Upload to Chromatic
  - Block merge if visual changes unreviewed

## Required Secrets

Add these secrets to your GitHub repository:

1. **NPM_TOKEN**: NPM automation token for publishing packages
2. **CHROMATIC_PROJECT_TOKEN**: Chromatic project token for visual testing
3. **TURBO_TOKEN** (optional): Turbo remote caching token
4. **TURBO_TEAM** (optional): Turbo team name

## Bundle Size Limits

- Button component: <3KB gzipped
- DataGrid component: <15KB gzipped

## Setup Commands

```bash
# Install dependencies
pnpm install

# Run all checks locally
pnpm lint
pnpm build
pnpm test
pnpm size-check

# Create a changeset
pnpm changeset add

# Release (only on main)
pnpm release
```

## Notes

- Turborepo remote caching is disabled by default (no token needed)
- Node.js version 20.x is required
- pnpm caching is configured between jobs
- Fail-fast strategy: lint → build → test → size-check
