/* ============================================
   REHMAX DIGITALS - MAIN SCRIPT
   ============================================ */

function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

document.documentElement.classList.add('js');

/* Notification Toast */
function showNotification(message, type = 'info') {
    const existing = qs('.notification');
    if (existing) existing.remove();
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.textContent = message;
    Object.assign(n.style, {
        position: 'fixed', top: '20px', right: '20px', padding: '15px 24px',
        borderRadius: '12px', color: 'white', fontWeight: '600', zIndex: '10000',
        transform: 'translateX(120%)', transition: 'transform 0.35s ease',
        maxWidth: '320px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        background: type === 'success' ? 'linear-gradient(135deg,#28a745,#20c997)' :
            type === 'error' ? 'linear-gradient(135deg,#dc3545,#c82333)' :
                'linear-gradient(135deg,#111,#333)',
        fontSize: '14px'
    });
    document.body.appendChild(n);
    setTimeout(() => n.style.transform = 'translateX(0)', 50);
    setTimeout(() => {
        n.style.transform = 'translateX(120%)';
        setTimeout(() => n.remove(), 350);
    }, 4000);
}

/* Mobile Navigation Toggle */
const navToggle = qs('#navToggle');
const navMenu = qs('#navMenu');

if (navToggle && navMenu) {
    /* Create close button for mobile nav */
    const navClose = document.createElement('button');
    navClose.className = 'nav-close';
    navClose.setAttribute('aria-label', 'Close menu');
    navClose.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    navMenu.insertBefore(navClose, navMenu.firstChild);

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navClose.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });

    qsa('.nav__link').forEach(link => {
        if (!link.classList.contains('nav__link--has-child')) {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
}

/* Mobile mega-menu toggle */
qsa('.nav__link--has-child').forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            link.closest('.nav__dropdown').classList.toggle('active');
        }
    });
});

/* Hero slider */
const slider = qs('#heroSlider');
const slides = slider ? qsa('.hero__slide') : [];
const prevBtn = qs('#heroPrev');
const nextBtn = qs('#heroNext');
const dots = qsa('.hero__dot');
let activeIndex = 0;

function setActiveSlide(idx) {
    if (!slides.length) return;
    slides.forEach(s => s.classList.remove('is-active'));
    dots.forEach(d => d.classList.remove('is-active'));
    activeIndex = (idx + slides.length) % slides.length;
    slides[activeIndex].classList.add('is-active');
    if (dots[activeIndex]) dots[activeIndex].classList.add('is-active');
}

if (slides.length) {
    if (prevBtn) prevBtn.addEventListener('click', () => setActiveSlide(activeIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => setActiveSlide(activeIndex + 1));
    dots.forEach(dot => {
        dot.addEventListener('click', () => setActiveSlide(parseInt(dot.dataset.slide)));
    });
    let timer = setInterval(() => setActiveSlide(activeIndex + 1), 5000);
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(timer));
        slider.addEventListener('mouseleave', () => {
            timer = setInterval(() => setActiveSlide(activeIndex + 1), 5000);
        });
    }
}

/* Lead form */
const leadForm = qs('#leadForm');
if (leadForm) {
    leadForm.addEventListener('submit', e => {
        e.preventDefault();
        showNotification('Thanks! We will contact you shortly.', 'success');
        leadForm.reset();
    });
}

/* Contact form */
const contactForm = qs('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        if (!contactForm.checkValidity()) {
            if (typeof contactForm.reportValidity === 'function') contactForm.reportValidity();
            showNotification('Please fill all required fields.', 'error');
            return;
        }

        e.preventDefault();
        const nameEl = qs('#cfName');
        const emailEl = qs('#cfEmail');
        const phoneEl = qs('#cfPhone');
        const serviceEl = qs('#cfService');
        const subjectEl = qs('#cfSubject');
        const messageEl = qs('#cfMessage');

        const name = nameEl ? nameEl.value.trim() : '';
        const email = emailEl ? emailEl.value.trim() : '';
        const phone = phoneEl ? phoneEl.value.trim() : '';
        const service = serviceEl ? serviceEl.value : '';
        const subject = subjectEl ? subjectEl.value.trim() : 'Website Contact';
        const message = messageEl ? messageEl.value.trim() : '';

        const bodyLines = [
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            `Service: ${service}`,
            '',
            message,
        ];

        const mailto = `mailto:rehmaxdigitals@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;

        // Some browsers (especially mobile) can ignore programmatic location changes to mailto.
        // Use a fallback <a> click which tends to be more reliable.
        let launched = false;
        try {
            window.open(mailto, '_self');
            launched = true;
        } catch (_) {
            launched = false;
        }

        if (!launched) {
            try {
                window.location.assign(mailto);
                launched = true;
            } catch (_) {
                launched = false;
            }
        }

        if (!launched) {
            try {
                window.location.href = mailto;
                launched = true;
            } catch (_) {
                launched = false;
            }
        }

        if (!launched) {
            try {
                const existing = qs('#mailtoFallback');
                if (existing) existing.remove();
                const link = document.createElement('a');
                link.id = 'mailtoFallback';
                link.href = mailto;
                link.textContent = 'Click here to email us';
                link.style.display = 'inline-block';
                link.style.marginTop = '12px';
                link.style.fontWeight = '700';
                link.style.color = 'var(--primary)';
                contactForm.appendChild(link);
            } catch (_) {
                // ignore
            }
        }

        try {
            const a = document.createElement('a');
            a.href = mailto;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.remove();
            launched = true;
        } catch (_) {
            launched = false;
        }

        if (launched) showNotification('Opening your email app…', 'success');
        else showNotification('Could not open your email app. Please email us at rehmaxdigitals@gmail.com', 'error');
    });
}

/* Stats counter animation */
function animateCounters() {
    qsa('.stats__number[data-count]').forEach(el => {
        if (el.dataset.animated) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.dataset.animated = 'true';
            const target = parseInt(el.dataset.count);
            const duration = 2000;
            const start = performance.now();
            function step(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased);
                if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }
    });
}
window.addEventListener('scroll', animateCounters);
animateCounters();

/* Smooth section reveal animation */
try {
    const revealTargets = document.querySelectorAll('section, .bento-item, .tile, .review, .blog-card, .masonry-card, .stats__item');
    revealTargets.forEach((el) => {
        el.classList.add('reveal');
        el.classList.add('reveal--pending');
    });

    const showIfInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 40 && rect.bottom > 0) {
            el.classList.add('is-visible');
            el.classList.remove('reveal--pending');
        }
    };

    revealTargets.forEach(showIfInViewport);

    if (!('IntersectionObserver' in window)) {
        revealTargets.forEach((el) => {
            el.classList.add('is-visible');
            el.classList.remove('reveal--pending');
        });
    } else {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        entry.target.classList.remove('reveal--pending');
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        revealTargets.forEach((el) => revealObserver.observe(el));
    }
} catch (e) {
    document.querySelectorAll('.reveal').forEach((el) => {
        el.classList.add('is-visible');
        el.classList.remove('reveal--pending');
    });
}

/* Smooth scroll for anchor links */
qsa('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = qs(href);
        if (!target) return;
        e.preventDefault();
        const header = qs('.header');
        const offset = header ? header.offsetHeight + 40 : 40;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - offset, behavior: 'smooth' });
    });
});

/* Sticky header shadow on scroll */
window.addEventListener('scroll', () => {
    const header = qs('.header');
    if (header) {
        header.style.boxShadow = window.scrollY > 10 ? '0 4px 20px rgba(0,0,0,0.08)' : 'none';
    }
});
