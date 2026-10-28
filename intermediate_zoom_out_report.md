# Intermediate Architectural Audit: docs/designs/portfolio_redesign.md (Stage 8)

**Role:** Skeptical Architect (`egm-zoom-out`)  
**Standard:** Zoom-Out Standard (`zoom-out-standard.md`)  
**Target File:** [`docs/designs/portfolio_redesign.md`](file:///C:/Users/tanpe/portfolio/docs/designs/portfolio_redesign.md) (Lines 1–314)  
**Context:** Synthesis of Stage 6 (Comprehension) and Stage 7 (Critic) findings  

---

### High-Altitude Assessment Summary

The fundamental architecture of the portfolio redesign remains sound, lean, and appropriately minimalist. It strictly adheres to Non-Goals (pure static vanilla HTML/CSS/JS, zero build tool overhead, no runtime backend dependencies, and decoupled static JSON/JS manifests).

However, reviewing the document in light of the Comprehension and Critic reports reveals that complexity is threatening to creep in through two vectors:
1. **Premature implementation details (Altitude Drops)** where hardcoded CSS rules directly caused accessibility (WCAG AA contrast) and touch-device interaction bugs.
2. **Mitigation over-engineering vs. architectural contradictions**, specifically concerning how static route pathing, pre-paint theme execution, and data manifest schemas are handled.

Below are the prioritized findings enforcing minimalism, YAGNI, and clean high-altitude architectural boundaries.

---

### Findings

#### 1. Severity: Major
* **Affected Scope:** Section 4: "Interactive CSS Fork Mechanism" (Lines 127–158)
* **Simplicity Rationale (Altitude Drop & Premature Code Leaks):**
  - Section 4 dumps 31 lines of raw CSS (`.fork-container`, `opacity: 0.45`, `filter: grayscale(0.4)`, `transform: translateY(-2px)`, unscoped `:has()`).
  - **Architectural Critique:** This low-level altitude drop directly baked in the major defects caught during the Critic review:
    1. Reducing opacity to `0.45` drops text contrast to ~2.4:1, violating WCAG 2.1 AA requirements.
    2. Unscoped `:has(.fork-half:hover)` creates sticky dimmed states on touch devices.
  - The Zoom-Out Standard mandates that architectural specifications focus on interfaces, interaction concepts, and contracts, not concrete styling declarations. 
  - **Recommendation:** Replace Section 4 with a high-level behavioral contract:
    - Specify that the desktop landing split highlights the hovered/focused side while softly de-emphasizing the sibling using ambient background wash / hairline adjustments without dropping text contrast below WCAG AA (4.5:1).
    - Mandate that hover states are encapsulated within `@media (hover: hover) and (pointer: fine)` so touchscreens default to a neutral, un-dimmed stacked layout.
    - Delete the premature raw CSS block from the architectural design.

#### 2. Severity: Major
* **Affected Scope:** Section 2: "Component Boundaries" (Line 96), Section 3: "Data Flow" (Lines 116–118), and Target Files (Lines 239, 276)
* **Simplicity Rationale (Architectural Placement Contradiction in Theme Initialization):**
  - Line 239 states that `chrome.js` will *"Export inline initialization helper to prevent flash-of-light-theme"*, while line 276 mentions adding the script only to `index.html`.
  - **Architectural Critique:** In a static site without bundlers or server-side rendering (Non-Goal NG2), an external deferred script like `chrome.js` cannot execute synchronously inline in `<head>` before first paint. Attempting to have `chrome.js` manage pre-paint logic is an architectural impossibility.
  - Furthermore, Critic review correctly identified that reading `localStorage` synchronously in `<head>` without error handling causes unhandled `SecurityError` / `DOMException` failures in hardened browser contexts (e.g. Safari private browsing).
  - **Recommendation:** Establish a clean, minimal boundary:
    - Pre-paint theme detection is defined as a uniform 4-line inline `<head>` script snippet (`try { localStorage... } catch(e) { matchMedia... }`) placed directly in each HTML shell (`index.html`, `work/index.html`, `writing/index.html`, `about.html`, `post.html`).
    - `chrome.js` retains sole responsibility for runtime post-paint UI concerns: rendering the side-rail navigation, handling user click toggle events, and updating `localStorage`.

#### 3. Severity: Major
* **Affected Scope:** Section 1: "System Structure", Section 2: "Component Boundaries", and Target Files (Lines 81, 94, 218–222, 237, 286, 302)
* **Simplicity Rationale (Route Consistency vs. Over-Engineered Path Mitigation):**
  - The transition to nested directory routes (`/work/index.html`, `/writing/index.html`) raised concerns regarding asset resolution. Proposing complex mitigations like `<base href="/">` is an anti-pattern: it disrupts in-page fragment links (`#section`), alters query string semantics, and breaks when run under arbitrary subdirectories.
  - The site already uses standard root-relative asset paths (`/style.css`, `/chrome.js`, `/projects.js`), which work consistently across Netlify and local preview servers (`python -m http.server`).
  - However, there is an unresolved routing mismatch: `chrome.js` links to `/about/` (line 94, 237), while target file 10 is `about.html` at repository root (line 286). On local static servers, linking to `/about/` returns a 404 if only `about.html` exists.
  - **Recommendation:** Keep path resolution simple with root-relative paths (`/style.css`). Eliminate routing asymmetry by standardizing the About route to match `/work/` and `/writing/` (i.e. `/about/index.html`), or explicitly retain `/about.html` across navigation links and Netlify redirects.

#### 4. Severity: Major
* **Affected Scope:** Lines 41–44, 100, 196, 252 (Open Questions Q1, Q3; `PROJECTS` Schema; Performance NFRs)
* **Simplicity Rationale (YAGNI Creep: Ghost Media Schemas & Artificial Content):**
  - The design continues to specify `image?: string` in `PROJECTS` (Line 100, 252), track screenshot asset URLs in Q1 (Line 41), and reserve layout shift budgets for *"project preview snapshots and images"* (Line 196).
  - Simultaneously, Q3 (Line 43) proposes writing dummy placeholder notes to artificially balance visual density in the writing fork.
  - **Architectural Critique:** The workspace codebase (`projects.js`) confirms that projects are rendered purely via text, stack pills, and GitHub/demo links—no images exist or are rendered. Retaining `image` schema fields and image CLS budgeting contradicts Goal G1 (*"without boxes, cards, or shadows"*) and clutters the interface contract with ghost requirements. Likewise, manufacturing placeholder blog posts is artificial scope bloat.
  - **Recommendation:** Purge `image?: string`, remove Q1 and Q3, and delete the image CLS metric. The split layout must gracefully accommodate real content density.

#### 5. Severity: Nit
* **Affected Scope:** Section 2: "Manifest Contracts" (Lines 100, 104) & `renderHomeFork()` (Lines 107, 269)
* **Simplicity Rationale (Selection Contract Minimalism for Writing Stream):**
  - Line 269 specifies that `renderHomeFork()` loads "top featured items from `PROJECTS` and `POSTS`". Line 100 omits `featured?: boolean` from the `PROJECTS` contract, while `POSTS` has no concept of `featured`.
  - To avoid inventing speculative schema flags on `POSTS` (YAGNI), the architecture should define a minimal selection heuristic:
    - Work side: Selects the project with `featured: true` (fallback to first entry).
    - Writing side: Selects the *N* most recent posts chronologically from `POSTS`.
  - Formally update the TypeScript interface contract in Section 2 to include `featured?: boolean` on `PROJECTS`.

#### 6. Severity: Nit
* **Affected Scope:** Section: "Target Files to Create/Modify" (Lines 212–297)
* **Simplicity Rationale (Scope Completeness in Implementation Plan):**
  - As flagged in the Comprehension report, `post.html` is a primary reading view cited in Data Flow (Lines 110, 124) and Verification (Line 303), but is missing from the 12 target files in the Detailed Implementation Plan.
  - Omitting `post.html` leaves it orphaned with outdated risograph assets and missing side-rail navigation.
  - **Recommendation:** Add `post.html` to the Target Files list to ensure complete migration coverage.

---

### Conclusion

The system does not suffer from fundamental architectural bloat, but it requires pruning of **premature CSS details (Section 4)** and **YAGNI media artifacts (Q1, image schema)**. By formalizing simple root-relative asset pathing, isolating the pre-paint inline script with defensive `try...catch` handling, and standardizing route conventions, the redesign will maintain a clean, resilient, and accessible static architecture.
