// ═══ РЕЕСТРЪ БОССОВЪ ═══
(function() {
  'use strict';
  const log = (...a) => { if (window.Logger?.module) window.Logger.module('BossRegistry', ...a); };
  window.BossRegistry = {
    defs: {},
    register(id, def) { this.defs[id] = def; },
    get(id) { return this.defs[id] || null; },
    count() { return Object.keys(this.defs).length; }
  };
  log('✓ Реестръ боссовъ готовъ');
})();