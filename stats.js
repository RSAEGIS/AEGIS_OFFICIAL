document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // Player search (demo UX)
    // =========================================
    const searchInput = document.getElementById('playerSearchInput');
    const searchBtn   = document.getElementById('playerSearchBtn');

    function doSearch() {
        const val = searchInput.value.trim().toUpperCase();
        if (!val) return;

        searchBtn.textContent = 'SEARCHING...';
        searchBtn.disabled = true;

        setTimeout(() => {
            searchBtn.disabled = false;
            if (val === 'OPERATOR_X7' || val === 'X7') {
                searchBtn.textContent = 'FOUND ✓';
                setTimeout(() => {
                    document.getElementById('profile').scrollIntoView({ behavior: 'smooth', block: 'start' });
                    searchBtn.textContent = 'SEARCH ❯';
                }, 800);
            } else {
                searchBtn.textContent = 'NOT FOUND';
                searchBtn.style.background = '#333';
                searchBtn.style.color = '#fff';
                setTimeout(() => {
                    searchBtn.textContent = 'SEARCH ❯';
                    searchBtn.style.background = '';
                    searchBtn.style.color = '';
                }, 2000);
            }
        }, 1200);
    }

    if (searchBtn) searchBtn.addEventListener('click', doSearch);
    if (searchInput) {
        searchInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') doSearch();
        });
    }

    // =========================================
    // XP bar + rank progress animate on load
    // =========================================
    const xpFill  = document.getElementById('pcXpFill');
    const rankObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                if (xpFill) {
                    const w = xpFill.style.width;
                    xpFill.style.transition = 'none';
                    xpFill.style.width = '0';
                    setTimeout(() => {
                        xpFill.style.transition = 'width 1.5s ease';
                        xpFill.style.width = w;
                    }, 100);
                }
                document.querySelectorAll('.pcr-progress-fill, .dwr-fill').forEach(el => {
                    const w = el.style.width;
                    el.style.transition = 'none';
                    el.style.width = '0';
                    setTimeout(() => {
                        el.style.transition = 'width 1.4s ease';
                        el.style.width = w;
                    }, 200);
                });
                rankObs.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const profileCard = document.querySelector('.profile-card');
    if (profileCard) rankObs.observe(profileCard);

    // =========================================
    // Global stats counter animation
    // =========================================
    function formatNum(n, suffix) {
        if (suffix === 'M') return (n / 1000000).toFixed(0) + 'M';
        if (suffix === 'HRS') return n + ' HRS';
        if (suffix === '%') return n + '%';
        if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
        if (n >= 1000) return n.toLocaleString();
        return String(n);
    }

    const gscNums = document.querySelectorAll('.gsc-num[data-target]');

    const gsObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target;
                const target = parseInt(el.dataset.target);
                const suffix = el.dataset.suffix || '';
                let current = 0;
                const duration = 1600;
                const steps = 60;
                const increment = target / steps;
                const timer = setInterval(() => {
                    current = Math.min(current + increment, target);
                    el.textContent = formatNum(Math.floor(current), suffix);
                    if (current >= target) {
                        el.textContent = formatNum(target, suffix);
                        clearInterval(timer);
                    }
                }, duration / steps);
                gsObs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    gscNums.forEach(el => gsObs.observe(el));

    // =========================================
    // Leaderboard filter (visual only)
    // =========================================
    const lbfBtns = document.querySelectorAll('.lbf-btn');
    lbfBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            lbfBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Animate table rows on switch
            document.querySelectorAll('.lb-row').forEach((row, i) => {
                row.style.animation = 'none';
                row.offsetHeight;
                row.style.opacity = '0';
                row.style.transform = 'translateX(-8px)';
                setTimeout(() => {
                    row.style.transition = `opacity 0.3s ease ${i * 0.04}s, transform 0.3s ease ${i * 0.04}s`;
                    row.style.opacity = '1';
                    row.style.transform = 'translateX(0)';
                }, 20);
            });
        });
    });

    // =========================================
    // Load more leaderboard (mock)
    // =========================================
    const lbLoadBtn = document.querySelector('.lb-load-btn');
    if (lbLoadBtn) {
        lbLoadBtn.addEventListener('click', () => {
            lbLoadBtn.textContent = 'LOADING...';
            lbLoadBtn.disabled = true;
            setTimeout(() => {
                lbLoadBtn.textContent = 'NO MORE DATA TO LOAD';
                lbLoadBtn.style.color = '#1a1a1a';
                lbLoadBtn.style.borderColor = '#111';
            }, 1200);
        });
    }

    // =========================================
    // Scroll reveal
    // =========================================
    const revEls = document.querySelectorAll(
        '.stats-section, .profile-card, .detailed-stats, .rank-tier, .rpb-item, .lb-row, .gs-card, .lb-podium-item'
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