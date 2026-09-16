// ═══════════════════════════════════════════════════════════
// 📦 ДАННЫЕ: ТОРГОВЫЕ РЯДЫ (скины, бустеры, золото)
// ═══════════════════════════════════════════════════════════

(function() {
  'use strict';

  const log = (...args) => {
    if (window.Logger && typeof window.Logger.module === 'function') {
      window.Logger.module('ShopData', ...args);
    }
  };

  // ─── СКИНЫ САМОЛЁТА ───
  const SKINS = [
    { id: 'standard', name: 'Красный бипланъ', color: '#a63a30', cost: 0,    desc: 'Классика Имперіи' },
    { id: 'north',    name: 'Сѣверный вѣтеръ', color: '#9db6d6', cost: 1200, desc: 'Цвѣтъ полярнаго неба' },
    { id: 'gold',     name: 'Золотой орёлъ',   color: '#d9a441', cost: 2000, desc: 'Блескъ богатства' },
    { id: 'imperial', name: 'Императорскій',   color: '#1e3a6d', cost: 3800, desc: 'Синій мундиръ' },
    { id: 'black',    name: 'Ночной ястребъ',  color: '#2a2a3a', cost: 5000, desc: 'Тѣнь въ небѣ' }
  ];

  // ─── БУСТЕРЫ (расходники) ───
  const BOOSTS = [
    { id: 'shield', name: 'Щитъ',   cost: 300, desc: 'Поглощаетъ одинъ ударъ' },
    { id: 'magnet', name: 'Магнитъ',cost: 260, desc: 'Притягиваетъ монеты 20 сек' },
    { id: 'repair', name: 'Ремонтъ',cost: 200, desc: 'Чинитъ +30% двигателя' }
  ];

  // ─── ЗОЛОТО (для монетизаціи Яндексъ/ВК) ───
  const GOLD = [
    { coins: 1000,  rub: 49 },
    { coins: 4000,  rub: 149 },
    { coins: 10000, rub: 349 }
  ];

  function getSkin(id) {
    return SKINS.find(s => s.id === id) || SKINS[0];
  }
  function getSkinColor() {
    return getSkin(window.Save?.data?.skin).color;
  }

  window.ShopData = { SKINS, BOOSTS, GOLD, getSkin, getSkinColor };
  log('✓ Данные торговыхъ рядовъ готовы');

})();