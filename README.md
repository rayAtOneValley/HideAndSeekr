# HideAndSeekr

AI-powered event discovery and itinerary planner built with [Nuxt 3](https://nuxt.com/), Vue 3, and Tailwind CSS.

## Prerequisites

- [Node.js](https://nodejs.org/) **18+** (LTS recommended)
- [npm](https://www.npmjs.com/) (bundled with Node)
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:rayAtOneValley/HideAndSeekr.git
cd HideAndSeekr
```

If you don't have SSH set up, use HTTPS instead:

```bash
git clone https://github.com/rayAtOneValley/HideAndSeekr.git
```

### 2. Install dependencies

```bash
npm install
```

This will also run `nuxt prepare` automatically via the `postinstall` script.

### 3. Configure environment variables

Create a `.env` file in the project root:

```bash
touch .env
```

Add the following keys to it:

```env
SEEKR_API_KEY=your_seekr_api_key_here
SEEKR_TEAM_ID=your_seekr_team_id_here
```

| Variable         | Description                                |
| ---------------- | ------------------------------------------ |
| `SEEKR_API_KEY`  | Your Seekr API key for AI-powered features |
| `SEEKR_TEAM_ID`  | The Seekr team ID associated with the API  |

> The `.env` file is git-ignored — never commit it.

### 4. Run the development server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script             | Description                                     |
| ------------------ | ----------------------------------------------- |
| `npm run dev`      | Start the dev server with hot reloading         |
| `npm run build`    | Build the app for production                    |
| `npm run preview`  | Preview the production build locally            |
| `npm run generate` | Generate a static version of the app            |

## Project Structure

```
HideAndSeekr/
├── app/             # Pages, components, and app-level code
├── server/          # Nitro server routes and API handlers
├── nuxt.config.ts   # Nuxt configuration
├── tailwind.config.ts
└── .env             # Local environment variables (not committed)
```

## Production

Build and preview locally:

```bash
npm run build
npm run preview
```

Deploy the `.output/` directory to your hosting provider of choice (Vercel, Netlify, Node server, etc.).
