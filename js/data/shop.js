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

  // ─── СКИНЫ САМОЛЁТА (Удалены по требованию, оставлен только один базовый) ───
  const SKINS = [
    { id: 'standard', name: 'Верный бипланъ', color: '#a63a30', cost: 0, desc: 'Ваш единственный и неповторимый самолет для кругосветного путешествия.' }
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