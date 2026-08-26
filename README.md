# Modern Full-Stack Web Application

A modern, high-performance full-stack web application built with **React 19**, **TypeScript**, **Vite**, **Express**, and a custom **CSS Design Token Architecture**.

---

## 🛠️ Technology Stack

### Frontend
- **Framework & Core:** [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool & Dev Server:** [Vite](https://vitejs.dev/) with Fast Refresh
- **Styling & Architecture:** Custom CSS Token-Driven Design System
  - Zero CSS-in-JS runtime overhead
  - Standalone, portable CSS design tokens (`/src/styles/tokens/`)
  - Normalized base reset, typography scale, and responsive layout primitives (`/src/styles/base/`)
  - Modern CSS features: OKLCH color spaces, CSS custom properties, and `@media` queries with `postcss-custom-media`
- **Animations:** [Motion](https://motion.dev/) for smooth, declarative UI transitions and layout effects
- **Icons:** [Lucide React](https://lucide.dev/)

### Backend & API
- **Server:** [Express](https://expressjs.com/) embedded with Vite middleware in development
- **Language & Runtime:** TypeScript executed via [tsx](https://github.com/privatenumber/tsx) in dev and compiled to a standalone CommonJS bundle via [esbuild](https://esbuild.github.io/) for production

---

## 📂 Project Architecture

```text
├── api/                  # Serverless function handlers (e.g. Vercel deployment)
├── public/               # Static assets & public media
├── server/               # Server-side modules, routes, and controllers
├── src/
│   ├── components/       # Reusable, modular React components
│   ├── data/             # Static configurations & app data
│   ├── styles/
│   │   ├── tokens/       # Pure design tokens (colors, spacing, typography, layout)
│   │   ├── base/         # Global resets, element typography, utilities, animations
│   │   └── *.css         # Component-specific styles
│   ├── utils/            # Shared helper functions and formatters
│   ├── App.tsx           # Main application entry component
│   └── main.tsx          # Client-side DOM mounting
├── server.ts             # Express application & Vite development middleware
├── package.json          # Project manifest & build scripts
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **pnpm** (v8.0.0 or higher)

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd <repository-directory>
pnpm install
```

### 2. Start Development Server

```bash
pnpm dev
```

The application will start with live reload at **`http://localhost:3000`**.

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Boots the Express server and Vite development middleware via `tsx` on port `3000`. |
| `pnpm build` | Compiles client assets via `vite build` and bundles `server.ts` into `dist/server.cjs` using `esbuild`. |
| `pnpm start` | Runs the compiled production server (`node dist/server.cjs`). |
| `pnpm lint` | Runs TypeScript static type checking without emitting files (`tsc --noEmit`). |
| `pnpm preview` | Locally preview the client-side production build with Vite. |
| `pnpm clean` | Cleans up the `dist` build directory and compiled artifacts. |

---

## 🏗️ Production Build & Deployment

To generate an optimized production bundle:

```bash
pnpm build
```

To run the production build locally:

```bash
pnpm start
```
