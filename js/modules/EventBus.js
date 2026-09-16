// ═══════════════════════════════════════════════════════════
// 🧩 МОДУЛЬ: СИСТЕМА СОБЫТИЙ (Event Bus)
// Версия 2.0 - с групповой отпиской и приватным состоянием
// ═══════════════════════════════════════════════════════════

(function() {
  'use strict';

  // 🔒 Приватное хранилище слушателей (недоступно снаружи)
  const listeners = new Map();
  
  // Счётчик для уникальных ID обработчиков
  let handlerId = 0;

  const EventBus = {
    
    // ─── ИНИЦИАЛИЗАЦИЯ ───
    init() {
      listeners.clear();
      console.log('%c[EventBus]', 'color: #4aff8b', '✓ Система событий готова');
      return Promise.resolve();
    },

    // ─── ПОДПИСКА ───
    // Поддерживает: on('event', fn) и on('event', fn, owner)
    on(event, callback, owner = null) {
      if (typeof callback !== 'function') {
        console.error(`[EventBus] on("${event}"): callback должен быть функцией`);
        return () => {};
      }

      if (!listeners.has(event)) {
        listeners.set(event, new Map());
      }

      const id = ++handlerId;
      listeners.get(event).set(id, { callback, owner });

      // Возвращаем функцию отписки
      return () => this._remove(event, id);
    },

    // ─── ОДНОРАЗОВАЯ ПОДПИСКА ───
    once(event, callback, owner = null) {
      let unsubscribe;
      unsubscribe = this.on(event, (...args) => {
        try {
          callback(...args);
        } finally {
          if (unsubscribe) unsubscribe();
        }
      }, owner);
      return unsubscribe;
    },

    // ─── ОТПИСКА ОТ КОНКРЕТНОГО ОБРАБОТЧИКА ───
    off(event, callback) {
      if (!listeners.has(event)) return;
      
      const eventListeners = listeners.get(event);
      for (const [id, handler] of eventListeners) {
        if (handler.callback === callback) {
          eventListeners.delete(id);
          break;
        }
      }
      
      if (eventListeners.size === 0) {
        listeners.delete(event);
      }
    },

    // ─── ОТПИСКА ВСЕХ ОБРАБОТЧИКОВ СОБЫТИЯ ───
    offAll(event) {
      if (!event) {
        listeners.clear();
        return;
      }
      listeners.delete(event);
    },

    // ─── ОТПИСКА ВСЕХ ОБРАБОТЧИКОВ ВЛАДЕЛЬЦА ───
    // Полезно при смене экрана: Events.offOwner('MenuScreen')
    offOwner(owner) {
      if (!owner) return;
      
      for (const [event, eventListeners] of listeners) {
        for (const [id, handler] of eventListeners) {
          if (handler.owner === owner) {
            eventListeners.delete(id);
          }
        }
        if (eventListeners.size === 0) {
          listeners.delete(event);
        }
      }
    },

    // ─── ВЫЗОВ СОБЫТИЯ ───
    // Поддерживает: emit('event') или emit('event', arg1, arg2, ...)
    emit(event, ...args) {
      if (!listeners.has(event)) return;

      const eventListeners = listeners.get(event);
      const handlers = Array.from(eventListeners.values()); // Копируем на случай изменений

      handlers.forEach(({ callback }) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`[EventBus] Ошибка в обработчике "${event}":`, error);
        }
      });
    },

    // ─── ПРОВЕРКА НАЛИЧИЯ СЛУШАТЕЛЕЙ ───
    hasListeners(event) {
      return listeners.has(event) && listeners.get(event).size > 0;
    },

    // ─── КОЛИЧЕСТВО СЛУШАТЕЛЕЙ ───
    listenerCount(event) {
      if (!listeners.has(event)) return 0;
      return listeners.get(event).size;
    },

    // ─── ВНУТРЕННЯЯ: удаление по ID ───
    _remove(event, id) {
      if (!listeners.has(event)) return;
      const eventListeners = listeners.get(event);
      eventListeners.delete(id);
      if (eventListeners.size === 0) {
        listeners.delete(event);
      }
    }
  };

  // Делаем доступным глобально под двумя именами
  window.Events = EventBus;
  window.EventBus = EventBus;

  console.log('%c[EventBus]', 'color: #4aff8b', 'Система событий готова (v2.0)');
})();