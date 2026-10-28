# Critic Review Report

**Target:** `docs/designs/portfolio_redesign.md` (Lines 1..209)  
**Standard:** `feature-spec-standard.md`  
**Reviewers:** `egm-design`, `egm-structural`, `egm-style`

---

## Reviewer Status

| Reviewer | Lens | Status |
|---|---|---|
| `egm-design` | Architecture, Scalability, Security & Risks | completed |
| `egm-structural` | Heading Hierarchy, Layout & Standard Compliance | completed |
| `egm-style` | Tone, Precision, Objectivity & Fluff Stripping | completed |

---

## Prioritized Findings

### 1. Missing Mandatory "Risks & Mitigations" Section - Severity: Blocker
* **Reviewer Lens:** `egm-design`, `egm-structural`
* **Affected Scope:** Scope boundary lines 191–209
* **Discrepancy Description**: The Feature Specification Standard mandates an explicit evaluation of constraints, risks, and failure modes: *"The specification must explicitly call out its own constraints. It must identify potential failure modes, security implications, scalability limits, and how they will be mitigated."* Lines 1..209 provide Problem, Goals, Non-Goals, Open Questions, CUJs, Architecture, Alternatives, and NFRs, but completely omit a dedicated `## Risks & Mitigations` section.
* **Rationale & Recommendation**: Add a formal `## Risks & Mitigations` section before the implementation plan. Explicitly document failure modes (third-party script delivery failure, unhandled storage access, rendering fallbacks, `:has()` browser compatibility) and system limits with mitigation strategies.

### 2. Inactive Split Dimming Violates WCAG 2.1 AA Contrast Minimum - Severity: Major
* **Reviewer Lens:** `egm-design`
* **Affected Scope:** Lines 140–145, 198–203 (`.fork-container` CSS & Accessibility NFRs)
* **Discrepancy Description**: Lines 140–145 specify that hovering or focusing one half of `.fork-container` causes the inactive sibling to transition to `opacity: 0.45` and `filter: grayscale(0.4)`. Line 199 claims compliance with WCAG AA (minimum 4.5:1 text contrast). Applying `opacity: 0.45` to the primary text color (`#3A3633` over `#FBF8F4`) drops effective contrast from ~9.6:1 down to ~2.4:1. Secondary muted metadata drops below 2:1. During keyboard navigation (`:focus-within`), tabbing through one side degrades legibility of the opposing side below accessibility thresholds.
* **Rationale & Recommendation**: Avoid applying high opacity reduction to text content. Dim background ambient washes, borders, or non-text decorative accents instead, or constrain opacity reductions to keep contrast ≥ 4.5:1. Disable opacity dimming under `@media (prefers-contrast: more)`.

### 3. Unhandled Storage Access / Security Exceptions in `<head>` Theme Script - Severity: Major
* **Reviewer Lens:** `egm-design`
* **Affected Scope:** Lines 116–118 (Data Flow & Pre-Paint Theme Initialization)
* **Discrepancy Description**: The architecture specifies an inline script in `<head>` that synchronously reads `localStorage('mode')` to set `data-mode` prior to first paint. In browsers with strict privacy/tracking protection enabled (Safari private browsing, hardened Firefox containers, or restricted webviews), invoking `localStorage` throws an uncaught `SecurityError` / `DOMException`. Because this runs synchronously in `<head>`, an uncaught exception will halt script execution and break initial rendering.
* **Rationale & Recommendation**: Mandate that the inline pre-paint script wraps `localStorage` access in a `try...catch` block, safely falling back to `window.matchMedia('(prefers-color-scheme: dark)')` when storage access is restricted.

### 4. Touch Device Sticky Dimming via Unscoped `:has()` Hover Selectors - Severity: Major
* **Reviewer Lens:** `egm-design`
* **Affected Scope:** Lines 139–158 (Interactive CSS Fork Mechanism)
* **Discrepancy Description**: Lines 139–152 define sibling dimming using `.fork-container:has(.fork-half:hover)` without encapsulating it in hover media queries. On touchscreens (mobile/tablets), user taps emulate `:hover`. When a user taps an item in the single-column stacked mobile layout, the sibling card becomes permanently dimmed (45% opacity) until the user taps outside, degrading mobile usability.
* **Rationale & Recommendation**: Encapsulate hover-dimming rules inside `@media (hover: hover) and (pointer: fine)`. For mobile viewports (< 768px), disable sibling opacity/grayscale suppression entirely.

### 5. Path Resolution Fragility for Shared Assets in Subdirectory Routes - Severity: Major
* **Reviewer Lens:** `egm-design`
* **Affected Scope:** Lines 91–111, 205–207 (Component Architecture & Static Routes)
* **Discrepancy Description**: The transition from root flat files (`projects.html`, `blog.html`) to nested folder routes (`/work/index.html`, `/writing/index.html`) creates asset resolution ambiguities. If assets are referenced relatively (`style.css`, `chrome.js`), the browser requests `/work/style.css` (404 Not Found). If referenced via root-relative paths (`/style.css`), local previewing without a custom web server root or hosting under sub-paths breaks.
* **Rationale & Recommendation**: Define the canonical asset referencing strategy in the architecture: specify absolute root paths (`/style.css`, `/chrome.js`) with an explicit `<base href="/">` or enforce depth-aware relative pathing (`../style.css`) across all route templates.

### 6. Marketing Adjective Stacking and Subjective Editorial Prose - Severity: Major
* **Reviewer Lens:** `egm-style`
* **Affected Scope:** Lines 11, 22 (`## Overview`, `## The Problem`)
* **Discrepancy Description**: Phrasing such as *"clean, modern, soft text-led portfolio"*, *"airy layout"*, and *"interactive, playful landing fork"* relies on subjective, non-measurable aesthetic labels. Furthermore, *"soft"* is used redundantly twice in a single sentence (*"soft peach-to-aqua wash, soft teal accents"*).
* **Rationale & Recommendation**: Replace decorative adjectives with concrete architectural descriptions (e.g., *"two-column responsive landing page dividing into Work catalog and Writing index, styled with CSS gradients, high-contrast typography, and monospace metadata"*).

### 7. Subjective Psychological Framing in Problem Statement - Severity: Major
* **Reviewer Lens:** `egm-style`
* **Affected Scope:** Lines 18–20 (`## The Problem`, Items 1–3)
* **Discrepancy Description**: Describing previous designs as *"feel cluttered and distracting rather than modern and focused"* or critiquing *"generic cards"* and *"overcomplicated themes vs. essential accessibility"* evaluates subjective emotion rather than interface defects.
* **Rationale & Recommendation**: Restate defects in measurable technical and UX terms (e.g., *"High-contrast decorative canvas/SVG grain overlays impede legibility. Fixed card layouts do not differentiate short-form status notes from multi-paragraph essays. Multi-palette theme switching increases stylesheet maintenance without respecting prefers-color-scheme."*).

### 8. Emotionally Loaded Critiques in Alternatives Considered - Severity: Major
* **Reviewer Lens:** `egm-style`
* **Affected Scope:** Lines 164–178 (`## Alternatives Considered: Alternatives A, B, and C`)
* **Discrepancy Description**: Rationale statements cite *"template-like 'AI-generated' look"*, *"lacking human craft and feeling generic"*, *"over-colorful"*, and *"heavy boxes are unwanted"*. These read as personal aesthetic opinions rather than professional engineering trade-off evaluations.
* **Rationale & Recommendation**: Frame rejections strictly around engineering constraints and usability metrics (e.g., lack of clear primary navigation hierarchy for hiring workflows, excessive vertical DOM height on mobile viewports, or out-of-scope styling complexity).

### 9. Dynamic Blog Post SEO & Social Graph (OpenGraph) Metadata Gap - Severity: Nit
* **Reviewer Lens:** `egm-design`
* **Affected Scope:** Lines 35, 110–124 (Non-Goals & Markdown Pipeline)
* **Discrepancy Description**: Non-Goal NG2 disallows build steps or static site generators, and `script.js` renders Markdown dynamically client-side on `post.html?slug=<slug>`. Consequently, individual essays and notes share identical root fallback `<meta property="og:title">` and description tags when shared on LinkedIn, X/Twitter, or indexed by web scrapers.
* **Rationale & Recommendation**: Explicitly document the lack of per-post dynamic OpenGraph meta tags as an accepted architectural trade-off of the no-build static approach in the Non-Goals/Constraints section.

### 10. Typographic Asset Payload vs. First-Load Transfer Budget - Severity: Nit
* **Reviewer Lens:** `egm-design`
* **Affected Scope:** Lines 194–196 (Performance & Core Web Vitals)
* **Discrepancy Description**: Line 194 targets `< 50 KB total compressed first-load transfer (excluding images)`. The design introduces three font families (Grotesk headings, Serif pull-quotes, Monospace metadata). Webfont files will add 60–120 KB to the wire. Differing fallback font metrics will induce layout shifts unless fallback override metrics are defined.
* **Rationale & Recommendation**: Clarify in the NFR budget whether font binaries are included in the 50 KB limit. Specify metric-overrides (`size-adjust`, `ascent-override`) in the CSS font-face definitions to protect the CLS < 0.05 target asserted in Line 196.

### 11. Section Nomenclature and Structural Symmetry - Severity: Nit
* **Reviewer Lens:** `egm-structural`
* **Affected Scope:** Line 15 (`## The Problem`), Lines 25 & 32 (`## Goals`, `## Non-Goals`), Lines 11, 48
* **Discrepancy Description**: Section naming diverges slightly from the blueprint template (`Problem Statement` vs `The Problem`; split `## Goals` and `## Non-Goals` rather than combined section). Live domains are formatted as inline code rather than hyperlinks.
* **Rationale & Recommendation**: Align section titles with the standard blueprint and format URLs as standard hyperlinks.

### 12. Synonym Redundancy, Informal Maxims, and Unverified Claims - Severity: Nit
* **Reviewer Lens:** `egm-style`
* **Affected Scope:** Lines 13, 26, 27, 29, 50, 55, 60, 181–187
* **Discrepancy Description**: Phrases like *"split fork ('show don't tell')"*, *"softly dims"*, *"warm off-white"*, *"clean and concise without visual clutter"*, and unverified comparative assertions (*"safer, faster, and produces significantly lower long-term technical debt"*) add noise and informal phrasing.
* **Rationale & Recommendation**: Simplify phrasing, replace informal slogans with direct technical statements, and ground color descriptions in hex values or token names.
