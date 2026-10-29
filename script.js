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
//  Shows Working Projects (left) & Personal Projects (right)
// ---------------------------------------------------------------------
function renderHomeFork() {
    const forkRoot = document.getElementById('fork-root');
    if (!forkRoot) return;

    const hasProjects = typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS);
    if (!hasProjects) return;

    const workingProjects = PROJECTS.filter(p => p.category === 'working');
    const personalProjects = PROJECTS.filter(p => p.category === 'personal');

    const featuredWorking = workingProjects.find(p => p.featured) || workingProjects[0];
    const otherWorking = workingProjects.filter(p => p !== featuredWorking).slice(0, 3);

    const featuredPersonal = personalProjects.find(p => p.featured) || personalProjects[0];
    const otherPersonal = personalProjects.filter(p => p !== featuredPersonal).slice(0, 3);

    forkRoot.innerHTML = `
        <!-- Working Projects Fork Half -->
        <section class="fork-half fork-working" tabindex="0" aria-label="Working Projects Section">
            <div>
                <header class="fork-header">
                    <span class="fork-label">// Work · Professional</span>
                    <a href="/work/#working" class="fork-title-link">
                        Working Projects <span class="fork-arrow">→</span>
                    </a>
                    <p class="fork-subtitle">Systems and engineering pipelines developed for working & production environments.</p>
                </header>

                <div class="fork-body">
                    ${featuredWorking ? `
                    <div class="featured-snapshot">
                        <div class="snapshot-header-row">
                            <span class="project-badge badge-working">Working Project</span>
                            <span class="snapshot-tag">Featured</span>
                        </div>
                        <h2 class="snapshot-title">${escapeHtml(featuredWorking.title)}</h2>
                        <p class="snapshot-summary">${escapeHtml(featuredWorking.summary)}</p>
                        <div class="snapshot-stack">
                            ${(featuredWorking.stack || []).map(s => `<span>${escapeHtml(s)}</span>`).join('')}
                        </div>
                        <div class="snapshot-links">
                            ${featuredWorking.link ? `<a href="${featuredWorking.link}" target="_blank" rel="noopener noreferrer">Live Demo ↗</a>` : ''}
                            ${featuredWorking.repo ? `<a href="${featuredWorking.repo}" target="_blank" rel="noopener noreferrer">GitHub Repo ↗</a>` : ''}
                        </div>
                    </div>
                    ` : ''}

                    <div class="fork-list" aria-label="Selected Working Projects">
                        ${otherWorking.map(p => `
                            <a href="/work/#working" class="fork-list-item">
                                <span class="fork-item-meta">${p.year}</span>
                                <span class="fork-item-title">${escapeHtml(p.title)}</span>
                                <span class="fork-item-meta">${(p.stack || []).slice(0, 2).join(' / ')}</span>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>

            <footer class="fork-footer">
                <a href="/work/#working" class="fork-more-link">View all working projects (${workingProjects.length}) →</a>
            </footer>
        </section>

        <!-- Personal Projects Fork Half -->
        <section class="fork-half fork-personal" tabindex="0" aria-label="Personal Projects Section">
            <div>
                <header class="fork-header">
                    <span class="fork-label">// Personal · Hobby & Experiments</span>
                    <a href="/work/#personal" class="fork-title-link">
                        Personal Projects <span class="fork-arrow">→</span>
                    </a>
                    <p class="fork-subtitle">Personal tools, open-source utilities, and independent experiments.</p>
                </header>

                <div class="fork-body">
                    ${featuredPersonal ? `
                    <div class="featured-snapshot">
                        <div class="snapshot-header-row">
                            <span class="project-badge badge-personal">Personal Project</span>
                            <span class="snapshot-tag">Featured</span>
                        </div>
                        <h2 class="snapshot-title">${escapeHtml(featuredPersonal.title)}</h2>
                        <p class="snapshot-summary">${escapeHtml(featuredPersonal.summary)}</p>
                        <div class="snapshot-stack">
                            ${(featuredPersonal.stack || []).map(s => `<span>${escapeHtml(s)}</span>`).join('')}
                        </div>
                        <div class="snapshot-links">
                            ${featuredPersonal.link ? `<a href="${featuredPersonal.link}" target="_blank" rel="noopener noreferrer">Live Demo ↗</a>` : ''}
                            ${featuredPersonal.repo ? `<a href="${featuredPersonal.repo}" target="_blank" rel="noopener noreferrer">GitHub Repo ↗</a>` : ''}
                        </div>
                    </div>
                    ` : ''}

                    <div class="fork-list" aria-label="Selected Personal Projects">
                        ${otherPersonal.map(p => `
                            <a href="/work/#personal" class="fork-list-item">
                                <span class="fork-item-meta">${p.year}</span>
                                <span class="fork-item-title">${escapeHtml(p.title)}</span>
                                <span class="fork-item-meta">${(p.stack || []).slice(0, 2).join(' / ')}</span>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>

            <footer class="fork-footer">
                <a href="/work/#personal" class="fork-more-link">View all personal projects (${personalProjects.length}) →</a>
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
//  Writing is currently paused. Clean, minimalist state without note/personal tags.
// ---------------------------------------------------------------------
function renderWritingPage() {
    const list = document.getElementById('writing-list');
    if (!list) return;

    const posts = typeof POSTS !== 'undefined' && Array.isArray(POSTS) ? POSTS : [];

    if (!posts.length) {
        list.innerHTML = `
            <div class="writing-empty-state">
                <p class="writing-empty-title">Writing is paused for now.</p>
                <p class="writing-empty-desc">
                    I am currently prioritizing engineering systems and active projects. 
                    In the meantime, feel free to explore my <a href="/work/">Work</a> or read more <a href="/about.html">About me</a>.
                </p>
            </div>
        `;
        return;
    }

    list.innerHTML = posts.map(p => `
        <article class="writing-item">
            <div class="writing-item-meta">
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
        body.innerHTML = '<p>That post doesn’t exist. <a href="/work/" style="color:var(--accent);">Explore my work</a>.</p>';
        return;
    }

    document.title = `${post.title} - Tan Nguyen`;
    if (titleEl) titleEl.textContent = post.title;
    if (metaEl) {
        metaEl.innerHTML = `
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
