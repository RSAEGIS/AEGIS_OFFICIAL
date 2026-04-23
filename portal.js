document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // Server Browser — Mode & Region filters
    // =========================================
    let activeMode   = 'all';
    let activeRegion = 'all';

    function applyServerFilters() {
        const rows = document.querySelectorAll('.sb-row');
        let count = 0;

        rows.forEach(row => {
            const modeMatch   = activeMode   === 'all' || row.dataset.mode   === activeMode;
            const regionMatch = activeRegion === 'all' || row.dataset.region === activeRegion;
            const show = modeMatch && regionMatch;
            row.style.display = show ? '' : 'none';
            if (show) count++;
        });

        const el = document.getElementById('serverCount');
        if (el) el.textContent = `${count} SERVER${count !== 1 ? 'S' : ''} ONLINE`;
    }

    document.querySelectorAll('.sbf-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filterType = btn.dataset.f;
            const val        = btn.dataset.v;

            // Toggle active within group
            document.querySelectorAll(`.sbf-btn[data-f="${filterType}"]`).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (filterType === 'mode')   activeMode   = val;
            if (filterType === 'region') activeRegion = val;

            applyServerFilters();
        });
    });

    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    const lastUpdated = document.getElementById('lastUpdated');

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshBtn.textContent = '⟳ REFRESHING...';
            refreshBtn.disabled = true;
            setTimeout(() => {
                refreshBtn.textContent = '⟳ REFRESH SERVERS';
                refreshBtn.disabled = false;
                if (lastUpdated) lastUpdated.textContent = 'JUST NOW';
            }, 1200);
        });
    }

    // =========================================
    // Create Experience — Toggle switches
    // =========================================
    document.querySelectorAll('.cft-switch').forEach(sw => {
        sw.addEventListener('click', () => sw.classList.toggle('active'));
    });

    // Preset loader
    const presets = {
        scrim: {
            mode: 'CLASH SQUAD 4v4', map: 'IRON WOLF', players: '8',
            time: '15 MIN', respawn: 'DISABLED (ELIMINATION)', bots: '0 (PLAYERS ONLY)',
            arhs: true, ff: false, spec: true, priv: true, loadout: false, ammo: false
        },
        content: {
            mode: 'CUSTOM DEATHMATCH', map: 'FROSTLINE', players: '20',
            time: 'UNLIMITED', respawn: 'ENABLED', bots: 'FILL TO MAX',
            arhs: true, ff: false, spec: true, priv: false, loadout: true, ammo: true
        },
        training: {
            mode: 'TRAINING', map: 'IRON WOLF', players: '4',
            time: 'UNLIMITED', respawn: 'ENABLED', bots: '10 BOTS',
            arhs: false, ff: false, spec: false, priv: true, loadout: true, ammo: false
        },
        tournament: {
            mode: 'TEAM DEATHMATCH', map: 'FROSTLINE', players: '16',
            time: '20 MIN', respawn: 'ENABLED', bots: '0 (PLAYERS ONLY)',
            arhs: true, ff: false, spec: true, priv: true, loadout: false, ammo: false
        },
        chaos: {
            mode: 'FREE FOR ALL', map: 'EMBER RAIN', players: '50',
            time: '15 MIN', respawn: 'ENABLED', bots: 'FILL TO MAX',
            arhs: false, ff: true, spec: false, priv: false, loadout: true, ammo: true
        }
    };

    document.querySelectorAll('.cp-load').forEach(btn => {
        btn.addEventListener('click', () => {
            const preset = presets[btn.closest('.cp-item').dataset.preset];
            if (!preset) return;

            // Visual feedback
            btn.textContent = 'LOADED ✓';
            btn.style.color = '#5cff00';
            btn.style.borderColor = 'rgba(92,255,0,0.3)';
            setTimeout(() => {
                btn.textContent = 'LOAD';
                btn.style.color = '';
                btn.style.borderColor = '';
            }, 2000);

            // Apply toggles
            const toggleMap = {
                arhs: 'arhsToggle', ff: 'ffToggle', spec: 'specToggle',
                priv: 'privateToggle', loadout: 'loadoutToggle', ammo: 'ammoToggle'
            };

            Object.entries(toggleMap).forEach(([key, id]) => {
                const sw = document.getElementById(id);
                if (!sw) return;
                if (preset[key]) sw.classList.add('active');
                else sw.classList.remove('active');
            });
        });
    });

    // Create lobby button
    const createBtn = document.getElementById('createLobbyBtn');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            const original = createBtn.textContent;
            createBtn.textContent = 'CREATING LOBBY...';
            createBtn.disabled = true;
            setTimeout(() => {
                createBtn.textContent = '✓ LOBBY CREATED — WAITING FOR PLAYERS';
                createBtn.style.background = '#ffffff';
                setTimeout(() => {
                    createBtn.textContent = original;
                    createBtn.style.background = '';
                    createBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // =========================================
    // A.R.H.S clips counter animation
    // =========================================
    const clipsNum = document.getElementById('arhsClips');
    if (clipsNum) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    let n = 24000;
                    const target = 24381;
                    const step = Math.ceil((target - n) / 40);
                    const timer = setInterval(() => {
                        n = Math.min(n + step, target);
                        clipsNum.textContent = n.toLocaleString();
                        if (n >= target) clearInterval(timer);
                    }, 30);
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.5 });
        obs.observe(clipsNum);
    }

    // =========================================
    // Clip Archive filter
    // =========================================
    const clpfBtns = document.querySelectorAll('.clpf-btn');
    const clipCards = document.querySelectorAll('.clip-card');

    clpfBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            clpfBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const cat = btn.dataset.clip;

            clipCards.forEach(card => {
                const cats = card.dataset.clip || '';
                const show = cat === 'all' || cats.includes(cat);
                card.style.display = show ? '' : 'none';
            });
        });
    });

    // =========================================
    // Load more clips (mock)
    // =========================================
    const loadMoreBtn = document.querySelector('.clp-load-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            loadMoreBtn.textContent = 'LOADING...';
            loadMoreBtn.disabled = true;
            setTimeout(() => {
                loadMoreBtn.textContent = 'NO MORE CLIPS TO LOAD';
                loadMoreBtn.style.color = '#222';
            }, 1500);
        });
    }

    // =========================================
    // Scroll reveal
    // =========================================
    const revEls = document.querySelectorAll(
        '.portal-section, .sb-row, .clip-card, .amh-card, .arhs-flow-step, .ap-item, .cp-item, .arhs-stat, .ov-card'
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