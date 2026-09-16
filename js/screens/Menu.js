// ═══ ГЛАВНОЕ МЕНЮ (i18n) ═══
(function() {
  'use strict';
  const log = (...a) => { if (window.Logger?.module) window.Logger.module('Menu', ...a); };
  const t = (k, p) => window.I18n ? window.I18n.t(k, p) : k;

  // Хелперъ для локализованнаго имени ранга (исправляетъ [object Object])
  function rankLabel(rank) {
    if (!rank || !rank.name) return '?';
    if (typeof rank.name === 'string') return rank.name;
    const lang = window.I18n?.getLang?.() || 'ru';
    return rank.name[lang] || rank.name.en || rank.name.ru || '?';
  }

  function renderEmblem() {
    let riv=''; for(let i=0;i<14;i++){const a=i/14*Math.PI*2;const x=100+92*Math.cos(a);const y=100+92*Math.sin(a);
      riv+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="#7a5010" stroke="#5a3810" stroke-width=".5"/>`;}
    const paw=(x,y,r)=>`<g><circle cx="${x}" cy="${y}" r="${r}" fill="#f0d080" stroke="#8a5a16"/><circle cx="${x}" cy="${y+r*0.25}" r="${r*0.42}" fill="#1a1a1a"/><circle cx="${x-r*0.45}" cy="${y-r*0.3}" r="${r*0.22}" fill="#1a1a1a"/><circle cx="${x}" cy="${y-r*0.45}" r="${r*0.22}" fill="#1a1a1a"/><circle cx="${x+r*0.45}" cy="${y-r*0.3}" r="${r*0.22}" fill="#1a1a1a"/></g>`;
    const mouse=(x,y)=>`<g transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="3" ry="1.5" fill="#1a1a1a"/><circle cx="2.6" cy="-0.9" r="1" fill="#1a1a1a"/><path d="M-3 0 q-2 1 -3.4 -0.6" stroke="#1a1a1a" fill="none" stroke-width=".7"/></g>`;
    const mottoShort = t('motto').replace(/[«»""]/g, '').split('—')[0].trim().toUpperCase();
    return `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <defs>
        <linearGradient id="ebrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0d080"/><stop offset=".5" stop-color="#c89840"/><stop offset="1" stop-color="#7a5010"/></linearGradient>
        <radialGradient id="esky" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#5a90d0"/><stop offset=".6" stop-color="#1a3a7a"/><stop offset="1" stop-color="#0a1f44"/></radialGradient>
        <linearGradient id="ewood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a07030"/><stop offset=".5" stop-color="#8a5a2a"/><stop offset="1" stop-color="#6a4510"/></linearGradient>
        <linearGradient id="eglass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c0e0ff"/><stop offset="1" stop-color="#2a4578"/></linearGradient>
        <radialGradient id="esun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="rgba(255,230,160,.8)"/><stop offset="1" stop-color="rgba(255,230,160,0)"/></radialGradient>
        <filter id="eglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <path id="eTa" d="M 26 100 A 74 74 0 0 1 174 100"/>
      </defs>
      <circle cx="100" cy="100" r="97" fill="url(#ebrass)" stroke="#5a3810" stroke-width="2"/>${riv}
      <circle cx="100" cy="100" r="86" fill="url(#esky)" stroke="#5a3810" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(255,255,255,.4)" stroke-width=".8" stroke-dasharray="4 3"/>
      <circle cx="100" cy="52" r="30" fill="url(#esun)"/>
      <g stroke="rgba(255,255,255,.35)" stroke-width="1.5" stroke-linecap="round">
        <g><animateTransform attributeName="transform" type="translate" values="-26 0; 30 0" dur="0.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="0.8s" repeatCount="indefinite"/><line x1="40" y1="60" x2="60" y2="60"/></g>
        <g><animateTransform attributeName="transform" type="translate" values="-24 0; 32 0" dur="0.7s" begin="0.3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="0.7s" begin="0.3s" repeatCount="indefinite"/><line x1="36" y1="76" x2="56" y2="76"/></g>
      </g>
      <g opacity=".95">
        <ellipse cx="100" cy="100" rx="62" ry="8" fill="url(#ewood)" stroke="#5a3810" stroke-width=".8" transform="rotate(45 100 100)"/>
        <ellipse cx="100" cy="100" rx="62" ry="8" fill="url(#ewood)" stroke="#5a3810" stroke-width=".8" transform="rotate(-45 100 100)"/>
      </g>
      <g filter="url(#eglow)">
        <path d="M100 122 q-10 4 -18 2 q-8 -2 -16 2" fill="none" stroke="#b82828" stroke-width="5" stroke-linecap="round"><animate attributeName="d" dur="0.9s" repeatCount="indefinite" values="M100 122 q-10 4 -18 2 q-8 -2 -16 2; M100 122 q-10 -4 -18 -2 q-8 2 -16 -2; M100 122 q-10 4 -18 2 q-8 -2 -16 2"/></path>
        <path d="M82 82 l-6 -16 l12 6 Z" fill="#3a2a1a"/><path d="M118 82 l6 -16 l-12 6 Z" fill="#3a2a1a"/>
        <circle cx="100" cy="98" r="24" fill="#3a2a1a"/>
        <path d="M78 94 A 24 26 0 0 1 122 94" fill="none" stroke="#6a4520" stroke-width="8" stroke-linecap="round"/>
        <line x1="100" y1="70" x2="100" y2="80" stroke="#4a2f15" stroke-width="1.5"/>
        <circle cx="91" cy="96" r="7" fill="url(#eglass)" stroke="#c89840" stroke-width="2"/>
        <circle cx="109" cy="96" r="7" fill="url(#eglass)" stroke="#c89840" stroke-width="2"/>
        <line x1="98" y1="96" x2="102" y2="96" stroke="#c89840" stroke-width="2"/>
        <line x1="84" y1="96" x2="78" y2="94" stroke="#6a4520" stroke-width="2"/>
        <line x1="116" y1="96" x2="122" y2="94" stroke="#6a4520" stroke-width="2"/>
        <ellipse cx="100" cy="108" rx="10" ry="8" fill="#d8c8a8"/>
        <path d="M98 105 l4 0 l-2 3 Z" fill="#8a1a2a"/>
        <path d="M100 108 q-3 3 -6 2 M100 108 q3 3 6 2" fill="none" stroke="#3a2a1a" stroke-width="1.2" stroke-linecap="round"/>
        <g stroke="#d8c8a8" stroke-width="1" stroke-linecap="round"><line x1="90" y1="106" x2="78" y2="104"/><line x1="90" y1="109" x2="78" y2="110"/><line x1="110" y1="106" x2="122" y2="104"/><line x1="110" y1="109" x2="122" y2="110"/></g>
      </g>
      ${paw(52,102,7)} ${paw(148,102,7)}
      <text font-family="IM Fell English SC, serif" font-size="13" fill="#f0d080" letter-spacing="3"><textPath href="#eTa" startOffset="50%" text-anchor="middle">${t('empireName')}</textPath></text>
      <g>
        <path d="M56 148 l-8 -6 l4 12 l-4 10 l8 -6 Z" fill="#8a1a2a" stroke="#5a0f1a"/>
        <path d="M144 148 l8 -6 l-4 12 l4 10 l-8 -6 Z" fill="#8a1a2a" stroke="#5a0f1a"/>
        <rect x="56" y="146" width="88" height="20" rx="3" fill="#b82828" stroke="#5a0f1a"/>
        <rect x="56" y="146" width="88" height="6" fill="rgba(255,255,255,.15)"/>
        <text x="100" y="159" text-anchor="middle" font-family="IM Fell English SC, serif" font-size="9.5" fill="#f0d080" letter-spacing="1.7">${mottoShort}</text>
      </g>
      ${mouse(70,176)} ${mouse(130,176)}
    </svg>`;
  }

  function generateStars(n){let s='';for(let i=0;i<n;i++){const x=Math.random()*100,y=Math.random()*100,z=Math.random()*2+1,d=Math.random()*5,u=Math.random()*3+2;
    s+=`<div style="position:absolute;left:${x}%;top:${y}%;width:${z}px;height:${z}px;background:rgba(240,208,128,${Math.random()*0.5+0.2});border-radius:50%;animation:starTwinkle ${u}s ease-in-out ${d}s infinite;pointer-events:none;"></div>`;}return s;}
  function cornerOrnament(p){const pos={tl:'top:24px;left:24px;',tr:'top:24px;right:24px;transform:scaleX(-1);',bl:'bottom:24px;left:24px;transform:scaleY(-1);',br:'bottom:24px;right:24px;transform:scale(-1,-1);'}[p];
    return `<svg style="position:fixed;width:70px;height:70px;opacity:0.4;pointer-events:none;z-index:5;${pos}"><path d="M0,0 L70,0 L70,12 L12,12 L12,70 L0,70 Z" fill="none" stroke="#d4a84b" stroke-width="1.5"/><circle cx="18" cy="18" r="3" fill="#d4a84b"/><path d="M25,5 Q35,5 35,15" fill="none" stroke="#d4a84b" stroke-width="1" opacity="0.6"/></svg>`;}
  const fmt = n => n>=1000?(n/1000).toFixed(1).replace('.',',')+'к':n.toLocaleString('ru-RU');

  function renderMenu() {
    const app = document.getElementById('app'); if (!app) return;
    const coins = window.Save?.data?.coins || 0;
    const rank = window.Ranks?.getCurrentRank?.() || { name: 'Кадетъ', icon: '🎖️', color: '#8e8e93' };
    const done = window.Save?.data?.done?.length || 0;
    const total = window.LEVELS?.length || 60;
    const achCount = window.Achievements?.ACHIEVEMENTS?.length || 0;
    const achDone = window.Save?.data?.xp?.medals?.length || 0;
    const hasDaily = window.Daily?.canClaim?.();
    const livesLeft = window.Lives?.getRemaining?.() ?? 9;
    const livesMax = window.Lives?.MAX_LIVES || 9;

    app.innerHTML = `
      <style>
        #app{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;overflow:hidden!important;display:block!important;}
        @keyframes menuFadeIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes starTwinkle{0%,100%{opacity:.2;transform:scale(1);}50%{opacity:1;transform:scale(1.3);}}
        @keyframes emblemFloat{0%,100%{transform:translateY(0) rotate(-1deg);}50%{transform:translateY(-12px) rotate(1deg);}}
        @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
        @keyframes btnGlow{0%,100%{box-shadow:0 0 20px rgba(212,168,75,.3);}50%{box-shadow:0 0 40px rgba(212,168,75,.6);}}
        @keyframes dailyPulse{0%,100%{box-shadow:0 0 12px rgba(255,200,80,.3);}50%{box-shadow:0 0 28px rgba(255,200,80,.7);}}
        .menu-btn{position:relative;display:flex;align-items:center;justify-content:center;border-radius:4px;padding:14px 20px;font-size:14px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;transition:all .35s;min-height:48px;cursor:pointer;font-family:'IM Fell English SC',serif;overflow:hidden;width:100%;white-space:nowrap;}
        .menu-btn:active{transform:scale(.97);}
        .menu-btn::before{content:'';position:absolute;inset:4px;border:1px solid currentColor;opacity:.3;border-radius:2px;pointer-events:none;}
        .menu-btn-gold{background:linear-gradient(180deg,#f5dfa0,#d4a84b 45%,#a67c2e);color:#1a0f00;font-weight:700;font-size:17px;border:1px solid rgba(255,235,160,.6);animation:btnGlow 3s infinite;}
        .menu-btn-gold::after{content:'';position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);animation:shimmer 3.5s infinite;}
        .menu-btn-gold:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 14px 40px rgba(212,168,75,.7);}
        .menu-btn-primary{background:linear-gradient(180deg,rgba(212,168,75,.12),rgba(212,168,75,.04));color:#f0d080;border:1px solid rgba(212,168,75,.35);backdrop-filter:blur(12px);}
        .menu-btn-primary:hover{background:linear-gradient(180deg,rgba(212,168,75,.25),rgba(212,168,75,.1));border-color:rgba(212,168,75,.7);transform:translateY(-2px);color:#ffe8b0;}
        .menu-btn-ghost{background:transparent;color:rgba(240,208,128,.6);border:1px solid rgba(212,168,75,.15);}
        .menu-btn-ghost:hover{color:#f0d080;border-color:rgba(212,168,75,.4);}
        .menu-btn-daily{background:linear-gradient(180deg,rgba(255,200,80,.2),rgba(255,160,40,.08));color:#ffd080;border:1px solid rgba(255,200,80,.5);animation:dailyPulse 2s infinite;}
        .menu-btn-daily:hover{background:linear-gradient(180deg,rgba(255,200,80,.35),rgba(255,160,40,.15));transform:translateY(-2px);}
        .menu-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.06);border:1px solid rgba(212,168,75,.2);border-radius:999px;padding:7px 14px;font-size:12px;backdrop-filter:blur(12px);color:rgba(250,244,232,.85);}
        .menu-chip.gold{background:rgba(212,168,75,.12);border-color:rgba(212,168,75,.35);color:#f0d080;}
        .menu-chip b{color:#f0d080;font-weight:700;}
        .menu-divider{display:flex;align-items:center;gap:12px;width:100%;max-width:340px;margin:4px 0;}
        .menu-divider::before,.menu-divider::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(212,168,75,.4),transparent);}
        .menu-divider span{color:rgba(212,168,75,.5);font-size:12px;}
      </style>
      <div style="position:fixed;inset:0;z-index:-3;background:radial-gradient(ellipse at 30% 20%, #1a3568 0%, #0a1f44 40%, #05102a 100%);"></div>
      <div style="position:fixed;inset:0;z-index:-2;overflow:hidden;pointer-events:none;">${generateStars(50)}</div>
      <div style="position:fixed;inset:0;z-index:-1;background:radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.75) 100%);pointer-events:none;"></div>
      <div style="position:fixed;inset:12px;border:1px solid rgba(212,168,75,.15);pointer-events:none;z-index:0;border-radius:8px;"></div>
      ${cornerOrnament('tl')}${cornerOrnament('tr')}${cornerOrnament('bl')}${cornerOrnament('br')}
      <div style="position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;overflow-y:auto;z-index:1;">
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:30px 20px;max-width:540px;width:100%;animation:menuFadeIn .8s ease-out;">
          <div style="width:140px;height:140px;margin-bottom:12px;animation:emblemFloat 6s ease-in-out infinite;filter:drop-shadow(0 12px 32px rgba(212,168,75,.4));">${renderEmblem()}</div>
          <div style="font-family:'IM Fell English SC',serif;font-size:14px;font-weight:600;color:#d4a84b;letter-spacing:.2em;text-transform:uppercase;margin-bottom:10px;text-align:center;">${t('gameTitle')}</div>
          <h1 style="font-family:'IM Fell English SC',serif;font-weight:600;font-size:clamp(42px,9vw,80px);line-height:.9;color:#faf4e8;margin:4px 0;text-shadow:0 4px 24px rgba(0,0,0,.4);text-align:center;">${t('subtitle')}</h1>
          <p style="font-size:clamp(14px,1.8vw,16px);line-height:1.5;color:rgba(250,244,232,.7);max-width:480px;font-weight:300;text-align:center;margin:14px 0 16px;">${t('motto')}</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:0 0 20px;">
            <span class="menu-chip gold">🪙 <b>${fmt(coins)}</b></span>
            <span class="menu-chip" id="chipRank" style="cursor:pointer;border-color:${rank.color||'rgba(212,168,75,.2)'};">${rank.icon||'🎖️'} <b>${rankLabel(rank)}</b></span>
            <span class="menu-chip" style="${livesLeft<=3?'border-color:rgba(255,80,60,.5);color:#ff8a80;':''}">❤️ <b>${livesLeft}</b>/${livesMax}</span>
            <span class="menu-chip">🏆 <b>${done}</b>/${total}</span>
            <span class="menu-chip">🎖️ <b>${achDone}</b>/${achCount}</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;width:100%;max-width:340px;">
            ${livesLeft>0
              ?`<button class="menu-btn menu-btn-gold" id="btnPlay">${t('play')}</button>`
              :`<button class="menu-btn menu-btn-gold" id="btnPlay" style="background:linear-gradient(180deg,#ff8a80,#c05a3a);border-color:#8a2f1d;animation:none;opacity:.7;">${t('livesOut')}</button>`}
            <button class="menu-btn menu-btn-primary" id="btnLives" style="font-size:12px;padding:10px 16px;min-height:40px;">${t('livesBtn')}</button>
            <div class="menu-divider"><span>✦</span></div>
            ${hasDaily?`<button class="menu-btn menu-btn-daily" id="btnDaily">${t('dailyBonus')}</button>`:''}
            <button class="menu-btn menu-btn-primary" id="btnAch">${t('achievements')}</button>
            <div class="menu-divider"><span>✦</span></div>
            <button class="menu-btn menu-btn-primary" data-go="hangar">${t('hangar')}</button>
            <button class="menu-btn menu-btn-primary" data-go="map">${t('map')}</button>
            <button class="menu-btn menu-btn-primary" data-go="shop">${t('shop')}</button>
            <button class="menu-btn menu-btn-primary" data-go="settings">${t('settings')}</button>
            <button class="menu-btn menu-btn-ghost" data-go="journal">${t('journal')}</button>
          </div>
          <div style="font-family:'IM Fell English SC',serif;font-style:italic;color:rgba(250,244,232,.4);font-size:13px;margin-top:20px;letter-spacing:.15em;">${t('motto')}</div>
        </div>
        <div style="padding:16px;text-align:center;font-size:10px;color:rgba(250,244,232,.3);letter-spacing:.15em;text-transform:uppercase;font-family:'IM Fell English SC',serif;">${t('imperialFleet')}</div>
      </div>`;

    setupMenuHandlers();
    log('✓ Меню отрисовано ('+window.I18n?.getLang?.()+')');
  }

  function setupMenuHandlers() {
    const btnPlay = document.getElementById('btnPlay');
    if (btnPlay) btnPlay.onclick = () => {
      if(!window.Lives?.canFly?.()){try{window.Sound?.click?.();}catch(e){}window.Lives?.showNoLivesScreen?.();return;}
      const levels = window.LEVELS || [], done = window.Save?.data?.done || [];
      let next = 0; while (next < levels.length-1 && done.includes(next)) next++;
      try { window.Sound?.click?.(); } catch(e) {}
      if (window.Briefing?.show) window.Briefing.show(next, () => { if (window.Flight?.start) window.Flight.start(next); });
      else if (window.Flight?.start) window.Flight.start(next);
      else if(window.UI?.toast)window.UI.toast(t('flightDev'),'warn');
    };
    const btnLives = document.getElementById('btnLives');
    if (btnLives) btnLives.onclick = () => { try{window.Sound?.click?.();}catch(e){} window.Lives?.showPanel?.(); };
    const chipRank = document.getElementById('chipRank');
    if (chipRank) chipRank.onclick = () => { try{window.Sound?.click?.();}catch(e){} window.Ranks?.showPanel?.(); };
    const btnDaily = document.getElementById('btnDaily');
    if (btnDaily) btnDaily.onclick = () => { try { window.Sound?.click?.(); } catch(e) {} window.Daily?.showPanel?.(); };
    const btnAch = document.getElementById('btnAch');
    if (btnAch) btnAch.onclick = () => { try { window.Sound?.click?.(); } catch(e) {} window.Achievements?.showPanel?.(); };
    document.querySelectorAll('[data-go]').forEach(btn => {
      btn.onclick = () => { const tgt = btn.getAttribute('data-go'); try { window.Sound?.click?.(); } catch(e) {} if (window.Screens?.show) window.Screens.show(tgt); };
    });
  }

  if (window.Screens?.register) { window.Screens.register('menu', renderMenu); log('Экранъ меню готовъ'); }
})();