# Tan Nguyen Portfolio Blueprint

## System Overview

A dependency-free personal portfolio and engineering blog built with vanilla HTML, modern CSS, and lightweight browser JavaScript (no build tools, bundlers, or package manifests).

The design follows a soft, text-led aesthetic with an interactive landing page fork dividing into **Work** and **Writing** streams.

- `_redirects` permanently routes legacy `/projects.html` and `/blog.html` to `/work/` and `/writing/`.
- `chrome.js` injects the persistent side-rail navigation (desktop) / sticky top bar (mobile), social channels, and manages dark/light mode (`data-mode`).
- `projects.js` contains the work manifest (`PROJECTS`) cataloging software applications and AI agents.
- `posts.js` contains the writing manifest (`POSTS`) tracking essays, notes, and reflections.
- `script.js` powers client hydration: `renderHomeFork()` on the landing page, `renderWorkPage()` on `/work/`, `renderWritingPage()` on `/writing/`, and `renderPost()` on `post.html`.
- `style.css` provides the soft text-led design system tokens, responsive side rail, interactive sibling-dimming landing fork, and dark mode styling.

Blog posts are Markdown files in `posts/` rendered client-side by `marked` (CDN, `marked@12`) on `post.html?slug=<slug>`.

## Routes & Pages

- `/` (`index.html`) — Interactive landing page fork between Work and Writing previews (`data-page="home"`).
- `/work/` (`work/index.html`) — Catalog of projects, AI agents, and web applications (`data-page="work"`).
- `/writing/` (`writing/index.html`) — Chronological stream of essays, technical notes, and build logs (`data-page="writing"`).
- `/about.html` (`about.html`) — Background, education, technical stack, and direct contact channels (`data-page="about"`).
- `/post.html?slug=<slug>` (`post.html`) — Markdown article reader (`data-page="writing"`).

## Manifest Contracts

### `projects.js` — Work Manifest
Exposes `PROJECTS` (and attaches to `window.PROJECTS`):
```javascript
{
  slug: string,
  title: string,
  category: 'professional' | 'personal', // 'professional' = Professional Project, 'personal' = Personal Project
  categoryLabel: string,                  // 'Professional Project' | 'Personal Project'
  year: string,
  stack: string[],
  summary: string,
  link?: string,
  repo?: string,
  featured?: boolean
}
```

### `posts.js` — Writing Manifest
Exposes `POSTS` (and attaches to `window.POSTS`):
```javascript
{
  slug: string,
  title: string,
  date: string,               // 'YYYY-MM-DD'
  kind?: 'note' | 'essay' | 'personal',
  lede?: string,              // Opening hook / pull-quote
  excerpt: string,            // Summary description
  tags?: string[],
  readMins?: number
}
```

## Chrome & Theme Invariants

- **Pre-paint Theme Check**: An inline script in `<head>` reads `localStorage['mode']` or checks `prefers-color-scheme: dark`, setting `data-mode="dark"` or `"light"` on `document.documentElement` before first paint to prevent theme flashing.
- **Side-Rail Navigation**: Desktop layouts (> 768px) render a fixed/sticky left side rail (`width: 240px`). Viewports < 768px collapse it into a compact sticky top bar.
- **Active Page Highlighting**: `chrome.js` inspects `<body data-page="...">` and highlights the corresponding link in the side rail.

## System Verification

Run Python's local web server:
```bash
python -m http.server
```
Open `http://localhost:8000/` in a browser and verify:
1. `/` displays the interactive Work / Writing split with live previews; hovering or focusing one half dims the other.
2. `/work/` renders the project list from `projects.js`.
3. `/writing/` renders the writing stream from `posts.js`.
4. `/about.html` renders the biography, technical stack, and direct contact channels.
5. `/post.html?slug=welcome` fetches and renders the markdown post with back link to `/writing/`.
6. Theme toggle switches between light mode (`#FBF8F4`) and charcoal-navy dark mode (`#1C2026`) without layout shift.
