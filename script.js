// =====================================================================
//  script.js — Page Logic & Dynamic Hydration
//  Renders Work Ledger, Writing Stream, and Markdown Posts.
// =====================================================================

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const ICON_ARROW_RIGHT = `<svg class="row-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>`;

const ICON_ARROW_UP_RIGHT = `<svg class="ext-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"></path><path d="M7 7h10v10"></path></svg>`;

// Parse 'YYYY-MM-DD' cleanly without timezone skew
function formatDate(iso) {
    if (!iso) return '';
    const parts = String(iso).split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return iso;
    const [y, m, d] = parts;
    return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function sentenceCase(s) {
    if (!s) return '';
    const str = String(s);
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

// ---------------------------------------------------------------------
//  1. Work Catalog Page (work/index.html)
// ---------------------------------------------------------------------
function renderWorkPage() {
    const list = document.getElementById('work-list');
    if (!list || typeof PROJECTS === 'undefined') return;

    if (!PROJECTS.length) {
        list.innerHTML = '<p class="empty-msg">No projects cataloged yet</p>';
        return;
    }

    const rawHash = (location.hash || '').replace('#', '').toLowerCase();
    const normalizedHash = rawHash === 'working' ? 'professional' : rawHash;
    let currentFilter = ['professional', 'personal'].includes(normalizedHash) ? normalizedHash : 'all';

    function renderProjectRow(p) {
        const isProfessional = p.category === 'professional' || p.category === 'working';
        const statusHtml = isProfessional
            ? `<span class="work-signature-tag"><span class="status-dot" aria-hidden="true">●</span> Production</span>`
            : `<span class="work-signature-tag">Open source</span>`;
        const stackStr = (p.stack || []).map(escapeHtml).join(' · ');

        return `
            <article class="work-row" data-category="${escapeHtml(p.category)}">
                <div class="work-row-head">
                    <h2 class="work-item-title">${escapeHtml(p.title)}</h2>
                    <div class="work-row-badges">
                        ${statusHtml}
                        <span class="work-year">${escapeHtml(p.year)}</span>
                    </div>
                </div>
                <p class="work-summary">${escapeHtml(p.summary)}</p>
                <div class="work-meta-line">
                    <span class="work-stack-inline">${stackStr}</span>
                    <div class="work-links">
                        ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener noreferrer"><span>Live demo</span>${ICON_ARROW_UP_RIGHT}</a>` : ''}
                        ${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener noreferrer"><span>Source</span>${ICON_ARROW_UP_RIGHT}</a>` : ''}
                    </div>
                </div>
            </article>
        `;
    }

    function updateView(filter) {
        currentFilter = filter;
        const professional = PROJECTS.filter(p => p.category === 'professional' || p.category === 'working');
        const personal = PROJECTS.filter(p => p.category === 'personal');

        const filterBar = `
            <div class="work-filter-bar" role="tablist" aria-label="Filter projects">
                <button type="button" role="tab" aria-selected="${filter === 'all'}" class="work-filter-btn ${filter === 'all' ? 'active' : ''}" data-filter="all">
                    <span>All</span>
                    <span class="filter-count">${PROJECTS.length}</span>
                </button>
                <button type="button" role="tab" aria-selected="${filter === 'professional'}" class="work-filter-btn ${filter === 'professional' ? 'active' : ''}" data-filter="professional">
                    <span>Production systems</span>
                    <span class="filter-count">${professional.length}</span>
                </button>
                <button type="button" role="tab" aria-selected="${filter === 'personal'}" class="work-filter-btn ${filter === 'personal' ? 'active' : ''}" data-filter="personal">
                    <span>Open source &amp; tools</span>
                    <span class="filter-count">${personal.length}</span>
                </button>
            </div>
        `;

        let content = '';

        if (filter === 'all') {
            content = `
                <div class="editorial-ledger">
                    <section class="editorial-section">
                        <div class="section-index">
                            <span class="idx-label">Production</span>
                            <span class="idx-sub">Company &amp; client systems</span>
                        </div>
                        <div class="section-body">
                            <div class="work-ledger">
                                ${professional.map(p => renderProjectRow(p)).join('')}
                            </div>
                        </div>
                    </section>

                    <section class="editorial-section">
                        <div class="section-index">
                            <span class="idx-label">Open source</span>
                            <span class="idx-sub">Tools &amp; ML experiments</span>
                        </div>
                        <div class="section-body">
                            <div class="work-ledger">
                                ${personal.map(p => renderProjectRow(p)).join('')}
                            </div>
                        </div>
                    </section>
                </div>
            `;
        } else {
            const isProf = filter === 'professional';
            const filtered = isProf ? professional : personal;
            content = `
                <div class="editorial-ledger">
                    <section class="editorial-section">
                        <div class="section-index">
                            <span class="idx-label">${isProf ? 'Production' : 'Open source'}</span>
                            <span class="idx-sub">${isProf ? 'Company & client systems' : 'Tools & ML experiments'}</span>
                        </div>
                        <div class="section-body">
                            <div class="work-ledger">
                                ${filtered.map(p => renderProjectRow(p)).join('')}
                            </div>
                        </div>
                    </section>
                </div>
            `;
        }

        list.innerHTML = filterBar + content;

        list.querySelectorAll('.work-filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const f = btn.getAttribute('data-filter');
                if (f === 'all') {
                    history.replaceState(null, '', location.pathname);
                } else {
                    history.replaceState(null, '', '#' + f);
                }
                updateView(f);
            });
        });
    }

    updateView(currentFilter);

    window.addEventListener('hashchange', () => {
        const raw = (location.hash || '').replace('#', '').toLowerCase();
        const normalized = raw === 'working' ? 'professional' : raw;
        const nextFilter = ['professional', 'personal'].includes(normalized) ? normalized : 'all';
        if (nextFilter !== currentFilter) {
            updateView(nextFilter);
        }
    });
}

// ---------------------------------------------------------------------
//  2. Writing Stream Page (writing/index.html)
// ---------------------------------------------------------------------
function renderWritingPage() {
    const list = document.getElementById('writing-list');
    if (!list) return;

    const posts = typeof POSTS !== 'undefined' && Array.isArray(POSTS) ? POSTS : [];

    if (!posts.length) {
        list.innerHTML = `
            <div class="writing-empty-state">
                <p class="writing-empty-title">No writing entries published yet</p>
                <p class="writing-empty-desc">
                    Essays, notes, and architectural reflections will be published here.
                    In the meantime, explore <a href="/work/">Work</a> or read <a href="/">About me</a>.
                </p>
            </div>
        `;
        return;
    }

    const rowsHtml = posts.map(p => `
        <article class="writing-row">
            <a href="/post.html?slug=${encodeURIComponent(p.slug)}" class="writing-row-link">
                <div class="writing-item-meta">
                    ${p.kind ? `<span class="kind-tag">${escapeHtml(sentenceCase(p.kind))}</span>` : ''}
                    <span class="writing-date">${formatDate(p.date)}</span>
                    ${p.readMins ? `<span class="writing-read">${p.readMins} min read</span>` : ''}
                </div>
                <h2 class="writing-item-title">
                    <span>${escapeHtml(p.title)}</span>
                    ${ICON_ARROW_RIGHT}
                </h2>
                ${p.lede ? `<p class="writing-lede">${escapeHtml(p.lede)}</p>` : ''}
                <p class="writing-excerpt">${escapeHtml(p.excerpt)}</p>
            </a>
        </article>
    `).join('');

    list.innerHTML = `
        <div class="editorial-ledger">
            <section class="editorial-section">
                <div class="section-index">
                    <span class="idx-label">Archive</span>
                    <span class="idx-sub">2026 — Present</span>
                </div>
                <div class="section-body">
                    <div class="writing-ledger">
                        ${rowsHtml}
                    </div>
                </div>
            </section>
        </div>
    `;
}

// ---------------------------------------------------------------------
//  3. Single Post View (post.html)
// ---------------------------------------------------------------------
async function renderPost() {
    const body = document.getElementById('post-content');
    if (!body || typeof POSTS === 'undefined') return;

    const titleEl = document.getElementById('post-title');
    const metaEl = document.getElementById('post-meta');
    const slug = new URLSearchParams(location.search).get('slug');
    const post = POSTS.find(p => p.slug === slug);

    if (!post) {
        document.title = 'Post not found — Tan Nguyen';
        if (titleEl) titleEl.textContent = 'Post not found';
        body.innerHTML = '<p>That post doesn’t exist. <a href="/writing/">Back to writing stream</a>.</p>';
        return;
    }

    document.title = `${post.title} — Tan Nguyen`;
    if (titleEl) titleEl.textContent = post.title;
    if (metaEl) {
        metaEl.innerHTML = `
            ${post.kind ? `<span class="kind-tag">${escapeHtml(sentenceCase(post.kind))}</span>` : ''}
            <span>${formatDate(post.date)}</span>
            ${post.readMins ? `<span>· ${post.readMins} min read</span>` : ''}
        `;
    }

    if (typeof marked === 'undefined') {
        body.innerHTML = '<p>Markdown renderer failed to load. Please refresh your page.</p>';
        return;
    }

    try {
        const res = await fetch(`/posts/${post.slug}.md`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        body.innerHTML = marked.parse(await res.text());
    } catch (err) {
        body.innerHTML = `
            <p>Couldn't load this post.</p>
            <p class="empty-msg">
                If opening directly from disk via file:///, browser security restricts fetching local files. Serve the directory over HTTP (e.g., <code>python -m http.server</code>).
            </p>
        `;
        console.error('Post load failed:', err);
    }
}

// ---------------------------------------------------------------------
//  DOM Initialization
// ---------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    renderWorkPage();
    renderWritingPage();
    renderPost();
});
