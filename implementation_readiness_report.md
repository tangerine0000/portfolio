# Implementation Readiness Report

**Target:** `docs/designs/portfolio_redesign.md` (Lines 210..314)  
**Standard:** `implementation-readiness-standard.md`  
**Reviewers:** `egm-implementation-readiness`, `egm-codebase-details`, `egm-style`

---

## Reviewer Status

| Reviewer | Lens | Status |
|---|---|---|
| `egm-implementation-readiness` | Zero-Decision Rule, Phasing & Actionability | completed (FAIL) |
| `egm-codebase-details` | Codebase Parity, Contract Drift & Edge Cases | completed |
| `egm-style` | Implementation Precision & Jargon Stripping | completed |

---

## Prioritized Findings

### 1. Complete Omission of Active Core File `post.html` - Severity: Blocker
* **Reviewer Lens:** `egm-codebase-details`, `egm-implementation-readiness`
* **Affected Scope:** Lines 212–297 (`Target Files to Create/Modify`), `post.html`
* **Discrepancy Description**: The Implementation Plan lists 12 items under "Target Files to Create/Modify" (lines 212–297) but omits `post.html`. In the actual codebase, `post.html` is an active template that requires the new shell integration (`chrome.js`), stylesheet (`style.css`), pre-paint theme script in `<head>`, updated backlink target (`/writing/` instead of `/blog.html`), and target DOM containers (`#post-title`, `#post-meta`, `#post-content`) consumed by `renderPost()`.
* **Rationale & Recommendation**: Add `post.html` to the target file modification list with explicit template changes (pre-paint script, side rail shell integration, `/writing/` backlink, and container contracts).

### 2. Complete Absence of Phasing and Verification Checkpoints - Severity: Blocker
* **Reviewer Lens:** `egm-implementation-readiness`
* **Affected Scope:** Lines 210–297 (Detailed Implementation Plan Structure)
* **Discrepancy Description**: The plan is organized as an unsequenced flat list of file modifications. Executing these changes sequentially as listed (e.g. rewriting `style.css` before route files exist, or deleting legacy files before new views are confirmed working) will leave the workspace in a broken intermediate state.
* **Rationale & Recommendation**: Group tasks into discrete, sequential phases (Phase 1: Manifest Schemas & Data Contracts; Phase 2: CSS Tokens & Chrome Shell; Phase 3: Route Views & Dynamic Rendering; Phase 4: Netlify Redirects, Legacy Cleanup & Verification). Each phase must define explicit completion criteria.

### 3. Incomplete Data Manifests and Truncated Schemas - Severity: Blocker
* **Reviewer Lens:** `egm-implementation-readiness`, `egm-codebase-details`
* **Affected Scope:** Items 4 & 5 (`projects.js`, `posts.js`, Lines 241–265) and Open Questions (Lines 39–44)
* **Discrepancy Description**: `projects.js` provides a truncated array with `// ...` leaving project definitions incomplete for FAISS Integration and Web Scraper. In `posts.js`, the plan instructs the implementer to add 2 sample posts without defining slug names, titles, dates, or lede text. Furthermore, the plan includes unused `image` fields while omitting `repo`, `excerpt`, and `readMins` fields required by `script.js`.
* **Rationale & Recommendation**: Provide complete, copy-pasteable data objects for all items in `PROJECTS` and `POSTS` matching actual runtime requirements (`slug`, `title`, `year`, `stack`, `summary`, `link`, `repo`, `featured` for projects; `slug`, `title`, `date`, `kind`, `lede`, `excerpt`, `readMins`, `tags` for posts). Resolve Q1, Q2, and Q3.

### 4. Omission of `contact.html` and Missing Contact Rules in `_redirects` - Severity: Blocker
* **Reviewer Lens:** `egm-codebase-details`
* **Affected Scope:** Lines 214–222, 290–293, `contact.html`, `_redirects`
* **Discrepancy Description**: `contact.html` exists in the repository root as an active redirect page, and existing `_redirects` routes `/contact.html` and `/contact` to `/about.html`. The plan's proposed `_redirects` listing omits these rules entirely. Furthermore, `contact.html` is not mentioned in the target scope—it is neither scheduled for deletion nor documented as preserved. On Netlify, an existing static file takes precedence over redirect rules unless forced.
* **Rationale & Recommendation**: Add `/contact.html` and `/contact` HTTP 301 redirects to the proposed `_redirects` configuration, and explicitly add `contact.html` to the legacy file deletion list alongside `projects.html` and `blog.html`.

### 5. Contract Mismatches in `chrome.js` Functions, Route Targets, and FOUT Strategy - Severity: Major
* **Reviewer Lens:** `egm-codebase-details`, `egm-implementation-readiness`
* **Affected Scope:** Lines 233–240 (`chrome.js`)
* **Discrepancy Description**: The plan states `Implement buildSideRail()` and `Implement simplified toggleTheme()`, whereas actual shell functions in the codebase are `buildChrome()` / `initChrome()` and `initTheme()`. It specifies navigation links pointing to `/about/` (a non-existent folder that yields 404s on static servers) instead of `/about.html`. It states `chrome.js` will "Export inline initialization helper", which is architecturally invalid for non-modular scripts loaded at the bottom of `<body>`.
* **Rationale & Recommendation**: Standardize function signatures to `buildChrome()` / `initChrome()`. Align the About page route either by creating `about/index.html` or keeping `/about.html`. Define the pre-paint theme script as an inline `<head>` script snippet across all HTML files.

### 6. Missing DOM Contracts and Component Rendering Specifications - Severity: Major
* **Reviewer Lens:** `egm-implementation-readiness`
* **Affected Scope:** Lines 233–240, 266–285 (`chrome.js`, `script.js`, `index.html`, `work/index.html`, `writing/index.html`)
* **Discrepancy Description**: The plan does not specify the DOM mount points, container classes, or template hierarchy for `renderHomeFork()`, `renderWorkPage()`, or `renderWritingPage()`. `renderHomeFork()` leaves item selection count and filtering undefined.
* **Rationale & Recommendation**: Provide explicit DOM container IDs (`#fork-root`, `#work-list`, `#writing-list`) and concrete HTML markup templates for rendered cards and list items.

### 7. Missing Script Tags and Relative Path Fragility in `index.html` - Severity: Major
* **Reviewer Lens:** `egm-codebase-details`
* **Affected Scope:** Lines 274–277 (`index.html`)
* **Discrepancy Description**: Line 276 specifies adding `<script src="projects.js">` and `<script src="posts.js">`, but omits `<script src="/chrome.js">` and `<script src="/script.js">`. Without these, navigation and fork rendering will not run. Furthermore, relative paths risk resolution errors across nested routes.
* **Rationale & Recommendation**: Specify root-relative script inclusions for all four scripts (`/projects.js`, `/posts.js`, `/chrome.js`, `/script.js`).

### 8. Missing Design Token Values and Ambiguous Typography Tokens - Severity: Major
* **Reviewer Lens:** `egm-implementation-readiness`
* **Affected Scope:** Lines 224–232 (`style.css`), Lines 198–202
* **Discrepancy Description**: Values for `--muted`, `--border`, `--glow-peach`, and `--glow-aqua` are never defined in either light or dark mode. Font families and font loader configurations are omitted, with Q2 leaving heading typography undecided.
* **Rationale & Recommendation**: Specify explicit hex/hsl values for all color tokens in light and dark modes, and document concrete font-family stacks with webfont link tags.

### 9. Vague Biography Modification and Technical Terminology - Severity: Major
* **Reviewer Lens:** `egm-style`
* **Affected Scope:** Lines 216, 288 (`_redirects`, `about.html`)
* **Discrepancy Description**: Line 288 states "Streamline bio" without concrete criteria. Line 216 describes 301 rules as "URL rewrite rules" instead of permanent redirects.
* **Rationale & Recommendation**: Specify exact biography text structure, and use precise technical terminology ("HTTP 301 permanent redirect rules").

### 10. Missing Exception Handling for `localStorage` in Theme Initialization - Severity: Major
* **Reviewer Lens:** `egm-implementation-readiness`
* **Affected Scope:** Lines 233–240, 274–277 (`chrome.js`, `index.html`)
* **Discrepancy Description**: Synchronously accessing `localStorage` without error handling throws unhandled exceptions in private/hardened browser contexts.
* **Rationale & Recommendation**: Mandate a `try...catch` wrapper around all `localStorage` reads/writes, falling back to `window.matchMedia`.

### 11. Verification Plan Precision and Edge Cases - Severity: Nit
* **Reviewer Lens:** `egm-implementation-readiness`, `egm-codebase-details`, `egm-style`
* **Affected Scope:** Lines 298–311 (`Verification Plan`)
* **Discrepancy Description**: Instructions are qualitative rather than automated. Edge cases (missing `?slug=` parameter, storage exceptions, `file:///` CORS restrictions) are omitted.
* **Rationale & Recommendation**: Define specific verification checks including missing query parameter fallbacks and CORS error states.
