// ═══ НАСТРОЙКИ (громкость, FX, музыка, языкъ, сбросъ) (i18n) ═══
(function() {
  'use strict';
  const log = (...a) => { if (window.Logger?.module) window.Logger.module('Settings', ...a); };
  const t = (k, p) => window.I18n ? window.I18n.t(k, p) : k;

  function renderSettings() {
    const app = document.getElementById('app');
    if (!app) return;
    const d = window.Save?.data || {};
    if (!d.settings) d.settings = {};
    const s = d.settings;
    const vol = s.volume ?? 0.8;
    const fx = s.fx !== false;
    const music = s.music !== false;
    const muted = window.Sound?.isMuted?.() || false;
    const curLang = window.I18n?.getLang?.() || 'ru';
    const langs = window.I18n?.getLangs?.() || { ru: { name: 'Русскій', flag: '🇷🇺' }, en: { name: 'English', flag: '🇬🇧' }, tr: { name: 'Türkçe', flag: '🇹🇷' }, zh: { name: '中文', flag: '🇨🇳' } };

    let langBtns = '';
    for (const code in langs) {
      const L = langs[code];
      const active = code === curLang;
      langBtns += `<button data-lang="${code}" style="
        padding:10px 16px;border-radius:8px;font-size:14px;cursor:pointer;transition:all .25s;
        border:2px solid ${active ? '#f0d080' : 'rgba(255,255,255,.15)'};
        background:${active ? 'rgba(212,168,75,.2)' : 'rgba(255,255,255,.04)'};
        color:${active ? '#f0d080' : 'rgba(250,244,232,.6)'};
        font-family:'IM Fell English SC',serif;letter-spacing:.05em;
        display:flex;align-items:center;gap:8px;">
        <span style="font-size:20px;">${L.flag}</span>
        <span>${L.name}</span>
        ${active ? '<span style="margin-left:auto;color:#a8e0a0;">✓</span>' : ''}
      </button>`;
    }

    app.innerHTML = `
      <style>
        #app{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;overflow:hidden!important;display:block!important;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(15px);}to{opacity:1;transform:translateY(0);}}
        .ink-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:4px;font-family:'IM Fell English SC',serif;font-size:13px;letter-spacing:.1em;text-transform:uppercase;background:linear-gradient(180deg,rgba(245,230,200,.9),rgba(232,213,168,.8));color:#3d2b16;border:1.5px solid #3d2b16;cursor:pointer;transition:all .25s;box-shadow:0 2px 6px rgba(60,40,20,.2);}
        .ink-btn:hover{background:linear-gradient(180deg,#3d2b16,#2a1a0a);color:#e3d3ae;transform:translateY(-1px);}
        .setting-row{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:linear-gradient(180deg,rgba(245,230,200,.08),rgba(245,230,200,.02));border:1px solid rgba(212,168,75,.25);border-radius:10px;margin-bottom:10px;}
        .setting-label{font-family:'IM Fell English SC',serif;font-size:15px;color:#f0d080;}
        .setting-desc{font-size:11px;color:rgba(250,244,232,.4);margin-top:2px;}
        .toggle{width:52px;height:28px;border-radius:99px;border:1.5px solid rgba(212,168,75,.4);cursor:pointer;position:relative;transition:all .3s;flex-shrink:0;}
        .toggle.on{background:linear-gradient(180deg,rgba(120,200,120,.3),rgba(120,200,120,.15));border-color:rgba(120,200,120,.5);}
        .toggle.off{background:rgba(255,255,255,.05);border-color:rgba(255,255,255,.15);}
        .toggle::after{content:'';position:absolute;top:3px;width:20px;height:20px;border-radius:50%;transition:all .3s;}
        .toggle.on::after{left:27px;background:#a8e0a0;}
        .toggle.off::after{left:3px;background:rgba(250,244,232,.4);}
        .slider-wrap{display:flex;align-items:center;gap:12px;flex:1;max-width:220px;margin-left:20px;}
        .slider{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:99px;background:rgba(255,255,255,.1);outline:none;}
        .slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;background:linear-gradient(180deg,#ffd080,#d4a84b);cursor:pointer;border:2px solid #8a6508;box-shadow:0 2px 6px rgba(0,0,0,.3);}
        .slider::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:linear-gradient(180deg,#ffd080,#d4a84b);cursor:pointer;border:2px solid #8a6508;}
        .vol-val{font-size:13px;color:#f0d080;font-weight:600;min-width:36px;text-align:right;}
        .danger-btn{padding:12px 24px;border-radius:6px;font-family:'IM Fell English SC',serif;font-size:13px;letter-spacing:.08em;text-transform:uppercase;background:rgba(255,80,60,.1);color:#ff8a80;border:1px solid rgba(255,80,60,.3);cursor:pointer;transition:all .25s;width:100%;}
        .danger-btn:hover{background:rgba(255,80,60,.25);border-color:rgba(255,80,60,.6);}
        .lang-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-top:8px;}
      </style>
      <div style="position:fixed;inset:0;z-index:-3;background:radial-gradient(ellipse at 30% 20%, #1a3568 0%, #0a1f44 40%, #05102a 100%);"></div>
      <div style="position:fixed;inset:0;z-index:-1;background:radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.75) 100%);pointer-events:none;"></div>

      <div style="position:fixed;inset:0;display:flex;flex-direction:column;z-index:1;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 24px 8px;">
          <button class="ink-btn" data-go="menu">${t('back')}</button>
        </div>

        <div style="text-align:center;padding:4px 24px 20px;">
          <div style="font-family:'IM Fell English SC',serif;font-size:clamp(24px,4vw,38px);color:#faf4e8;letter-spacing:.08em;">${t('settings')}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:13px;color:rgba(240,208,128,.5);margin-top:4px;">${t('imperialFleet')}</div>
        </div>

        <div style="flex:1;overflow-y:auto;padding:0 24px 40px;">
          <div style="max-width:560px;margin:0 auto;animation:fadeIn .5s ease-out;">

            <!-- ЯЗЫКЪ -->
            <div class="setting-row" style="flex-direction:column;align-items:stretch;">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
                <span class="setting-label">${t('language')}</span>
              </div>
              <div class="setting-desc">${t('languageDesc')}</div>
              <div class="lang-grid" id="langGrid">
                ${langBtns}
              </div>
            </div>

            <!-- ГРОМКОСТЬ -->
            <div class="setting-row">
              <div>
                <div class="setting-label">${t('volume')}</div>
                <div class="setting-desc">${t('volumeDesc')}</div>
              </div>
              <div class="slider-wrap">
                <input type="range" class="slider" id="volSlider" min="0" max="100" value="${Math.round(vol*100)}">
                <span class="vol-val" id="volVal">${Math.round(vol*100)}%</span>
              </div>
            </div>

            <!-- MUTE -->
            <div class="setting-row">
              <div>
                <div class="setting-label">${t('mute')}</div>
                <div class="setting-desc">${t('muteDesc')}</div>
              </div>
              <div class="toggle ${muted?'off':'on'}" id="togMute"></div>
            </div>

            <!-- МУЗЫКА -->
            <div class="setting-row">
              <div>
                <div class="setting-label">${t('music')}</div>
                <div class="setting-desc">${t('musicDesc')}</div>
              </div>
              <div class="toggle ${music?'on':'off'}" id="togMusic"></div>
            </div>

            <!-- FX -->
            <div class="setting-row">
              <div>
                <div class="setting-label">${t('fx')}</div>
                <div class="setting-desc">${t('fxDesc')}</div>
              </div>
              <div class="toggle ${fx?'on':'off'}" id="togFx"></div>
            </div>

            <!-- ОПАСНАЯ ЗОНА -->
            <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(212,168,75,.15);">
              <div style="font-family:'IM Fell English SC',serif;font-size:14px;color:rgba(255,138,128,.7);margin-bottom:12px;text-align:center;">${t('dangerZone')}</div>
              <button class="danger-btn" id="btnReset">${t('resetProgress')}</button>
              <div style="font-size:11px;color:rgba(250,244,232,.3);text-align:center;margin-top:8px;">${t('resetWarn')}</div>
            </div>

            <div style="text-align:center;margin-top:24px;font-size:11px;color:rgba(250,244,232,.2);font-family:'Cormorant Garamond',serif;">
              ${t('gameTitle')} · ${t('subtitle')} · v1.0
            </div>
          </div>
        </div>
      </div>

      <!-- ПОДТВЕРЖДЕНІЕ СБРОСА -->
      <div id="resetConfirm" style="position:fixed;inset:0;z-index:100;display:none;align-items:center;justify-content:center;padding:24px;">
        <div style="position:absolute;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(8px);" class="rc-bg"></div>
        <div style="position:relative;max-width:400px;width:90%;background:linear-gradient(180deg,rgba(26,53,104,.97),rgba(10,31,68,.98));border:1px solid rgba(255,80,60,.4);border-radius:16px;padding:28px;text-align:center;box-shadow:0 16px 50px rgba(0,0,0,.5);">
          <div style="font-size:40px;margin-bottom:12px;">⚠️</div>
          <div style="font-family:'IM Fell English SC',serif;font-size:22px;color:#ff8a80;margin-bottom:8px;">${t('resetConfirm')}</div>
          <div style="font-size:13px;color:rgba(250,244,232,.6);margin-bottom:20px;">${t('resetConfirmDesc')}</div>
          <div style="display:flex;gap:10px;justify-content:center;">
            <button id="rcYes" style="padding:12px 28px;border:none;border-radius:99px;background:linear-gradient(180deg,#ff8a80,#c05a3a);color:#fff;font-weight:700;font-size:14px;cursor:pointer;font-family:'IM Fell English SC',serif;">${t('resetYes')}</button>
            <button id="rcNo" style="padding:12px 28px;border:1px solid rgba(255,255,255,.25);border-radius:99px;background:rgba(255,255,255,.08);color:#faf4e8;font-size:14px;cursor:pointer;font-family:'IM Fell English SC',serif;">${t('cancel')}</button>
          </div>
        </div>
      </div>
    `;

    setupHandlers(s, vol, fx, music, muted);
    log('✓ Настройки отрисованы');
  }

  function setupHandlers(s, vol, fx, music, muted) {
    // Назадъ
    const back = document.querySelector('[data-go="menu"]');
    if (back) back.onclick = () => { try{window.Sound?.click?.();}catch(e){} saveSettings(s); if(window.Screens?.show)window.Screens.show('menu'); };

    // Языкъ
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.onclick = () => {
        const lang = btn.getAttribute('data-lang');
        if (window.I18n) window.I18n.setLang(lang);
        try{window.Sound?.click?.();}catch(e){}
        // Перерисовать экранъ на новомъ языкѣ
        renderSettings();
      };
    });

    // Громкость
    const slider = document.getElementById('volSlider');
    const volVal = document.getElementById('volVal');
    if (slider) {
      slider.oninput = () => {
        const v = parseInt(slider.value) / 100;
        s.volume = v;
        volVal.textContent = slider.value + '%';
        window.Sound?.setVolume?.(v);
        try{window.Sound?.click?.();}catch(e){}
      };
    }

    // Mute
    const togMute = document.getElementById('togMute');
    if (togMute) togMute.onclick = () => {
      const nowMuted = !window.Sound?.isMuted?.();
      window.Sound?.setMuted?.(nowMuted);
      togMute.className = 'toggle ' + (nowMuted ? 'off' : 'on');
      try{if(!nowMuted)window.Sound?.click?.();}catch(e){}
    };

    // Музыка
    const togMusic = document.getElementById('togMusic');
    if (togMusic) togMusic.onclick = () => {
      const nowOn = s.music === false;
      s.music = nowOn;
      window.Sound?.setMusicOn?.(nowOn);
      togMusic.className = 'toggle ' + (nowOn ? 'on' : 'off');
      try{window.Sound?.click?.();}catch(e){}
      if (nowOn) window.Sound?.musicStart?.();
      else window.Sound?.musicStop?.();
    };

    // FX
    const togFx = document.getElementById('togFx');
    if (togFx) togFx.onclick = () => {
      const nowOn = s.fx === false;
      s.fx = nowOn;
      togFx.className = 'toggle ' + (nowOn ? 'on' : 'off');
      try{window.Sound?.click?.();}catch(e){}
    };

    // Сбросъ
    const btnReset = document.getElementById('btnReset');
    const resetOv = document.getElementById('resetConfirm');
    if (btnReset && resetOv) {
      btnReset.onclick = () => { resetOv.style.display = 'flex'; };
      resetOv.querySelector('.rc-bg').onclick = () => { resetOv.style.display = 'none'; };
      document.getElementById('rcNo').onclick = () => { resetOv.style.display = 'none'; };
      document.getElementById('rcYes').onclick = () => {
        try {
          // ИСПРАВЛЕНО: правильный ключъ localStorage (совпадаетъ съ Save.js)
          const saveKey = window.CONFIG?.SAVE?.KEY || 'cat_pilot_v2';
          localStorage.removeItem(saveKey);
          if (window.Save?.data) { Object.keys(window.Save.data).forEach(k => delete window.Save.data[k]); }
          window.Save?.save?.();
        } catch(e) {}
        resetOv.style.display = 'none';
        if (window.UI?.toast) window.UI.toast(t('resetDone'), 'warn');
        setTimeout(() => { location.reload(); }, 800);
      };
    }
  }

  function saveSettings(s) {
    if (window.Save?.save) window.Save.save();
  }

  if (window.Screens?.register) {
    window.Screens.register('settings', renderSettings);
    log('Настройки зарегистрированы');
  }
  // УДАЛЕНО: дублирующій Events.on('screen:changed')
})();