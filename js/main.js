import { initNavigation, initSmoothScroll } from './navigation.js';
import { initThemeSwitcher } from './theme.js';

// Initialize all modules when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSmoothScroll();
    initThemeSwitcher();
}); 