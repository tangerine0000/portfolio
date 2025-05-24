// Theme switcher functionality
export function initThemeSwitcher() {
    const themeSwitcher = document.querySelector('.theme-switcher');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme
    const currentTheme = localStorage.getItem('theme') || 
        (prefersDarkScheme.matches ? 'cool' : 'warm');
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Theme switcher click handler
    themeSwitcher.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'warm' ? 'cool' : 'warm';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'cool' : 'warm';
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    });
} 