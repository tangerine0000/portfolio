// =====================================================================
//  script.js — page-content behaviour.
//  Shared chrome (nav, footer, theme, nav-shrink) lives in chrome.js.
// =====================================================================

// ---- Smooth scroll for in-page anchors ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            if (history.pushState) {
                history.pushState(null, '', targetId);
            } else {
                location.hash = targetId;
            }
        }
    });
});

// ---------------------------------------------------------------------
//  Blog — manifest-driven (POSTS comes from posts.js)
// ---------------------------------------------------------------------
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

// Parse 'YYYY-MM-DD' manually — avoids new Date() timezone shifts.
function formatDate(iso) {
    const parts = String(iso).split('-').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return iso;
    const [y, m, d] = parts;
    return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

function postMetaHtml(post) {
    const tags = (post.tags || []).map(t => `<span class="post-tag">${escapeHtml(t)}</span>`).join('');
    const read = post.readMins ? `<span>· ${post.readMins} min read</span>` : '';
    return `${tags}<span class="post-date">${formatDate(post.date)}</span>${read}`;
}

function sortedPosts() {
    // newest first; date strings sort lexically when 'YYYY-MM-DD'
    return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

// Blog index — render cards from the manifest
function renderBlogIndex() {
    const list = document.getElementById('post-list');
    if (!list || typeof POSTS === 'undefined') return;

    const posts = sortedPosts();
    if (!posts.length) {
        list.innerHTML = '<p style="text-align:center;color:var(--ink-soft)">No posts yet — check back soon.</p>';
        return;
    }

    list.innerHTML = posts.map(p => `
        <a class="post-card" href="post.html?slug=${encodeURIComponent(p.slug)}">
            <div class="post-meta">${postMetaHtml(p)}</div>
            <h3>${escapeHtml(p.title)}</h3>
            <p class="post-excerpt">${escapeHtml(p.excerpt || '')}</p>
            <span class="read-more">Read post</span>
        </a>`).join('');
}

// Single post — look up slug in manifest, fetch + render the markdown
async function renderPost() {
    const body = document.getElementById('post-content');
    if (!body || typeof POSTS === 'undefined') return;

    const titleEl = document.getElementById('post-title');
    const metaEl = document.getElementById('post-meta');
    const slug = new URLSearchParams(location.search).get('slug');
    const post = POSTS.find(p => p.slug === slug); // restrict fetch to known slugs

    if (!post) {
        document.title = 'Post not found - Tan Nguyen';
        if (titleEl) titleEl.textContent = 'Post not found';
        body.innerHTML = '<p>That post doesn’t exist. <a href="blog.html">Back to the blog</a>.</p>';
        return;
    }

    document.title = `${post.title} - Tan Nguyen`;
    if (titleEl) titleEl.textContent = post.title;
    if (metaEl) metaEl.innerHTML = postMetaHtml(post);

    if (typeof marked === 'undefined') {
        body.innerHTML = '<p>Markdown renderer failed to load. Check your connection and refresh.</p>';
        return;
    }

    try {
        const res = await fetch(`posts/${post.slug}.md`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        body.innerHTML = marked.parse(await res.text());
    } catch (err) {
        body.innerHTML =
            '<p>Couldn’t load this post.</p>' +
            '<p style="color:var(--ink-soft)">If you opened this page directly from disk, the browser blocks reading the Markdown file. Serve the folder over HTTP — e.g. run <code>python -m http.server</code> in this folder and open <code>http://localhost:8000/blog.html</code>. On a host like Netlify it works as-is.</p>';
        console.error('Post load failed:', err);
    }
}

// ---- Project tabs ----
document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            button.classList.add('active');
            const pane = document.getElementById(button.getAttribute('data-tab'));
            if (pane) pane.classList.add('active');
        });
    });

    // ---- Blog ----
    renderBlogIndex();
    renderPost();

    // ---- Contact form (no backend — client feedback only) ----
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('Form submitted:', {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            });
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
});
