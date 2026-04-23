document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. Video — Seamless Loop + Mute Toggle
    // =========================================
    const video    = document.getElementById('heroVideo');
    const btn      = document.getElementById('videoControl');
    const icon     = document.getElementById('controlIcon');
    const muteBtn  = document.getElementById('muteControl');
    const muteIcon = document.getElementById('muteIcon');

    if (video) {
        // Hide video if file not found — fallback bg shows instead
        video.addEventListener('error', () => { video.style.display = 'none'; });

        // Seamless loop: fade near end to avoid black flash
        video.addEventListener('timeupdate', () => {
            if (!video.duration) return;
            const remaining = video.duration - video.currentTime;
            if (remaining < 0.8 && remaining > 0) {
                video.style.opacity = Math.max(remaining / 0.8, 0.3);
            } else {
                video.style.opacity = 1;
            }
        });

        video.addEventListener('ended', () => { video.currentTime = 0; video.play(); });

        if (btn) {
            btn.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    icon.className = 'icon-wrapper pause-mode';
                    icon.innerHTML = '<span class="bar"></span><span class="bar"></span>';
                    btn.classList.remove('is-paused');
                } else {
                    video.pause();
                    icon.className = 'icon-wrapper play-mode-icon';
                    icon.innerHTML = '';
                    btn.classList.add('is-paused');
                }
            });
        }

        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                video.muted = !video.muted;
                if (video.muted) {
                    muteIcon.className = 'mute-icon is-muted';
                    muteIcon.innerHTML = '<span class="mute-line"></span>';
                } else {
                    muteIcon.className = 'mute-icon is-unmuted';
                    muteIcon.innerHTML = '';
                    video.volume = 1;
                }
            });
        }
    }

    // =========================================
    // 2. REC Timer — counts UP from 00:00:00:00
    // =========================================
    const clockEl = document.getElementById('liveClock');
    const recStartTime = Date.now();

    function updateRecTimer() {
        const elapsed = Date.now() - recStartTime;
        const totalSec = Math.floor(elapsed / 1000);
        const frames   = Math.floor((elapsed % 1000) / (1000 / 30));
        const hh = String(Math.floor(totalSec / 3600)).padStart(2, '0');
        const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
        const ss = String(totalSec % 60).padStart(2, '0');
        const ff = String(frames).padStart(2, '0');
        if (clockEl) clockEl.textContent = `${hh}:${mm}:${ss}:${ff}`;
    }
    setInterval(updateRecTimer, 33);

    // =========================================
    // 3. Launch Countdown — 365 days from now
    // =========================================
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 365);

    function updateCountdown() {
        const diff = targetDate - Date.now();
        const set = (id, val, pad = true) => {
            const el = document.getElementById(id);
            if (el) el.textContent = pad ? String(val).padStart(2, '0') : val;
        };
        if (diff <= 0) { ['days','hours','minutes','seconds'].forEach(id => set(id, '00', false)); return; }
        set('days',    Math.floor(diff / 86400000), false);
        set('hours',   Math.floor((diff % 86400000) / 3600000));
        set('minutes', Math.floor((diff % 3600000)  / 60000));
        set('seconds', Math.floor((diff % 60000)    / 1000));
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
});
// =========================================
// 4. Game Modes — Tab Switcher
// =========================================
(function() {
    const modes = {
        ranked: {
            opCode:  'OPERATION CODE: ALPHA-1',
            title:   'RANKED MODE',
            sub:     '50 PLAYERS — DOMINATION',
            desc:    'Battle against 50 real opponents in strategic team-based warfare. Every bullet counts. Ranked progression, real rewards, and a reputation built match by match.',
            tags:    ['50 PLAYERS', 'TEAM-BASED', 'COMPETITIVE'],
            number:  '50<span class="gm-vs">v</span>50',
            bgIcon:  '&#10005;',
            label:   'RANKED MODE'
        },
        mixed: {
            opCode:  'OPERATION CODE: BRAVO-2',
            title:   'MIXED MODE',
            sub:     'PLAYERS + AI BOTS',
            desc:    'Compete alongside and against intelligent adaptive AI bots. Perfect for warming up or dominating a server with friends. Bots scale with your skill level.',
            tags:    ['AI BOTS', 'ADAPTIVE', 'HYBRID'],
            number:  'P<span class="gm-vs">+</span>AI',
            bgIcon:  '&#9733;',
            label:   'MIXED MODE'
        },
        clash: {
            opCode:  'OPERATION CODE: DELTA-4',
            title:   'CLASH SQUAD',
            sub:     '4v4 — CLOSE QUARTERS',
            desc:    'Intense 4v4 elimination rounds in tight tactical arenas. One life, one chance. The squad that coordinates wins — no respawns, no second chances.',
            tags:    ['4v4', 'ELIMINATION', 'NO RESPAWN'],
            number:  '4<span class="gm-vs">v</span>4',
            bgIcon:  '&#9670;',
            label:   'CLASH SQUAD'
        },
        training: {
            opCode:  'OPERATION CODE: ECHO-0',
            title:   'TRAINING GROUNDS',
            sub:     'SKILL — MECHANICS — MASTERY',
            desc:    'Master recoil patterns, movement, and map knowledge before stepping into ranked. A structured training environment built for serious improvement.',
            tags:    ['RECOIL TRAINING', 'MOVEMENT', 'UNLIMITED TIME'],
            number:  '<span class="gm-vs" style="font-size:0.5em">TRAINING</span>',
            bgIcon:  '&#9889;',
            label:   'TRAINING GROUNDS'
        },
        custom: {
            opCode:  'OPERATION CODE: FOXTROT-X',
            title:   'CUSTOM ROOMS',
            sub:     'YOUR RULES — YOUR GAME',
            desc:    'Create your own experience. Set map, mode, time limit, and bot count. Host tournaments, private scrims, or content creation sessions on your own terms.',
            tags:    ['PRIVATE LOBBY', 'CUSTOM RULES', 'TOURNAMENTS'],
            number:  'C<span class="gm-vs">U</span>ST',
            bgIcon:  '&#9881;',
            label:   'CUSTOM ROOMS'
        },
        classic: {
            opCode:  'OPERATION CODE: GHOST-1',
            title:   'CLASSIC SQUAD',
            sub:     'SQUAD — TEAM SURVIVAL',
            desc:    'Drop in, gear up, and be the last squad standing. Classic battle royale mechanics with AEGIS precision gunplay and bodycam recording on every kill.',
            tags:    ['SQUAD', 'SURVIVAL', 'BODYCAM'],
            number:  'SQ<span class="gm-vs">U</span>AD',
            bgIcon:  '&#9632;',
            label:   'CLASSIC SQUAD'
        }
    };

    function switchMode(key) {
        const m = modes[key];
        if (!m) return;

        // Update tabs
        document.querySelectorAll('.gm-tab').forEach(t => t.classList.remove('active'));
        const activeTab = document.querySelector(`.gm-tab[data-mode="${key}"]`);
        if (activeTab) activeTab.classList.add('active');

        // Update icon bar
        document.querySelectorAll('.gm-icon-item').forEach(t => t.classList.remove('active'));
        const activeIcon = document.querySelector(`.gm-icon-item[data-mode="${key}"]`);
        if (activeIcon) activeIcon.classList.add('active');

        // Update content with fade
        const infoCard = document.querySelector('.gm-info-card');
        const visualCard = document.querySelector('.gm-visual-card');

        [infoCard, visualCard].forEach(el => {
            if (el) { el.style.animation = 'none'; el.offsetHeight; el.style.animation = ''; }
        });

        const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

        set('gmOpCode', m.opCode);
        set('gmModeTitle', m.title);
        set('gmModeSub', m.sub);
        set('gmModeDesc', m.desc);
        set('gmVcNumber', m.number);
        set('gmVcBgIcon', m.bgIcon);
        set('gmVcLabel', m.label);

        const tagsEl = document.getElementById('gmTags');
        if (tagsEl) tagsEl.innerHTML = m.tags.map(t => `<span class="gm-tag">${t}</span>`).join('');
    }

    // Bind tab clicks
    document.querySelectorAll('.gm-tab').forEach(btn => {
        btn.addEventListener('click', () => switchMode(btn.dataset.mode));
    });

    // Bind icon bar clicks
    document.querySelectorAll('.gm-icon-item').forEach(item => {
        item.addEventListener('click', () => switchMode(item.dataset.mode));
    });
})();
// =========================================
// 5. Operations — Tab Switcher
// =========================================
(function() {
    const operations = {
        frostline: {
            opCode:    'OP-FL-01',
            title:     'OPERATION FROSTLINE',
            biome:     'SNOW BATTLEFIELD',
            colors:    'Blue / White',
            desc:      'Frozen forests and abandoned military facilities buried beneath ice. Combat shifts across snowdrifts and frozen lakes under the northern lights.',
            features:  [['FROZEN LAKES','SNOW TRENCHES'],['MILITARY BUNKERS','AURORA BOREALIS']],
            vcNumber:  '01',
            accentColor: '#4da6ff',
            topLine:   '#4da6ff'
        },
        black: {
            opCode:    'OP-BD-02',
            title:     'OPERATION BLACK DUNE',
            biome:     'DESERT OIL REFINERY',
            colors:    'Orange / Brown',
            desc:      'A burning oil refinery in the deep desert. Sandstorms reduce visibility while fire creates dynamic lighting across the battlefield.',
            features:  [['OIL RIGS','BURNING PIPELINES'],['SANDSTORM EVENTS','UNDERGROUND TUNNELS']],
            vcNumber:  '02',
            accentColor: '#ff8c00',
            topLine:   '#ff8c00'
        },
        iron: {
            opCode:    'OP-IW-03',
            title:     'OPERATION IRON WOLF',
            biome:     'MOUNTAIN PASS',
            colors:    'Gray / Green',
            desc:      'A strategic mountain radio station shrouded in fog. Narrow pathways and elevated positions create intense sniper engagements.',
            features:  [['RADIO TOWER','MOUNTAIN PATHS'],['FOG SYSTEMS','CAVES']],
            vcNumber:  '03',
            accentColor: '#5cff00',
            topLine:   '#5cff00'
        },
        ember: {
            opCode:    'OP-ER-04',
            title:     'OPERATION EMBER RAIN',
            biome:     'BURNING CITY',
            colors:    'Red / Orange',
            desc:      'A city consumed by fire. Ember particles fill the sky as emergency sirens echo through streets of collapsed buildings.',
            features:  [['COLLAPSED SKYSCRAPERS','DYNAMIC SMOKE'],['FIRE PARTICLES','SUBWAY TUNNELS']],
            vcNumber:  '04',
            accentColor: '#ff2222',
            topLine:   '#ff2222'
        },

        sandstrike: {
            opCode:    'OP-SS-05',
            title:     'OPERATION SANDSTRIKE',
            biome:     'COASTAL PORT',
            colors:    'Navy Blue',
            desc:      'A collapsing military port on the coastline. Fight through shipping containers and sinking vessels under heavy naval artillery.',
            features:  [['SHIPPING YARDS','NAVAL GUNS'],['SINKING SHIPS','HARBOR CRANES']],
            vcNumber:  '05',
            accentColor: '#3355ff',
            topLine:   '#3355ff'
        },
        crimson: {
            opCode:    'OP-CZ-06',
            title:     'OPERATION CRIMSON ZONE',
            biome:     'URBAN WARZONE',
            colors:    'Crimson / Dark Red',
            desc:      'A devastated urban district locked in a brutal siege. High-rise combat, underground tunnels, and crimson-smoke-filled streets define this close-quarters nightmare.',
            features:  [['URBAN RUINS','HIGH-RISE CQB'],['UNDERGROUND ACCESS','CRIMSON SMOKE']],
            vcNumber:  '06',
            accentColor: '#cc0000',
            topLine:   '#cc0000'
        }
    };

    const keys = Object.keys(operations);
    let currentIndex = 0;

    function switchOp(key) {
        const o = operations[key];
        if (!o) return;
        currentIndex = keys.indexOf(key);

        // Update tabs
        document.querySelectorAll('.ops-tab').forEach(t => t.classList.remove('active'));
        const activeTab = document.querySelector(`.ops-tab[data-op="${key}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.style.setProperty('--tab-accent', o.accentColor);
        }
        document.querySelectorAll('.ops-tab').forEach(t => {
            if (!t.classList.contains('active')) t.style.removeProperty('--tab-accent');
        });

        // Animate cards
        const infoCard = document.querySelector('.ops-info-card');
        const visualCard = document.querySelector('.ops-visual-card');
        [infoCard, visualCard].forEach(el => {
            if (el) { el.style.animation = 'none'; el.offsetHeight; el.style.animation = ''; }
        });

        // Top accent line color
        const topLine = document.getElementById('opsInfoTopLine');
        if (topLine) topLine.style.background = o.topLine;

        // VC number color
        const vcNum = document.getElementById('opsVcNumber');
        if (vcNum) vcNum.style.color = `${o.accentColor}22`;

        // VC name color
        const vcName = document.getElementById('opsVcName');
        if (vcName) vcName.style.color = o.accentColor;

        // Biome color
        const biomeEl = document.getElementById('opsBiome');
        if (biomeEl) { biomeEl.textContent = o.biome; biomeEl.style.color = o.accentColor; }

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('opsOpCode', o.opCode);
        set('opsOpTitle', o.title);
        set('opsColors', o.colors);
        set('opsOpDesc', o.desc);
        set('opsVcNumber', o.vcNumber);
        set('opsVcBiome', o.biome);
        set('opsVcName', o.title);

        const grid = document.getElementById('opsFeaturesGrid');
        if (grid) {
            grid.innerHTML = o.features.map(col =>
                `<ul class="ops-feat-col">${col.map(f => `<li style="--dot-color:${o.accentColor}">${f}</li>`).join('')}</ul>`
            ).join('');
        }
    }

    document.querySelectorAll('.ops-tab').forEach(btn => {
        btn.addEventListener('click', () => switchOp(btn.dataset.op));
    });

    const prevBtn = document.getElementById('opsPrev');
    const nextBtn = document.getElementById('opsNext');
    if (prevBtn) prevBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + keys.length) % keys.length; switchOp(keys[currentIndex]); });
    if (nextBtn) nextBtn.addEventListener('click', () => { currentIndex = (currentIndex + 1) % keys.length; switchOp(keys[currentIndex]); });

    // Init first
    switchOp('frostline');
})();

// =========================================
// 6. Factions — Tab Switcher
// =========================================
(function() {
    const factions = {
        vox: {
            abbr:    'VOX',
            role:    'TACTICAL ASSAULT',
            title:   'VANGUARD OPERATIONS UNIT',
            sub:     'VANGUARD OPS',
            desc:    'Modern elite special forces. Heavily trained, tactical precision, and clean operational design. VOX represents the pinnacle of military professionalism and cutting-edge warfare technology.',
            features:[['ELITE TRAINING','STEALTH INSERTION'],['ADVANCED TECH','RAPID RESPONSE']],
            color:   '#5cff00',
            logoColor: 'rgba(92,255,0,0.18)'
        },
        bfs: {
            abbr:    'BFS',
            role:    'COVERT OPERATIONS',
            title:   'BLACK FALCON SYNDICATE',
            sub:     'BLACK FALCON',
            desc:    'A covert Private Military Company operating in the shadows. Dark aesthetics define their identity — ruthless efficiency and unconventional tactics are their trademarks.',
            features:[['PMC NETWORK','UNCONVENTIONAL WARFARE'],['DARK OPS','RESOURCE CONTROL']],
            color:   '#ff2222',
            logoColor: 'rgba(255,34,34,0.18)'
        },
        ilf: {
            abbr:    'ILF',
            role:    'HEAVY WARFARE',
            title:   'IRON LEGION FRONT',
            sub:     'IRON LEGION',
            desc:    'A militarized nationalist group built on heavy firepower and relentless determination. Bulky armor, desert-hardened veterans, and overwhelming force define their approach.',
            features:[['HEAVY ARMOR','FORTIFICATION'],['DESERT WARFARE','ARTILLERY SUPPORT']],
            color:   '#ff8c00',
            logoColor: 'rgba(255,140,0,0.18)'
        },
        prn: {
            abbr:    'PRN',
            role:    'STEALTH / RECON',
            title:   'PHANTOM RECON NETWORK',
            sub:     'PHANTOM RECON',
            desc:    'Stealth-focused covert operations unit. Masters of night warfare, reconnaissance, and precision elimination. They see everything before you know they exist.',
            features:[['NIGHT OPS','INTEL GATHERING'],['SILENT ELIMINATION','SNIPER MASTERY']],
            color:   '#4477ff',
            logoColor: 'rgba(68,119,255,0.18)'
        }
    };

    function switchFaction(key) {
        const f = factions[key];
        if (!f) return;

        // Top selector
        document.querySelectorAll('.fac-sel-item').forEach(el => {
            el.classList.remove('active');
            el.style.removeProperty('--fac-color');
        });
        const selItem = document.querySelector(`.fac-sel-item[data-fac="${key}"]`);
        if (selItem) {
            selItem.classList.add('active');
            selItem.style.setProperty('--fac-color', f.color);
        }

        // Bottom bar
        document.querySelectorAll('.fac-bar-item').forEach(el => {
            el.classList.remove('active');
            el.style.removeProperty('--fac-color');
        });
        const barItem = document.querySelector(`.fac-bar-item[data-fac="${key}"]`);
        if (barItem) {
            barItem.classList.add('active');
            barItem.style.setProperty('--fac-color', f.color);
        }

        // Animate
        const panel = document.querySelector('.fac-panel');
        if (panel) { panel.style.animation = 'none'; panel.offsetHeight; panel.style.animation = ''; }

        // Logo
        const logo = document.getElementById('facLogoText');
        if (logo) { logo.textContent = f.abbr; logo.style.color = f.logoColor; }

        // Top line
        const topline = document.getElementById('facInfoTopline');
        if (topline) topline.style.background = f.color;

        // Tag abbr color
        const tagAbbr = document.getElementById('facTagAbbr');
        if (tagAbbr) { tagAbbr.textContent = f.abbr; tagAbbr.style.color = f.color; }

        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('facTagRole', f.role);
        set('facInfoTitle', f.title);
        set('facInfoDesc', f.desc);

        const sub = document.getElementById('facInfoSub');
        if (sub) { sub.textContent = f.sub; sub.style.color = f.color; }

        const grid = document.getElementById('facFeaturesGrid');
        if (grid) {
            grid.innerHTML = f.features.map(col =>
                `<ul class="fac-feat-col">${col.map(ft => `<li style="--dot-color:${f.color}">${ft}</li>`).join('')}</ul>`
            ).join('');
        }

        // Bottom bar abbr colors
        document.querySelectorAll('.fac-bar-item').forEach(el => {
            const k = el.dataset.fac;
            const abbrEl = el.querySelector('.fac-bar-abbr');
            if (abbrEl) abbrEl.style.color = factions[k]?.color || '#5cff00';
        });
    }

    document.querySelectorAll('.fac-sel-item, .fac-bar-item').forEach(el => {
        el.addEventListener('click', () => switchFaction(el.dataset.fac));
    });

    // Init
    switchFaction('vox');
})();

// =========================================
// 7. Battle Pass — Season Switcher
// =========================================
(function() {
    const seasons = {
        s1: {
            label:    'SEASON 1',
            title:    'OPERATION FROSTLINE',
            theme:    'ICE / SNOW',
            desc:     'Ice-themed camo, snow gear outfits, and blue glowing weapons.',
            rewards:  [['ICE CAMO','BLUE FX'],['SNOW GEAR','WINTER BADGE']],
            bgIcon:   '❄',
            prog:     'LEVEL 1 — 100',
            color:    '#4da6ff',
            vcColor:  'rgba(77,166,255,0.15)'
        },
        s2: {
            label:    'SEASON 2',
            title:    'OPERATION BLACK DUNE',
            theme:    'FIRE / DESERT',
            desc:     'Desert-camo bundles, flame weapon skins, and sandstorm visual effects.',
            rewards:  [['DESERT CAMO','FLAME FX'],['SAND GEAR','DUNE BADGE']],
            bgIcon:   '🔥',
            prog:     'LEVEL 1 — 100',
            color:    '#ff8c00',
            vcColor:  'rgba(255,140,0,0.15)'
        },
        s3: {
            label:    'SEASON 3',
            title:    'OPERATION EMBER RAIN',
            theme:    'URBAN / FIRE',
            desc:     'City-themed operator outfits, ember particle weapon effects, and neon skins.',
            rewards:  [['URBAN CAMO','EMBER FX'],['CITY GEAR','RECON BADGE']],
            bgIcon:   '🌆',
            prog:     'LEVEL 1 — 100',
            color:    '#ff2222',
            vcColor:  'rgba(255,34,34,0.15)'
        }
    };

    function switchSeason(key) {
        const s = seasons[key];
        if (!s) return;

        document.querySelectorAll('.bp-tab').forEach(t => t.classList.remove('active'));
        const tab = document.querySelector(`.bp-tab[data-season="${key}"]`);
        if (tab) tab.classList.add('active');

        const panel = document.querySelector('.bp-panel');
        if (panel) { panel.style.animation = 'none'; panel.offsetHeight; panel.style.animation = ''; }

        // Top line color
        const tl = document.getElementById('bpInfoTopLine');
        if (tl) tl.style.background = s.color;

        // VC theme + name color
        const vcTheme = document.getElementById('bpVcTheme');
        if (vcTheme) { vcTheme.textContent = s.theme; vcTheme.style.color = s.color; }
        const vcName = document.getElementById('bpVcName');
        if (vcName) { vcName.textContent = s.title; vcName.style.color = s.color; }

        // BG icon
        const bg = document.getElementById('bpVcBgIcon');
        if (bg) { bg.textContent = s.bgIcon; bg.style.color = s.vcColor; }

        // Info
        const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        set('bpSeasonLabel', s.label);
        set('bpInfoTitle', s.title);
        set('bpInfoDesc', s.desc);
        set('bpProgVal', s.prog);

        // Prog val color
        const pv = document.getElementById('bpProgVal');
        if (pv) pv.style.color = s.color;

        // Rewards
        const grid = document.getElementById('bpRewardsGrid');
        if (grid) {
            grid.innerHTML = s.rewards.map(col =>
                `<ul class="bp-reward-col">${col.map(r => `<li style="--dot-color:${s.color}">${r}</li>`).join('')}</ul>`
            ).join('');
        }
    }

    document.querySelectorAll('.bp-tab').forEach(btn => {
        btn.addEventListener('click', () => switchSeason(btn.dataset.season));
    });

    switchSeason('s1');
})();

// =========================================
// 8. Arsenal — Category Filter
// =========================================
(function() {
    function filterArsenal(cat) {
        document.querySelectorAll('.arsenal-cat').forEach(b => b.classList.remove('active'));
        const activeBtn = document.querySelector(`.arsenal-cat[data-cat="${cat}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        document.querySelectorAll('.arsenal-card').forEach(card => {
            if (cat === 'all' || card.dataset.cat === cat) {
                card.style.display = '';
                card.style.animation = 'none';
                card.offsetHeight;
                card.style.animation = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    document.querySelectorAll('.arsenal-cat').forEach(btn => {
        btn.addEventListener('click', () => filterArsenal(btn.dataset.cat));
    });
})();

// =========================================
// 9. Smooth scroll for navbar links
// =========================================
document.querySelectorAll('a[href^="#section-"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// =========================================
// 10. Navbar — highlight active section on scroll
// =========================================
(function() {
    const sectionMap = {
        'section-modes':      '[href="#section-modes"]',
        'section-operations': '[href="#section-operations"]',
        'section-factions':   '[href="#section-factions"]',
        'section-arsenal':    '[href="#section-arsenal"]',
        'section-battlepass': '[href="#section-battlepass"]',
        'section-esports':    '[href="#section-esports"]',
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sel = sectionMap[entry.target.id];
                document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('nav-active'));
                if (sel) {
                    document.querySelectorAll(sel).forEach(a => a.classList.add('nav-active'));
                }
            }
        });
    }, { threshold: 0.3 });

    Object.keys(sectionMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
})();

// =========================================
// 11. Mobile Drawer Menu
// =========================================
(function() {
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

    // Close drawer when a link is clicked
    document.querySelectorAll('.drawer-links a, .drawer-play-btn').forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeDrawer();
    });
})();