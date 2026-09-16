// ═══ АНГАРЪ (i18n) ═══
(function() {
  'use strict';
  const log = (...a) => { if (window.Logger?.module) window.Logger.module('Hangar', ...a); };
  const t = (k, p) => window.I18n ? window.I18n.t(k, p) : k;

  // ─── Хелперъ для локализованнаго имени ранга (исправляетъ [object Object]) ───
  function rankLabel(rank) {
    if (!rank || !rank.name) return '?';
    if (typeof rank.name === 'string') return rank.name;
    const lang = window.I18n?.getLang?.() || 'ru';
    return rank.name[lang] || rank.name.en || rank.name.ru || '?';
  }

  // ─── Словарь переводовъ для улучшеній (въ upgrades.js имена на русскомъ) ───
  const UP_NAMES = {
    engine:   {ru:'Двигатель',  en:'Engine',   tr:'Motor',    zh:'引擎'},
    wings:    {ru:'Крылья',     en:'Wings',    tr:'Kanatlar', zh:'机翼'},
    tank:     {ru:'Бакъ',       en:'Tank',     tr:'Depo',     zh:'油箱'},
    armor:    {ru:'Броня',      en:'Armor',    tr:'Zırh',     zh:'装甲'},
    fuselage: {ru:'Фюзеляжъ',   en:'Fuselage', tr:'Gövde',    zh:'机身'},
    weapon:   {ru:'Вооруженіе', en:'Weapon',   tr:'Silah',    zh:'武器'}
  };
  function upLabel(u) {
    const lang = window.I18n?.getLang?.() || 'ru';
    const dict = UP_NAMES[u.key];
    return dict ? (dict[lang] || dict.en || dict.ru) : u.name;
  }

  function generateStars(n) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = Math.random() * 100, y = Math.random() * 100, z = Math.random() * 2 + 1, d = Math.random() * 5, u = Math.random() * 3 + 2;
      s += `<div style="position:absolute;left:${x}%;top:${y}%;width:${z}px;height:${z}px;background:rgba(240,208,128,${Math.random() * 0.5 + 0.2});border-radius:50%;animation:starTwinkle ${u}s ease-in-out ${d}s infinite;pointer-events:none;"></div>`;
    }
    return s;
  }

  function renderGauge(value, label, idp) {
    value = Math.max(0, Math.min(100, Math.round(value)));
    const a = -110 + (value / 100) * 220;
    const col = value > 60 ? '#3a7a2a' : value > 30 ? '#b8860b' : '#a02020';
    let ticks = '';
    for (let i = 0; i <= 10; i++) {
      const ta = -110 + i * 22;
      ticks += `<line x1="60" y1="16" x2="60" y2="${i % 5 === 0 ? 26 : 21}" stroke="#5a4020" stroke-width="${i % 5 === 0 ? 2.5 : 1.2}" transform="rotate(${ta} 60 60)"/>`;
    }
    return `<svg viewBox="0 0 120 120" width="100%" height="100%">
      <defs>
        <radialGradient id="${idp}b" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="#f0d080"/><stop offset="50%" stop-color="#c89840"/><stop offset="100%" stop-color="#7a5010"/></radialGradient>
        <radialGradient id="${idp}f" cx="50%" cy="40%" r="70%"><stop offset="0%" stop-color="#f2e8ce"/><stop offset="100%" stop-color="#d8c8a0"/></radialGradient>
      </defs>
      <circle cx="60" cy="60" r="58" fill="url(#${idp}b)" stroke="#5a3810" stroke-width="2"/>
      <circle cx="60" cy="60" r="48" fill="url(#${idp}f)" stroke="#8a5a16" stroke-width="1.5"/>
      ${ticks}
      <text x="60" y="40" text-anchor="middle" font-family="IM Fell English SC, serif" font-size="9" fill="#6a4a20" letter-spacing="1">${label}</text>
      <text x="60" y="88" text-anchor="middle" font-family="IM Fell English SC, serif" font-size="14" fill="${col}" font-weight="bold">${value}%</text>
      <g transform="rotate(${a} 60 60)">
        <path d="M60 60 L60 22" stroke="#8a1a1a" stroke-width="3" stroke-linecap="round"/>
        <path d="M60 60 L60 68" stroke="#8a1a1a" stroke-width="4" stroke-linecap="round"/>
      </g>
      <circle cx="60" cy="60" r="5" fill="url(#${idp}b)" stroke="#5a3810" stroke-width="1"/>
      <circle cx="18" cy="60" r="2.5" fill="#7a5010"/><circle cx="102" cy="60" r="2.5" fill="#7a5010"/>
    </svg>`;
  }

  function getCondition(engine) {
    if (engine >= 80) return { level: 'excellent', label: t('excellent'), color: '#3a7a2a', percent: engine };
    if (engine >= 50) return { level: 'good', label: t('good'), color: '#b8860b', percent: engine };
    if (engine >= 25) return { level: 'damaged', label: t('damaged'), color: '#cc6600', percent: engine };
    return { level: 'critical', label: t('critical'), color: '#a02020', percent: engine };
  }

  function renderHangar() {
    const app = document.getElementById('app');
    if (!app) return;
    const d = window.Save?.data || {};
    if (d.engine == null) d.engine = 100;
    if (d.fuel == null) d.fuel = 100;
    if (!d.up) d.up = {};
    if (!d.planes) d.planes = [(window.PLANES && window.PLANES[0].id) || 'murma'];
    const coins = d.coins || 0;
    const rank = window.Ranks?.getCurrentRank?.() || { name: 'Кадетъ', icon: '🎖️' };
    const condition = getCondition(d.engine);
    const curPlaneId = d.plane || (window.PLANES && window.PLANES[0].id) || 'murma';
    const cur = window.currentPlane ? window.currentPlane() : { name: 'Самолётъ' };
    const repairCost = Math.max(0, Math.ceil((100 - d.engine) * 1.5));
    const fuelCost = Math.max(0, Math.ceil((100 - d.fuel) * 0.5));
    const engineFull = d.engine >= 100, fuelFull = d.fuel >= 100;
    const fmt = n => n >= 1000 ? (n / 1000).toFixed(1).replace('.', ',') + 'к' : n.toLocaleString('ru-RU');
    const livesLeft = window.Lives?.getRemaining?.() ?? 9;
    const livesMax = window.Lives?.MAX_LIVES || 9;
    const planes = window.PLANES || [];
    const curP = planes.find(x => x.id === curPlaneId) || planes[0] || { st: { speed: 1, hp: 1, dmg: 1, fuel: 1 }, name: '?' };
    const st = curP.st || { speed: 1, hp: 1, dmg: 1, fuel: 1 };
    const planeHTML = window.PlaneAsset?.render ? window.PlaneAsset.render(condition) : '<div style="width:100%;height:200px;display:flex;align-items:center;justify-content:center;color:rgba(240,208,128,.3);">✈</div>';

    app.innerHTML = `
      <style>
        #app{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;overflow:hidden!important;display:block!important;}
        @keyframes starTwinkle{0%,100%{opacity:.2;}50%{opacity:1;}}
        @keyframes planeFloat{0%,100%{transform:translateY(0) rotate(-0.5deg);}50%{transform:translateY(-12px) rotate(0.5deg);}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(15px);}to{opacity:1;transform:translateY(0);}}
        .back-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:4px;font-family:'IM Fell English SC',serif;font-size:13px;letter-spacing:.1em;text-transform:uppercase;background:linear-gradient(180deg,rgba(245,230,200,.9),rgba(232,213,168,.8));color:#3d2b16;border:1.5px solid #3d2b16;cursor:pointer;transition:all .25s;box-shadow:0 2px 6px rgba(60,40,20,.2);}
        .back-btn:hover{background:linear-gradient(180deg,#3d2b16,#2a1a0a);color:#e3d3ae;transform:translateY(-1px);}
        .stat-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.06);border:1px solid rgba(212,168,75,.2);border-radius:999px;padding:7px 14px;font-size:12px;backdrop-filter:blur(12px);color:rgba(250,244,232,.85);}
        .stat-chip b{color:#f0d080;font-weight:700;}
        .gauge-btn{width:100%;padding:11px 8px;border-radius:6px;font-family:'IM Fell English SC',serif;font-size:12px;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;transition:all .3s;background:linear-gradient(180deg,#e8c070,#c89840 45%,#8a5a16);color:#1a0f00;font-weight:700;border:2px solid #5a3810;box-shadow:inset 0 2px 0 rgba(255,255,255,.4),0 4px 12px rgba(0,0,0,.4);}
        .gauge-btn:not(:disabled):hover{transform:translateY(-2px);}
        .gauge-btn:disabled{background:rgba(255,255,255,.05);color:rgba(240,208,128,.35);border-color:rgba(212,168,75,.2);cursor:not-allowed;box-shadow:none;}
        .fly-btn{padding:16px 44px;border-radius:6px;font-family:'IM Fell English SC',serif;font-size:17px;letter-spacing:.12em;text-transform:uppercase;background:linear-gradient(180deg,#f5dfa0,#d4a84b 45%,#a67c2e);color:#1a0f00;border:2px solid rgba(255,235,160,.6);cursor:pointer;font-weight:700;box-shadow:0 6px 20px rgba(212,168,75,.4);transition:all .3s;}
        .fly-btn:hover{transform:translateY(-3px);box-shadow:0 12px 35px rgba(212,168,75,.6);}
        .fly-btn:disabled{background:linear-gradient(180deg,#ff8a80,#c05a3a);border-color:#8a2f1d;color:#fff;cursor:not-allowed;box-shadow:none;}
        .plane-pick{width:72px;height:50px;border-radius:8px;cursor:pointer;border:2px solid rgba(212,168,75,.3);background:rgba(255,255,255,.03);opacity:.5;padding:3px;transition:all .3s;display:flex;align-items:center;justify-content:center;}
        .plane-pick.owned{opacity:.8;cursor:pointer;}
        .plane-pick.owned:hover{border-color:rgba(212,168,75,.6);background:rgba(212,168,75,.1);transform:scale(1.05);}
        .plane-pick.selected{opacity:1;border-color:#f0d080;background:rgba(212,168,75,.2);box-shadow:0 0 12px rgba(212,168,75,.4);}
        .stat-bar{height:8px;background:rgba(255,255,255,.08);border-radius:99px;overflow:hidden;flex:1;}
        .stat-fill{height:100%;border-radius:99px;transition:width .5s;}
      </style>
      <div style="position:fixed;inset:0;z-index:-3;background:radial-gradient(ellipse at 70% 30%, #1a3568 0%, #0a1f44 40%, #05102a 100%);"></div>
      <div style="position:fixed;inset:0;z-index:-2;overflow:hidden;pointer-events:none;">${generateStars(40)}</div>
      <div style="position:fixed;inset:0;z-index:-1;background:radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.75) 100%);pointer-events:none;"></div>
      <div style="position:fixed;inset:12px;border:1px solid rgba(212,168,75,.15);pointer-events:none;z-index:0;border-radius:8px;"></div>
      <div style="position:fixed;inset:0;display:flex;flex-direction:column;z-index:1;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 24px 8px;flex-wrap:wrap;gap:10px;">
          <button class="back-btn" data-go="menu">${t('back')}</button>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <span class="stat-chip">🪙 <b>${fmt(coins)}</b></span>
            <span class="stat-chip" style="${livesLeft <= 3 ? 'border-color:rgba(255,80,60,.5);color:#ff8a80;' : ''}">❤️ <b>${livesLeft}</b>/${livesMax}</span>
            <span class="stat-chip">${rank.icon || '⭐'} <b>${rankLabel(rank)}</b></span>
          </div>
        </div>
        <div style="text-align:center;padding:8px 24px 16px;animation:fadeIn .5s ease-out;">
          <div style="font-size:11px;font-weight:600;color:#d4a84b;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;font-family:'IM Fell English SC',serif;">${t('hangar')}</div>
          <h1 style="font-family:'IM Fell English SC',serif;font-weight:600;font-size:clamp(32px,5.5vw,56px);line-height:1;color:#faf4e8;margin:0;">${cur.name || curP.name || 'Самолётъ'}</h1>
          <div style="font-size:13px;color:${condition.color};margin-top:6px;font-family:'Cormorant Garamond',serif;font-style:italic;">${condition.label} · ${Math.round(condition.percent)}%</div>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;gap:20px;padding:0 20px 20px;flex-wrap:wrap;animation:fadeIn .6s ease-out;">
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;width:150px;">
            <div style="width:130px;height:130px;filter:drop-shadow(0 8px 20px rgba(0,0,0,.5));">${renderGauge(d.engine, t('integrity'), 'g1')}</div>
            <button id="btnRepair" class="gauge-btn" ${engineFull || coins < repairCost ? 'disabled' : ''}>${engineFull ? t('repaired') : t('repair') + ' · 🪙' + repairCost}</button>
          </div>
          <div style="width:min(400px,80%);animation:planeFloat 5s ease-in-out infinite;filter:drop-shadow(0 15px 35px rgba(212,168,75,.25));">${planeHTML}</div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;width:150px;">
            <div style="width:130px;height:130px;filter:drop-shadow(0 8px 20px rgba(0,0,0,.5));">${renderGauge(d.fuel, t('fuel'), 'g2')}</div>
            <button id="btnRefuel" class="gauge-btn" ${fuelFull || coins < fuelCost ? 'disabled' : ''}>${fuelFull ? t('full') : t('refuel') + ' · 🪙' + fuelCost}</button>
          </div>
        </div>
        ${planes.length > 1 ? `
          <div style="max-width:700px;width:100%;margin:0 auto;padding:0 24px 16px;">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
              <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(212,168,75,.3));"></div>
              <span style="font-family:'IM Fell English SC',serif;font-size:13px;color:rgba(240,208,128,.6);letter-spacing:.12em;text-transform:uppercase;">${t('choosePlane')}</span>
              <div style="flex:1;height:1px;background:linear-gradient(90deg,rgba(212,168,75,.3),transparent);"></div>
            </div>
            <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
              ${planes.map(pl => {
                const owned = (d.planes || ['murma']).includes(pl.id);
                const sel = curPlaneId === pl.id;
                return `<button class="plane-pick ${owned ? 'owned' : ''} ${sel ? 'selected' : ''}" data-pick="${pl.id}" title="${pl.name}" ${owned ? '' : 'disabled'}>${window.PlanesSVG ? window.PlanesSVG.render(pl, { shop: true }) : '<span style="font-size:10px;color:rgba(240,208,128,.4);">' + pl.name + '</span>'}</button>`;
              }).join('')}
            </div>
          </div>
        ` : ''}
        <div style="max-width:700px;width:100%;margin:0 auto;padding:0 24px 16px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
            <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(212,168,75,.3));"></div>
            <span style="font-family:'IM Fell English SC',serif;font-size:13px;color:rgba(240,208,128,.6);letter-spacing:.12em;text-transform:uppercase;">${t('stats')}</span>
            <div style="flex:1;height:1px;background:linear-gradient(90deg,rgba(212,168,75,.3),transparent);"></div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;">
            ${[
              { n: t('speed'), v: st.speed, c: '#5ac8fa' },
              { n: t('durability'), v: st.hp, c: '#34c759' },
              { n: t('damage'), v: st.dmg, c: '#ff6b57' },
              { n: t('tank'), v: st.fuel, c: '#ffd080' }
            ].map(s => `<div style="background:rgba(255,255,255,.04);border:1px solid rgba(212,168,75,.15);border-radius:8px;padding:10px 12px;">
              <div style="font-size:11px;color:rgba(250,244,232,.5);margin-bottom:4px;">${s.n}</div>
              <div style="display:flex;align-items:center;gap:8px;">
                <div class="stat-bar"><div class="stat-fill" style="width:${Math.min(100, s.v * 20)}%;background:${s.c};"></div></div>
                <span style="font-size:12px;color:${s.c};font-weight:600;">${s.v}</span>
              </div>
            </div>`).join('')}
          </div>
        </div>
        <div style="max-width:700px;width:100%;margin:0 auto;padding:0 24px 16px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
            <div style="flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(212,168,75,.3));"></div>
            <span style="font-family:'IM Fell English SC',serif;font-size:13px;color:rgba(240,208,128,.6);letter-spacing:.12em;text-transform:uppercase;">${t('upgrades')}</span>
            <div style="flex:1;height:1px;background:linear-gradient(90deg,rgba(212,168,75,.3),transparent);"></div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
            ${(window.UPGRADES || []).map(u => {
              const lvl = d.up[u.key] || 0;
              const maxed = lvl >= u.max;
              return `<span class="stat-chip" style="${maxed ? 'border-color:rgba(120,200,120,.4);' : ''}">${upLabel(u)} · <b style="color:${maxed ? '#a8e0a0' : '#f0d080'};">${lvl}/${u.max}</b></span>`;
            }).join('')}
          </div>
          <div style="text-align:center;margin-top:12px;">
            <button class="back-btn" data-go="shop" style="font-size:12px;padding:8px 16px;">${t('goToShop')}</button>
          </div>
        </div>
        <div style="display:flex;justify-content:center;padding:12px 24px 40px;">
          ${livesLeft > 0 ? `<button class="fly-btn" id="btnFlyFromHangar">${t('play')}</button>` : `<button class="fly-btn" id="btnFlyFromHangar" disabled>${t('livesOut')}</button>`}
        </div>
      </div>
    `;
    setupHandlers(repairCost, fuelCost, livesLeft);
    log('✓ Ангаръ отрисованъ');
  }

  function setupHandlers(repairCost, fuelCost, livesLeft) {
    const d = window.Save?.data || {};
    
    document.querySelector('[data-go="menu"]').onclick = () => {
      try { window.Sound?.click?.(); } catch (e) {}
      if (window.Screens?.show) window.Screens.show('menu');
    };
    
    const goShop = document.querySelector('[data-go="shop"]');
    if (goShop) goShop.onclick = () => {
      try { window.Sound?.click?.(); } catch (e) {}
      if (window.Screens?.show) window.Screens.show('shop');
    };
    
    document.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => {
      const id = b.getAttribute('data-pick');
      if (!(d.planes || ['murma']).includes(id)) {
        if (window.UI?.toast) window.UI.toast(t('buyInShop'), 'warn');
        return;
      }
      d.plane = id;
      window.Save.save();
      try { window.Sound?.click?.(); } catch (e) {}
      if (window.UI?.toast) window.UI.toast(t('planeChanged'), 'success');
      renderHangar();
    });
    
    const br = document.getElementById('btnRepair');
    if (br) br.onclick = () => {
      if (d.engine >= 100) return;
      if ((d.coins || 0) >= repairCost) {
        d.coins -= repairCost;
        d.engine = 100;
        window.Save.save();
        try { window.Sound?.coin?.(); } catch (e) {}
        if (window.UI?.toast) window.UI.toast(t('engineRepaired'), 'success');
        renderHangar();
      } else {
        if (window.UI?.toast) window.UI.toast(t('notEnough'), 'warn');
      }
    };
    
    const bf = document.getElementById('btnRefuel');
    if (bf) bf.onclick = () => {
      if (d.fuel >= 100) return;
      if ((d.coins || 0) >= fuelCost) {
        d.coins -= fuelCost;
        d.fuel = 100;
        window.Save.save();
        try { window.Sound?.coin?.(); } catch (e) {}
        if (window.UI?.toast) window.UI.toast(t('tankFull'), 'success');
        renderHangar();
      } else {
        if (window.UI?.toast) window.UI.toast(t('notEnough'), 'warn');
      }
    };
    
    const fly = document.getElementById('btnFlyFromHangar');
    if (fly) fly.onclick = () => {
      if (livesLeft <= 0) {
        try { window.Sound?.click?.(); } catch (e) {}
        window.Lives?.showNoLivesScreen?.();
        return;
      }
      try { window.Sound?.click?.(); } catch (e) {}
      const levels = window.LEVELS || [], done = d.done || [];
      let next = 0;
      while (next < levels.length - 1 && done.includes(next)) next++;
      if (window.Briefing?.show) window.Briefing.show(next, () => {
        if (window.Flight?.start) window.Flight.start(next);
      });
      else if (window.Flight?.start) window.Flight.start(next);
    };
  }

  if (window.Screens?.register) {
    window.Screens.register('hangar', renderHangar);
    log('Ангаръ зарегистрированъ');
  }
})();