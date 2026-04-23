document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // Active section tracker in quick nav
    // =========================================
    const sections = ['getting-started','movement','shooting','weapons','ranked','maps','arhs-guide'];

    const navObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.gqn-item').forEach(item => item.classList.remove('active'));
                const active = document.querySelector(`.gqn-item[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) navObs.observe(el);
    });

    // =========================================
    // Hit zone bars animate on scroll
    // =========================================
    const hzBars = document.querySelectorAll('.hz-bar');
    const hzObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const w = e.target.style.width;
                e.target.style.width = '0';
                setTimeout(() => { e.target.style.width = w; }, 150);
                hzObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.8 });

    hzBars.forEach(bar => {
        bar.style.transition = 'width 1s ease';
        hzObs.observe(bar);
    });

    // =========================================
    // Recoil dots animation
    // =========================================
    const dots = document.querySelectorAll('.rd-dot');
    const rdObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                dots.forEach((dot, i) => {
                    dot.style.opacity = '0';
                    dot.style.transform = 'translate(-50%,-50%) scale(0)';
                    dot.style.transition = `opacity 0.3s ease ${i * 0.08}s, transform 0.3s ease ${i * 0.08}s`;
                    setTimeout(() => {
                        dot.style.opacity = '1';
                        dot.style.transform = 'translate(-50%,-50%) scale(1)';
                    }, 50);
                });
                rdObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });

    const rdVisual = document.querySelector('.rd-visual');
    if (rdVisual) rdObs.observe(rdVisual);

    // =========================================
    // Scroll reveal
    // =========================================
    const revEls = document.querySelectorAll(
        '.guide-section, .lc-step, .mv-card, .sh-card, .wg-card, .rt-card, .mg-card, .ag-card, .gqn-item'
    );

    const revObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.08 });

    revEls.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.transition = `opacity 0.45s ease ${(i % 6) * 0.05}s, transform 0.45s ease ${(i % 6) * 0.05}s`;
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
            if (target) {
                e.preventDefault();
                const offset = 90;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
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