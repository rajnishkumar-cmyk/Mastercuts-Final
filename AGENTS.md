# Repository Guidelines

## Project Structure & Module Organization

This is a Vite React + TypeScript application. The main entry points are `src/main.tsx` and `src/App.tsx`. Route-level pages live in `src/pages`, shared UI and feature components live in `src/components`, and reusable helpers live in `src/lib`. Booking-specific logic is under `src/lib/booking`, API helpers are under `src/lib/api`, and custom hooks live in `src/hooks`. Static assets are stored in `public/assets` and `public/images`; keep large media there instead of importing from `src`. Production output is generated in `dist` and should not be edited manually.

## Build, Test, and Development Commands

- `npm run dev` starts the Vite dev server with hot module replacement.
- `npm run build` runs TypeScript project checks with `tsc -b` and creates a production build with Vite.
- `npm run lint` runs ESLint across the repository.
- `npm run preview` serves the built app locally for final inspection.

Use `npm install` after dependency changes or when setting up a fresh checkout.

## Coding Style & Naming Conventions

Write React components in TypeScript with `.tsx` files and keep non-React utilities in `.ts` files. Use PascalCase for components and page files, such as `HomePage.tsx` or `ServiceCard.tsx`; use camelCase for functions, hooks, and variables. Hooks should use the `useX` naming pattern. Prefer existing shadcn/Radix-style primitives in `src/components/ui` and compose Tailwind classes with `cn` from `src/lib/utils` when conditional merging is needed. Follow the current two-space JSX indentation style and run `npm run lint` before opening a PR.

## Testing Guidelines

There is currently no dedicated test runner or first-party test directory. For now, verify changes with `npm run lint` and `npm run build`, then manually exercise affected routes and overlays in the browser. If adding tests, place them beside the code they cover using `*.test.ts` or `*.test.tsx`, and add the matching script and dependencies in `package.json`.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commit prefixes such as `feat:`, `fix:`, and `refactor:`. Keep commit subjects concise and imperative, for example `fix: update cart drawer totals`. Pull requests should include a short summary, verification steps, linked issues when applicable, and screenshots or screen recordings for visible UI changes. Call out any new assets, configuration changes, or manual QA gaps.

## Security & Configuration Tips

Keep environment-specific API details out of source files. Centralize client configuration in `src/lib/api/env.ts` and avoid committing secrets, tokens, or private service credentials.
