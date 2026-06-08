// =====================================================================
//  docs.js — renders the wiki sidebar from one table of contents.
//  (Same pattern as the site's chrome.js: one source, no copy-paste.)
//  A page declares which doc it is with <body data-doc="architecture">.
// =====================================================================
const DOCS = [
    { id: 'index',        href: 'index.html',        label: 'Overview' },
    { id: 'architecture', href: 'architecture.html', label: 'Architecture' },
    { id: 'files',        href: 'files.html',        label: 'File Reference' },
    { id: 'guides',       href: 'guides.html',        label: 'How-To Guides' },
];

function renderWikiNav() {
    const nav = document.getElementById('wiki-nav');
    if (!nav) return;
    const active = document.body.getAttribute('data-doc');
    const links = DOCS.map(d =>
        `<li><a href="${d.href}"${d.id === active ? ' class="active" aria-current="page"' : ''}>${d.label}</a></li>`
    ).join('');
    nav.innerHTML = `<h2>Codebase Wiki</h2><ul>${links}</ul>`;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderWikiNav);
} else {
    renderWikiNav();
}
