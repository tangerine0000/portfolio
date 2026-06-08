// =====================================================================
//  chrome.js — the site's shared chrome, in one place.
//
//  Owns everything every page repeats: the nav, the footer, the theme
//  switcher, and the behaviour attached to them (theme cycling,
//  nav-shrink-on-scroll).
//
//  A page opts in with one attribute:   <body data-page="blog">
//  That value highlights the matching nav link. The post page uses
//  data-page="blog" so Blog stays highlighted while reading a post.
//
//  TO ADD A NAV LINK:  add one entry to NAV below.
//  TO ADD A THEME:     add one object to THEMES below.
// =====================================================================

// ---- Theme registry (single source of truth) -----------------------
// Each theme is just data: two inks + their soft tints. chrome.js
// applies them as CSS custom properties, so there are no per-theme
// blocks in style.css to keep in sync.
const THEMES = [
    { id: 'tangerine', ink1: '#f0530e', ink1soft: '#f8a072', ink2: '#1f4fd6', ink2soft: '#8aa6f2' },
    { id: 'flamingo',  ink1: '#ff2e74', ink1soft: '#ff9cbf', ink2: '#1f4fd6', ink2soft: '#8aa6f2' },
    { id: 'orchard',   ink1: '#6a2fb5', ink1soft: '#b794e0', ink2: '#1f9e57', ink2soft: '#8fd9af' },
    { id: 'solar',     ink1: '#e8a200', ink1soft: '#f4cf73', ink2: '#0f9bb0', ink2soft: '#82d2dd' },
];

// ---- Nav (single source of truth) ----------------------------------
const NAV = [
    { page: 'about',    href: 'about.html',    label: 'About' },
    { page: 'projects', href: 'projects.html', label: 'Projects' },
    { page: 'blog',     href: 'blog.html',     label: 'Blog' },
    { page: 'contact',  href: 'contact.html',  label: 'Contact' },
];

const SOCIAL = [
    { href: 'https://github.com/tangerine0000', label: 'GitHub', external: true },
    { href: 'https://www.linkedin.com/in/sperc/', label: 'LinkedIn', external: true },
    { href: 'mailto:tan.personal.mail@gmail.com', label: 'Email', external: false },
];

// ---- Theme application ---------------------------------------------
function applyTheme(theme) {
    const root = document.documentElement.style;
    root.setProperty('--ink-1', theme.ink1);
    root.setProperty('--ink-1-soft', theme.ink1soft);
    root.setProperty('--ink-2', theme.ink2);
    root.setProperty('--ink-2-soft', theme.ink2soft);
    document.documentElement.setAttribute('data-theme', theme.id);
}

function initTheme(button) {
    let savedId = localStorage.getItem('theme');
    let index = THEMES.findIndex(t => t.id === savedId);
    if (index < 0) index = 0; // migrate old warm/cool values -> default
    applyTheme(THEMES[index]);
    localStorage.setItem('theme', THEMES[index].id);

    button.addEventListener('click', () => {
        index = (index + 1) % THEMES.length;
        applyTheme(THEMES[index]);
        localStorage.setItem('theme', THEMES[index].id);
    });
}

// ---- Chrome injection ----------------------------------------------
function buildChrome() {
    const active = document.body.getAttribute('data-page');

    const navLinks = NAV.map(item =>
        `<li><a href="${item.href}"${item.page === active ? ' class="active" aria-current="page"' : ''}>${item.label}</a></li>`
    ).join('');

    const socialLinks = SOCIAL.map(s =>
        `<a href="${s.href}"${s.external ? ' target="_blank" rel="noopener"' : ''}>${s.label}</a>`
    ).join('');

    // Theme switcher
    const button = document.createElement('button');
    button.className = 'theme-switcher';
    button.setAttribute('aria-label', 'Switch theme');
    button.innerHTML = '<i class="fas fa-palette"></i>';

    // Header / nav
    const header = document.createElement('header');
    header.innerHTML =
        `<nav><h1>Tan Nguyen</h1><ul>${navLinks}</ul></nav>`;

    // Footer
    const footer = document.createElement('footer');
    footer.innerHTML =
        `<div class="footer-content">` +
        `<p>&copy; 2025 Tan Nguyen. All rights reserved.</p>` +
        `<div class="social-links">${socialLinks}</div>` +
        `</div>`;

    document.body.prepend(header);
    document.body.prepend(button);
    document.body.append(footer);

    return button;
}

// ---- Nav shrink on scroll ------------------------------------------
function initNavShrink() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('shrink', window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    onScroll();
}

// ---- Boot -----------------------------------------------------------
function initChrome() {
    if (!document.body) return;
    const button = buildChrome();
    initTheme(button);
    initNavShrink();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChrome);
} else {
    initChrome();
}
