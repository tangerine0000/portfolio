# EGM Drift Report — 2026-10-29

Scope: Design specifications and architectural contracts across the repository (`docs/designs/portfolio_redesign.md`, `README.md`, `docs/README.md`). Checked against current source files (`chrome.js`, `projects.js`, `posts.js`, `script.js`, `style.css`, `_redirects`, `*.html`, and `docs/`).

## docs/designs/portfolio_redesign.md

- Missing Feature / Model Field: Design schema defines `image?: string` on `PROJECTS` (lines 100, 252) and non-functional requirements specify fixed aspect ratio preview snapshots for CLS optimization (line 196). In `projects.js`, none of the entries define an `image` attribute, and neither `script.js` nor `style.css` implement image rendering or thumbnail styles.
- Missing Feature / Logic Shortcut: Design specifies that `renderWritingPage()` on `/writing/` renders a "chronological list categorized by `kind`" (line 109). In `script.js`, `renderWritingPage()` renders an uncategorized flat chronological stream with inline kind badges rather than grouped sections by format (`essay`, `note`, `personal`).
- Architectural Divergence: Design specifies exporting an "inline initialization helper to prevent flash-of-light-theme" from `chrome.js` (line 239). `chrome.js` does not export or provide this helper; an inline pre-paint script is instead duplicated verbatim in the `<head>` of all five HTML templates.
- Scope Omission: `post.html` is an active reader template referenced in Data Flow (line 124) and Verification (line 303), but is entirely omitted from the 12 target files in the Detailed Implementation Plan (lines 212–297).
- Scope Omission: `contact.html` is not mentioned in the implementation target list or migration plan, but remains active in the codebase as a client-side meta-refresh redirect to `/about.html#contact`.
- Unimplemented Documentation Update: Target item 12 ("`README.md` & `docs/`") specified updating contracts to reflect new components and remove risograph references (lines 294–297). While root `README.md` was rewritten, the `docs/` codebase wiki (`docs/index.html`, `docs/architecture.html`, `docs/files.html`, `docs/guides.html`) still documents the deprecated risograph design system, deleted `THEMES` registry, and removed pages (`projects.html`, `blog.html`).

## README.md

- Coverage Gap: `script.js:renderWorkPage()` contains an uncontracted empty-state fallback displaying "No projects cataloged yet." when `PROJECTS` is empty.
- Coverage Gap: `script.js:renderWritingPage()` contains an uncontracted empty-state fallback displaying "No writing entries published yet." when `POSTS` is empty.
- Coverage Gap: `script.js:renderPost()` contains three uncontracted fallback branches: (a) missing post / 404 message with link to `/writing/`, (b) missing `marked` library error message, and (c) fetch failure handler displaying `file:///` restrictions and `python -m http.server` troubleshooting.
- Coverage Gap: `script.js:renderHomeFork()` contains uncontracted selection and truncation logic: defaults to `PROJECTS[0]` if no item has `featured: true`, slices secondary projects to a maximum of 3, slices secondary writing items to a maximum of 2, and silently aborts if `#fork-root`, `PROJECTS`, or `POSTS` is absent.
- Coverage Gap: Internal date formatting and sanitization utilities (`MONTHS`, `formatDate()`, `escapeHtml()`) in `script.js` are uncontracted.
- Coverage Gap: `chrome.js:buildChrome()` dynamically generates and injects a `.mobile-social` connect block into `main` on non-home pages; this DOM manipulation is omitted from the contract.
- Coverage Gap: `chrome.js:initTheme()` attaches a runtime event listener to `window.matchMedia('(prefers-color-scheme: dark)')` to synchronize with OS theme changes when no `localStorage` override exists; this behavior is not documented.

## docs/README.md

- Architectural Divergence: The wiki contract specifies that pages "reuse the site stylesheet (`../style.css`) plus the wiki-specific `wiki.css`." Following the removal of the risograph theme system, `style.css` no longer provides `--ink-black`, `--paper`, `--ink-1`, `--ink-1-soft`, `--ink-2`, `--radius`, or `--transition`. Consequently, `docs/wiki.css` references undefined tokens across all wiki pages.
- Outdated System Specification: The wiki content described by `docs/README.md` documents obsolete site architecture (`THEMES` color registry, horizontal nav shrinking, `projects.html`, `blog.html`, and risograph print effects) which no longer exists in the codebase.
