// ═══ БРИФИНГЪ (i18n) ═══
(function() {
  'use strict';
  const log = (...a) => { if (window.Logger?.module) window.Logger.module('Briefing', ...a); };
  const t = (k, p) => window.I18n ? window.I18n.t(k, p) : k;

  function renderBriefing(levelIndex, onFly) {
    const app = document.getElementById('app'); if (!app) return;
    const levels = window.LEVELS || [];
    const level = levels[levelIndex] || { n: 'Полётъ', y: 1909, t: 'delivery', w: 'CLEAR', dist: 10 };
    const d = window.Save?.data || {};
    const coins = d.coins || 0;
    const cur = window.currentPlane ? window.currentPlane() : { name: 'Самолётъ' };
    const engine = d.engine ?? 100;
    const fuel = d.fuel ?? 100;
    const livesLeft = window.Lives?.getRemaining?.() ?? 9;
    const livesMax = window.Lives?.MAX_LIVES || 9;
    const W = (window.CONSTANTS && window.CONSTANTS.WEATHER) || {};
    const weather = W[level.w] || { i: '☀️', name: 'Ясно', desc: '' };
    const T = (window.CONSTANTS && window.CONSTANTS.TYPE_NAMES) || {};
    const typeName = T[level.t] || level.t || 'Доставка';
    const isBoss = !!level.boss;
    const bossNum = isBoss ? Math.floor(levelIndex / 3) + 1 : 0;
    const bossDef = isBoss && window.BossRegistry ? window.BossRegistry.get('boss' + bossNum) : null;
    const bossName = bossDef ? bossDef.name : (level.boss || '?');
    const stars = (d.stars || {})[levelIndex] || 0;
    const PLACES = ['Муррбургъ','Мяусква','Мурское Село','Мяунева','Мурбалтика','Мяуполье','Мяуевъ','Когтымъ','Мурролѣсье','Котнигсбергъ','Когтепаты','Мурцкъ','Мяусибирь','Мурчёрное море','Котстантинополь','Мяуфоръ','Муррижъ','Мяльпы','Когтистыя горы'];
    const place = PLACES[levelIndex % PLACES.length];
    const warnings = [];
    if (engine < 50) warnings.push({ icon: '🔧', text: t('motorWarn', { pct: Math.round(engine) }) });
    if (fuel < 30) warnings.push({ icon: '⛽', text: t('fuelWarn', { pct: Math.round(fuel) }) });
    if (livesLeft <= 2) warnings.push({ icon: '❤️', text: t('livesWarn', { n: livesLeft, max: livesMax }) });
    if (isBoss) warnings.push({ icon: '♛', text: t('bossWarn', { name: bossName }) });
    const fmt = n => n >= 1000 ? (n / 1000).toFixed(1).replace('.', ',') + 'к' : n.toLocaleString('ru-RU');

    app.innerHTML = `
      <style>
        #app{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;overflow:hidden!important;display:block!important;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-30px);}to{opacity:1;transform:translateX(0);}}
        @keyframes pulseGold{0%,100%{box-shadow:0 0 15px rgba(212,168,75,.3);}50%{box-shadow:0 0 35px rgba(212,168,75,.7);}}
        .ink-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:4px;font-family:'IM Fell English SC',serif;font-size:13px;letter-spacing:.1em;text-transform:uppercase;background:linear-gradient(180deg,rgba(245,230,200,.9),rgba(232,213,168,.8));color:#3d2b16;border:1.5px solid #3d2b16;cursor:pointer;transition:all .25s;box-shadow:0 2px 6px rgba(60,40,20,.2);}
        .ink-btn:hover{background:linear-gradient(180deg,#3d2b16,#2a1a0a);color:#e3d3ae;transform:translateY(-1px);}
        .info-card{background:linear-gradient(180deg,rgba(245,230,200,.08),rgba(245,230,200,.02));border:1px solid rgba(212,168,75,.25);border-radius:10px;padding:14px 18px;margin-bottom:10px;}
        .info-label{font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:rgba(240,208,128,.5);font-family:'IM Fell English SC',serif;margin-bottom:4px;}
        .info-value{font-family:'IM Fell English SC',serif;font-size:16px;color:#faf4e8;}
        .warn-row{display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(255,180,60,.08);border:1px solid rgba(255,180,60,.25);border-radius:8px;margin-bottom:6px;font-size:13px;color:#ffd080;animation:slideIn .4s ease-out;}
        .fly-btn{padding:18px 50px;border-radius:6px;font-family:'IM Fell English SC',serif;font-size:18px;letter-spacing:.14em;text-transform:uppercase;background:linear-gradient(180deg,#f5dfa0,#d4a84b 45%,#a67c2e);color:#1a0f00;border:2px solid rgba(255,235,160,.6);cursor:pointer;font-weight:700;box-shadow:0 6px 20px rgba(212,168,75,.4);transition:all .3s;animation:pulseGold 3s infinite;}
        .fly-btn:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 12px 40px rgba(212,168,75,.7);}
      </style>
      <div style="position:fixed;inset:0;z-index:-3;background:radial-gradient(ellipse at 30% 20%, #1a3568 0%, #0a1f44 40%, #05102a 100%);"></div>
      <div style="position:fixed;inset:0;z-index:-1;background:radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.75) 100%);pointer-events:none;"></div>
      <div style="position:fixed;inset:0;display:flex;flex-direction:column;z-index:1;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 24px 8px;">
          <button class="ink-btn" id="btnBack">${t('back')}</button>
          <div style="display:flex;gap:8px;">
            <span style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:999px;font-size:12px;background:rgba(255,255,255,.06);border:1px solid rgba(212,168,75,.2);color:rgba(250,244,232,.85);">🪙 <b style="color:#f0d080;">${fmt(coins)}</b></span>
            <span style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:999px;font-size:12px;background:rgba(255,255,255,.06);border:1px solid rgba(212,168,75,.2);color:${livesLeft<=3?'#ff8a80':'rgba(250,244,232,.85)'};">❤️ <b>${livesLeft}</b>/${livesMax}</span>
          </div>
        </div>
        <div style="text-align:center;padding:12px 24px 20px;animation:fadeIn .5s ease-out;">
          <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#d4a84b;font-family:'IM Fell English SC',serif;margin-bottom:6px;">${t('briefing')} · ${t('sortie')}${levelIndex + 1}</div>
          <h1 style="font-family:'IM Fell English SC',serif;font-size:clamp(28px,5vw,48px);color:#faf4e8;margin:0;line-height:1.1;">${level.n}</h1>
          <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:14px;color:rgba(240,208,128,.5);margin-top:6px;">${place} · ${level.y} ${t('year')}</div>
          ${stars > 0 ? '<div style="margin-top:6px;font-size:18px;color:#f0d080;">' + '★'.repeat(stars) + '☆'.repeat(3 - stars) + '</div>' : ''}
        </div>
        <div style="max-width:600px;width:100%;margin:0 auto;padding:0 24px;animation:fadeIn .6s ease-out;">
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-bottom:16px;">
            <div class="info-card"><div class="info-label">${t('mission')}</div><div class="info-value">${typeName}</div></div>
            <div class="info-card"><div class="info-label">${t('weather')}</div><div class="info-value">${weather.i} ${weather.name}</div></div>
            <div class="info-card"><div class="info-label">${t('distance')}</div><div class="info-value">${level.dist} ${t('vs')}</div></div>
            <div class="info-card"><div class="info-label">${t('plane')}</div><div class="info-value">${cur.name || 'Самолётъ'}</div></div>
          </div>
          ${weather.desc ? `<div class="info-card" style="margin-bottom:16px;"><div class="info-label">${t('forecast')}</div><div style="font-family:'Cormorant Garamond',serif;font-size:14px;color:rgba(250,244,232,.7);font-style:italic;">${weather.desc}</div></div>` : ''}
          ${isBoss ? `<div style="background:linear-gradient(180deg,rgba(138,47,29,.15),rgba(138,47,29,.05));border:1px solid rgba(138,47,29,.4);border-radius:10px;padding:16px 20px;margin-bottom:16px;animation:fadeIn .7s ease-out;">
            <div style="display:flex;align-items:center;gap:12px;"><div style="font-size:32px;">♛</div><div><div style="font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,138,128,.6);font-family:'IM Fell English SC',serif;">${t('enemyAhead')}</div><div style="font-family:'IM Fell English SC',serif;font-size:18px;color:#ff8a80;">${bossName}</div>${bossDef && bossDef.taunt ? '<div style="font-family:\'Cormorant Garamond\',serif;font-style:italic;font-size:13px;color:rgba(250,244,232,.5);margin-top:4px;">«' + bossDef.taunt + '»</div>' : ''}</div></div></div>` : ''}
          ${warnings.length > 0 ? `<div style="margin-bottom:16px;"><div style="font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,180,60,.6);font-family:'IM Fell English SC',serif;margin-bottom:8px;">${t('warnings')}</div>${warnings.map((w, i) => `<div class="warn-row" style="animation-delay:${i * 0.1}s;"><span style="font-size:18px;">${w.icon}</span><span>${w.text}</span></div>`).join('')}</div>` : ''}
          <div style="display:flex;gap:10px;margin-bottom:20px;">
            <div style="flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(212,168,75,.15);border-radius:8px;padding:10px 14px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="font-size:11px;color:rgba(250,244,232,.5);">${t('motorBar')}</span><span style="font-size:12px;color:${engine >= 50 ? '#a8e0a0' : '#ff8a80'};font-weight:600;">${Math.round(engine)}%</span></div>
              <div style="height:6px;background:rgba(255,255,255,.08);border-radius:99px;overflow:hidden;"><div style="height:100%;width:${engine}%;background:${engine >= 50 ? 'linear-gradient(90deg,#34c759,#7ed957)' : 'linear-gradient(90deg,#ff6b57,#ff8a80)'};border-radius:99px;"></div></div>
            </div>
            <div style="flex:1;background:rgba(255,255,255,.04);border:1px solid rgba(212,168,75,.15);border-radius:8px;padding:10px 14px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="font-size:11px;color:rgba(250,244,232,.5);">${t('fuelBar')}</span><span style="font-size:12px;color:${fuel >= 30 ? '#a8e0a0' : '#ff8a80'};font-weight:600;">${Math.round(fuel)}%</span></div>
              <div style="height:6px;background:rgba(255,255,255,.08);border-radius:99px;overflow:hidden;"><div style="height:100%;width:${fuel}%;background:${fuel >= 30 ? 'linear-gradient(90deg,#34c759,#7ed957)' : 'linear-gradient(90deg,#ff6b57,#ff8a80)'};border-radius:99px;"></div></div>
            </div>
          </div>
          <div style="display:flex;gap:12px;justify-content:center;padding-bottom:40px;flex-wrap:wrap;">
            <button class="ink-btn" id="btnToHangar" style="padding:14px 28px;">${t('toHangar')}</button>
            <button class="fly-btn" id="btnFly">${t('flyBtn')}</button>
          </div>
        </div>
      </div>`;
    document.getElementById('btnBack').onclick = () => { try { window.Sound?.click?.(); } catch(e) {} if (window.Screens?.show) window.Screens.show('map'); };
    document.getElementById('btnToHangar').onclick = () => { try { window.Sound?.click?.(); } catch(e) {} if (window.Screens?.show) window.Screens.show('hangar'); };
    document.getElementById('btnFly').onclick = () => { try { window.Sound?.click?.(); } catch(e) {} if (onFly) onFly(); };
    log('✓ Брифингъ: уровень ' + (levelIndex + 1));
  }

  function show(levelIndex, onFly) { renderBriefing(levelIndex, onFly); }

  if (window.Screens?.register) { window.Screens.register('briefing', () => renderBriefing(0, () => {})); log('Брифингъ зарегистрированъ'); }
  window.Briefing = { show, renderBriefing };
})();