// ═══════════════════════════════════════════════════════════
// 📦 ДАННЫЕ: ДЕБАФЫ (негативные эффекты погоды и поврежденій)
// ═══════════════════════════════════════════════════════════

(function() {
  'use strict';
  const log = (...a) => { if (window.Logger?.module) window.Logger.module('Debuffs', ...a); };

  // speed/ctrl — штрафъ въ доляхъ; vis — затемненіе 0..0.75; burn — уронъ/сек; gust — порывы
  const DEFS = [
    { id:'rain',     name:'Дождь',            icon:'🌧', speed:0.10, ctrl:0,    vis:0.15, burn:0, gust:0,  when: s => s.weather==='RAIN' },
    { id:'storm',    name:'Штормъ',           icon:'⛈', speed:0.20, ctrl:0.25, vis:0.25, burn:0, gust:60, when: s => s.weather==='STORM' },
    { id:'snow',     name:'Снѣгъ',            icon:'❄',  speed:0.10, ctrl:0.15, vis:0.10, burn:0, gust:0,  when: s => s.weather==='SNOW' },
    { id:'blizzard', name:'Метель',           icon:'🌨', speed:0.15, ctrl:0.30, vis:0.40, burn:0, gust:40, when: s => s.weather==='BLIZZARD' },
    { id:'fog',      name:'Туманъ',           icon:'🌫', speed:0,    ctrl:0,    vis:0.50, burn:0, gust:0,  when: s => s.weather==='FOG' },
    { id:'night',    name:'Ночь',             icon:'🌙', speed:0,    ctrl:0,    vis:0.35, burn:0, gust:0,  when: s => s.weather==='NIGHT' },
    { id:'engine',   name:'Моторъ барахлитъ', icon:'🔧', speed:0.10, ctrl:0.10, vis:0,    burn:0, gust:0,  when: s => s.hp < 60 && s.hp >= 35 },
    { id:'fire',     name:'Пожаръ',           icon:'🔥', speed:0.20, ctrl:0.20, vis:0,    burn:2, gust:0,  when: s => s.hp < 35 },
    { id:'lowfuel',  name:'Мало топлива',     icon:'⛽', speed:0.15, ctrl:0,    vis:0,    burn:0, gust:0,  when: s => s.fuel < s.fuelmax*0.3 }
  ];

  // Перемножаетъ всѣ активные штрафы
  function calc(state) {
    const list = DEFS.filter(d => d.when(state));
    let speed = 1, ctrl = 1, vis = 0, burn = 0, gust = 0;
    for (const d of list) {
      speed *= (1 - d.speed);
      ctrl  *= (1 - d.ctrl);
      vis = Math.min(0.75, vis + d.vis);
      burn += d.burn;
      gust += d.gust;
    }
    return { list, speed, ctrl, vis, burn, gust };
  }

  window.Debuffs = { DEFS, calc };
  log('✓ Дебафы готовы (' + DEFS.length + ')');
})();