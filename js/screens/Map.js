// ═══════════════════════════════════════════════════════════
// 🌍 КРУГОСВЕТНЫЙ ГЛОБУС (Псевдо-3D на Canvas)
// ═══════════════════════════════════════════════════════════
(function() {
  'use strict';
  const log = (...a) => { if (window.Logger?.module) window.Logger.module('Map', ...a); };
  const t = (k, p) => window.I18n ? window.I18n.t(k, p) : k;

  let raf = null;
  let running = false;
  let canvas, ctx;
  let W = 0, H = 0;

  // Event handler references for cleanup
  let onMouseUp, onTouchEnd, onResize;

  // Вращение глобуса
  let rotX = 0;      // вокруг оси X (вверх-вниз)
  let rotY = 0;      // вокруг оси Y (влево-вправо)
  let vRotX = 0, vRotY = 0.002;

  let isDragging = false;
  let lastMouse = { x: 0, y: 0 };
  
  // Геометрия
  const RADIUS = 180; // Базовый радиус
  const POINTS_COUNT = 80;
  let levels = [];
  let landmasses = [];

  // Географические маркеры (Широта, Долгота)
  const CITIES = [
    { name: 'Лондонъ', lat: 0.9, lon: 0.0 }, // 51N, 0
    { name: 'Парижъ', lat: 0.85, lon: 0.04 }, // 48N, 2E
    { name: 'Альпы', lat: 0.8, lon: 0.17 }, // 46N, 10E
    { name: 'Суэцъ', lat: 0.52, lon: 0.56 }, // 30N, 32E
    { name: 'Индія', lat: 0.35, lon: 1.35 }, // 20N, 77E
    { name: 'Китай', lat: 0.6, lon: 1.8 }, // 35N, 104E
    { name: 'Японія', lat: 0.63, lon: 2.4 }, // 36N, 138E
    { name: 'Тихій океанъ', lat: 0.1, lon: 3.5 }, // 5N, -160 (200E)
    { name: 'Сан-Франциско', lat: 0.66, lon: 4.15 }, // 37N, -122 (238E)
    { name: 'Нью-Йоркъ', lat: 0.71, lon: 5.0 }, // 40N, -74 (286E)
    { name: 'Атлантика', lat: 0.6, lon: 5.6 } // 35N, -35 (325E)
  ];

  function llToXYZ(lat, lon) {
    return {
      x: Math.cos(lat) * Math.cos(lon),
      y: Math.sin(lat),
      z: Math.cos(lat) * Math.sin(lon)
    };
  }

  function initContinents() {
    landmasses = [];
    const rnd = () => Math.random() * 2 - 1;
    // Очень грубая аппроксимация континентов кругами
    const regions = [
      { lat: 0.8, lon: 0.2, r: 0.3, c: 40 }, // Европа
      { lat: 0.5, lon: 1.5, r: 0.6, c: 80 }, // Азия
      { lat: -0.1, lon: 0.4, r: 0.5, c: 70 }, // Африка
      { lat: 0.8, lon: 4.6, r: 0.5, c: 60 }, // Сев. Америка
      { lat: -0.3, lon: 5.1, r: 0.4, c: 50 }, // Юж. Америка
      { lat: -0.4, lon: 2.3, r: 0.3, c: 30 } // Австралия
    ];

    for (let reg of regions) {
      for (let i=0; i<reg.c; i++) {
        // Разброс вокруг центра региона
        const dLat = (Math.random() - 0.5) * reg.r;
        const dLon = (Math.random() - 0.5) * reg.r * 1.5;
        const pLat = reg.lat + dLat;
        const pLon = reg.lon + dLon;
        // Отсечение по краям
        if (pLat > 1.4 || pLat < -1.4) continue;
        landmasses.push(llToXYZ(pLat, pLon));
      }
    }
  }

  function initLevels() {
    levels = [];
    const done = window.Save?.data?.done || [];

    // Генерируем маршрут, проходящий через города
    for (let i = 0; i < POINTS_COUNT; i++) {
      const isBoss = (i % 4 === 3);

      const progress = i / (POINTS_COUNT - 1); // 0 to 1

      // Находим два ближайших города
      const cityIdxFloat = progress * (CITIES.length - 1);
      const idx1 = Math.floor(cityIdxFloat);
      const idx2 = Math.min(CITIES.length - 1, idx1 + 1);
      const t = cityIdxFloat - idx1;

      const c1 = CITIES[idx1];
      const c2 = CITIES[idx2];

      // Интерполяция
      let lat = c1.lat + (c2.lat - c1.lat) * t;
      let lon = c1.lon + (c2.lon - c1.lon) * t;

      // Добавляем шум, чтобы не было прямой линии
      lat += (Math.random() * 0.1 - 0.05);
      lon += (Math.random() * 0.1 - 0.05);

      const xyz = llToXYZ(lat, lon);

      const isCompleted = done.includes(i);
      const isAvailable = (i === 0 || done.includes(i-1));

      let state = 'locked';
      if (isCompleted) state = 'done';
      else if (isAvailable) state = 'avail';

      // Привязываем названия городов к некоторым узлам
      let cityName = null;
      if (Math.abs(t) < 0.1 && i !== 0 && i !== POINTS_COUNT - 1) { // Близко к c1
         cityName = c1.name;
      }

      levels.push({ i, x: xyz.x, y: xyz.y, z: xyz.z, isBoss, state, cityName });
    }

    // Гарантируем, что старт и финиш называются
    if(levels.length > 0) levels[0].cityName = CITIES[0].name;
    if(levels.length > 0) levels[levels.length-1].cityName = CITIES[CITIES.length-1].name;
  }

  // 3D вращение точки
  function rotate3D(p, rx, ry) {
    // Вращение вокруг X
    let y1 = p.y * Math.cos(rx) - p.z * Math.sin(rx);
    let z1 = p.y * Math.sin(rx) + p.z * Math.cos(rx);

    // Вращение вокруг Y
    let x2 = p.x * Math.cos(ry) + z1 * Math.sin(ry);
    let z2 = -p.x * Math.sin(ry) + z1 * Math.cos(ry);

    return { x: x2, y: y1, z: z2 };
  }

  function resize() {
    if (!canvas) return;
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function draw() {
    if (!ctx) return;

    // Очистка
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const R = Math.min(W, H) * 0.35; // Адаптивный радиус

    // Океан (сфера)
    const g = ctx.createRadialGradient(cx - R*0.3, cy - R*0.3, R*0.1, cx, cy, R);
    g.addColorStop(0, '#3a6a9a'); // Блики солнца на воде
    g.addColorStop(0.7, '#1a3a6a');
    g.addColorStop(1, '#05102a');

    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    // Атмосферное свечение (halo)
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.05, 0, Math.PI*2);
    const hg = ctx.createRadialGradient(cx, cy, R*0.95, cx, cy, R*1.05);
    hg.addColorStop(0, 'rgba(100, 180, 255, 0)');
    hg.addColorStop(0.5, 'rgba(100, 180, 255, 0.3)');
    hg.addColorStop(1, 'rgba(100, 180, 255, 0)');
    ctx.fillStyle = hg;
    ctx.fill();

    // Континенты
    ctx.fillStyle = 'rgba(40, 80, 50, 0.4)'; // Зеленоватый оттенок суши
    for (let p of landmasses) {
      const pRot = rotate3D(p, rotX, rotY);
      if (pRot.z < 0) continue; // На обратной стороне
      const px = cx + pRot.x * R;
      const py = cy + pRot.y * R;
      // Размер пятна зависит от перспективы
      const scale = 0.5 + (pRot.z + 1) * 0.5;

      ctx.beginPath();
      ctx.arc(px, py, 15 * scale, 0, Math.PI * 2);
      ctx.fill();
    }

    // Меридианы и параллели (каркас)
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    // Отрисовка сетки
    for(let i=0; i<6; i++) {
        // Упрощенная отрисовка экваторов, вращающихся вместе с глобусом
        ctx.beginPath();
        ctx.ellipse(cx, cy, R, R * Math.abs(Math.sin(rotX + i*Math.PI/6)), 0, 0, Math.PI*2);
        ctx.stroke();
    }

    // Сортировка точек по Z (чтобы рисовать задние позади, а передние спереди)
    const proj = levels.map(p => {
      const pRot = rotate3D(p, rotX, rotY);
      return { ...p, px: cx + pRot.x * R, py: cy + pRot.y * R, pz: pRot.z };
    });

    proj.sort((a,b) => a.pz - b.pz); // От дальних к ближним

    // Линии маршрута
    ctx.strokeStyle = 'rgba(212,168,75,0.4)';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    let first = true;
    let lastZVisible = false;
    for(let i=0; i<proj.length; i++) {
        const p = proj.find(pt => pt.i === i);
        if(!p) continue;
        const isVisible = p.pz >= -0.2;
        if (!isVisible) {
            first = true; // Разрыв линии, если ушли за горизонт
            lastZVisible = false;
            continue;
        }
        if(first) {
            ctx.moveTo(p.px, p.py);
            first = false;
        } else {
            if(lastZVisible) ctx.lineTo(p.px, p.py);
            else ctx.moveTo(p.px, p.py);
        }
        lastZVisible = true;
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Точки
    for(let p of proj) {
      if (p.pz < 0) continue; // Точка за горизонтом

      // Перспектива: чем ближе (z > 0), тем больше
      const scale = 0.5 + (p.pz + 1) * 0.5; // от 0.5 до 1.5
      const size = (p.isBoss ? 8 : 5) * scale;

      let color = '#555'; // locked
      let glow = false;

      if (p.state === 'done') {
        color = '#d4a84b'; // gold
      } else if (p.state === 'avail') {
        color = '#ff4444'; // active
        glow = true;
      }

      if (glow) {
         ctx.beginPath();
         ctx.arc(p.px, p.py, size * 2.5, 0, Math.PI*2);
         ctx.fillStyle = 'rgba(255, 68, 68, 0.4)';
         ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(p.px, p.py, size, 0, Math.PI*2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Иконка самолетика на активном уровне
      if (p.state === 'avail') {
         ctx.font = `${Math.floor(16 * scale)}px Arial`;
         ctx.textAlign = 'center';
         ctx.textBaseline = 'bottom';
         ctx.fillStyle = '#fff';
         ctx.fillText('✈', p.px, p.py - size - 2);
      }

      // Название города
      if (p.cityName && scale > 0.8) {
         ctx.font = `${Math.floor(10 * scale)}px 'IM Fell English SC', serif`;
         ctx.textAlign = 'center';
         ctx.textBaseline = 'top';
         ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
         ctx.fillText(p.cityName, p.px, p.py + size + 4);
      }
    }
  }

  function loop() {
    if (!running) return;

    // Инерция
    rotX += vRotX;
    rotY += vRotY;

    vRotX *= 0.95;
    vRotY = vRotY * 0.95 + 0.002 * 0.05; // Автоматическое вращение вправо

    draw();
    raf = requestAnimationFrame(loop);
  }

  function renderMap() {
    const app = document.getElementById('app');
    if (!app) return;

    const done = window.Save?.data?.done || [];
    const daysLeft = 80 - done.length;

    app.innerHTML = `
      <style>
        #app { background: #000; overflow: hidden; }
        .hud-top { position:absolute; top:20px; left:20px; right:20px; display:flex; justify-content:space-between; z-index:10; }
        .glass-panel { background: rgba(10,20,40,0.6); border: 1px solid rgba(212,168,75,0.4); border-radius: 12px; padding: 10px 20px; color: #f0d080; font-family: 'IM Fell English SC', serif; backdrop-filter: blur(10px); }
        .btn-back { cursor:pointer; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 99px; padding: 10px 24px; color: #fff; font-size: 14px; text-transform:uppercase; letter-spacing:1px; }
        .btn-back:hover { background: rgba(255,255,255,0.2); }
        .btn-fly { position:absolute; bottom: 40px; left:50%; transform:translateX(-50%); cursor:pointer; background: linear-gradient(180deg,#ffd080,#d4a84b); border:none; border-radius: 99px; padding: 16px 40px; color: #1a0f00; font-size: 20px; font-weight:bold; font-family: 'IM Fell English SC', serif; box-shadow: 0 4px 20px rgba(212,168,75,0.4); transition: transform 0.2s; z-index:10;}
        .btn-fly:hover { transform:translateX(-50%) scale(1.05); }
      </style>

      <canvas id="globeCanvas" style="position:absolute; inset:0; width:100%; height:100%; cursor:grab;"></canvas>

      <div class="hud-top">
        <button id="btnMapBack" class="btn-back">${t('back')}</button>
        <div class="glass-panel" style="font-size:24px; text-align:center;">
           КРУГОСВѢТНЫЙ ПОЛЁТЪ<br>
           <span style="font-size:16px; color:#fff;">Осталось дней: ${daysLeft} из 80</span>
        </div>
        <div class="glass-panel">🪙 ${window.Save?.data?.coins || 0}</div>
      </div>

      <button id="btnFlyGlobal" class="btn-fly">✈ ВЪ ПОЛЁТЪ!</button>
    `;

    canvas = document.getElementById('globeCanvas');
    ctx = canvas.getContext('2d');

    onMouseUp = () => { if (canvas) { isDragging = false; canvas.style.cursor='grab'; } };
    onTouchEnd = () => { isDragging = false; };
    onResize = () => resize();

    // События мыши/тача для вращения
    canvas.addEventListener('mousedown', e => { isDragging = true; lastMouse = {x: e.clientX, y: e.clientY}; canvas.style.cursor='grabbing'; });
    canvas.addEventListener('mousemove', e => {
      if(!isDragging) return;
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      vRotY = dx * 0.005;
      vRotX = dy * 0.005;
      lastMouse = {x: e.clientX, y: e.clientY};
    });
    window.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('touchstart', e => { isDragging = true; lastMouse = {x: e.touches[0].clientX, y: e.touches[0].clientY}; });
    canvas.addEventListener('touchmove', e => {
      if(!isDragging) return;
      const dx = e.touches[0].clientX - lastMouse.x;
      const dy = e.touches[0].clientY - lastMouse.y;
      vRotY = dx * 0.005;
      vRotX = dy * 0.005;
      lastMouse = {x: e.touches[0].clientX, y: e.touches[0].clientY};
    });
    window.addEventListener('touchend', onTouchEnd);

    function cleanup() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
    }

    document.getElementById('btnMapBack').onclick = () => {
      cleanup();
      if(window.Screens?.show) window.Screens.show('menu');
    };

    document.getElementById('btnFlyGlobal').onclick = () => {
       const done = window.Save?.data?.done || [];
       let next = 0; while (next < 80 && done.includes(next)) next++;
       if(next >= 80) { if (window.UI?.toast) window.UI.toast('Кругосвѣтное путешествіе завершено!', 'success'); return; }
       cleanup();
       if (window.Briefing?.show) window.Briefing.show(next, () => { if (window.Flight?.start) window.Flight.start(next); });
       else if (window.Flight?.start) window.Flight.start(next);
    };

    window.addEventListener('resize', onResize);
    resize();
    initContinents();
    initLevels();

    running = true;
    raf = requestAnimationFrame(loop);
    log('✓ 3D Глобус отрисован');
  }

  if (window.Screens?.register) { window.Screens.register('map', renderMap); }
})();
