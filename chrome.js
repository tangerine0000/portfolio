// =====================================================================
//  chrome.js — Shared Chrome & Responsive Side-Rail Shell
//  Owns side-rail navigation, dark mode toggling, and social channels.
// =====================================================================

// Navigation items
const NAV = [
    { page: 'home',    href: '/',           label: 'index' },
    { page: 'work',    href: '/work/',      label: 'work' },
    { page: 'writing', href: '/writing/',   label: 'writing' },
    { page: 'about',   href: '/about.html', label: 'about' },
];

// Social channels
const SOCIAL = [
    { href: 'https://github.com/tangerine0000', label: 'GitHub', external: true },
    { href: 'https://www.linkedin.com/in/sperc/', label: 'LinkedIn', external: true },
    { href: 'mailto:tan.personal.mail@gmail.com', label: 'Email', external: false },
];

// Icon SVGs
const SUN_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

const MOON_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

// ---- Theme management ----
function initTheme(button) {
    function getMode() {
        return document.documentElement.getAttribute('data-mode') || 'light';
    }

    function updateButton(mode) {
        if (!button) return;
        const icon = button.querySelector('.theme-icon');
        const label = button.querySelector('.theme-label');
        if (mode === 'dark') {
            if (icon) icon.innerHTML = SUN_SVG;
            if (label) label.textContent = 'light';
            button.setAttribute('aria-label', 'Switch to light mode');
        } else {
            if (icon) icon.innerHTML = MOON_SVG;
            if (label) label.textContent = 'dark';
            button.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    // Set initial toggle button state
    updateButton(getMode());

    if (button) {
        button.addEventListener('click', () => {
            const current = getMode();
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-mode', next);
            localStorage.setItem('mode', next);
            updateButton(next);
        });
    }

    // Listen for OS color scheme shifts if user has not explicitly set preference
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('mode')) {
                const mode = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-mode', mode);
                updateButton(mode);
            }
        });
    }
}

// ---- Chrome injection ----
function buildChrome() {
    const active = document.body.getAttribute('data-page');

    const navLinks = NAV.map(item => {
        const isActive = item.page === active;
        return `<li><a href="${item.href}"${isActive ? ' class="active" aria-current="page"' : ''}>${item.label}</a></li>`;
    }).join('');

    const socialLinks = SOCIAL.map(s =>
        `<a href="${s.href}"${s.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${s.label}</a>`
    ).join('');

    const rail = document.createElement('aside');
    rail.className = 'side-rail';
    rail.setAttribute('aria-label', 'Primary Navigation');
    rail.innerHTML = `
        <div class="rail-brand">
            <a href="/" class="brand-name">Tan Nguyen</a>
            <span class="brand-sub">developer</span>
        </div>
        <nav class="rail-nav">
            <ul>${navLinks}</ul>
        </nav>
        <div class="rail-bottom">
            <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Toggle dark mode">
                <span class="theme-icon" aria-hidden="true"></span>
                <span class="theme-label">mode</span>
            </button>
            <div class="rail-social">${socialLinks}</div>
        </div>
    `;

    document.body.prepend(rail);

    // Append mobile social section to main if not on index
    const mainEl = document.querySelector('main') || document.querySelector('.main-content');
    if (mainEl && active !== 'home' && !document.querySelector('.mobile-social')) {
        const mobSocial = document.createElement('div');
        mobSocial.className = 'mobile-social';
        mobSocial.innerHTML = `
            <span class="mobile-social-title">Connect</span>
            <div class="mobile-social-links">${socialLinks}</div>
        `;
        const wrapper = mainEl.querySelector('.page-wrapper') || mainEl;
        wrapper.appendChild(mobSocial);
    }

    return rail.querySelector('#theme-toggle');
}

// ---- Boot ----
function initChrome() {
    if (!document.body) return;
    const button = buildChrome();
    initTheme(button);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChrome);
} else {
    initChrome();
}
