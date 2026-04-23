document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // Scroll reveal animations
    // =========================================
    const revealEls = document.querySelectorAll(
        '.about-section, .lt-item, .fab-card, .oab-card, .wstat-card, .pq-item, .about-cta'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));

    // =========================================
    // Smooth anchor scroll (in-page links)
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // =========================================
    // Navbar active section highlight on scroll
    // =========================================
    const sectionIds = ['world', 'lore', 'factions', 'operations', 'philosophy'];
    const navSel = {
        world:       'a[href="#world"]',
        lore:        'a[href="#lore"]',
        factions:    'a[href="#factions"]',
        operations:  'a[href="#operations"]',
        philosophy:  'a[href="#philosophy"]',
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('nav-active'));
                const sel = navSel[entry.target.id];
                if (sel) document.querySelectorAll(sel).forEach(a => a.classList.add('nav-active'));
            }
        });
    }, { threshold: 0.35 });

    sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) sectionObserver.observe(el);
    });

    // =========================================
    // Mobile Drawer
    // =========================================
    const hamburger = document.getElementById('hamburgerBtn');
    const drawer    = document.getElementById('mobileDrawer');
    const overlay   = document.getElementById('drawerOverlay');
    const closeBtn  = document.getElementById('drawerClose');

    function openDrawer() {
        drawer.classList.add('is-open');
        hamburger.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    if (hamburger) hamburger.addEventListener('click', openDrawer);
    if (closeBtn)  closeBtn.addEventListener('click', closeDrawer);
    if (overlay)   overlay.addEventListener('click', closeDrawer);

    document.querySelectorAll('.drawer-links a, .drawer-play-btn').forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeDrawer();
    });

    // =========================================
    // Animated number counter on scroll
    // =========================================
    function animateCounter(el, target, duration = 1200) {
        const isInfinity = target === '∞';
        if (isInfinity) return;
        const hasPlus = String(target).includes('+');
        const num = parseInt(String(target).replace('+', ''));
        let start = 0;
        const step = num / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= num) {
                el.textContent = hasPlus ? num + '+' : num;
                clearInterval(timer);
            } else {
                el.textContent = hasPlus ? Math.floor(start) + '+' : Math.floor(start);
            }
        }, 16);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numEl = entry.target.querySelector('.wstat-num');
                if (numEl && !numEl.dataset.animated) {
                    numEl.dataset.animated = '1';
                    animateCounter(numEl, numEl.textContent.trim());
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.wstat-card').forEach(card => counterObserver.observe(card));

});