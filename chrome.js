// =====================================================================
//  chrome.js — Shared Chrome & Responsive Side-Rail Shell
//  Owns side-rail navigation, dark mode toggling, and social channels.
// =====================================================================

const NAV = [
    { page: 'about',   href: '/',         label: 'About' },
    { page: 'work',    href: '/work/',    label: 'Work' },
    { page: 'writing', href: '/writing/', label: 'Writing' },
];

const SOCIAL = [
    { href: 'https://github.com/tangerine0000', label: 'GitHub', external: true },
    { href: 'https://www.linkedin.com/in/sperc/', label: 'LinkedIn', external: true },
    { href: 'mailto:tan.nguyen.atwork@gmail.com', label: 'Email', external: false },
];

// Line icons: 16px, 1.5px stroke (Lucide standard)
const SUN_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`;

const MOON_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`;

const ARROW_UP_RIGHT_SVG = `<svg class="ext-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"></path><path d="M7 7h10v10"></path></svg>`;

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
            if (label) label.textContent = 'Light theme';
            button.setAttribute('aria-label', 'Switch to light theme');
        } else {
            if (icon) icon.innerHTML = MOON_SVG;
            if (label) label.textContent = 'Dark theme';
            button.setAttribute('aria-label', 'Switch to dark theme');
        }
    }

    updateButton(getMode());

    if (button) {
        button.addEventListener('click', () => {
            const current = getMode();
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-mode', next);
            try { localStorage.setItem('mode', next); } catch (e) {}
            updateButton(next);
        });
    }

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            let stored = null;
            try { stored = localStorage.getItem('mode'); } catch (err) {}
            if (!stored) {
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
        return `<li>
            <a href="${item.href}"${isActive ? ' class="active" aria-current="page"' : ''}>
                <span class="nav-label">${item.label}</span>
            </a>
        </li>`;
    }).join('');

    const socialLinks = SOCIAL.map(s =>
        `<a href="${s.href}"${s.external ? ' target="_blank" rel="noopener noreferrer"' : ''}><span>${s.label}</span>${s.external ? ARROW_UP_RIGHT_SVG : ''}</a>`
    ).join('');

    const rail = document.createElement('aside');
    rail.className = 'side-rail';
    rail.setAttribute('aria-label', 'Primary navigation');
    rail.innerHTML = `
        <div class="rail-top">
            <div class="rail-brand">
                <a href="/" class="brand-name">Tan Nguyen</a>
                <span class="brand-sub">AI Engineer · Ho Chi Minh City</span>
            </div>
            <nav class="rail-nav">
                <ul>${navLinks}</ul>
            </nav>
        </div>
        <div class="rail-bottom">
            <div class="rail-social">${socialLinks}</div>
            <button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch theme">
                <span class="theme-icon" aria-hidden="true"></span>
                <span class="theme-label">Theme</span>
            </button>
        </div>
    `;

    document.body.prepend(rail);

    const mainEl = document.querySelector('main') || document.querySelector('.main-content');
    if (mainEl && active !== 'home' && !document.querySelector('.mobile-social')) {
        const mobSocial = document.createElement('div');
        mobSocial.className = 'mobile-social';
        mobSocial.innerHTML = `
            <span class="mobile-social-title">Links</span>
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
