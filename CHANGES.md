# ARAAN local updates

Copy these files into your local clone of `vasanth-07-bunny/ARAAN`, preserving the directory structure.

## Added
- `link-utils.ts`
- `client/index.html`
- `patches/wouter@3.7.1.patch`
- `playwright.config.ts`
- `e2e/onboarding-payout.spec.ts`
- `test/setup.ts`
- `test/link-utils.test.ts`
- `test/app.integration.test.tsx`
- `vitest.config.ts`
- `sonner-wrapper.tsx`

## Updated
- `App.tsx`
- `index.css`
- `index.html`
- `package.json`
- `pnpm-lock.yaml`
- `tsconfig.json`
- `vite.config.ts`

## Removed / renamed
- Remove the old root `sonner.tsx`; it was renamed to `sonner-wrapper.tsx` to avoid shadowing the installed `sonner` package.

## After copying

```bash
pnpm install
pnpm test
pnpm check
pnpm build
pnpm test:e2e
```
