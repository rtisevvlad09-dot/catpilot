// ═══════════════════════════════════════════════════════════
// 🧩 МОДУЛЬ: ИНТЕРФЕЙСЪ (UI)
// Управленіе UI элементами (toast, dialog, formatNumber)
// ═══════════════════════════════════════════════════════════

window.UI = {
  toastTimeout: null,
  
  init() {
    console.log('%c[UI]', 'color: #4aff8b', '✓ UI готовъ');
  },
  
  // ─── TOAST (всплывающее уведомленіе) ───
  // Переводы должны быть сдѣланы ДО вызова этой функціи
  toast(message, type = 'info') {
    let toast = document.getElementById('toast');
    
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.style.cssText = `
        position: fixed; top: 24px; left: 50%; transform: translateX(-50%) translateY(-20px);
        padding: 14px 24px; border-radius: 12px; z-index: 10000;
        opacity: 0; transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: 'IM Fell English SC', serif; font-size: 14px;
        letter-spacing: 0.05em; font-weight: 600;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4); backdrop-filter: blur(12px);
        pointer-events: none; max-width: 90%; text-align: center;
        border: 1px solid rgba(212,168,75,0.3);
      `;
      document.body.appendChild(toast);
    }
    
    // Цвѣта для разныхъ типовъ
    const styles = {
      info:    'background: rgba(26,53,104,0.95); color: #f0d080; border-color: rgba(212,168,75,0.4);',
      success: 'background: rgba(40,100,60,0.95); color: #a8e0a0; border-color: rgba(120,200,120,0.5);',
      warn:    'background: rgba(138,47,29,0.95); color: #ffd8c8; border-color: rgba(255,120,90,0.5);',
      error:   'background: rgba(160,32,32,0.95); color: #ffb8b8; border-color: rgba(255,90,90,0.5);'
    };
    
    toast.style.cssText += (styles[type] || styles.info);
    toast.textContent = message;
    
    // Анимированное появленіе
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(-20px)';
    }, 3000);
  },
  
  // ─── DIALOG (модальный діалогъ съ кнопками) ───
  dialog(title, text, buttons = []) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center; z-index: 9999;
      backdrop-filter: blur(8px); padding: 24px;
    `;
    
    const box = document.createElement('div');
    box.style.cssText = `
      background: linear-gradient(180deg, #1a3568, #0a1f44);
      border-radius: 20px; padding: 32px; max-width: 440px; width: 100%;
      text-align: center; color: #faf4e8;
      border: 1px solid rgba(212,168,75,0.4);
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      animation: dialogFadeIn 0.3s ease-out;
    `;
    
    box.innerHTML = `
      <h2 style="font-family: 'IM Fell English SC', serif; color: #f0d080; margin: 0 0 16px; font-size: 22px;">${title}</h2>
      <p style="margin: 0 0 24px; line-height: 1.6; font-family: 'Cormorant Garamond', serif; font-size: 16px; color: rgba(250,244,232,0.85);">${text}</p>
    `;
    
    const btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;';
    
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.textContent = btn.label;
      button.style.cssText = `
        padding: 12px 28px; border-radius: 99px; border: none; cursor: pointer;
        background: ${btn.primary ? 'linear-gradient(180deg, #ffd080, #d4a84b)' : 'rgba(255,255,255,0.08)'};
        color: ${btn.primary ? '#1a0f00' : '#faf4e8'}; font-weight: 700;
        font-family: 'IM Fell English SC', serif; font-size: 14px; letter-spacing: 0.06em;
        transition: all 0.25s; border: ${btn.primary ? '1px solid rgba(255,235,160,0.6)' : '1px solid rgba(255,255,255,0.2)'};
      `;
      button.onmouseenter = () => {
        button.style.transform = 'translateY(-2px)';
        if (btn.primary) button.style.boxShadow = '0 6px 18px rgba(212,168,75,0.5)';
      };
      button.onmouseleave = () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'none';
      };
      button.onclick = () => {
        document.body.removeChild(overlay);
        if (btn.action) btn.action();
      };
      btnContainer.appendChild(button);
    });
    
    box.appendChild(btnContainer);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    
    // Анимационный CSS (добавляется одинъ разъ)
    if (!document.getElementById('uiDialogAnim')) {
      const style = document.createElement('style');
      style.id = 'uiDialogAnim';
      style.textContent = `@keyframes dialogFadeIn { from { opacity: 0; transform: scale(0.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }`;
      document.head.appendChild(style);
    }
  },
  
  // ─── CONFIRM (упрощённый діалогъ подтверждения) ───
  confirm(title, text, onConfirm, onCancel, labels = {}) {
    const t = (k) => window.I18n ? window.I18n.t(k) : k;
    this.dialog(title, text, [
      { label: labels.confirm || t('resetYes') || 'Да', primary: true, action: onConfirm },
      { label: labels.cancel || t('cancel') || 'Отмѣна', primary: false, action: onCancel }
    ]);
  },
  
  // ─── FORMAT NUMBER (число съ учётомъ языка) ───
  formatNumber(n) {
    const lang = window.I18n?.getLang?.() || 'ru';
    const localeMap = {
      ru: 'ru-RU',
      en: 'en-US',
      tr: 'tr-TR',
      zh: 'zh-CN'
    };
    try {
      return n.toLocaleString(localeMap[lang] || 'ru-RU');
    } catch (e) {
      return n.toLocaleString('ru-RU');
    }
  },
  
  // ─── Форматированіе большихъ чиселъ (1.5к, 2.3M) ───
  formatCompact(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.', ',') + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.', ',') + 'к';
    return this.formatNumber(n);
  }
};

console.log('%c[UI]', 'color: #4aff8b', '✓ Модуль UI готовъ');