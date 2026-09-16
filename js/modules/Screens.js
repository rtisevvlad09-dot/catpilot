// ═══════════════════════════════════════════════════════════
// 🧩 МОДУЛЬ: МЕНЕДЖЕР ЭКРАНОВ
// Управление переключением экранов
// ═══════════════════════════════════════════════════════════

window.Screens = {
  current: 'loading',
  screens: {},
  
  init() {
    console.log('%c[Screens]', 'color: #4aff8b', 'Менеджер экранов готов');
  },
  
  // Зарегистрировать экран
  register(name, renderFn) {
    this.screens[name] = renderFn;
  },
  
  // Показать экран
  show(name) {
    this.current = name;
    
    const app = document.getElementById('app');
    if (app) {
      app.classList.add('visible');
    }
    
    const loading = document.getElementById('loading');
    if (loading) {
      loading.style.display = 'none';
    }
    
    if (this.screens[name]) {
      this.screens[name]();
    }
    
    window.Events?.emit('screen:changed', name);
    console.log('%c[Screens]', 'color: #4aff8b', `Экран: ${name}`);
  }
};

console.log('%c[Screens]', 'color: #4aff8b', 'Модуль экранов готов');