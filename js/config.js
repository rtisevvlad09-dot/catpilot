// ═══════════════════════════════════════════════════════════
// ⚙️ КОНФИГУРАЦИЯ ИГРЫ (ИСПРАВЛЕНО: пути к файлам)
// ═══════════════════════════════════════════════════════════

window.CONFIG = {
  VERSION: '2.0.0',
  DEBUG: true,
  PLATFORM: 'web',

  SAVE: {
    KEY: 'cat_pilot_v2',
    AUTOSAVE: 5000,
    CLOUD: true
  },

  GAME: {
    BASE_FUEL: 100,
    BASE_ENGINE: 100,
    MAX_STARS: 3,
    COINS_PER_LEVEL: 20,
    HONOR_PER_LEVEL: 15,
    TIME_BASE: 60,
    TIME_INCREMENT: 30
  },

  PLATFORMS: {
    yandex: { enabled: true, cloudSave: true, ads: true },
    vk: { enabled: true, cloudSave: true, ads: true }
  },

  SOUND: {
    enabled: true,
    volume: 0.5,
    motorVolume: 0.3
  },

  // ⭐ ИСПРАВЛЕНО: добавлен префикс js/ ко всем путям
  MODULES: [
    'js/modules/EventBus.js',
    'js/modules/Save.js',
    'js/modules/Sound.js',
    'js/modules/UI.js',
    'js/modules/Screens.js',
    'js/modules/Flight.js',
    'js/data/constants.js',
    'js/data/levels.js',
    'js/data/upgrades.js',
    'js/screens/Menu.js',
    'js/screens/Hangar.js',
    'js/screens/Map.js',
    'js/screens/Shop.js',
    'js/screens/Briefing.js'
  ]
};