document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // Live clock in hero
    // =========================================
    const liveTime = document.getElementById('newsLiveTime');
    function updateClock() {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2,'0');
        const mm = String(now.getMinutes()).padStart(2,'0');
        const ss = String(now.getSeconds()).padStart(2,'0');
        if (liveTime) liveTime.textContent = `${hh}:${mm}:${ss}`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // =========================================
    // Filter bar
    // =========================================
    const filterBtns = document.querySelectorAll('.nfb-btn');
    const cards = document.querySelectorAll('.news-card');
    const postCount = document.getElementById('postCount');

    function filterPosts(cat) {
        filterBtns.forEach(b => b.classList.remove('active'));
        document.querySelector(`.nfb-btn[data-filter="${cat}"]`)?.classList.add('active');

        let visible = 0;
        cards.forEach(card => {
            const show = cat === 'all' || card.dataset.cat === cat;
            card.style.display = show ? '' : 'none';
            if (show) visible++;
        });

        if (postCount) postCount.textContent = `${visible} POST${visible !== 1 ? 'S' : ''}`;
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => filterPosts(btn.dataset.filter));
    });

    // =========================================
    // Hero tabs → scroll to section
    // =========================================
    document.querySelectorAll('.nht').forEach(tab => {
        tab.addEventListener('click', e => {
            e.preventDefault();
            document.querySelectorAll('.nht').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = document.querySelector(tab.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // =========================================
    // Scroll spy — highlight active hero tab
    // =========================================
    const sections = [
        { id: 'patch-notes', tab: '[href="#patch-notes"]' },
        { id: 'dev-updates', tab: '[href="#dev-updates"]' },
        { id: 'community',   tab: '[href="#community"]' },
    ];

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const match = sections.find(s => s.id === entry.target.id);
                if (match) {
                    document.querySelectorAll('.nht').forEach(t => t.classList.remove('active'));
                    document.querySelector(`.nht${match.tab}`)?.classList.add('active');
                }
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => {
        const el = document.getElementById(s.id);
        if (el) spyObserver.observe(el);
    });

    // =========================================
    // Scroll reveal
    // =========================================
    const revealEls = document.querySelectorAll(
        '.news-featured, .community-grid, .comm-events, .comm-social, .news-newsletter, .ce-item'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    revealEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        revealObserver.observe(el);
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
    // Newsletter form (basic UX)
    // =========================================
    const nnlBtn = document.querySelector('.nnl-btn');
    const nnlInput = document.querySelector('.nnl-input');

    if (nnlBtn && nnlInput) {
        nnlBtn.addEventListener('click', () => {
            const email = nnlInput.value.trim();
            if (!email || !email.includes('@')) {
                nnlInput.style.borderColor = '#ff2222';
                setTimeout(() => { nnlInput.style.borderColor = ''; }, 2000);
                return;
            }
            nnlBtn.textContent = 'SUBSCRIBED ✓';
            nnlBtn.style.background = '#fff';
            nnlInput.value = '';
            nnlInput.placeholder = 'YOU\'RE NOW ON THE INTEL FEED';
            setTimeout(() => { nnlBtn.textContent = 'SUBSCRIBE ❯'; nnlBtn.style.background = ''; }, 3000);
        });
    }

});