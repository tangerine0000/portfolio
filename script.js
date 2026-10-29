// =====================================================================
//  script.js — Page Logic & Dynamic Hydration
//  Renders Home Fork (Working vs Personal), Work Catalog, and Writing.
// =====================================================================

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Parse 'YYYY-MM-DD' cleanly without timezone skew
function formatDate(iso) {
    if (!iso) return '';
    const parts = String(iso).split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return iso;
    const [y, m, d] = parts;
    return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

// ---------------------------------------------------------------------
//  1. Home Fork Split View (index.html)
//  Left: Work (with working & personal project badges)
//  Right: Writing (essays & notes stream)
// ---------------------------------------------------------------------
function renderHomeFork() {
    const forkRoot = document.getElementById('fork-root');
    if (!forkRoot) return;

    const hasProjects = typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS);
    const hasPosts = typeof POSTS !== 'undefined' && Array.isArray(POSTS);

    if (!hasProjects) return;

    // Featured Work item (prioritize featured, or first project)
    const featuredProject = PROJECTS.find(p => p.featured) || PROJECTS[0];
    const otherProjects = PROJECTS.filter(p => p !== featuredProject).slice(0, 3);

    // Latest Writing items
    const sortedWriting = hasPosts ? [...POSTS].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)) : [];
    const latestPost = sortedWriting[0];
    const olderPosts = sortedWriting.slice(1, 3);

    forkRoot.innerHTML = `
        <!-- Work Fork Half -->
        <section class="fork-half fork-work" tabindex="0" aria-label="Work Section">
            <div>
                <header class="fork-header">
                    <span class="fork-label">// Work</span>
                    <a href="/work/" class="fork-title-link">
                        Work <span class="fork-arrow">→</span>
                    </a>
                    <p class="fork-subtitle">Systems, AI pipelines, and web tools across working and personal projects.</p>
                </header>

                <div class="fork-body">
                    ${featuredProject ? `
                    <div class="featured-snapshot">
                        <div class="snapshot-header-row">
                            <span class="project-badge ${featuredProject.category === 'working' ? 'badge-working' : 'badge-personal'}">
                                ${escapeHtml(featuredProject.categoryLabel || (featuredProject.category === 'working' ? 'Working Project' : 'Personal Project'))}
                            </span>
                            <span class="snapshot-tag">Featured Project</span>
                        </div>
                        <h2 class="snapshot-title">${escapeHtml(featuredProject.title)}</h2>
                        <p class="snapshot-summary">${escapeHtml(featuredProject.summary)}</p>
                        <div class="snapshot-stack">
                            ${(featuredProject.stack || []).map(s => `<span>${escapeHtml(s)}</span>`).join('')}
                        </div>
                        <div class="snapshot-links">
                            ${featuredProject.link ? `<a href="${featuredProject.link}" target="_blank" rel="noopener noreferrer">Live Demo ↗</a>` : ''}
                            ${featuredProject.repo ? `<a href="${featuredProject.repo}" target="_blank" rel="noopener noreferrer">GitHub Repo ↗</a>` : ''}
                        </div>
                    </div>
                    ` : ''}

                    <div class="fork-list" aria-label="Selected Projects">
                        ${otherProjects.map(p => `
                            <a href="/work/#${p.category || 'all'}" class="fork-list-item">
                                <span class="fork-item-meta">${p.year}</span>
                                <span class="fork-item-title">
                                    ${escapeHtml(p.title)}
                                    <span class="project-badge-inline ${p.category === 'working' ? 'badge-working' : 'badge-personal'}">
                                        ${p.category === 'working' ? 'Working' : 'Personal'}
                                    </span>
                                </span>
                                <span class="fork-item-meta">${(p.stack || []).slice(0, 2).join(' / ')}</span>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>

            <footer class="fork-footer">
                <a href="/work/" class="fork-more-link">View all projects (${PROJECTS.length}) →</a>
            </footer>
        </section>

        <!-- Writing Fork Half -->
        <section class="fork-half fork-writing" tabindex="0" aria-label="Writing Section">
            <div>
                <header class="fork-header">
                    <span class="fork-label">// Writing</span>
                    <a href="/writing/" class="fork-title-link">
                        Writing <span class="fork-arrow">→</span>
                    </a>
                    <p class="fork-subtitle">Essays, notes, and architectural reflections on full-stack development and AI.</p>
                </header>

                <div class="fork-body">
                    ${latestPost ? `
                    <div class="featured-writing">
                        <blockquote class="fork-lede-quote">
                            “${escapeHtml(latestPost.lede || latestPost.excerpt)}”
                        </blockquote>
                        <div class="fork-lede-meta">
                            ${latestPost.kind ? `<span class="kind-badge">${escapeHtml(latestPost.kind)}</span>` : ''}
                            <span>${formatDate(latestPost.date)}</span>
                            ${latestPost.readMins ? `<span>· ${latestPost.readMins} min read</span>` : ''}
                        </div>
                        <h2 class="snapshot-title" style="font-size:1.15rem; margin-bottom:0.4rem;">
                            <a href="/post.html?slug=${encodeURIComponent(latestPost.slug)}" style="color:var(--text-bright);">
                                ${escapeHtml(latestPost.title)}
                            </a>
                        </h2>
                        <p class="snapshot-summary">${escapeHtml(latestPost.excerpt)}</p>
                    </div>

                    <div class="fork-list" aria-label="Recent Posts">
                        ${olderPosts.map(p => `
                            <a href="/post.html?slug=${encodeURIComponent(p.slug)}" class="fork-list-item">
                                <span class="fork-item-meta">${p.kind || 'note'}</span>
                                <span class="fork-item-title">${escapeHtml(p.title)}</span>
                                <span class="fork-item-meta">${formatDate(p.date).split(',')[0]}</span>
                            </a>
                        `).join('')}
                    </div>
                    ` : `
                    <div class="featured-writing">
                        <p class="snapshot-tag">Articles & Notes</p>
                        <h2 class="snapshot-title" style="font-size:1.15rem; margin-bottom:0.4rem; color:var(--text-bright);">
                            Writing Stream
                        </h2>
                        <p class="snapshot-summary">
                            Essays, notes, and architectural reflections will be published here.
                        </p>
                        <div class="snapshot-links" style="margin-top: 1rem;">
                            <a href="/writing/">View writing archive →</a>
                        </div>
                    </div>
                    `}
                </div>
            </div>

            <footer class="fork-footer">
                <a href="/writing/" class="fork-more-link">View writing archive (${hasPosts ? POSTS.length : 0}) →</a>
            </footer>
        </section>
    `;
}

// ---------------------------------------------------------------------
//  2. Work Catalog Page (work/index.html)
//  Classified into Working Projects and Personal Projects with Filter Tabs
// ---------------------------------------------------------------------
function renderWorkPage() {
    const list = document.getElementById('work-list');
    if (!list || typeof PROJECTS === 'undefined') return;

    if (!PROJECTS.length) {
        list.innerHTML = '<p style="color:var(--muted)">No projects cataloged yet.</p>';
        return;
    }

    // Read active category from URL hash or default to 'all'
    const hash = (location.hash || '').replace('#', '').toLowerCase();
    let currentFilter = ['working', 'personal'].includes(hash) ? hash : 'all';

    function renderProjectCard(p) {
        const isWorking = p.category === 'working';
        const badgeClass = isWorking ? 'badge-working' : 'badge-personal';
        const badgeText = isWorking ? 'Working Project' : 'Personal Project';

        return `
            <article class="work-item" data-category="${p.category}">
                <div class="work-item-top">
                    <div class="work-item-title-group">
                        <span class="project-badge ${badgeClass}">${badgeText}</span>
                        <h2 class="work-item-title">
                            <span>${escapeHtml(p.title)}</span>
                            <span class="work-year">${escapeHtml(p.year)}</span>
                        </h2>
                    </div>
                    <div class="work-links">
                        ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener noreferrer">Live Demo ↗</a>` : ''}
                        ${p.repo ? `<a href="${p.repo}" target="_blank" rel="noopener noreferrer">Source ↗</a>` : ''}
                    </div>
                </div>
                <p class="work-summary">${escapeHtml(p.summary)}</p>
                <div class="work-stack">
                    ${(p.stack || []).map(s => `<span class="stack-pill">${escapeHtml(s)}</span>`).join('')}
                </div>
            </article>
        `;
    }

    function updateView(filter) {
        currentFilter = filter;
        const workingCount = PROJECTS.filter(p => p.category === 'working').length;
        const personalCount = PROJECTS.filter(p => p.category === 'personal').length;

        // Render Tabs
        const filterBar = `
            <div class="work-filter-bar" role="tablist" aria-label="Filter projects">
                <button type="button" class="work-filter-btn ${filter === 'all' ? 'active' : ''}" data-filter="all">
                    All <span class="filter-count">${PROJECTS.length}</span>
                </button>
                <button type="button" class="work-filter-btn ${filter === 'working' ? 'active' : ''}" data-filter="working">
                    Working Projects <span class="filter-count">${workingCount}</span>
                </button>
                <button type="button" class="work-filter-btn ${filter === 'personal' ? 'active' : ''}" data-filter="personal">
                    Personal Projects <span class="filter-count">${personalCount}</span>
                </button>
            </div>
        `;

        let content = '';

        if (filter === 'all') {
            const working = PROJECTS.filter(p => p.category === 'working');
            const personal = PROJECTS.filter(p => p.category === 'personal');

            content = `
                <section class="work-group-section">
                    <div class="work-group-header">
                        <span class="group-label">// Working Projects</span>
                        <p class="group-desc">Projects engineered for working and professional production environments.</p>
                    </div>
                    ${working.map(renderProjectCard).join('')}
                </section>

                <section class="work-group-section" style="margin-top: 3.5rem;">
                    <div class="work-group-header">
                        <span class="group-label">// Personal Projects</span>
                        <p class="group-desc">Hobby projects, open-source utilities, and personal experiments.</p>
                    </div>
                    ${personal.map(renderProjectCard).join('')}
                </section>
            `;
        } else {
            const filtered = PROJECTS.filter(p => p.category === filter);
            content = filtered.map(renderProjectCard).join('');
        }

        list.innerHTML = filterBar + '<div class="work-items-container">' + content + '</div>';

        // Add Tab Listeners
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

    // Listen for hash changes (e.g. from home page link clicks)
    window.addEventListener('hashchange', () => {
        const newHash = (location.hash || '').replace('#', '').toLowerCase();
        const nextFilter = ['working', 'personal'].includes(newHash) ? newHash : 'all';
        if (nextFilter !== currentFilter) {
            updateView(nextFilter);
        }
    });
}

// ---------------------------------------------------------------------
//  3. Writing Stream Page (writing/index.html)
// ---------------------------------------------------------------------
function renderWritingPage() {
    const list = document.getElementById('writing-list');
    if (!list) return;

    const posts = typeof POSTS !== 'undefined' && Array.isArray(POSTS) ? POSTS : [];

    if (!posts.length) {
        list.innerHTML = `
            <div class="writing-empty-state">
                <p class="writing-empty-title">No writing entries published yet.</p>
                <p class="writing-empty-desc">
                    Essays, notes, and architectural reflections will be published here.
                    In the meantime, feel free to explore my <a href="/work/">Work</a> or read more <a href="/about.html">About me</a>.
                </p>
            </div>
        `;
        return;
    }

    list.innerHTML = posts.map(p => `
        <article class="writing-item">
            <div class="writing-item-meta">
                ${p.kind ? `<span class="kind-badge">${escapeHtml(p.kind)}</span>` : ''}
                <span>${formatDate(p.date)}</span>
                ${p.readMins ? `<span>· ${p.readMins} min read</span>` : ''}
            </div>
            <h2 class="writing-item-title">
                <a href="/post.html?slug=${encodeURIComponent(p.slug)}">${escapeHtml(p.title)}</a>
            </h2>
            ${p.lede ? `<p class="writing-lede">“${escapeHtml(p.lede)}”</p>` : ''}
            <p class="writing-excerpt">${escapeHtml(p.excerpt)}</p>
        </article>
    `).join('');
}

// ---------------------------------------------------------------------
//  4. Single Post View (post.html)
// ---------------------------------------------------------------------
async function renderPost() {
    const body = document.getElementById('post-content');
    if (!body || typeof POSTS === 'undefined') return;

    const titleEl = document.getElementById('post-title');
    const metaEl = document.getElementById('post-meta');
    const slug = new URLSearchParams(location.search).get('slug');
    const post = POSTS.find(p => p.slug === slug);

    if (!post) {
        document.title = 'Post not found - Tan Nguyen';
        if (titleEl) titleEl.textContent = 'Post not found';
        body.innerHTML = '<p>That post doesn’t exist. <a href="/writing/" style="color:var(--accent);">Back to writing stream</a>.</p>';
        return;
    }

    document.title = `${post.title} - Tan Nguyen`;
    if (titleEl) titleEl.textContent = post.title;
    if (metaEl) {
        metaEl.innerHTML = `
            ${post.kind ? `<span class="kind-badge">${escapeHtml(post.kind)}</span>` : ''}
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
            <p style="color:var(--muted); font-size:0.9rem;">
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
    renderHomeFork();
    renderWorkPage();
    renderWritingPage();
    renderPost();
});
