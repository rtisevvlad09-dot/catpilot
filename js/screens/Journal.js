// ═══ ДНЕВНИКЪ (i18n) ═══
(function() {
  'use strict';
  const log = (...a) => { if (window.Logger?.module) window.Logger.module('Journal', ...a); };
  const t = (k, p) => window.I18n ? window.I18n.t(k, p) : k;

  function getChapters() {
    const chapters = [];
    const doneLevelsCount = window.Save?.data?.done?.length || 0;
    const levels = window.LEVELS || [];
    const maxChapters = levels.length || 80;

    // Prologue chapter always exists
    chapters.push({
      id: 'prologue',
      title: { ru: 'Прологъ · Вылетъ', en: 'Prologue · Departure' },
      icon: '🏰',
      text: {
        ru: 'Котъ Василій садится въ свой вѣрный "Мурма". Впереди – долгое путешествіе черезъ весь свѣтъ.\n\nЦѣль одна – доказать, что коты созданы для небесъ. Первыя испытанія уже ждутъ!',
        en: 'Cat Vasily boards his trusty "Murma". A long journey across the world lies ahead.\n\nHis goal is one – to prove that cats are made for the skies. The first trials await!'
      },
      isUnlocked: true
    });

    // Generate dynamic chapters for each level
    for (let i = 0; i < maxChapters; i++) {
      const level = levels[i] || {};
      const num = i + 1;
      const actName = level.n.split(' (')[0] || 'Полетъ';
      const act = actName;
      const city = level._routeTo || level.n.split(' ➔ ')[1]?.replace(')', '') || 'Неизвѣстность';
      const isBoss = (i + 1) % 4 === 0;

      let titleRu = `Глава ${num} · ${act} ${city}`;
      let textRu = `Дневникъ полета.\n\nМаршрутъ пролегалъ ${city.toLowerCase()}.\nПогода была непростая, пришлось маневрировать.\n\nСамолетъ "Мурма" показалъ себя превосходно!`;

      let titleEn = `Chapter ${num} · ${act} ${city}`;
      let textEn = `Flight log.\n\nThe route passed ${city.toLowerCase()}.\nThe weather was challenging, maneuvers were required.\n\nThe "Murma" plane performed excellently!`;

      if (isBoss) {
        const bossName = level.boss || 'Врагъ';
        titleRu = `Глава ${num} · Сраженіе: ${bossName}`;
        textRu = `Столкновеніе!\n\nНа пути къ ${city} насъ перехватилъ ${bossName}.\nЭто былъ тяжелый воздушный бой, но убѣгать не въ нашихъ правилахъ!\nВрагъ поверженъ.`;

        titleEn = `Chapter ${num} · Battle: ${bossName}`;
        textEn = `Encounter!\n\nOn the way to ${city} we were intercepted by ${bossName}.\nIt was a tough dogfight, but running away is not our way!\nThe enemy is defeated.`;
      }

      chapters.push({
        id: `level_${num}`,
        title: { ru: titleRu, en: titleEn },
        icon: isBoss ? '💀' : '✈️',
        text: { ru: textRu, en: textEn },
        isUnlocked: i < doneLevelsCount
      });
    }

    return chapters;
  }

  function renderJournal() {
    const app = document.getElementById('app'); if (!app) return;

    const CHAPTERS = getChapters();
    const unlocked = CHAPTERS.filter(ch => ch.isUnlocked !== false).length;

    const lang = window.I18n?.getLang?.() || 'ru';

    let chaptersHtml = '';
    CHAPTERS.forEach((ch, i) => {
      const isOpen = ch.isUnlocked !== false;
      const chTitle = ch.title[lang] || ch.title.en || ch.title.ru;
      chaptersHtml += `<div class="journal-chapter ${isOpen ? 'open' : 'locked'}" data-chapter="${i}" style="background:${isOpen ? 'linear-gradient(180deg,rgba(245,230,200,.08),rgba(245,230,200,.02))' : 'rgba(255,255,255,.02)'};border:1px solid ${isOpen ? 'rgba(212,168,75,.3)' : 'rgba(255,255,255,.08)'};border-radius:12px;padding:20px 24px;margin-bottom:12px;cursor:${isOpen ? 'pointer' : 'default'};transition:all .3s;opacity:${isOpen ? 1 : 0.4};">
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="font-size:28px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;background:${isOpen ? 'rgba(212,168,75,.15)' : 'rgba(255,255,255,.05)'};border-radius:10px;border:1px solid ${isOpen ? 'rgba(212,168,75,.3)' : 'rgba(255,255,255,.1)'};">${isOpen ? ch.icon : '🔒'}</div>
          <div style="flex:1;"><div style="font-family:'IM Fell English SC',serif;font-size:16px;color:${isOpen ? '#f0d080' : 'rgba(240,208,128,.4)'};">${chTitle}</div><div style="font-size:11px;color:rgba(250,244,232,.4);margin-top:2px;">${isOpen ? t('openToRead') : t('unlockMore')}</div></div>
          <div style="font-size:12px;color:rgba(212,168,75,.5);">${isOpen ? '→' : ''}</div>
        </div></div>`;
    });

    app.innerHTML = `
      <style>
        #app{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;overflow:hidden!important;display:block!important;}
        @keyframes fadeIn{from{opacity:0;transform:translateY(15px);}to{opacity:1;transform:translateY(0);}}
        .ink-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:4px;font-family:'IM Fell English SC',serif;font-size:13px;letter-spacing:.1em;text-transform:uppercase;background:linear-gradient(180deg,rgba(245,230,200,.9),rgba(232,213,168,.8));color:#3d2b16;border:1.5px solid #3d2b16;cursor:pointer;transition:all .25s;box-shadow:0 2px 6px rgba(60,40,20,.2);}
        .ink-btn:hover{background:linear-gradient(180deg,#3d2b16,#2a1a0a);color:#e3d3ae;transform:translateY(-1px);}
        .journal-chapter.open:hover{background:linear-gradient(180deg,rgba(245,230,200,.15),rgba(245,230,200,.05))!important;border-color:rgba(212,168,75,.6)!important;transform:translateX(4px);}
      </style>
      <div style="position:fixed;inset:0;z-index:-3;background:radial-gradient(ellipse at 30% 20%, #1a3568 0%, #0a1f44 40%, #05102a 100%);"></div>
      <div style="position:fixed;inset:0;z-index:-1;background:radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.75) 100%);pointer-events:none;"></div>
      <div style="position:fixed;inset:0;display:flex;flex-direction:column;z-index:1;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 24px 8px;">
          <button class="ink-btn" data-go="menu">${t('back')}</button>
          <span style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:999px;font-size:12px;background:rgba(255,255,255,.06);border:1px solid rgba(212,168,75,.2);color:rgba(250,244,232,.85);">📖 <b style="color:#f0d080;">${unlocked}</b>/${CHAPTERS.length} ${t('chapters')}</span>
        </div>
        <div style="text-align:center;padding:4px 24px 16px;">
          <div style="font-family:'IM Fell English SC',serif;font-size:clamp(22px,4vw,36px);color:#faf4e8;letter-spacing:.08em;">${t('journalTitle')}</div>
          <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:14px;color:rgba(240,208,128,.6);margin-top:4px;">${t('pilotStory')}</div>
        </div>
        <div style="flex:1;overflow-y:auto;padding:0 24px 40px;">
          <div style="max-width:700px;margin:0 auto;animation:fadeIn .6s ease-out;">${chaptersHtml}</div>
        </div>
      </div>
      <div id="chapterModal" style="position:fixed;inset:0;z-index:100;display:none;align-items:center;justify-content:center;padding:24px;">
        <div class="cm-bg" style="position:absolute;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(8px);"></div>
        <div style="position:relative;max-width:680px;width:100%;max-height:85vh;overflow-y:auto;background:linear-gradient(180deg,#e8d5a8,#d6c29a);border:2px solid #3d2b16;border-radius:8px;padding:36px 40px;box-shadow:0 20px 60px rgba(0,0,0,.6);color:#3d2b16;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;">
            <div><div id="cmIcon" style="font-size:32px;margin-bottom:8px;"></div><div id="cmTitle" style="font-family:'IM Fell English SC',serif;font-size:24px;color:#3d2b16;"></div></div>
            <button class="cm-close" style="background:rgba(61,43,22,.08);border:1.5px solid #3d2b16;color:#3d2b16;font-size:18px;cursor:pointer;padding:4px 12px;border-radius:4px;font-family:'IM Fell English SC',serif;">✕</button>
          </div>
          <div style="width:60px;height:2px;background:#3d2b16;margin-bottom:20px;opacity:.3;"></div>
          <div id="cmText" style="font-family:'Cormorant Garamond',serif;font-size:17px;line-height:1.85;color:#2a1a0a;white-space:pre-line;"></div>
          <div style="text-align:center;margin-top:28px;padding-top:16px;border-top:1px solid rgba(61,43,22,.25);"><div style="font-family:'IM Fell English SC',serif;font-size:11px;color:#5a4030;letter-spacing:.15em;">${t('imperialFleet')}</div></div>
        </div>
      </div>`;

    document.querySelector('[data-go="menu"]').onclick = () => { try{window.Sound?.click?.();}catch(e){} if(window.Screens?.show)window.Screens.show('menu'); };
    document.querySelectorAll('.journal-chapter.open').forEach(el => {
      el.onclick = () => {
        const i = parseInt(el.getAttribute('data-chapter'));
        const ch = CHAPTERS[i]; if (!ch) return;
        try{window.Sound?.click?.();}catch(e){}
        const modal = document.getElementById('chapterModal');
        const chTitle = ch.title[lang] || ch.title.en || ch.title.ru;
        const chText = ch.text[lang] || ch.text.en || ch.text.ru;
        document.getElementById('cmIcon').textContent = ch.icon;
        document.getElementById('cmTitle').textContent = chTitle;
        document.getElementById('cmText').textContent = chText;
        modal.style.display = 'flex';
      };
    });
    const modal = document.getElementById('chapterModal');
    if (modal) { const close = () => { modal.style.display = 'none'; }; modal.querySelector('.cm-bg').onclick = close; modal.querySelector('.cm-close').onclick = close; }
    log('✓ Дневникъ отрисованъ (' + unlocked + '/' + CHAPTERS.length + ')');
  }

  function add(levelIndex, level, stars) { log('Запись: уровень ' + (levelIndex+1)); }

  if (window.Screens?.register) { window.Screens.register('journal', renderJournal); log('Дневникъ зарегистрированъ'); }
  if (window.Events?.on) window.Events.on('screen:changed', n => { if (n==='journal') setTimeout(renderJournal, 100); }, 'JournalScreen');
  window.Journal = { add, renderJournal };
})();