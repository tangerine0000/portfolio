# Consolidated Review Report: Portfolio Redesign Specification

**Target Document:** [`docs/designs/portfolio_redesign.md`](file:///C:/Users/tanpe/portfolio/docs/designs/portfolio_redesign.md)  
**Execution Mode:** Uninterrupted Full Flow (All 5 Review Rubrics)  
**Date:** 2026-10-29  

---

## Executive Summary

A full multi-agent Goldfish audit was executed across the high-level specification (`FeatureRange: lines 1..209`) and detailed plan (`DetailedRange: lines 210..314`) of `portfolio_redesign.md`. 

The high-level product intent (retiring the heavy risograph aesthetic for a clean, text-led, dual-audience portfolio with a zero-build vanilla stack) is strong and well-motivated. However, the document fails the **Feature Specification Standard** and **Implementation Readiness Standard** in several critical areas:
1. **Omission of Core Pages**: Active templates ([post.html](file:///C:/Users/tanpe/portfolio/post.html) and [contact.html](file:///C:/Users/tanpe/portfolio/contact.html)) were omitted from the target file scope.
2. **Missing Mandatory Sections**: The document lacks an explicit `## Risks & Mitigations` section.
3. **Accessibility & Interaction Deficiencies**: The 45% sibling opacity dimming on the landing fork violates WCAG AA text contrast thresholds (< 2.4:1), and unscoped `:has()` rules cause sticky dimming on touch devices.
4. **Implementation Plan Gaps**: The implementation plan is a flat, unphased task list with truncated schemas (`// ...`), missing DOM mount contracts, and unhandled `localStorage` exceptions.

---

## Stage Reports Traceability & Status

| Stage | Review Rubric | Reviewers / Lenses | Status | Artifact Report |
|---|---|---|---|---|
| **Stage 5** | Initial Zoom Out | `egm-zoom-out` | Completed | [`zoom_out_report.md`](file:///C:/Users/tanpe/portfolio/zoom_out_report.md) |
| **Stage 6** | Comprehension Test | `egm-comprehension` | Completed | [`comprehension_report.md`](file:///C:/Users/tanpe/portfolio/comprehension_report.md) |
| **Stage 7** | Critic Review | `egm-design`, `egm-structural`, `egm-style` | Completed | [`critic_report.md`](file:///C:/Users/tanpe/portfolio/critic_report.md) |
| **Stage 8** | Intermediate Zoom Out | `egm-zoom-out` | Completed | [`intermediate_zoom_out_report.md`](file:///C:/Users/tanpe/portfolio/intermediate_zoom_out_report.md) |
| **Stage 9** | Implementation Readiness Test | `egm-implementation-readiness`, `egm-codebase-details`, `egm-style` | Completed (FAIL) | [`implementation_readiness_report.md`](file:///C:/Users/tanpe/portfolio/implementation_readiness_report.md) |

---

## Consolidated Action Items by Priority

### 🔴 Blockers (Must resolve before implementation approval)

#### Task B1: Add Mandatory `## Risks & Mitigations` Section
* **Primary Reviewers:** `egm-design`, `egm-structural`
* **Affected Document Scope:** Scope boundary between lines 191 and 210
* **Issue:** The Feature Specification Standard mandates an explicit evaluation of constraints, failure modes, security implications, and mitigations.
* **Action Required:** Insert a formal `## Risks & Mitigations` section addressing:
  - Third-party CDN delivery failures for `marked@12` (fallback message or vendoring).
  - Storage access restrictions (`localStorage` disabled or private browsing).
  - Browser compatibility fallbacks for CSS `:has()`.
  - Client-side Markdown sanitization considerations.

#### Task B2: Incorporate `post.html` into Target Scope and Plan
* **Primary Reviewers:** `egm-comprehension`, `egm-codebase-details`, `egm-implementation-readiness`, `egm-zoom-out`
* **Affected Document Scope:** Lines 212–297 (`Target Files to Create/Modify`), `post.html`
* **Issue:** `post.html` is a core reading template actively referenced in Data Flow (line 124) and Verification (line 303), but completely omitted from the 12 target files in the Detailed Implementation Plan.
* **Action Required:** Add `post.html` to the target modification list with explicit steps: update `<head>` pre-paint script, attach `chrome.js` side-rail shell, link `/style.css`, change backlink to `/writing/`, and define container IDs (`#post-title`, `#post-meta`, `#post-content`).

#### Task B3: Add Phasing and Completion Checkpoints to Implementation Plan
* **Primary Reviewers:** `egm-implementation-readiness`
* **Affected Document Scope:** Lines 210–297 (`Detailed Implementation Plan`)
* **Issue:** The plan is organized as an unsequenced flat list of 12 file changes. Executing these as listed breaks the build state across intermediate steps.
* **Action Required:** Restructure the plan into sequential phases with intermediate verification:
  - *Phase 1*: Manifest Schemas & Data Contracts (`projects.js`, `posts.js`).
  - *Phase 2*: CSS Design Tokens & Shell Layout (`style.css`, `chrome.js`).
  - *Phase 3*: Route Pages & Dynamic Hydration (`index.html`, `work/`, `writing/`, `post.html`, `about.html`).
  - *Phase 4*: Redirects, Legacy Cleanup & Final Verification (`_redirects`, deletion of legacy pages).

#### Task B4: Complete Data Manifests and Eliminate Truncated Schemas
* **Primary Reviewers:** `egm-implementation-readiness`, `egm-codebase-details`, `egm-zoom-out`
* **Affected Document Scope:** Lines 241–265 (`projects.js`, `posts.js`)
* **Issue:** `projects.js` provides a truncated array (`// ...`), omitting fields for FAISS Integration and Web Scraper. `posts.js` instructs adding 2 sample posts without titles, slugs, dates, or lede text. Unused `image` fields are retained while required `repo`, `excerpt`, and `readMins` fields are missing.
* **Action Required:** Provide fully populated, copy-pasteable data objects for all items in `PROJECTS` and `POSTS` matching actual client requirements.

#### Task B5: Include `contact.html` and Complete `_redirects` Rules
* **Primary Reviewers:** `egm-codebase-details`, `egm-zoom-out`
* **Affected Document Scope:** Lines 214–222, 290–293, `contact.html`, `_redirects`
* **Issue:** `contact.html` exists as an active redirect page, but is omitted from the plan's proposed `_redirects` and target file list.
* **Action Required:** Add `/contact.html` and `/contact` to the proposed `_redirects` rules, and schedule `contact.html` for deletion alongside `projects.html` and `blog.html`.

---

### 🟡 Major Findings (High impact on UX, stability, and code quality)

#### Task M1: Fix WCAG AA Contrast Violation in Inactive Split Dimming
* **Primary Reviewers:** `egm-design`, `egm-zoom-out`
* **Affected Document Scope:** Lines 140–145, 198–203 (`.fork-container` CSS & Accessibility NFRs)
* **Issue:** Applying `opacity: 0.45` drops text contrast to ~2.4:1 on the inactive fork, violating WCAG AA minimums (4.5:1) and impairing keyboard navigation.
* **Action Required:** Avoid high opacity reduction on text. Retain text contrast ≥ 4.5:1 by de-emphasizing background gradients/hairline borders instead, or disable opacity dimming under `@media (prefers-contrast: more)`.

#### Task M2: Encapsulate Hover Selectors to Prevent Touch Sticky Dimming
* **Primary Reviewers:** `egm-design`, `egm-zoom-out`
* **Affected Document Scope:** Lines 139–158 (`Interactive CSS Fork Mechanism`)
* **Issue:** Unscoped `.fork-container:has(.fork-half:hover)` causes sticky dimming upon tap on touchscreens.
* **Action Required:** Wrap desktop hover-dimming rules inside `@media (hover: hover) and (pointer: fine)`. For mobile viewports (< 768px), disable sibling opacity/grayscale suppression entirely.

#### Task M3: Wrap `<head>` Theme Script in Defensive `try...catch`
* **Primary Reviewers:** `egm-design`, `egm-zoom-out`, `egm-implementation-readiness`
* **Affected Document Scope:** Lines 116–118, 239, 276
* **Issue:** Direct synchronous `localStorage` reads in `<head>` throw uncaught `SecurityError` / `DOMException` in private or restricted browser contexts, halting page load.
* **Action Required:** Mandate a uniform 4-line inline `<head>` snippet wrapped in `try { ... } catch (e) { ... }` that safely falls back to `window.matchMedia('(prefers-color-scheme: dark)')` across all HTML entry points.

#### Task M4: Replace Premature CSS Code Dump with Interaction Contract
* **Primary Reviewers:** `egm-zoom-out`
* **Affected Document Scope:** Lines 127–158 (Section 4)
* **Issue:** Dumping 31 lines of raw CSS in the high-level architecture section is an altitude drop that baked in contrast and touch bugs.
* **Action Required:** Replace the raw CSS code block with a high-level behavioral interaction contract and move styling details to `style.css`.

#### Task M5: Resolve Route Mismatch for About Page (`/about/` vs `/about.html`)
* **Primary Reviewers:** `egm-comprehension`, `egm-zoom-out`, `egm-codebase-details`
* **Affected Document Scope:** Lines 81, 94, 237, 286, 302
* **Issue:** `chrome.js` specifies links to `/about/`, but the site uses `about.html` at the repository root, returning 404s on static servers without rewrite rules.
* **Action Required:** Standardize navigation links to `/about.html` (matching codebase and verification plan), or migrate `about.html` into `about/index.html`.

#### Task M6: Define DOM Container Contracts and Markup Templates
* **Primary Reviewers:** `egm-implementation-readiness`
* **Affected Document Scope:** Lines 233–240, 266–285
* **Issue:** Mount targets, element hierarchies, and class names for `buildChrome()`, `renderHomeFork()`, `renderWorkPage()`, and `renderWritingPage()` are undefined.
* **Action Required:** Provide explicit container IDs (`#fork-root`, `#work-list`, `#writing-list`) and template specifications for generated cards and lists.

#### Task M7: Fix Missing Scripts and Path Resolution in `index.html`
* **Primary Reviewers:** `egm-codebase-details`
* **Affected Document Scope:** Lines 274–277 (`index.html`)
* **Issue:** `index.html` specifies loading `projects.js` and `posts.js` with relative paths, but omits `chrome.js` and `script.js`.
* **Action Required:** Include root-relative `<script src="/chrome.js">` and `<script src="/script.js">` in all page shells.

#### Task M8: Document Color Token Values and Typography Stacks
* **Primary Reviewers:** `egm-implementation-readiness`
* **Affected Document Scope:** Lines 198–202, 224–232 (`style.css`)
* **Issue:** Values for `--muted`, `--border`, `--glow-peach`, and `--glow-aqua` are undefined. Specific font stacks and loader tags are omitted.
* **Action Required:** Document exact hex/hsl values for tokens across light and dark modes, and define font-family stacks with webfont links.

#### Task M9: Strip Marketing Prose, Redundancies, and Loaded Critiques
* **Primary Reviewers:** `egm-style`
* **Affected Scope:** Lines 11, 18–22, 164–178, 288
* **Issue:** The document uses subjective aesthetic jargon ("clean, modern, soft", "airy layout", "template-like 'AI-generated' look", "Streamline bio").
* **Action Required:** Rephrase using objective, measurable engineering language and specific functional changes.

---

### 🟢 Nits & Architectural Polish

* **Task N1: Purge Unused `image?: string` Property and Q1**: Remove `image` from the `PROJECTS` schema, close Q1, and remove image CLS budgeting to preserve text-led simplicity. (`egm-zoom-out`, `egm-codebase-details`)
* **Task N2: Resolve Open Questions (Q1–Q3)**: Resolve Q1 (no images), Q2 (finalize heading typography), and Q3 (remove dummy post requirement) prior to marking document Approved. (`egm-zoom-out`, `egm-implementation-readiness`)
* **Task N3: Specify Dependency Source for `marked@12`**: Explicitly state the CDN source URL or vendored script path for `marked@12`. (`egm-comprehension`)
* **Task N4: Document Dynamic OpenGraph Limitations**: State in Non-Goals that client-side Markdown rendering produces uniform root OpenGraph tags across posts. (`egm-design`)
* **Task N5: Clarify Typographic Transfer Budget**: Specify whether webfonts are included in the 50 KB compressed payload target. (`egm-design`)
* **Task N6: Blueprint Naming Alignment**: Adjust section headers to exact blueprint names (`Problem Statement`, combined `Goals & Non-Goals`). (`egm-structural`)
* **Task N7: Add Edge Cases to Verification Plan**: Include test cases for missing `?slug=`, storage exceptions, and `file:///` CORS behavior. (`egm-implementation-readiness`, `egm-codebase-details`)

---

## Traceability Matrix

| Raw Finding Source | Reviewer Lens | Severity | Consolidated Action Item |
|---|---|---|---|
| `critic_report.md` #1 | `egm-design`, `egm-structural` | 🔴 Blocker | **Task B1**: Add Mandatory `## Risks & Mitigations` Section |
| `comprehension_report.md` #1 | `egm-comprehension` | 🔴 Blocker | **Task B2**: Incorporate `post.html` into Target Scope |
| `implementation_readiness_report.md` #1 | `egm-codebase-details` | 🔴 Blocker | **Task B2**: Incorporate `post.html` into Target Scope |
| `implementation_readiness_report.md` #2 | `egm-implementation-readiness` | 🔴 Blocker | **Task B3**: Add Phasing and Completion Checkpoints |
| `implementation_readiness_report.md` #3 | `egm-implementation-readiness` | 🔴 Blocker | **Task B4**: Complete Data Manifests and Schemas |
| `implementation_readiness_report.md` #4 | `egm-codebase-details` | 🔴 Blocker | **Task B5**: Include `contact.html` and Complete `_redirects` |
| `critic_report.md` #2 | `egm-design` | 🟡 Major | **Task M1**: Fix WCAG AA Contrast Violation in Dimming |
| `critic_report.md` #4 | `egm-design` | 🟡 Major | **Task M2**: Encapsulate Hover Selectors for Touch Devices |
| `critic_report.md` #3 | `egm-design` | 🟡 Major | **Task M3**: Wrap Theme Script in Defensive `try...catch` |
| `zoom_out_report.md` #2 | `egm-zoom-out` | 🟡 Major | **Task M4**: Replace Raw CSS Dump with Interaction Contract |
| `comprehension_report.md` #2 | `egm-comprehension` | 🟡 Major | **Task M5**: Resolve Route Mismatch for About Page |
| `implementation_readiness_report.md` #6 | `egm-implementation-readiness` | 🟡 Major | **Task M6**: Define DOM Contracts and Markup Templates |
| `implementation_readiness_report.md` #7 | `egm-codebase-details` | 🟡 Major | **Task M7**: Fix Missing Scripts and Path Resolution |
| `implementation_readiness_report.md` #8 | `egm-implementation-readiness` | 🟡 Major | **Task M8**: Document Color Token Values and Typography |
| `critic_report.md` #6–8 | `egm-style` | 🟡 Major | **Task M9**: Strip Marketing Prose and Loaded Critiques |
| `zoom_out_report.md` #1 | `egm-zoom-out` | 🟢 Nit | **Task N1**: Purge Unused `image?: string` Property |
| `zoom_out_report.md` #4 | `egm-zoom-out` | 🟢 Nit | **Task N2**: Resolve Open Questions (Q1–Q3) |
| `comprehension_report.md` #5 | `egm-comprehension` | 🟢 Nit | **Task N3**: Specify Dependency Source for `marked@12` |
| `critic_report.md` #9 | `egm-design` | 🟢 Nit | **Task N4**: Document Dynamic OpenGraph Limitations |
| `critic_report.md` #10 | `egm-design` | 🟢 Nit | **Task N5**: Clarify Typographic Transfer Budget |
| `critic_report.md` #11 | `egm-structural` | 🟢 Nit | **Task N6**: Blueprint Naming Alignment |
| `implementation_readiness_report.md` #11 | `egm-implementation-readiness` | 🟢 Nit | **Task N7**: Add Edge Cases to Verification Plan |
