document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId)

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });

            if (history.pushState) {
                history.pushState(null, null, targetId);
            } else {
                location.hash = targetId;
            }
        }
    })
})

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Here you would typically send the form data to a server
            // For now, we'll just log it and show a success message
            console.log('Form submitted:', formData);
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
});

// Remove all existing scroll event listeners
window.removeEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

window.removeEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
    lastScroll = currentScroll;
});

// Simple scroll event listener for nav
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('small');
    } else {
        nav.classList.remove('small');
    }
});

// Make nav shrink when scrolling
window.addEventListener('scroll', function() {
    const nav = document.getElementById('mainNav');
    if (window.scrollY > 50) {
        nav.classList.add('py-3', 'px-6', 'rounded-2xl');
        nav.querySelector('h1').classList.add('text-2xl');
        nav.querySelectorAll('a').forEach(link => {
            link.classList.add('px-4', 'py-2', 'text-sm');
        });
    } else {
        nav.classList.remove('py-3', 'px-6', 'rounded-2xl');
        nav.querySelector('h1').classList.remove('text-2xl');
        nav.querySelectorAll('a').forEach(link => {
            link.classList.remove('px-4', 'py-2', 'text-sm');
        });
    }
});

// Theme switching
const themeSwitcher = document.querySelector('.theme-switcher');
const themes = ['warm', 'cool'];
let currentThemeIndex = 0;

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    currentThemeIndex = themes.indexOf(savedTheme);
} else {
    // Set warm theme as default
    document.documentElement.setAttribute('data-theme', 'warm');
    localStorage.setItem('theme', 'warm');
}

themeSwitcher.addEventListener('click', () => {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndex];
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});