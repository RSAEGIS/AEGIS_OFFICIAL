document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // Season countdown timer (hero + bottom CTA)
    // =========================================
    const seasonEnd = new Date('2026-06-15T00:00:00Z');

    function updateTimers() {
        const diff = seasonEnd - Date.now();
        if (diff <= 0) return;

        const days  = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins  = Math.floor((diff % 3600000) / 60000);

        ['bpDays','bpCtaDays'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = String(days).padStart(2,'0');
        });
        ['bpHours','bpCtaHours'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = String(hours).padStart(2,'0');
        });
        ['bpMins','bpCtaMins'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = String(mins).padStart(2,'0');
        });
    }

    updateTimers();
    setInterval(updateTimers, 60000);

    // =========================================
    // Rewards filter
    // =========================================
    const rfBtns = document.querySelectorAll('.rf-btn');
    const rwCards = document.querySelectorAll('.rw-card');

    function filterRewards(cat) {
        rfBtns.forEach(b => b.classList.remove('active'));
        document.querySelector(`.rf-btn[data-rcat="${cat}"]`)?.classList.add('active');

        rwCards.forEach((card, i) => {
            const show = cat === 'all' || card.dataset.rcat === cat;
            card.style.display = show ? '' : 'none';
            if (show) {
                card.style.animation = 'none';
                card.offsetHeight;
                card.style.animation = '';
                card.style.animationDelay = `${(i % 4) * 0.06}s`;
            }
        });
    }

    rfBtns.forEach(btn => {
        btn.addEventListener('click', () => filterRewards(btn.dataset.rcat));
    });

    // =========================================
    // Level track progress bar
    // =========================================
    const ltFill = document.getElementById('ltFill');
    if (ltFill) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    setTimeout(() => { ltFill.style.width = '35%'; }, 300);
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.4 });
        obs.observe(ltFill.parentElement);
    }

    // =========================================
    // XP bars animation on scroll
    // =========================================
    const xpBars = document.querySelectorAll('.xp-bar-fill');
    const xpObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const targetWidth = e.target.style.width;
                e.target.style.width = '0';
                setTimeout(() => { e.target.style.width = targetWidth; }, 200);
                xpObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.8 });

    xpBars.forEach(bar => {
        const w = bar.style.width;
        bar.dataset.target = w;
        xpObs.observe(bar);
    });

    // =========================================
    // FAQ accordion
    // =========================================
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq-item').forEach(fi => fi.classList.remove('open'));

            // Open clicked if it was closed
            if (!isOpen) item.classList.add('open');
        });
    });

    // =========================================
    // Scroll reveal
    // =========================================
    const revEls = document.querySelectorAll(
        '.bp-section, .rw-card, .xp-card, .tc-free, .tc-premium, .bpov-card, .faq-item, .xp-boost-bar, .bp-cta-section'
    );

    const revObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    revEls.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(18px)';
        el.style.transition = `opacity 0.5s ease ${(i % 5) * 0.06}s, transform 0.5s ease ${(i % 5) * 0.06}s`;
        revObs.observe(el);
    });

    // =========================================
    // Smooth scroll
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