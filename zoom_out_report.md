# Architectural Audit: docs/designs/portfolio_redesign.md

**Standard:** Zoom-Out Standard (`zoom-out-standard.md`)  
**Auditor:** Skeptical Architect (egm-zoom-out)  
**Target:** [`docs/designs/portfolio_redesign.md`](file:///C:/Users/tanpe/portfolio/docs/designs/portfolio_redesign.md) (Lines 1–314)

---

### High-Altitude Assessment Summary

The design document succeeds in establishing a clear root-cause motivation: retiring the high-friction, cluttered risograph aesthetic and 4-palette theme switcher in favor of an airy, text-led, dual-audience (recruiters vs. blog readers) layout. By strictly establishing Non-Goals (no bundler/frameworks, static HTML/CSS/JS, no backend forms), the architecture maintains a minimalist footprint and simple client-side data flow.

However, several violations of the **Zoom-Out Standard** were identified, primarily concerning **speculative YAGNI attributes**, **premature CSS implementation details (altitude drop)**, and **interface contract inconsistencies**.

---

### Findings

#### 1. Severity: Major
* **Affected Scope:** Lines 41, 100, 196, 252 (Open Question Q1; Section 2: Component Boundaries; Section: Non-Functional Requirements; Target Files: `projects.js`)
* **Simplicity Rationale (YAGNI / Ghost Requirements):**
  - The design repeatedly specifies project image assets:
    - Line 41 (Q1): *"What are the exact project screenshot assets and live repo URLs to place in `projects.js`?"*
    - Line 100: Manifest contract specifies `image?: string`.
    - Line 196: Specifies layout shift (CLS) budgeting for *"project preview snapshots and images"*.
    - Line 252: Sample data includes `image: '/images/chatbot.png'`.
  - **Critique:** The core architectural philosophy of this redesign is explicitly text-led: *"without boxes, cards, or shadows"* (Goal G1, Line 26). In actual layout and hydration (`renderHomeFork()` and `renderWorkPage()`), no images or preview thumbnails are ever rendered; all project previews rely exclusively on clean typography, stack pills, and links. Retaining `image` in the manifest schema, budgeting CLS for non-existent image containers, and tracking an open question for screenshot assets creates speculative work and dead schema weight (YAGNI). Either remove `image` entirely or clarify if and where image snapshots fit into a text-led system.

---

#### 2. Severity: Major
* **Affected Scope:** Lines 127–158 (Section 4: "Interactive CSS Fork Mechanism")
* **Simplicity Rationale (Anti-Weeds / Altitude Drop):**
  - Section 4 plunges directly from architectural data flow diagrams into 30+ lines of raw CSS implementation details (`.fork-container`, `:has()`, `opacity: 0.45`, `filter: grayscale(0.4)`, `transform: translateY(-2px)`, media query breakpoints).
  - **Critique:** The Zoom-Out Standard explicitly dictates: *"High-level sections must focus on architecture, interfaces, and data flows, not code-level implementation details."* The architectural concept is concisely captured in one sentence: *"The desktop landing fork uses CSS relational `:has()` and `:focus-within` selectors to dim the non-focused sibling."* Dumping full CSS rule blocks inside the high-level architecture section is an altitude drop that pollutes the architectural blueprint with styling code that belongs in `style.css` and the implementation phase.

---

#### 3. Severity: Major
* **Affected Scope:** Section 2: "Component Boundaries & Manifest Contracts", Line 100 vs. Lines 107, 254
* **Simplicity Rationale (Interface Contract Incompleteness):**
  - The formal `PROJECTS` manifest contract defined on Line 100:
    ```typescript
    { slug: string, title: string, year: string, stack: string[], summary: string, image?: string, link?: string, repo?: string }
    ```
    omits the `featured?: boolean` property.
  - Yet on Line 107 (`renderHomeFork()`) and Line 254 (sample object), the dynamic landing fork relies fundamentally on `featured: true` to select the primary highlighted project for the Work half.
  - **Critique:** Component boundaries and public data schemas must be exact contracts. Omitting `featured?: boolean` while retaining the unused `image?: string` introduces contract drift between the manifest specification and the client rendering pipeline.

---

#### 4. Severity: Nit
* **Affected Scope:** Lines 4, 39–44 (Document Header Status vs. Open Questions)
* **Simplicity Rationale (Contradictory Approval State & Artificial Scope):**
  - The document header states `Status: Approved`, yet lines 39–44 present three unresolved Open Questions (Q1 regarding screenshot assets, Q2 regarding typography family selection, and Q3 regarding adding placeholder posts to balance layout density).
  - **Critique:** An approved design should not carry unresolved architectural choices (e.g. typography token selection in Q2). Furthermore, Q3 proposes adding two placeholder/dummy posts solely to achieve visual balance in a stream, violating the principle of building for real requirements rather than artificial padding. Open questions should be closed or resolved before marking the specification approved.

---

#### 5. Severity: Nit
* **Affected Scope:** Lines 204–206, 214–222 (Migration & Target Files: `_redirects`)
* **Simplicity Rationale (Incomplete Migration Routing):**
  - Non-Goal NG3 (Line 36) removes the mock contact form, and Target File 10 (`about.html`, Line 286) consolidates contact channels into the about page.
  - However, the `_redirects` configuration in lines 218–222 specifies redirects only for `/work`, `/writing`, `/projects.html`, and `/blog.html`. It omits redirecting `/contact.html` (and `/contact`) to `/about.html`.
  - **Critique:** Omitting the legacy contact URL mapping from the migration plan risks broken links or 404s for external visitors, creating an architectural loose end.

---

### Conclusion

The overall direction, data flow, and non-goals are strong and aligned with minimalist static web design. The document should be refined to:
1. Strip out speculative `image` attributes and Q1.
2. Replace the 30-line CSS block in Section 4 with a high-level interaction description.
3. Add `featured?: boolean` to the formal `PROJECTS` schema contract.
4. Resolve the Open Questions and include the `/contact.html` redirect in the migration table.
