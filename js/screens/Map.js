// ═══════════════════════════════════════════════════════════
// 🗺️ КАРТА ИМПЕРІИ КОТОВЪ (Apple-style 1930-хъ пергаментъ) (i18n)
// ═══════════════════════════════════════════════════════════
(function() {
  'use strict';
  const log = (...a) => { if (window.Logger?.module) window.Logger.module('Map', ...a); };
  const t = (k, p) => window.I18n ? window.I18n.t(k, p) : k;
  
  const INK = '#3d2b16';
  const GOLD = '#b8860b';
  const CREAM = '#f5e6c8';
  const PARCHMENT = '#e8d5a8';
  const MIN_SCALE = 1, MAX_SCALE = 5;
  let scale = 1, tx = 0, ty = 0;
  let world = null, viewport = null;
  let seed = 1;
  function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }

  function genPoints(n) {
    const pts = [], cols = 6, rows = Math.max(1, Math.ceil(n / cols));
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / cols), c = i % cols;
      const col = (row % 2 === 0) ? c : (cols - 1 - c);
      const x = 10 + col * (80 / (cols - 1)) + ((i * 7) % 3 - 1);
      const y = Math.min(92, 10 + row * (80 / Math.max(1, rows - 1)));
      pts.push([x, y]);
    }
    return pts;
  }
  const POINTS = genPoints((window.LEVELS || []).length || 60);

  // Лорныя названія оставлены на русскомъ для атмосферы Имперіи
  const PLACES = ['Муррбургъ','Мяусква','Мурское Село','Мяунева','Мурбалтика','Мяуполье','Мяуевъ','Когтымъ','Мурролѣсье','Котнигсбергъ','Когтепаты','Мурцкъ','Мяусибирь','Мурчёрное море','Котстантинополь','Мяуфоръ','Муррижъ','Мяльпы','Когтистыя горы'];
  const CITIES = [
    { x: 32, y: 14, name: 'Муррбургъ' }, { x: 41, y: 33, name: 'Мяусква' },
    { x: 37, y: 50, name: 'Мяуевъ' },   { x: 44, y: 64, name: 'Когтымъ' },
    { x: 78, y: 25, name: 'Мяусибирь' },{ x: 38, y: 90, name: 'Котстантинополь' },
    { x: 7,  y: 57, name: 'Муррижъ' },  { x: 12, y: 71, name: 'Мяльпы' }
  ];
  const SEAS = [ { x: 42, y: 79, name: 'МУРЧЁРНОЕ МОРЕ' }, { x: 22, y: 10, name: 'МУРБАЛТИКА' }, { x: 58, y: 58, name: 'КОТСПІЙСКОЕ МОРЕ' } ];
  const REGIONS = [ { x: 40, y: 28, name: 'МАУСКОВІЯ' }, { x: 78, y: 16, name: 'СИБИРЬ' }, { x: 36, y: 45, name: 'МАЛАЯ ЗЕМЛЯ' }, { x: 8, y: 45, name: 'ИНОСТРАННЫЯ ЗЕМЛИ' }, { x: 33, y: 7, name: 'МУРЛЯНДІЯ' } ];

  function isDone(i) { return (window.Save?.data?.done || []).includes(i); }
  function isUnlocked(i) { return i === 0 || isDone(i - 1); }
  function getStars(i) { return (window.Save?.data?.stars || {})[i] || 0; }

  function apply(smooth) {
    if (!world || !viewport) return;
    const vw = viewport.clientWidth, vh = viewport.clientHeight;
    world.style.transition = smooth ? 'left .35s ease, top .35s ease, width .35s ease, height .35s ease' : 'none';
    world.style.left = tx + 'px'; world.style.top = ty + 'px';
    world.style.width = (vw * scale) + 'px'; world.style.height = (vh * scale) + 'px';
    world.style.setProperty('--lz', Math.min(2.5, 1 + (scale - 1) * 0.6));
  }
  function clamp() { if (!viewport) return; const vw = viewport.clientWidth, vh = viewport.clientHeight;
    tx = Math.min(0, Math.max(vw - vw * scale, tx)); ty = Math.min(0, Math.max(vh - vh * scale, ty)); }
  function setZoom(ns, cx, cy, smooth) { ns = Math.min(MAX_SCALE, Math.max(MIN_SCALE, ns)); const k = ns / scale;
    tx = cx - k * (cx - tx); ty = cy - k * (cy - ty); scale = ns; clamp(); apply(smooth); }
  function zoomToPercent(px, py, t) { if (!viewport) return; const vw = viewport.clientWidth, vh = viewport.clientHeight;
    scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, t)); tx = vw/2 - scale*vw*px/100; ty = vh/2 - scale*vh*py/100; clamp(); apply(true); }
  function resetZoom() { scale = 1; tx = 0; ty = 0; apply(true); }

  function mountains(cx, cy, n, sx, sy) { let s=''; for(let i=0;i<n;i++){const x=cx+(rnd()*2-1)*sx,y=cy+(rnd()*2-1)*sy,r=1+rnd()*1.4;
    s+=`<path d="M${x-r},${y} L${x},${y-r*1.7} L${x+r},${y}" fill="none" stroke="${INK}" stroke-width="0.35" opacity="0.7"/>`;} return s; }
  function trees(cx, cy, n, sx, sy) { let s=''; for(let i=0;i<n;i++){const x=cx+(rnd()*2-1)*sx,y=cy+(rnd()*2-1)*sy;
    s+=`<path d="M${x},${y-1.6} L${x-0.9},${y+0.8} L${x+0.9},${y+0.8} Z M${x},${y+0.8} L${x},${y+1.6}" fill="none" stroke="${INK}" stroke-width="0.3" opacity="0.6"/>`;} return s; }
  function catSoldier(x, y, flip) { return `<g transform="translate(${x} ${y}) scale(${flip?-1:1},1)" stroke="${INK}" fill="none" stroke-width="0.5" opacity="0.75">
      <circle cx="0" cy="-6" r="2.6"/><path d="M-2,-7.5 L-3,-10 L-1,-8.5 Z M2,-7.5 L3,-10 L1,-8.5 Z"/>
      <path d="M0,-3.4 L0,3 M0,-1 L-3,1 M0,-1 L3,-2 M0,3 L-2,7 M0,3 L2,7"/><path d="M3,-2 L3,-9 M3,-9 L4.5,-7.5"/></g>`; }
  function ship(x, y) { return `<g transform="translate(${x} ${y})" stroke="${INK}" fill="none" stroke-width="0.45" opacity="0.75">
      <path d="M-4,1 Q0,3 4,1 L3,-1 L-3,-1 Z"/><path d="M0,-1 L0,-6 M0,-6 Q3,-4 0,-2"/></g>`; }
  function biplane(x, y) { return `<g transform="translate(${x} ${y})" stroke="${GOLD}" fill="none" stroke-width="0.5" opacity="0.9">
      <path d="M-5,0 L5,0 M-4,2 L4,2 M-4,0 L-4,2 M2,0 L2,2 M5,0 L7,1 M-5,0 Q-6,1 -5,2"/><circle cx="-6" cy="1" r="0.8"/></g>`; }

  function compassRose(x, y, size) {
    const s = size || 8;
    const lang = window.I18n?.getLang?.() || 'ru';
    const dirs = {
      ru: {n:'С', s:'Ю', e:'В', w:'З'},
      en: {n:'N', s:'S', e:'E', w:'W'},
      tr: {n:'K', s:'G', e:'D', w:'B'},
      zh: {n:'北', s:'南', e:'东', w:'西'}
    };
    const d = dirs[lang] || dirs.ru;
    return `<g transform="translate(${x} ${y})" opacity="0.85">
      <circle cx="0" cy="0" r="${s*1.3}" fill="none" stroke="${GOLD}" stroke-width="0.4"/>
      <circle cx="0" cy="0" r="${s*1.1}" fill="none" stroke="${INK}" stroke-width="0.25"/>
      <path d="M0,${-s} L${s*0.15},${-s*0.15} L0,0 L${-s*0.15},${-s*0.15} Z" fill="#8a2f1d" stroke="${INK}" stroke-width="0.2"/>
      <path d="M0,${s} L${s*0.15},${s*0.15} L0,0 L${-s*0.15},${s*0.15} Z" fill="${CREAM}" stroke="${INK}" stroke-width="0.2"/>
      <path d="M${s},0 L${s*0.15},${-s*0.15} L0,0 L${s*0.15},${s*0.15} Z" fill="${CREAM}" stroke="${INK}" stroke-width="0.2"/>
      <path d="M${-s},0 L${-s*0.15},${-s*0.15} L0,0 L${-s*0.15},${s*0.15} Z" fill="${CREAM}" stroke="${INK}" stroke-width="0.2"/>
      <text x="0" y="${-s-1.5}" text-anchor="middle" font-family="IM Fell English SC,serif" font-size="2.2" fill="${INK}">${d.n}</text>
      <text x="0" y="${s+2.5}" text-anchor="middle" font-family="IM Fell English SC,serif" font-size="2.2" fill="${INK}">${d.s}</text>
      <text x="${s+1.5}" y="0.8" text-anchor="middle" font-family="IM Fell English SC,serif" font-size="2.2" fill="${INK}">${d.e}</text>
      <text x="${-s-1.5}" y="0.8" text-anchor="middle" font-family="IM Fell English SC,serif" font-size="2.2" fill="${INK}">${d.w}</text>
      <circle cx="0" cy="0" r="0.8" fill="${GOLD}" stroke="${INK}" stroke-width="0.2"/>
    </g>`;
  }

  function renderLand() {
    seed = 7;
    return `
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;">
        <defs>
          <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.5"/></filter>
          <linearGradient id="landFill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="rgba(180,150,90,0.18)"/><stop offset="1" stop-color="rgba(140,110,60,0.12)"/></linearGradient>
          <linearGradient id="seaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(100,140,180,0.08)"/><stop offset="1" stop-color="rgba(80,120,160,0.14)"/></linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#seaFill)"/>
        <path filter="url(#rough)" d="M28,5 C30,2 34,2 36,5 L38,10 C35,14 31,15 29,18 L28,24 C26,28 27,32 27,36 L26,46 C27,54 30,59 34,62 L40,64 L42,66 L43,70 L45,71 L47,68 L46,65 L49,67 C51,70 53,70 55,68 L60,72 C70,77 85,79 100,77 L100,3 C80,1 60,2 40,3 C36,3 30,3 28,5 Z" fill="url(#landFill)" stroke="${INK}" stroke-width="0.5"/>
        <path filter="url(#rough)" d="M0,38 C5,32 11,34 14,38 C18,43 17,50 15,56 C13,63 8,68 3,70 L0,69 Z" fill="url(#landFill)" stroke="${INK}" stroke-width="0.4"/>
        <path filter="url(#rough)" d="M20,8 C24,6 27,9 27,13 C27,18 24,21 21,21 C18,20 17,14 18,10 Z" fill="none" stroke="${GOLD}" stroke-width="0.35" stroke-dasharray="1.5 1" opacity="0.6"/>
        <path filter="url(#rough)" d="M34,68 C38,65 45,66 49,69 C53,72 53,78 49,81 C44,84 38,83 35,79 C32,75 32,71 34,68 Z" fill="none" stroke="${GOLD}" stroke-width="0.35" stroke-dasharray="1.5 1" opacity="0.6"/>
        <ellipse cx="58" cy="58" rx="3.5" ry="8" fill="none" stroke="${GOLD}" stroke-width="0.35" stroke-dasharray="1.5 1" opacity="0.5"/>
        ${mountains(64, 30, 14, 2, 20)} ${mountains(13, 66, 10, 4, 4)} ${mountains(26, 61, 8, 3, 3)} ${mountains(51, 68, 6, 3, 2)}
        ${trees(78, 30, 22, 14, 12)} ${trees(35, 40, 12, 6, 8)} ${trees(31, 22, 8, 4, 4)}
        ${ship(42, 76)} ${ship(22, 13)} ${biplane(70, 12)} ${biplane(55, 8)}
        ${catSoldier(94, 12, false)} ${catSoldier(94, 88, true)} ${catSoldier(5, 84, false)}
        ${compassRose(90, 90, 5)}
        ${CITIES.map(c => `<circle cx="${c.x}" cy="${c.y}" r="1" fill="${GOLD}" stroke="${INK}" stroke-width="0.3"/>`).join('')}
        <polyline points="${POINTS.map(p => p[0]+','+p[1]).join(' ')}" fill="none" stroke="${GOLD}" stroke-width="1.4" stroke-dasharray="3 3" vector-effect="non-scaling-stroke" opacity="0.6"/>
        <polyline points="${POINTS.map(p => p[0]+','+p[1]).join(' ')}" fill="none" stroke="${INK}" stroke-width="0.6" stroke-dasharray="3 3" vector-effect="non-scaling-stroke" opacity="0.4"/>
      </svg>`;
  }

  function pointHTML(level, i) {
    const p = POINTS[i] || [50,50];
    const unlocked = isUnlocked(i), done = isDone(i), isBoss = !!level.boss;
    const stars = getStars(i);
    let cls = 'map-point', size = 32;
    if (isBoss) { cls += ' boss'; size = 42; }
    if (done) cls += ' done'; else if (unlocked) cls += ' available'; else cls += ' locked';
    const starDots = done ? '<span class="star-dots">' + '★'.repeat(stars) + '☆'.repeat(3-stars) + '</span>' : '';
    return `<button class="${cls}" data-level="${i}" style="left:${p[0]}%;top:${p[1]}%;width:${size}px;height:${size}px;margin-left:-${size/2}px;margin-top:-${size/2}px;">
      ${isBoss ? '<span class="crown">♛</span>' : ''}
      ${starDots}
      <span class="num">${i + 1}</span>
    </button>`;
  }

  function renderMap() {
    const app = document.getElementById('app');
    if (!app) return;
    scale = 1; tx = 0; ty = 0;
    const levels = window.LEVELS || [];
    const doneCount = (window.Save?.data?.done || []).length;
    const totalStars = Object.values(window.Save?.data?.stars || {}).reduce((a,b)=>a+b,0);
    const coins = window.Save?.data?.coins || 0;
    const maxStars = levels.length * 3;
    const lang = window.I18n?.getLang?.() || 'ru';
    const localeMap = { ru: 'ru-RU', en: 'en-US', tr: 'tr-TR', zh: 'zh-CN' };
    const locale = localeMap[lang] || 'ru-RU';

    app.innerHTML = `
      <style>
        #app { position:fixed !important; inset:0 !important; width:100vw !important; height:100vh !important; overflow:hidden !important; display:block !important; background:${PARCHMENT}; }
        @keyframes pulseGold { 0%,100%{box-shadow:0 0 6px rgba(184,134,11,.4),0 2px 8px rgba(60,40,20,.3);} 50%{box-shadow:0 0 20px rgba(184,134,11,.8),0 2px 12px rgba(60,40,20,.4);} }
        @keyframes fadeInUp { from{opacity:0;transform:translateX(-50%) translateY(20px);} to{opacity:1;transform:translateX(-50%) translateY(0);} }
        .ink-btn { display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:6px;font-family:'IM Fell English SC',serif;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;background:linear-gradient(180deg,rgba(245,230,200,0.9),rgba(232,213,168,0.8));color:${INK};border:1.5px solid ${INK};cursor:pointer;transition:all .25s;box-shadow:0 2px 6px rgba(60,40,20,.2); }
        .ink-btn:hover { background:linear-gradient(180deg,${INK},#2a1a0a); color:${CREAM}; transform:translateY(-1px); box-shadow:0 4px 12px rgba(60,40,20,.4); }
        .ink-chip { display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:999px;font-size:12px;background:linear-gradient(180deg,rgba(245,230,200,0.8),rgba(232,213,168,0.6));border:1px solid rgba(61,43,22,.3);color:${INK};backdrop-filter:blur(8px);box-shadow:0 1px 4px rgba(60,40,20,.15); }
        .ink-chip b { color:${GOLD}; }
        .zoom-btn { width:40px;height:40px;border-radius:8px;font-size:20px;font-weight:700;cursor:pointer;border:1.5px solid ${INK};background:linear-gradient(180deg,rgba(245,230,200,0.95),rgba(232,213,168,0.85));color:${INK};transition:all .2s;box-shadow:0 2px 6px rgba(60,40,20,.25); }
        .zoom-btn:hover { background:linear-gradient(180deg,${INK},#2a1a0a); color:${CREAM}; transform:scale(1.05); }
        .city-label { position:absolute;transform:translate(-50%,-50%);font-family:'Cormorant Garamond',serif;font-style:italic;font-size:calc(13px * var(--lz,1));color:${INK};letter-spacing:0.04em;white-space:nowrap;cursor:pointer;pointer-events:auto;opacity:0.85;text-shadow:0 1px 3px rgba(245,230,200,0.8); }
        .city-label:hover { text-decoration:underline; opacity:1; color:${GOLD}; }
        .sea-label { position:absolute;transform:translate(-50%,-50%);font-family:'IM Fell English SC',serif;font-size:calc(13px * var(--lz,1));color:rgba(80,120,160,0.6);letter-spacing:0.3em;white-space:nowrap;pointer-events:none; }
        .region-label { position:absolute;transform:translate(-50%,-50%);font-family:'IM Fell English SC',serif;font-size:calc(15px * var(--lz,1));color:rgba(61,43,22,0.3);letter-spacing:0.2em;white-space:nowrap;pointer-events:none; }
        .map-point { position:absolute;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'IM Fell English SC',serif;font-weight:700;cursor:pointer;transition:all .3s;border:2.5px solid ${INK};z-index:2;color:${INK};box-shadow:0 3px 8px rgba(60,40,20,.35); }
        .map-point .num { font-size:13px; line-height:1; font-weight:700; }
        .map-point.boss .num { font-size:16px; }
        .map-point .crown { position:absolute;top:-18px;left:50%;transform:translateX(-50%);font-size:15px;color:#8a2f1d;text-shadow:0 1px 3px rgba(245,230,200,0.8); }
        .map-point .star-dots { position:absolute;top:-12px;left:50%;transform:translateX(-50%);font-size:8px;color:${GOLD};white-space:nowrap;letter-spacing:1px;text-shadow:0 1px 2px rgba(245,230,200,0.9); }
        .map-point.available { background:radial-gradient(circle at 35% 30%, #d4a84b, #b8860b 50%, #8a6508); border-color:#6a4a08; color:#1a0f00; animation:pulseGold 2.5s infinite; }
        .map-point.available .num { text-shadow:0 1px 2px rgba(255,255,255,0.3); }
        .map-point.done { background:linear-gradient(180deg,#4a3a2a,#3d2b16); border-color:#2a1a0a; color:${CREAM}; }
        .map-point.locked { background:rgba(61,43,22,0.08); border-color:rgba(61,43,22,0.25); color:rgba(61,43,22,0.4); cursor:not-allowed; box-shadow:none; }
        .map-point.boss { background:radial-gradient(circle at 35% 30%, #c05a3a, #8a2f1d 50%, #5a1a0e); border-color:#3a0a05; color:#ffe8b0; }
        .map-point.boss.locked { background:rgba(61,43,22,0.08); border-color:rgba(138,47,29,0.25); color:rgba(138,47,29,0.4); box-shadow:none; animation:none; }
        .map-point:not(.locked):hover { transform:scale(1.25); z-index:3; box-shadow:0 6px 20px rgba(60,40,20,.5); }
        .legend-item { display:flex;align-items:center;gap:8px;font-size:11px;color:${INK};opacity:0.8; }
        .legend-dot { width:12px;height:12px;border-radius:50%;border:1.5px solid ${INK};flex-shrink:0; }
      </style>

      <div style="position:fixed;inset:0;background:radial-gradient(ellipse at 50% 40%, #f0e0c0 0%, ${PARCHMENT} 50%, #c8a870 100%);"></div>
      <div style="position:fixed;inset:0;pointer-events:none;background:
        radial-gradient(circle at 15% 20%, rgba(184,134,11,0.08) 0%, transparent 15%),
        radial-gradient(circle at 80% 70%, rgba(184,134,11,0.06) 0%, transparent 18%),
        radial-gradient(circle at 60% 15%, rgba(138,47,29,0.04) 0%, transparent 12%),
        radial-gradient(circle at 30% 85%, rgba(120,90,50,0.08) 0%, transparent 14%);"></div>
      <div style="position:fixed;inset:0;pointer-events:none;background:radial-gradient(ellipse at center, transparent 50%, rgba(60,40,20,0.4) 100%);box-shadow:inset 0 0 80px rgba(60,40,20,0.3);"></div>
      <svg style="position:fixed;inset:0;width:100%;height:100%;opacity:0.4;pointer-events:none;mix-blend-mode:multiply;">
        <filter id="paperNoise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" seed="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.08"/></feComponentTransfer></filter>
        <rect width="100%" height="100%" filter="url(#paperNoise)"/>
      </svg>

      <div style="position:fixed;inset:0;display:flex;flex-direction:column;z-index:1;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 24px 8px;flex-wrap:wrap;gap:10px;">
          <button class="ink-btn" data-go="menu">${t('back')}</button>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
            <span class="ink-chip">🗺️ <b>${doneCount}</b>/${levels.length}</span>
            <span class="ink-chip">⭐ <b>${totalStars}</b>/${maxStars}</span>
            <span class="ink-chip">🪙 <b>${coins.toLocaleString(locale)}</b></span>
          </div>
        </div>

        <div style="text-align:center;padding:4px 24px 10px;">
          <div style="display:inline-block;position:relative;padding:12px 40px;background:linear-gradient(180deg,rgba(245,230,200,0.7),rgba(232,213,168,0.5));border:2px solid ${INK};border-radius:4px;box-shadow:0 4px 16px rgba(60,40,20,.2),inset 0 1px 0 rgba(255,255,255,.3);">
            <div style="position:absolute;inset:3px;border:1px solid rgba(184,134,11,.3);border-radius:2px;pointer-events:none;"></div>
            <div style="font-family:'IM Fell English SC',serif;font-size:clamp(18px,3.2vw,30px);color:${INK};letter-spacing:0.1em;line-height:1.1;">${t('mapTitle')}</div>
            <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:12px;color:rgba(61,43,22,0.6);margin-top:3px;">${t('mapSubtitle')}</div>
          </div>
        </div>

        <div id="mapViewport" style="flex:1;position:relative;margin:0 20px 16px;border:2px solid ${INK};border-radius:6px;overflow:hidden;touch-action:none;cursor:grab;box-shadow:0 4px 20px rgba(60,40,20,.3),inset 0 0 30px rgba(60,40,20,.15);background:linear-gradient(180deg,rgba(240,224,192,0.3),rgba(200,168,112,0.2));">
          <div id="mapWorld" style="position:absolute;left:0;top:0;">
            ${renderLand()}
            ${REGIONS.map(r => `<div class="region-label" style="left:${r.x}%;top:${r.y}%;">${r.name}</div>`).join('')}
            ${SEAS.map(s => `<div class="sea-label" style="left:${s.x}%;top:${s.y}%;">${s.name}</div>`).join('')}
            ${CITIES.map(c => `<div class="city-label" data-x="${c.x}" data-y="${c.y}" style="left:${c.x}%;top:${c.y - 2.5}%;">${c.name}</div>`).join('')}
            ${levels.map((lv, i) => pointHTML(lv, i)).join('')}
          </div>

          <div style="position:absolute;right:10px;bottom:10px;display:flex;flex-direction:column;gap:6px;z-index:6;">
            <button class="zoom-btn" id="zoomIn">+</button>
            <button class="zoom-btn" id="zoomOut">−</button>
            <button class="zoom-btn" id="zoomReset" style="font-size:15px;">⌂</button>
          </div>

          <div style="position:absolute;left:10px;bottom:8px;display:flex;flex-direction:column;gap:4px;z-index:6;pointer-events:none;">
            <div class="legend-item"><div class="legend-dot" style="background:radial-gradient(circle at 35% 30%,#d4a84b,#b8860b);"></div>${t('available')}</div>
            <div class="legend-item"><div class="legend-dot" style="background:linear-gradient(180deg,#4a3a2a,#3d2b16);"></div>${t('completed')}</div>
            <div class="legend-item"><div class="legend-dot" style="background:radial-gradient(circle at 35% 30%,#c05a3a,#8a2f1d);"></div>${t('boss')}</div>
            <div class="legend-item"><div class="legend-dot" style="background:rgba(61,43,22,0.1);border-color:rgba(61,43,22,0.25);"></div>${t('locked')}</div>
          </div>

          <div style="position:absolute;right:10px;top:10px;z-index:6;pointer-events:none;">
            <div style="background:linear-gradient(180deg,rgba(245,230,200,0.85),rgba(232,213,168,0.7));border:1px solid rgba(61,43,22,.3);border-radius:6px;padding:6px 12px;font-size:10px;color:${INK};font-family:'Cormorant Garamond',serif;backdrop-filter:blur(6px);box-shadow:0 2px 6px rgba(60,40,20,.15);">
              <div style="display:flex;align-items:center;gap:4px;"><span style="color:${GOLD};">━━━</span> ${t('flightRoute')}</div>
              <div style="display:flex;align-items:center;gap:4px;margin-top:2px;"><span style="color:${GOLD};">●</span> ${t('city')}</div>
              <div style="display:flex;align-items:center;gap:4px;margin-top:2px;"><span style="color:${GOLD};">▲</span> ${t('mountains')}</div>
            </div>
          </div>
        </div>
      </div>

      <div id="levelPopup" style="position:fixed;left:50%;bottom:20px;transform:translateX(-50%);width:min(500px,94%);background:linear-gradient(180deg,#f0e0c0,#e3d3ae);border:2px solid ${INK};border-radius:10px;padding:0;z-index:10;display:none;box-shadow:0 16px 50px rgba(60,40,20,.5),0 0 0 1px rgba(184,134,11,.2);color:${INK};animation:fadeInUp .35s ease-out;overflow:hidden;">
        <div id="popupContent"></div>
      </div>
    `;

    world = document.getElementById('mapWorld');
    viewport = document.getElementById('mapViewport');
    apply(false);
    setupZoom();
    setupHandlers();
    log('✓ Карта Имперіи Котовъ съ ' + levels.length + ' точками готова');
  }

  function setupZoom() {
    if (!viewport || !world) return;
    window.addEventListener('resize', () => { clamp(); apply(false); });
    viewport.addEventListener('wheel', (e) => { e.preventDefault(); const r = viewport.getBoundingClientRect();
      setZoom(scale * (e.deltaY < 0 ? 1.2 : 1/1.2), e.clientX - r.left, e.clientY - r.top, false); }, { passive: false });
    const pointers = new Map(); let lastDist = 0;
    viewport.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.map-point') || e.target.closest('.city-label') || e.target.closest('.zoom-btn')) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      viewport.setPointerCapture(e.pointerId);
      if (pointers.size === 2) { const p = [...pointers.values()]; lastDist = Math.hypot(p[0].x-p[1].x, p[0].y-p[1].y); } });
    viewport.addEventListener('pointermove', (e) => {
      if (!pointers.has(e.pointerId)) return;
      const prev = pointers.get(e.pointerId), cur = { x: e.clientX, y: e.clientY };
      if (pointers.size === 1) { tx += cur.x-prev.x; ty += cur.y-prev.y; clamp(); apply(false); }
      else if (pointers.size === 2) { pointers.set(e.pointerId, cur); const p = [...pointers.values()];
        const d = Math.hypot(p[0].x-p[1].x, p[0].y-p[1].y); const r = viewport.getBoundingClientRect();
        if (lastDist > 0) setZoom(scale * (d/lastDist), (p[0].x+p[1].x)/2 - r.left, (p[0].y+p[1].y)/2 - r.top, false);
        lastDist = d; return; }
      pointers.set(e.pointerId, cur); });
    const drop = (e) => { pointers.delete(e.pointerId); lastDist = 0; };
    viewport.addEventListener('pointerup', drop);
    viewport.addEventListener('pointercancel', drop);
    viewport.addEventListener('dblclick', (e) => { if (e.target.closest('.map-point') || e.target.closest('.zoom-btn')) return;
      const r = viewport.getBoundingClientRect(); setZoom(scale * 1.6, e.clientX - r.left, e.clientY - r.top, true); });
    document.getElementById('zoomIn').onclick = () => { const r = viewport.getBoundingClientRect(); setZoom(scale*1.4, r.width/2, r.height/2, true); };
    document.getElementById('zoomOut').onclick = () => { const r = viewport.getBoundingClientRect(); setZoom(scale/1.4, r.width/2, r.height/2, true); };
    document.getElementById('zoomReset').onclick = resetZoom;
    document.querySelectorAll('.city-label').forEach(l => { l.onclick = () => zoomToPercent(parseFloat(l.getAttribute('data-x')), parseFloat(l.getAttribute('data-y')), 2.6); });
  }

  function showPopup(i) {
    const level = (window.LEVELS || [])[i]; if (!level) return;
    const W = (window.CONSTANTS && window.CONSTANTS.WEATHER) || {};
    const T = (window.CONSTANTS && window.CONSTANTS.TYPE_NAMES) || {};
    const weather = W[level.w] || { i: '☀️', name: 'Ясно' };
    const typeName = T[level.t] || level.t;
    const stars = getStars(i), unlocked = isUnlocked(i), place = PLACES[i % PLACES.length] || t('unknownLands');
    let starsHTML = '';
    for (let s = 1; s <= 3; s++) starsHTML += `<span style="color:${s <= stars ? GOLD : 'rgba(61,43,22,0.2)'};font-size:20px;">★</span>`;
    const popup = document.getElementById('levelPopup'), content = document.getElementById('popupContent');
    if (!popup || !content) return;
    const progress = Math.round((i / ((window.LEVELS||[]).length || 1)) * 100);
    content.innerHTML = `
      <div style="background:linear-gradient(180deg,rgba(184,134,11,0.15),rgba(184,134,11,0.05));padding:16px 22px 12px;border-bottom:1px solid rgba(61,43,22,.15);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <div style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;font-family:'IM Fell English SC',serif;opacity:0.6;">${t('levelNum')} ${i+1} · ${level.y} ${t('year')} · ${place}</div>
            <div style="font-family:'IM Fell English SC',serif;font-size:22px;margin-top:3px;color:${INK};">${level.n}</div>
          </div>
          <button id="popupClose" style="background:rgba(61,43,22,.1);border:1px solid rgba(61,43,22,.2);color:${INK};font-size:16px;cursor:pointer;padding:4px 10px;border-radius:4px;transition:all .2s;">✕</button>
        </div>
      </div>
      <div style="padding:14px 22px 18px;">
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
          <span class="ink-chip">${weather.i} ${weather.name}</span>
          <span class="ink-chip">📋 ${typeName}</span>
          <span class="ink-chip">📏 ${level.dist} ${t('vs')}</span>
          ${level.boss ? `<span class="ink-chip" style="border-color:rgba(138,47,29,.4);color:#8a2f1d;">♛ ${level.boss}</span>` : ''}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:4px;">${starsHTML}</div>
          <div style="font-size:11px;color:rgba(61,43,22,.5);font-family:'Cormorant Garamond',serif;">${t('progress')}: ${progress}%</div>
        </div>
        <div style="height:4px;background:rgba(61,43,22,.1);border-radius:99px;overflow:hidden;margin-bottom:16px;">
          <div style="height:100%;width:${progress}%;background:linear-gradient(90deg,${GOLD},#d4a84b);border-radius:99px;transition:width .5s;"></div>
        </div>
        <button id="popupFly" class="ink-btn" style="width:100%;justify-content:center;padding:14px;font-size:15px;${unlocked ? 'background:linear-gradient(180deg,#d4a84b,#b8860b);color:#1a0f00;border-color:#8a6508;font-weight:700;' : 'opacity:0.4;cursor:not-allowed;'}">${unlocked ? t('flyBtn') : t('lockedBtn')}</button>
      </div>`;
    popup.style.display = 'block';
    document.getElementById('popupClose').onclick = () => { popup.style.display = 'none'; };
    document.getElementById('popupClose').onmouseenter = function() { this.style.background = 'rgba(61,43,22,.2)'; };
    document.getElementById('popupClose').onmouseleave = function() { this.style.background = 'rgba(61,43,22,.1)'; };
    const fly = document.getElementById('popupFly');
    if (fly && unlocked) fly.onclick = () => {
      try { window.Sound?.click?.(); } catch (e) {}
      popup.style.display = 'none';
      if (window.Briefing && typeof window.Briefing.show === 'function') window.Briefing.show(i, () => { if (window.Flight?.start) window.Flight.start(i); });
      else if (window.Flight?.start) window.Flight.start(i);
      else window.UI?.toast?.(t('flightDevWarn'), 'warn');
    };
  }

  function setupHandlers() {
    const back = document.querySelector('[data-go="menu"]');
    if (back) back.onclick = () => { try { window.Sound?.click?.(); } catch (e) {} if (window.Screens?.show) window.Screens.show('menu'); };
    document.querySelectorAll('.map-point').forEach(pt => {
      pt.onclick = () => {
        const i = parseInt(pt.getAttribute('data-level'), 10);
        if (!isUnlocked(i)) { window.UI?.toast?.(t('prevLevelWarn'), 'warn'); return; }
        try { window.Sound?.click?.(); } catch (e) {}
        showPopup(i);
      };
    });
  }

  if (window.Screens && typeof window.Screens.register === 'function') { window.Screens.register('map', renderMap); log('Экранъ карты готовъ'); }
  if (window.Events && typeof window.Events.on === 'function') {
    window.Events.on('screen:changed', (n) => { if (n === 'map') setTimeout(renderMap, 100); }, 'MapScreen');
  }
})();