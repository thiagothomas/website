// Main JavaScript for Thiago Thomas Portfolio

// ===== TYPEWRITER EFFECT =====
class Typewriter {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
    }

    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }

    start() {
        this.element.textContent = '';
        this.type();
    }
}

// ===== SCROLL PROGRESS BAR =====
function updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = progress + '%';
}

// ===== NAVIGATION SCROLL EFFECT =====
function handleNavScroll() {
    const nav = document.getElementById('nav');
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}

// ===== MOBILE MENU TOGGLE =====
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all section titles
    document.querySelectorAll('.section-title').forEach(title => {
        observer.observe(title);
    });

    // Observe about section elements
    document.querySelectorAll('.about-content, .about-education').forEach(el => {
        observer.observe(el);
    });

    // Observe experience cards
    document.querySelectorAll('.exp-card').forEach(card => {
        observer.observe(card);
    });

    // Observe skill categories
    document.querySelectorAll('.skill-category').forEach(category => {
        observer.observe(category);
    });

    // Observe philosophy elements
    document.querySelectorAll('.philosophy-title, .philosophy-subtitle').forEach(el => {
        observer.observe(el);
    });

    document.querySelectorAll('.philosophy-item').forEach((item, index) => {
        setTimeout(() => {
            observer.observe(item);
        }, index * 100);
    });

    // Observe contact section elements
    document.querySelectorAll('.contact-info, .contact-form-wrapper').forEach(el => {
        observer.observe(el);
    });
}

// ===== STAT COUNTER ANIMATION =====
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ===== FORM HANDLING =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('.submit-button');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show loading state
        submitButton.classList.add('loading');
        formMessage.style.display = 'none';

        // Get form data
        const formData = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            message: form.querySelector('#message').value
        };

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            submitButton.classList.remove('loading');
            formMessage.textContent = '> Message sent successfully! I\'ll get back to you soon.';
            formMessage.className = 'form-message success';
            form.reset();

            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }, 2000);
    });

    // Add terminal-style cursor effect to active input
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.caretColor = '#00FFFF';
        });

        // Prevent any scroll behavior when typing
        input.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ===== GLITCH EFFECT ON HOVER =====
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('[data-glitch]');

    glitchElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            const originalText = element.textContent;
            const glitchText = element.getAttribute('data-glitch');

            let iterations = 0;
            const maxIterations = 8;

            const interval = setInterval(() => {
                element.textContent = glitchText
                    .split('')
                    .map((char, index) => {
                        if (index < iterations) {
                            return glitchText[index];
                        }
                        return String.fromCharCode(33 + Math.floor(Math.random() * 94));
                    })
                    .join('');

                iterations += 1;

                if (iterations > maxIterations) {
                    clearInterval(interval);
                    element.textContent = originalText;
                }
            }, 40);
        });
    });
}

// ===== INITIALIZE HERO TYPEWRITER =====
function initHeroTypewriter() {
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitle = document.getElementById('heroSubtitle');

    // Type title first
    const titleWriter = new Typewriter(heroTitle, 'THIAGO THOMAS', 80);
    titleWriter.start();

    // Then type subtitle after a delay
    setTimeout(() => {
        const subtitleWriter = new Typewriter(
            heroSubtitle,
            'Full-Stack Engineer (Backend-Heavy) | AI Agents | Web3 | Crypto | Blockchain',
            30
        );
        subtitleWriter.start();
    }, 1500);
}

// ===== INITIALIZE ABOUT TYPEWRITER =====
function initAboutTypewriter() {
    const aboutLead = document.getElementById('aboutLead');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
                entry.target.classList.add('typed');
                const leadWriter = new Typewriter(
                    aboutLead,
                    'Building the future at the intersection of AI, Web3, and distributed systems.',
                    30
                );
                leadWriter.start();
            }
        });
    }, observerOptions);

    observer.observe(aboutLead);
}

// ===== RIPPLE EFFECT ON CLICK =====
function initRippleEffect() {
    const buttons = document.querySelectorAll('.cta-button, .submit-button, .tag, .skill-tag');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ===== PARALLAX EFFECT FOR SECTIONS =====
function initParallax() {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;

                // Parallax for hero
                const hero = document.querySelector('.hero');
                if (hero && scrolled < window.innerHeight) {
                    const canvas = document.querySelector('.constellation-canvas');
                    if (canvas) {
                        canvas.style.transform = `translateY(${scrolled * 0.5}px)`;
                    }
                }

                ticking = false;
            });

            ticking = true;
        }
    }, { passive: true });
}

// ===== CURSOR ENHANCEMENT =====
function initCustomCursor() {
    // Only on desktop
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: var(--accent-cyan);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            mix-blend-mode: difference;
            transition: transform 0.15s ease;
            display: block;
            opacity: 0;
        `;
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.opacity = '1';
        });

        // Interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .tag, .skill-tag, .exp-card, .edu-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
            });
        });

        function animateCursor() {
            const dx = mouseX - cursorX;
            const dy = mouseY - cursorY;

            cursorX += dx * 0.2;
            cursorY += dy * 0.2;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }
}

// ===== SCROLL REVEAL WITH DELAY =====
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe sections for reveal
    document.querySelectorAll('.section').forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = `all 0.8s ease ${index * 0.1}s`;
        observer.observe(section);
    });
}

// ===== RANDOM TECH BADGE GLOW =====
function initTechBadgeGlow() {
    const techTags = document.querySelectorAll('.tech-tag, .skill-tag');

    setInterval(() => {
        const randomTag = techTags[Math.floor(Math.random() * techTags.length)];
        if (randomTag && randomTag.classList.contains('visible')) {
            randomTag.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.4)';
            setTimeout(() => {
                randomTag.style.boxShadow = '';
            }, 1000);
        }
    }, 3000);
}

// ===== EVENT LISTENERS =====
window.addEventListener('scroll', () => {
    updateScrollProgress();
    handleNavScroll();
});

// ===== PERFORMANCE OPTIMIZATION =====
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        updateScrollProgress();
        handleNavScroll();
    });
}, { passive: true });

// ===== TERMINAL BOOT SEQUENCE =====
function initTerminalBoot() {
    const terminal = document.createElement('div');
    terminal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'JetBrains Mono', monospace;
        color: #00FF00;
        font-size: 14px;
        padding: 20px;
        transition: opacity 0.5s ease;
    `;

    const bootText = document.createElement('div');
    bootText.innerHTML = `
        <div style="opacity: 0; animation: fadeIn 0.3s ease forwards;">$ initializing portfolio...</div>
        <div style="opacity: 0; animation: fadeIn 0.3s ease 0.3s forwards;">$ loading assets...</div>
        <div style="opacity: 0; animation: fadeIn 0.3s ease 0.6s forwards;">$ establishing connection...</div>
        <div style="opacity: 0; animation: fadeIn 0.3s ease 0.9s forwards; color: #00FFFF;">$ welcome_to_thiago_portfolio</div>
    `;

    terminal.appendChild(bootText);
    document.body.appendChild(terminal);

    setTimeout(() => {
        terminal.style.opacity = '0';
        setTimeout(() => {
            terminal.remove();
        }, 500);
    }, 2000);
}

// ===== INITIALIZE ON DOM LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    initTerminalBoot();
    initThemeToggle(); // Initialize theme toggle immediately

    setTimeout(() => {
        initHeroTypewriter();
        initAboutTypewriter();
        initMobileMenu();
        initScrollAnimations();
        animateStats();
        initContactForm();
        initSmoothScroll();
        initGlitchEffect();
        initRippleEffect();
        initParallax();
        initCustomCursor();
        initScrollReveal();
        initTechBadgeGlow();
    }, 2000);
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Ignore shortcuts when typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }

    // Press 'K' to scroll to contact
    if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }

    // Press 'H' to scroll to top
    if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ===== THEME TOGGLE =====
const colorThemes = [
    { name: 'Green Matrix', primary: '#00FF00', secondary: '#39FF14' },
    { name: 'Cyan & Purple', primary: '#00FFFF', secondary: '#9D4EDD' },
    { name: 'Hot Pink', primary: '#FF1493', secondary: '#FF69B4' },
    { name: 'Orange Glow', primary: '#FF6B00', secondary: '#FFA500' },
    { name: 'Electric Blue', primary: '#0080FF', secondary: '#00D4FF' },
    { name: 'Neon Yellow', primary: '#FFFF00', secondary: '#FFD700' },
    { name: 'Red Alert', primary: '#FF0000', secondary: '#FF4444' }
];

let currentThemeIndex = 0;

function applyTheme(theme) {
    document.documentElement.style.setProperty('--accent-cyan', theme.primary);
    document.documentElement.style.setProperty('--accent-purple', theme.secondary);

    // Save to localStorage
    localStorage.setItem('themeIndex', currentThemeIndex);
}

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');

    // Load saved theme
    const savedThemeIndex = localStorage.getItem('themeIndex');
    if (savedThemeIndex !== null) {
        currentThemeIndex = parseInt(savedThemeIndex);
        applyTheme(colorThemes[currentThemeIndex]);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % colorThemes.length;
            applyTheme(colorThemes[currentThemeIndex]);

            // Show theme name briefly
            const themeName = document.createElement('div');
            themeName.textContent = colorThemes[currentThemeIndex].name;
            themeName.style.cssText = `
                position: fixed;
                bottom: 90px;
                right: 30px;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid ${colorThemes[currentThemeIndex].primary};
                padding: 10px 20px;
                font-family: 'JetBrains Mono', monospace;
                font-size: 14px;
                color: ${colorThemes[currentThemeIndex].primary};
                z-index: 9999;
                border-radius: 4px;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(themeName);

            setTimeout(() => {
                themeName.style.opacity = '1';
            }, 10);

            setTimeout(() => {
                themeName.style.opacity = '0';
                setTimeout(() => themeName.remove(), 300);
            }, 1500);
        });
    }
}
