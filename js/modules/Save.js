// ═══════════════════════════════════════════════════════════
// 🧩 МОДУЛЬ: СОХРАНЕНІЯ (i18n + исправленная структура данныхъ)
// Управление сохраненіемъ игрового прогресса
// ═══════════════════════════════════════════════════════════

window.Save = {
  data: null,
  
  getDefault() {
    return {
      version: window.CONFIG?.VERSION || '2.0.0',
      coins: 200,
      fuel: 100,
      engine: 100,
      honor: 0,
      done: [],
      stars: {},
      // Плоская структура улучшеній для совместимости съ Flight.js и Achievements.js
      up: { engine: 0, wings: 0, fuselage: 0, weapon: 0, tank: 0 },
      // Старая структура оставлена для обратной совместимости
      upgrades: {
        engine: { carburetor: 0, pistons: 0, compressor: 0, ignition: 0, exhaust: 0 },
        wings: { material: 0, shape: 0, flaps: 0, span: 0 },
        fuel: { tank: 0, material: 0, pump: 0, fuel_type: 0 },
        armor: { plates: 0, coating: 0, structure: 0 }
      },
      wpn: ['PISTOL'],
      wpnSel: 'PISTOL',
      planes: ['murma'], // Исправлено: было skins, но логика используетъ planes
      plane: 'murma',    // Текущій выбраный самолётъ
      boost: { shield: 1, magnet: 0, repair: 0 },
      journal: [],
      xp: {
        daily: { last: '', streak: 0 },
        lives: { date: '', crashes: 0 }, // Критически важно для системы жизней и монетизаціи!
        postcards: [],
        medals: [],
        stats: { flights: 0, wins: 0, bosses: 0, perfect: 0 }
      },
      settings: {
        volume: 0.8,
        music: true,
        fx: true,
        lang: 'ru' // Языкъ по умолчанию
      }
    };
  },
  
  init() {
    return this.load();
  },
  
  async load() {
    try {
      const key = window.CONFIG?.SAVE?.KEY || 'cat_pilot_v2';
      const raw = localStorage.getItem(key);
      
      if (raw) {
        this.data = this.mergeDeep(this.getDefault(), JSON.parse(raw));
        console.log('%c[Save]', 'color: #4aff8b', '✓ Сохраненіе загружено');
      } else {
        this.data = this.getDefault();
        console.log('%c[Save]', 'color: #4aff8b', '✓ Новое сохраненіе');
      }
      
      window.Events?.emit('save:loaded', this.data);
      return this.data;
    } catch (error) {
      console.error('[Save] Ошибка загрузки:', error);
      this.data = this.getDefault();
      return this.data;
    }
  },
  
  save() {
    try {
      const key = window.CONFIG?.SAVE?.KEY || 'cat_pilot_v2';
      localStorage.setItem(key, JSON.stringify(this.data));
      window.Events?.emit('save:saved', this.data);
    } catch (error) {
      console.error('[Save] Ошибка сохраненія:', error);
    }
  },
  
  mergeDeep(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.mergeDeep(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  },
  
  // Полученіе ранга. Теперьъ делегируетъ новому модулю Ranks.js,
  // но сохраняетъ fallback на старую систему съ поддержкой i18n.
  getRank() {
    // Если доступенъ новый модуль ранговъ, используемъ его (предпочтительно)
    if (window.Ranks?.getCurrentRank) {
      return window.Ranks.getCurrentRank();
    }
    
    // Fallback на старую систему (на случайъ, если Ranks.js не загрузился)
    const lang = window.I18n?.getLang?.() || 'ru';
    const ranks = [
      { name: {ru:'Поручикъ', en:'Lieutenant', tr:'Teğmen', zh:'中尉'}, min: 0 },
      { name: {ru:'Штабсъ-Капитанъ', en:'Staff Captain', tr:'Üsteğmen', zh:'上尉'}, min: 100 },
      { name: {ru:'Капитанъ', en:'Captain', tr:'Kaptan', zh:'上校'}, min: 300 },
      { name: {ru:'Полковникъ', en:'Colonel', tr:'Albay', zh:'上校'}, min: 700 },
      { name: {ru:'Генералъ-Маіоръ', en:'Major General', tr:'Tümgeneral', zh:'少将'}, min: 1500 }
    ];
    
    let rank = ranks[0];
    for (const r of ranks) {
      if ((this.data?.honor || 0) >= r.min) rank = r;
    }
    
    const rankName = rank.name[lang] || rank.name.en || rank.name.ru;
    return { name: rankName, min: rank.min, icon: '🎖️', color: '#8e8e93' };
  }
};

console.log('%c[Save]', 'color: #4aff8b', 'Модуль сохраненій готовъ');