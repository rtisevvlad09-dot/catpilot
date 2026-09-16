// ═══ ЦЕНТРАЛЬНЫЙ МЕНЕДЖЕРЪ (ВЕРСІЯ 11.2 - SDK ЯНДЕКСА + I18N) ═══
(function() {
  'use strict';
  
  // ═══ СПИСОКЪ МОДУЛЕЙ (YaBridge удалёнъ!) ═══
  const MODULE_PATHS = [
    'js/modules/EventBus.js','js/modules/Save.js','js/modules/I18n.js','js/modules/Sound.js','js/modules/UI.js',
    'js/modules/Screens.js','js/modules/Flight.js',
    'js/modules/Daily.js','js/modules/Achievements.js','js/modules/Powerups.js','js/modules/Tournament.js',
    'js/modules/Lives.js','js/modules/Ranks.js','js/modules/Monetization.js',
    'js/bosses/BossRegistry.js',
    'js/bosses/boss1.js','js/bosses/boss2.js','js/bosses/boss3.js','js/bosses/boss4.js',
    'js/bosses/boss5.js','js/bosses/boss6.js','js/bosses/boss7.js','js/bosses/boss8.js',
    'js/bosses/boss9.js','js/bosses/boss10.js','js/bosses/boss11.js','js/bosses/boss12.js',
    'js/bosses/boss13.js','js/bosses/boss14.js','js/bosses/boss15.js','js/bosses/boss16.js',
    'js/bosses/boss17.js','js/bosses/boss18.js','js/bosses/boss19.js','js/bosses/boss20.js',
    'js/data/constants.js','js/data/levels.js','js/data/upgrades.js','js/data/shop.js',
    'js/data/debuffs.js','js/data/planes.js',
    'js/assets/plane.js',
    'js/screens/Menu.js','js/screens/Hangar.js','js/screens/Map.js','js/screens/Shop.js',
    'js/screens/Settings.js','js/screens/Briefing.js','js/screens/Journal.js'
  ];
  
  const AppState = {
    initialized: false,
    currentScreen: 'loading',
    platform: 'web',
    game: { running: false, paused: false, currentLevel: 0 }
  };
  window.AppState = AppState;
  
  const Logger = {
    log: function() { var a = [].slice.call(arguments); a.unshift('%c[Game]', 'color:#4a9eff'); console.log.apply(console, a); },
    warn: function() { var a = [].slice.call(arguments); a.unshift('%c[Game]', 'color:#ffa500'); console.warn.apply(console, a); },
    error: function() { var a = [].slice.call(arguments); a.unshift('%c[Game ERROR]', 'color:#ff4444;font-weight:bold'); console.error.apply(console, a); },
    module: function(n) { var a = [].slice.call(arguments, 1); a.unshift('%c[' + n + ']', 'color:#4aff8b'); console.log.apply(console, a); }
  };
  window.Logger = Logger;
  
  function loadScript(src) {
    return new Promise(function(res, rej) {
      var s = document.createElement('script');
      s.src = src + '?v=' + Date.now();
      s.onload = function() { Logger.module('Loader', 'OK ' + src); res(); };
      s.onerror = function() { Logger.error('FAIL: ' + src); rej(new Error('404: ' + src)); };
      document.head.appendChild(s);
    });
  }
  
  function loadAllModules() {
    Logger.log('Loading modules: ' + MODULE_PATHS.length);
    var loaded = 0, failed = 0, failedList = [];
    return MODULE_PATHS.reduce(function(c, p) {
      return c.then(function() {
        return loadScript(p).then(function() { loaded++; }).catch(function() { failed++; failedList.push(p); });
      });
    }, Promise.resolve())
    .then(function() {
      Logger.log('Loaded: ' + loaded + ', failed: ' + failed);
      if (failedList.length) Logger.warn('Not loaded:', failedList);
      return { loaded: loaded, failed: failed, failedList: failedList };
    });
  }
  
  function detectPlatform() {
    if (typeof YaGames !== 'undefined') { AppState.platform = 'yandex'; Logger.log('Platform: Yandex'); }
    else if (typeof vkBridge !== 'undefined') { AppState.platform = 'vk'; Logger.log('Platform: VK'); }
    else { AppState.platform = 'web'; Logger.log('Platform: Web'); }
  }
  
  function initializeModules() {
    Logger.log('Initializing modules...');
    var order = [
      { names: ['Events', 'EventBus'], required: false },
      { names: ['Save'], required: true },
      { names: ['I18n'], required: false },
      { names: ['Sound'], required: false },
      { names: ['UI'], required: false },
      { names: ['Screens'], required: true },
      { names: ['Flight'], required: false },
      { names: ['Daily'], required: false },
      { names: ['Achievements'], required: false },
      { names: ['Powerups'], required: false },
      { names: ['Tournament'], required: false },  // ← ДОБАВЛЕНО!
      { names: ['Lives'], required: false },
      { names: ['Ranks'], required: false },
      { names: ['Monetization'], required: false }
    ];
    var chain = Promise.resolve();
    order.forEach(function(m) {
      chain = chain.then(function() {
        var mod = null, name = null;
        for (var i = 0; i < m.names.length; i++) {
          if (window[m.names[i]]) { mod = window[m.names[i]]; name = m.names[i]; break; }
        }
        if (mod && typeof mod.init === 'function') {
          return Promise.resolve().then(function() { return mod.init(); })
            .then(function() { Logger.module(name, 'initialized'); })
            .catch(function(e) { Logger.error('Init error ' + name + ':', e); });
        } else if (mod) { Logger.module(name, 'loaded'); return Promise.resolve(); }
        else if (m.required) { Logger.error('Required missing: ' + m.names.join('/')); return Promise.resolve(); }
        else { Logger.warn('Not found: ' + m.names.join('/')); return Promise.resolve(); }
      });
    });
    return chain;
  }
  
  function loadGameData() {
    Logger.log('Loading game data...');
    if (window.Save && typeof window.Save.load === 'function') {
      return Promise.resolve().then(function() { return window.Save.load(); })
        .then(function() { Logger.log('Save loaded'); })
        .catch(function(e) { Logger.error('Save load error:', e); });
    }
    return Promise.resolve();
  }
  
  function startGame() {
    Logger.log('Starting game...');
    if (window.Screens && typeof window.Screens.show === 'function') {
      try { window.Screens.show('menu'); } catch (e) { Logger.error('Screens.show error:', e); }
    } else {
      Logger.warn('Screens not available');
      showFallbackMenu();
    }
    var l = document.getElementById('loading'), a = document.getElementById('app');
    if (l) l.style.display = 'none';
    if (a) a.style.display = 'block';
    AppState.game.running = true;
    Logger.log('Game started!');
    setTimeout(function() { if (window.Daily && window.Daily.autoCheck) window.Daily.autoCheck(); }, 1500);
    setTimeout(function() { if (window.Achievements && window.Achievements.checkAll) window.Achievements.checkAll(); }, 2000);
    if (window.Events && typeof window.Events.emit === 'function') {
      try { window.Events.emit('game:started'); } catch (e) {}
    }
  }
  
  function showFallbackMenu() {
    var a = document.getElementById('app');
    if (!a) return;
    a.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:radial-gradient(ellipse at 30% 20%, #1a3568 0%, #0a1f44 40%, #05102a 100%);color:#faf4e8;font-family:\'Cormorant Garamond\',serif;text-align:center;padding:20px;"><div style="font-size:80px;margin-bottom:20px;">🐱</div><h1 style="font-family:\'IM Fell English SC\',serif;font-size:48px;color:#f0d080;">Котъ-Лётчикъ</h1></div>';
  }
  
  // ═══ ГЛАВНАЯ ФУНКЦИЯ — СНАЧАЛА SDK, ПОТОМЪ МОДУЛИ ═══
  function init() {
    Logger.log('Starting application...');
    detectPlatform();
    
    // ═══════════════════════════════════════════════════════
    // ⚠️ КРИТИЧНО ДЛЯ ЯНДЕКСЪ ИГРЪ: ИНИЦИАЛИЗИРУЕМ SDK ПЕРВЫМЪ!
    // ═══════════════════════════════════════════════════════
    if (typeof YaGames !== 'undefined') {
      Logger.log('Initializing Yandex Games SDK...');
      return YaGames.init()
        .then(function(sdk) {
          window.ysdk = sdk; // Глобальная ссылка для Monetization.js
          Logger.module('Yandex', '✓ SDK initialized (v2)');
          return startLoadingModules();
        })
        .catch(function(err) {
          Logger.warn('SDK init failed: ' + err.message + ' — fallback');
          return startLoadingModules();
        });
    } else {
      Logger.warn('Yandex SDK not found — standalone mode');
      return startLoadingModules();
    }
  }
  
  function startLoadingModules() {
    return loadAllModules().then(function(r) {
      if (r.failedList.indexOf('js/modules/Save.js') !== -1 || 
          r.failedList.indexOf('js/modules/Screens.js') !== -1) {
        showError('Required not loaded: ' + r.failedList.join(', '));
        return;
      }
      return initializeModules().then(function() {
        return loadGameData();
      }).then(function() {
        startGame();
        AppState.initialized = true;
        Logger.log('Available modules:');
        [['Events', 'EventBus'], ['Save'], ['I18n'], ['Sound'], ['UI'], ['Screens'],
         ['Flight'], ['Daily'], ['Achievements'], ['Powerups'], ['Tournament'],
         ['Lives'], ['Ranks'], ['Monetization']].forEach(function(n) {
          var f = null;
          for (var i = 0; i < n.length; i++) {
            if (window[n[i]]) { f = n[i]; break; }
          }
          if (f) Logger.module(f, 'ready');
          else Logger.warn(n[0] + ' - NOT LOADED');
        });
        if (window.Events && typeof window.Events.emit === 'function') {
          try { window.Events.emit('app:ready', { platform: AppState.platform }); } catch (e) {}
        }
      });
    }).catch(function(e) {
      Logger.error('Critical error:', e);
      showError('Failed to start: ' + e.message);
    });
  }
  
  function showError(m) {
    var l = document.getElementById('loading');
    if (!l) return;
    l.innerHTML = '<div style="text-align:center;color:#ff6b6b;max-width:500px;padding:20px;"><div style="font-size:48px;">⚠️</div><div style="font-size:20px;margin:10px 0;color:#f0d080;">Ошибка загрузки</div><div style="font-size:14px;opacity:.8;">' + m + '</div><button onclick="location.reload()" style="margin-top:20px;padding:12px 24px;background:#d4a84b;border:none;border-radius:8px;cursor:pointer;font-weight:bold;">Перезагрузить</button></div>';
  }
  
  // Авто-сохраненіе каждые 5 секундъ
  setInterval(function() {
    if (AppState.initialized && AppState.game.running && window.Save) {
      try { window.Save.save(); } catch (e) {}
    }
  }, 5000);
  
  // Сохраненіе при закрытіи
  window.addEventListener('beforeunload', function() {
    if (window.Save && typeof window.Save.save === 'function') {
      try { window.Save.save(); } catch (e) {}
    }
  });
  
  // Пауза при потерѣ фокуса (требованіе Яндексъ)
  document.addEventListener('visibilitychange', function() {
    if (document.hidden && window.Flight && window.Flight.running && !window.Flight.paused) {
      window.Flight.paused = true;
      if (window.Events && typeof window.Events.emit === 'function') {
        try { window.Events.emit('game:pause'); } catch (e) {}
      }
    }
  });
  
  // Запускъ
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  
  window.AppManager = { init: init, showError: showError, getState: function() { return AppState; } };
})();