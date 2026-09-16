// ═══ 60 УРОВНЕЙ · 20 БОССОВЪ (каждый 3-й) ═══
(function() {
  'use strict';
  const log = (...a) => { if (window.Logger?.module) window.Logger.module('Levels', ...a); };

  const TYPES = ['delivery','race','duel','survival','combat','stealth','rescue'];
  const WEATHER = ['CLEAR','CLOUDY','RAIN','STORM','SNOW','BLIZZARD','WIND','NIGHT','FOG'];
  const ACT = ['Депеша','Гонка','Развѣдка','Конвой','Патруль','Ночной дозоръ','Перехватъ','Дуэль'];
  const PLACE = ['надъ Невой','къ Мяусквѣ','надъ Крымомъ','въ Карпатахъ','надъ Балтикой','къ Сибири','надъ Моремъ','къ Парижу'];
  const BOSS_NAMES = [
    'Графъ Обломовъ','Баронъ Штейнъ','Купецъ Брюхатый','Атаманъ Мурка','Князь Вихрь',
    'Поручикъ Рѣзвый','Полковникъ Громъ','Сѣрая Тѣнь','Адмиралъ Коготь','Ханъ Барсъ',
    'Чёрный Командоръ','Графиня Ночь','Магистръ Винтъ','Княжна Метель','Баронъ Штопоръ',
    'Старшина Гроза','Графъ Рикошетъ','Мадамъ Миражъ','Генералъ Тайфунъ','Императоръ Пустоты'
  ];

  const L = [];
  let b = 0;
  for (let i = 0; i < 60; i++) {
    const isBoss = (i % 3 === 2);
    const lv = {
      n: isBoss ? ('Дуэль: ' + BOSS_NAMES[b]) : (ACT[i % ACT.length] + ' ' + PLACE[(i * 3) % PLACE.length]),
      y: 1909 + Math.floor(i * 18 / 59),
      t: isBoss ? 'duel' : TYPES[i % TYPES.length],
      w: i === 0 ? 'CLEAR' : WEATHER[(i * 5) % WEATHER.length],
      dist: 8 + (i % 4) * 3 + (isBoss ? 4 : 0),
      _idx: i,
      _isBoss: isBoss,
      _bossIdx: isBoss ? b : -1
    };
    if (isBoss) { lv.boss = BOSS_NAMES[b]; b++; }
    L.push(lv);
  }

  window.LEVELS = L;
  log('✓ Загружено уровней: ' + L.length + ' (боссовъ: ' + b + ')');

  // ═══ ЛОКАЛИЗАЦІЯ НАЗВАНІЙ УРОВНЕЙ И БОССОВЪ (RU/EN/TR/ZH) ═══
  const I18N_ACT = {
    'Депеша':           { en:'Dispatch',         tr:'Telgraf',        zh:'急件' },
    'Гонка':            { en:'Race',             tr:'Yarış',          zh:'竞速' },
    'Развѣдка':         { en:'Recon',            tr:'Keşif',          zh:'侦察' },
    'Конвой':           { en:'Convoy',           tr:'Konvoy',         zh:'护航' },
    'Патруль':          { en:'Patrol',           tr:'Devriye',        zh:'巡逻' },
    'Ночной дозоръ':    { en:'Night Watch',      tr:'Gece Nöbeti',    zh:'夜间守望' },
    'Перехватъ':        { en:'Intercept',        tr:'Önleme',         zh:'拦截' },
    'Дуэль':            { en:'Duel',             tr:'Düello',         zh:'决斗' }
  };

  const I18N_PLACE = {
    'надъ Невой':       { en:'Over the Neva',     tr:'Neva Üzerinde',    zh:'涅瓦河上空' },
    'къ Мяусквѣ':       { en:'To Mausqva',        tr:'Mausqva\'ya',      zh:'飞往猫斯科' },
    'надъ Крымомъ':     { en:'Over Crimea',       tr:'Kırım Üzerinde',   zh:'克里米亚上空' },
    'въ Карпатахъ':     { en:'In the Carpathians',tr:'Karpatlarda',      zh:'喀尔巴阡山' },
    'надъ Балтикой':    { en:'Over the Baltic',   tr:'Baltık Üzerinde',  zh:'波罗的海上空' },
    'къ Сибири':        { en:'To Siberia',        tr:'Sibirya\'ya',      zh:'飞往西伯利亚' },
    'надъ Моремъ':      { en:'Over the Sea',      tr:'Deniz Üzerinde',   zh:'海洋上空' },
    'къ Парижу':        { en:'To Paris',          tr:'Paris\'e',         zh:'飞往巴黎' }
  };

  const I18N_BOSS = [
    { en:'Count Oblomov',       tr:'Kont Oblomov',       zh:'奥布洛莫夫伯爵' },
    { en:'Baron Stein',         tr:'Baron Stein',        zh:'斯坦因男爵' },
    { en:'Merchant Bryukhaty',  tr:'Tüccar Bryukhaty',   zh:'大腹商人' },
    { en:'Ataman Murka',        tr:'Ataman Murka',       zh:'穆尔卡头领' },
    { en:'Prince Whirlwind',    tr:'Prens Kasırga',      zh:'旋风亲王' },
    { en:'Lieutenant Rezvy',    tr:'Teğmen Rezvy',       zh:'活泼中尉' },
    { en:'Colonel Thunder',     tr:'Albay Gök Gürültüsü',zh:'雷霆上校' },
    { en:'Grey Shadow',         tr:'Gri Gölge',          zh:'灰影' },
    { en:'Admiral Claw',        tr:'Amiral Pençe',       zh:'利爪上将' },
    { en:'Khan Bars',           tr:'Han Bars',           zh:'雪豹汗' },
    { en:'Black Commander',     tr:'Kara Komutan',       zh:'黑色指挥官' },
    { en:'Countess Night',      tr:'Kontes Gece',        zh:'夜之伯爵夫人' },
    { en:'Master Screw',        tr:'Usta Vida',          zh:'螺旋桨大师' },
    { en:'Princess Blizzard',   tr:'Prenses Tipi',       zh:'暴雪公主' },
    { en:'Baron Corkscrew',     tr:'Baron Tirbuşon',     zh:'螺旋男爵' },
    { en:'Sergeant Storm',      tr:'Çavuş Fırtına',      zh:'风暴军士长' },
    { en:'Count Ricochet',      tr:'Kont Sekme',         zh:'跳弹伯爵' },
    { en:'Madam Mirage',        tr:'Madam Serap',        zh:'幻影夫人' },
    { en:'General Typhoon',     tr:'General Tayfun',     zh:'台风将军' },
    { en:'Emperor of the Void', tr:'Boşluk İmparatoru',  zh:'虚空皇帝' }
  ];

  const I18N_DUEL = { en:'Duel:', tr:'Düello:', zh:'决斗：' };

  window.LEVELS.forEach(function(lv){
    const origName = lv.n;
    const origBoss = lv.boss;

    Object.defineProperty(lv, 'n', {
      configurable: true,
      enumerable: true,
      get: function(){
        const lang = window.I18n?.getLang?.() || 'ru';
        if (lang === 'ru') return origName;

        if (lv._isBoss) {
          const bDict = I18N_BOSS[lv._bossIdx];
          const bName = bDict ? (bDict[lang] || bDict.en) : (origBoss || '?');
          return (I18N_DUEL[lang] || I18N_DUEL.en) + ' ' + bName;
        }

        const actKey = ACT[lv._idx % ACT.length];
        const placeKey = PLACE[(lv._idx * 3) % PLACE.length];
        const actTr = I18N_ACT[actKey] ? (I18N_ACT[actKey][lang] || I18N_ACT[actKey].en) : actKey;
        const placeTr = I18N_PLACE[placeKey] ? (I18N_PLACE[placeKey][lang] || I18N_PLACE[placeKey].en) : placeKey;
        return actTr + ' ' + placeTr;
      }
    });

    if (lv.boss) {
      Object.defineProperty(lv, 'boss', {
        configurable: true,
        enumerable: true,
        get: function(){
          const lang = window.I18n?.getLang?.() || 'ru';
          if (lang === 'ru') return origBoss;
          const bDict = I18N_BOSS[lv._bossIdx];
          return bDict ? (bDict[lang] || bDict.en || origBoss) : origBoss;
        }
      });
    }
  });

  log('✓ Названія уровней локализованы (60 уровней + 20 боссовъ)');
})();