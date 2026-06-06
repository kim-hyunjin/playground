## Project Overview

Electron desktop application — a namu-wiki (나무위키) style personal wiki. Built with **React + Tailwind CSS**, bundled with **Vite** via `@electron-forge/plugin-vite`.

### Main Technologies

- **Framework:** [Electron](https://www.electronjs.org/) (v42)
- **Frontend Library:** [React](https://react.dev/) (v19)
- **Build Tool:** [Vite](https://vitejs.dev/) (with Electron Forge Vite plugin)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4, `@theme` in `src/index.css`)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## Architecture

**Electron main process:** `main.mts` — creates `BrowserWindow` with `contextIsolation: true`, `nodeIntegration: false`. Uses Forge Vite plugin env vars (`MAIN_WINDOW_VITE_DEV_SERVER_URL`, `MAIN_WINDOW_VITE_NAME`) to load the renderer. These are compile-time constants injected by `@electron-forge/plugin-vite`.

**Build config:**

- `forge.config.mts` — Electron Forge with `@electron-forge/plugin-vite`, renderer name: `main_window`
- `vite.main.config.mts` — Vite config for the main process
- `vite.renderer.config.mts` — Vite config for the renderer (`@vitejs/plugin-react`, `@tailwindcss/vite`)

**React entry:** `src/main.tsx` → `src/App.tsx`

**UI flow:**

1. **List view** — `WikiList` shows registered articles from `allWikis`
2. **Article view** — `Header` (with back), `IndexBox`, `SummaryTable`, `ContentSection`

**Components** (`src/components/`):

- `Header` — app header; optional back button on article view
- `WikiList` — article list
- `IndexBox` — table of contents for section anchors
- `SummaryTable` — infobox-style summary table (title, subtitle, optional image, key–value rows)
- `ContentSection` — wiki body sections

**Content data:**

- `src/data/wikiContent.ts` — `WikiArticle` types and `allWikis` registry
- `src/data/articles/` — per-article modules (e.g. `sample.tsx`); import and add to `allWikis` to register a new page

**Styling:** `src/index.css` — Tailwind import, `@theme` colors (`primary`, `minju`), Pretendard `@font-face`, `mobile` variant (max-width 680px).

## Building and Running

The project uses `electron-forge` for lifecycle management.

- **Start development:**
  ```bash
  npm start
  ```
- **Typecheck:**
  ```bash
  npm run typecheck
  ```
- **Package the application:**
  ```bash
  npm run package
  ```
- **Generate installers:**
  ```bash
  npm run make
  ```

Packaged app name follows `package.json` `name` (`my-wiki-app`) unless overridden in `forge.config.mts` → `packagerConfig`.

## Development Conventions

- **Styling:** Tailwind CSS 4 via the Vite plugin. Theme tokens live in `src/index.css` (`@theme`, `@custom-variant mobile`).
- **Content:** Add articles under `src/data/articles/`, export a `WikiArticle`, and append it to `allWikis` in `src/data/wikiContent.ts`.
- **Components:** Functional React components with TypeScript props.
- **Types & assets:** Global declarations (Forge/Vite env vars, static imports) are in `src/electron-env.d.ts`. `tsconfig.json` includes `main.mts` and root config files for the main process.

## Key Files

- `package.json` — metadata, scripts, dependencies
- `forge.config.mts` — Electron Forge configuration
- `main.mts` — Electron main process entry
- `src/electron-env.d.ts` — global TypeScript declarations
- `src/data/wikiContent.ts` — article types and registry
- `src/index.css` — Tailwind theme and global styles
