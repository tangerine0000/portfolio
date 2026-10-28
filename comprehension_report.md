# Comprehension Report

**Target:** `docs/designs/portfolio_redesign.md` (Lines 1..314)
**Reviewer:** `egm-comprehension`

---

## Paraphrase

### What this proposes
This document proposes redesigning Tan Nguyen's personal developer portfolio (`tanport.netlify.app`) from a heavy risograph aesthetic into a minimal, soft, text-led portfolio and writing stream. The core landing experience introduces an interactive desktop split fork that highlights either "Work" or "Writing" upon hover or keyboard focus while softly dimming the sibling. Navigation shifts from a top bar to a persistent monospace side rail (collapsing to a top bar on mobile) with binary light/dark mode. The architecture maintains a vanilla HTML/CSS/JS stack without build tools, reorganizing content into static data manifests (`projects.js`, `posts.js`) rendered into clean directory routes (`/work/`, `/writing/`) while maintaining backwards compatibility via Netlify redirects.

### How the existing system works, per this document
As described in the document, the current portfolio is a pure static site dominated by risograph styling featuring halftone dots, grain textures, dark offset borders, and an ~890-line `style.css`. Navigation uses a horizontal bar that shrinks on scroll, coupled with a 4-theme palette cycler managed in `chrome.js` that lacks system dark mode detection. The root `index.html` acts as a meta-refresh redirect rather than an interactive landing page, directing users to legacy pages like `projects.html` and `blog.html` (which loads markdown via `marked@12` from `posts.js`). Contact information is presented through a mock form on `about.html`.

---

## Findings

### 1. Omission of `post.html` from Target Files - Severity: Major
* **Affected Scope**: Section "Detailed Implementation Plan" (Lines 210–297) & Data Flow (Lines 110, 124)
* **Discrepancy Description & Rationale**: Lines 110, 124, and 303 explicitly define the post-reading experience (`renderPost()` dynamically rendering Markdown on `post.html?slug=<slug>`), yet `post.html` is completely absent from the 12 target files in the Detailed Implementation Plan (lines 212–297). Without updating `post.html` to import the new `style.css`, include the side-rail navigation from `chrome.js`, and execute the pre-paint theme script, navigating to any essay or note will result in broken styles or legacy risograph artifacts.

### 2. Inconsistent Routing Contract for About Page (`/about/` vs `/about.html`) - Severity: Major
* **Affected Scope**: Lines 81, 94, 237, 286, 302 ("Component Boundaries & Manifest Contracts", "Target Files", "Verification Plan")
* **Discrepancy Description & Rationale**: In Section 2 (line 94) and Section 3 (line 237), `chrome.js` is specified to inject navigation links pointing to `/`, `/work/`, `/writing/`, and `/about/`. However, target file 10 (line 286) modifies `about.html` as a root file (not `about/index.html`), and the Verification Plan (line 302) checks `/about.html`. On static hosts and standard local web servers (like Python `http.server`), linking to `/about/` expects an `index.html` inside an `about/` folder and will return a 404 error if only `about.html` exists. The document needs to clarify whether `about.html` is moving to `about/index.html`, if Netlify rewrite rules handle it, or if the navigation link should remain `/about.html`.

### 3. Incomplete Data Contracts and Selection Criteria for `renderHomeFork()` - Severity: Major
* **Affected Scope**: Lines 98–105, 241–265, 269 ("Manifest Contracts" & `renderHomeFork()` implementation)
* **Discrepancy Description & Rationale**: Line 269 states that `renderHomeFork()` dynamically loads "top featured items from `PROJECTS` and `POSTS` into the fork halves". In the `PROJECTS` sample (line 254), a `featured: true` property is added, but it is missing from the TypeScript interface definition in line 100 (`{ slug, title, year, stack, summary, image?, link?, repo? }`). More critically, the `posts.js` manifest definition (line 104) and proposed changes (lines 260–265) have no `featured` property at all. The document does not define how `renderHomeFork()` selects which writing entries to preview on the split fork (e.g., whether it relies on a `featured: boolean` flag, post `kind`, or chronological sorting of the latest *N* items).

### 4. Ambiguity in Pre-paint Theme Initialization Implementation - Severity: Nit
* **Affected Scope**: Lines 29, 116–117, 239, 276 ("Theme Toggle", "Data Flow", `chrome.js`, `index.html`)
* **Discrepancy Description & Rationale**: The design specifies using an inline `<head>` script to avoid theme flickering (FOUC). However, line 239 states that `chrome.js` will "Export inline initialization helper to prevent flash-of-light-theme", while line 276 only mentions adding the pre-paint script to `index.html`. Because `chrome.js` is loaded as an external script, it cannot execute inline before paint unless its code is manually duplicated into the `<head>` of all HTML entry points (`index.html`, `work/index.html`, `writing/index.html`, `about.html`, `post.html`). The document should clarify if this inline script is an inline code snippet embedded across all HTML `<head>` tags.

### 5. Unspecified Dependency Source for `marked@12` - Severity: Nit
* **Affected Scope**: Line 110 (`script.js` Component Boundaries)
* **Discrepancy Description & Rationale**: The document specifies `marked@12` for client-side Markdown parsing and prohibits npm/build steps (Non-Goal NG2), but does not state how `marked` is loaded into the project (e.g., via a public CDN link like jsDelivr/unpkg or as a vendored static script in the repository).

### 6. Unexplained Existing Meta-Refresh Redirect - Severity: Nit
* **Affected Scope**: Lines 274–275 (Target File 7: `index.html`)
* **Discrepancy Description & Rationale**: Line 275 instructs to "Replace `<meta http-equiv=\"refresh\">` redirect with the landing page shell", but the existing redirect's destination and historical reason are never introduced in the "The Problem" or "Overview" sections, which may momentarily confuse a reader unfamiliar with the legacy repository state.
