/* ===================================================================
   ALCEU MELLO ENGENHARIA — LANDING PAGE SCRIPTS
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ── HEADER SCROLL EFFECT ────────────────────────────────────── */
    const header = document.getElementById('header');

    const handleScroll = () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ── MOBILE NAV TOGGLE ───────────────────────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile nav when clicking a link
    nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    /* ── SMOOTH SCROLL FOR ANCHOR LINKS (Premium Easing) ──────────── */
    const easeInOutCubic = (t) => t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const smoothScrollTo = (targetY, duration = 900) => {
        const startY = window.scrollY;
        const distance = targetY - startY;
        let startTime = null;

        const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeInOutCubic(progress);

            window.scrollTo(0, startY + distance * eased);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                smoothScrollTo(targetPosition, 900);
            }
        });
    });

    /* ── SCROLL REVEAL ANIMATION ─────────────────────────────────── */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animations for grid items
                const delay = entry.target.closest('.services__grid')
                    ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 100
                    : 0;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ── ACTIVE NAV LINK HIGHLIGHT ───────────────────────────────── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    const highlightNav = () => {
        const scrollPos = window.scrollY + header.offsetHeight + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();

    /* ── COUNTER ANIMATION ──────────────────────────────────────── */
    const statNumbers = document.querySelectorAll('.about__stat-number');

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = target === 100 ? '%' : '+';
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
            current += step;
            if (current >= target) {
                el.textContent = target + suffix;
                return;
            }
            el.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(update);
        };

        update();
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numbers = entry.target.querySelectorAll('.about__stat-number');
                numbers.forEach((num, i) => {
                    setTimeout(() => animateCounter(num), i * 200);
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.about__stats');
    if (statsSection) counterObserver.observe(statsSection);

});
