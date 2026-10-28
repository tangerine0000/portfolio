# Codebase Wiki (`docs/`)

## Overview

A static, multi-page wiki describing the portfolio codebase. Four HTML pages
(`index.html`, `architecture.html`, `files.html`, `guides.html`) share one
sidebar rendered by `docs.js` from a single table of contents. Pages reuse the
site stylesheet (`../style.css`) plus the wiki-specific `wiki.css`. The wiki
does **not** load the site's `chrome.js` (no shared nav/footer/theme switcher).

## Interface

- `docs.js:DOCS` — table-of-contents array of `{ id, href, label }` entries
  (`index`, `architecture`, `files`, `guides`). Single source of truth for the
  sidebar.
- `docs.js:renderWikiNav()` — writes `<h2>Codebase Wiki</h2>` and a link list
  into `#wiki-nav`; marks the entry whose `id` equals `body[data-doc]` with
  `class="active"` and `aria-current="page"`.
- Page contract: each page declares `<body data-doc="<id>">`, contains
  `<aside class="wiki-nav" id="wiki-nav">`, and includes `<script src="docs.js">`.

## Invariants

- Every `data-doc` value used by a page must match an `id` in
  `docs.js:DOCS`, or no sidebar link is highlighted.
- Adding a wiki page requires adding exactly one entry to `docs.js:DOCS`.
- `renderWikiNav()` is a no-op when `#wiki-nav` is absent
  (`docs.js:renderWikiNav`).
- Runs on `DOMContentLoaded` if the document is still loading, otherwise
  immediately (`docs.js` boot block).

## Side Effects

- DOM mutation: replaces `#wiki-nav` `innerHTML`.
- No network, storage, or global state beyond the `DOCS` and `renderWikiNav`
  globals.
- External stylesheets loaded by pages: Font Awesome 6.4.0 (cdnjs) and Google
  Fonts (Inter, Space Grotesk).

## Verification

- No automated test suite. Serve the repo root (e.g. `python -m http.server`)
  and open `http://localhost:8000/docs/index.html`; confirm each sidebar link
  highlights on its own page.
