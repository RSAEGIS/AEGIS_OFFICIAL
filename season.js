document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // Season countdown — ends 15 Jun 2026
    // =========================================
    const seasonEnd = new Date('2026-06-15T00:00:00Z');

    function updateSeasonTimer() {
        const diff = seasonEnd - Date.now();
        if (diff <= 0) {
            ['sDays','sHours','sMins','sSecs'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '00';
            });
            return;
        }
        const days  = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins  = Math.floor((diff % 3600000) / 60000);
        const secs  = Math.floor((diff % 60000) / 1000);

        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = String(val).padStart(2, '0');
        };

        set('sDays',  days);
        set('sHours', hours);
        set('sMins',  mins);
        set('sSecs',  secs);
    }

    updateSeasonTimer();
    setInterval(updateSeasonTimer, 1000);

    // =========================================
    // Floating ice particles in hero
    // =========================================
    const container = document.getElementById('shParticles');
    if (container) {
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'sh-particle';
            p.style.left = `${Math.random() * 100}%`;
            p.style.top  = `${Math.random() * 100}%`;
            p.style.width  = `${Math.random() * 2 + 1}px`;
            p.style.height = p.style.width;
            p.style.animationDuration  = `${Math.random() * 10 + 8}s`;
            p.style.animationDelay     = `${Math.random() * 8}s`;
            p.style.opacity = Math.random() * 0.6 + 0.1;
            container.appendChild(p);
        }
    }

    // =========================================
    // Battle pass progress bar animation
    // =========================================
    const bpFill = document.getElementById('bpFill');
    if (bpFill) {
        const bpObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => { bpFill.style.width = '38%'; }, 200);
                    bpObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        bpObserver.observe(bpFill.parentElement);
    }

    // =========================================
    // Scroll reveal — general sections
    // =========================================
    const revealEls = document.querySelectorAll(
        '.season-section, .ov-card, .ev-card, .ltm-card, .bpt-card, .bp-progress-visual, .weekly-missions, .s2-teaser'
    );

    const revObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    revealEls.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.07}s, transform 0.5s ease ${(i % 4) * 0.07}s`;
        revObserver.observe(el);
    });

    // =========================================
    // Roadmap items reveal
    // =========================================
    const rtItems = document.querySelectorAll('.rt-item');
    const rtObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.3 });

    rtItems.forEach((item, i) => {
        item.style.transitionDelay = `${i * 0.1}s`;
        rtObserver.observe(item);
    });

    // =========================================
    // Smooth scroll for anchor links
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });

    // =========================================
    // Mobile Drawer
    // =========================================
    const hamburger = document.getElementById('hamburgerBtn');
    const drawer    = document.getElementById('mobileDrawer');
    const overlay   = document.getElementById('drawerOverlay');
    const closeBtn  = document.getElementById('drawerClose');

    function openDrawer()  { drawer.classList.add('is-open'); hamburger.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
    function closeDrawer() { drawer.classList.remove('is-open'); hamburger.classList.remove('is-open'); document.body.style.overflow = ''; }

    if (hamburger) hamburger.addEventListener('click', openDrawer);
    if (closeBtn)  closeBtn.addEventListener('click', closeDrawer);
    if (overlay)   overlay.addEventListener('click', closeDrawer);
    document.querySelectorAll('.drawer-links a, .drawer-play-btn').forEach(l => l.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

});
