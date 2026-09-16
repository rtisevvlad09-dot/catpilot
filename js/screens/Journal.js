// ═══ ДНЕВНИКЪ (i18n) ═══
(function() {
  'use strict';
  const log = (...a) => { if (window.Logger?.module) window.Logger.module('Journal', ...a); };
  const t = (k, p) => window.I18n ? window.I18n.t(k, p) : k;

  const CHAPTERS = [
    { id:'prologue', title:{ru:'Прологъ · Родъ Мурмыскихъ',en:'Prologue · House Murmysky',tr:'Önsöz · Murmysky Hanedanı',zh:'序章·穆尔梅斯基家族'}, icon:'🏰',
      text:{ru:'Родъ Мурмыскихъ — одинъ изъ древнѣйшихъ въ Имперіи Котовъ. Его основатель, котъ-бояринъ Мурмъ Первый, ещё въ XV вѣкѣ служилъ при дворѣ Великаго Князя и славился тѣмъ, что первымъ среди котовъ догадался привязать къ спинѣ два гусиныхъ крыла и спрыгнуть съ колокольни. Онъ выжилъ — хотя гусиные перья разлетѣлись по всей площади.\n\nСъ тѣхъ поръ каждый Мурмыскій считалъ своимъ долгомъ стремиться въ небо.',en:'House Murmysky is one of the oldest in the Cat Empire. Its founder, boyar cat Murm the First, served at the Grand Prince\'s court in the 15th century and was famous for being the first cat to tie two goose wings to his back and jump from a bell tower. He survived — though goose feathers scattered across the entire square.\n\nSince then, every Murmysky considered it their duty to reach for the sky.',tr:'Murmysky Hanedanı, Kedi İmparatorluğu\'nun en eski hanedanlarından biridir. Kurucusu boyar kedi Murm Birinci, 15. yüzyılda Büyük Prens\'in sarayında hizmet etmiş ve sırtına iki kaz kanadı bağlayıp çan kulesinden atlayan ilk kedi olarak ünlenmiştir. Hayatta kaldı — ancak kaz tüyleri tüm meydana saçıldı.\n\nO zamandan beri her Murmysky gökyüzüne ulaşmayı kendine vazife bildi.',zh:'穆尔梅斯基家族是猫帝国最古老的家族之一。其创始人贵族猫穆尔姆一世在15世纪服务于大公宫廷，以第一只将两只鹅翅膀绑在背上并从钟楼跳下的猫而闻名。他活了下来——尽管鹅毛散落在整个广场上。\n\n从那时起，每个穆尔梅斯基都认为追求天空是自己的使命。'} },
    { id:'childhood', title:{ru:'Глава I · Дѣтство на чердакѣ',en:'Chapter I · Attic Childhood',tr:'Bölüm I · Tavan Arası Çocukluğu',zh:'第一章·阁楼上的童年'}, icon:'🐱',
      text:{ru:'Василій родился въ 1891 году въ родовомъ имѣніи Муррбургъ. Его отецъ, графъ Мурчелло Мурмыскій, былъ адмираломъ Кошачьяго Флота. Но Василій съ младенчества тянулся не къ водѣ, а къ небу.\n\nЕго нянька вспоминала: «Маленькій Вася цѣлыми днями сидѣлъ на чердакѣ и смотрѣлъ въ слуховое окно на облака.»\n\nВъ семь лѣтъ онъ впервые увидѣлъ воздушный шаръ и шепталъ: «Я тоже полечу.»',en:'Vasily was born in 1891 at the ancestral estate of Murrgburg. His father, Count Murchello Murmysky, was Admiral of the Cat Fleet. But Vasily was drawn not to water, but to the sky.\n\nHis nanny recalled: "Little Vasya spent whole days in the attic watching clouds through the dormer window."\n\nAt seven he saw a hot air balloon for the first time and whispered: "I will fly too."',tr:'Vasily 1891\'de Murrgburg\'un ata malikanesinde doğdu. Babası Kont Murchello Murmysky, Kedi Filosunun Amiraliydi. Ama Vasily suya değil, gökyüzüne çekildi.\n\nDadısı hatırladı: "Küçük Vasya bütün günlerini çatı katında pencereden bulutları izleyerek geçirdi."\n\nYedi yaşında ilk kez sıcak hava balonu gördü ve fısıldadı: "Ben de uçacağım."',zh:'瓦西里于1891年出生在穆尔堡的祖传庄园。他的父亲穆尔切洛·穆尔梅斯基伯爵是猫舰队的海军上将。但瓦西里从小就被天空而非水面所吸引。\n\n他的保姆回忆道："小瓦夏整天坐在阁楼里，透过天窗看云。"\n\n七岁时他第一次看到热气球，低声说："我也要飞。"'} },
    { id:'academy', title:{ru:'Глава II · Авіаціонная Школа',en:'Chapter II · Aviation School',tr:'Bölüm II · Havacılık Okulu',zh:'第二章·航空学校'}, icon:'🎓',
      text:{ru:'Въ 1907 году Имперія Котовъ открыла первую Авіаціонную Школу. Василій поступилъ однимъ изъ первыхъ. Инструкторъ, старый пёсъ-авіаторъ баронъ фонъ Гавсъ, гонялъ курсантовъ безъ пощады.\n\nВасилій научился управлять бипланомъ за три мѣсяца — рекордъ школы. Его прозвали «Мурр-Скай» — Небесный Мурръ.',en:'In 1907 the Cat Empire opened its first Aviation School. Vasily enrolled as one of the first. The instructor, old dog aviator Baron von Haws, drilled cadets mercilessly.\n\nVasily learned to fly a biplane in three months — a school record. They called him "Murr-Sky" — the Heavenly Murr.',tr:'1907\'de Kedi İmparatorluğu ilk Havacılık Okulunu açtı. Vasily ilk öğrencilerden biri olarak kaydoldu. Eğitmen, yaşlı köpek havacı Baron von Haws, öğrencileri acımasızca çalıştırdı.\n\nVasily üç ayda çift kanatlı uçak kullanmayı öğrendi — okul rekoru. Ona "Murr-Sky" — Göksel Murr dediler.',zh:'1907年猫帝国开设了第一所航空学校。瓦西里是第一批入学的人之一。教官老狗飞行员冯·豪斯男爵无情地训练学员。\n\n瓦西里三个月学会了驾驶双翼飞机——创下了学校纪录。他们称他为"穆尔-天"——天上的穆尔。'} },
    { id:'war', title:{ru:'Глава III · Великая Война',en:'Chapter III · The Great War',tr:'Bölüm III · Büyük Savaş',zh:'第三章·大战'}, icon:'⚔️',
      text:{ru:'Въ 1909 году началась Великая Кошачья Война. Собачья Имперія вторглась въ западныя провинціи. Василій получилъ свой первый боевой самолётъ — «Мурр-Скай».\n\nПервый бой случился надъ Мурбалтикой. Три пёсьихъ триплана атаковали дирижабль. Василій бросился въ атаку одинъ и спасъ дирижабль.\n\nЗа этотъ бой онъ получилъ орденъ Золотого Когтя и званіе поручика.',en:'In 1909 the Great Cat War began. The Dog Empire invaded western provinces. Vasily received his first combat plane — "Murr-Sky".\n\nThe first battle took place over Murbaltic. Three dog triplanes attacked a dirigible. Vasily charged alone and saved it.\n\nFor this battle he received the Order of the Golden Claw and the rank of Lieutenant.',tr:'1909\'da Büyük Kedi Savaşı başladı. Köpek İmparatorluğu batı eyaletlerini işgal etti. Vasily ilk savaş uçağını aldı — "Murr-Sky".\n\nİlk savaş Murbaltik üzerinde gerçekleşti. Üç köpek üçkanatlısı bir zepline saldırdı. Vasily tek başına hücum etti ve zeplini kurtardı.\n\nBu savaş için Altın Pençe Nişanı ve Teğmen rütbesi aldı.',zh:'1909年大猫战争爆发。狗帝国入侵西部省份。瓦西里获得了他的第一架战斗机——"穆尔-天"。\n\n第一场战斗发生在穆尔巴蒂克上空。三架狗的三翼机攻击了一艘飞艇。瓦西里独自冲锋并拯救了它。\n\n因此战他获得了金爪勋章和中尉军衔。'} },
    { id:'enemies', title:{ru:'Глава IV · Враги',en:'Chapter IV · Enemies',tr:'Bölüm IV · Düşmanlar',zh:'第四章·敌人'}, icon:'💀',
      text:{ru:'Не всѣ враги были псами. Графъ Обломовъ тайно финансировалъ собачью авіацію. Баронъ Штейнъ — пёсъ-снайперъ — объявилъ Василія личной мишенью. Купецъ Брюхатый продавалъ секреты за сливки. Атаманъ Мурка угонялъ самолёты.\n\nКаждый изъ нихъ сталъ боссомъ. Каждый долженъ быть побѣждёнъ.',en:'Not all enemies were dogs. Count Oblomov secretly funded dog aviation. Baron Stein — a dog sniper — declared Vasily his personal target. Merchant Bryukhaty sold secrets for cream. Ataman Murka stole planes.\n\nEach became a boss. Each must be defeated.',tr:'Tüm düşmanlar köpek değildi. Kont Oblomov gizlice köpek havacılığını finanse etti. Baron Stein — bir köpek keskin nişancı — Vasily\'yi kişisel hedefi ilan etti. Tüccar Bryukhaty krema karşılığında sırları sattı. Ataman Murka uçakları çaldı.\n\nHer biri bir boss oldu. Her biri yenilmeli.',zh:'并非所有敌人都是狗。奥布洛莫夫伯爵秘密资助狗的航空。施泰因男爵——一只狗狙击手——宣布瓦西里为个人目标。商人布鲁哈蒂用奶油换取机密。阿塔曼穆尔卡偷窃飞机。\n\n每一个都成了Boss。每一个都必须被击败。'} },
    { id:'mission', title:{ru:'Глава V · Миссія',en:'Chapter V · Mission',tr:'Bölüm V · Görev',zh:'第五章·任务'}, icon:'🎯',
      text:{ru:'Кото-Императоръ поставилъ задачу: псы создали супер-оружіе — гигантскій корабль „Цербръ". Прорвись черезъ всѣ линіи обороны и уничтожь его.\n\nВасилій поклонился: «Честь и Небо, Ваше Величество. Я полечу.»',en:'The Cat Emperor gave the mission: dogs created a super-weapon — the giant ship "Cerberus". Break through all defense lines and destroy it.\n\nVasily bowed: "Honor and Sky, Your Majesty. I will fly."',tr:'Kedi İmparator görevi verdi: köpekler süper silah yarattı — dev gemi "Cerberus". Tüm savunma hatlarını kır ve yok et.\n\nVasily eğildi: "Onur ve Gökyüzü, Majesteleri. Uçacağım."',zh:'猫皇帝下达任务：狗创造了超级武器——巨型飞船"刻耳柏洛斯"。突破所有防线并摧毁它。\n\n瓦西里鞠躬："荣誉与天空，陛下。我将起飞。"'} },
    { id:'dream', title:{ru:'Глава VI · Мечта',en:'Chapter VI · Dream',tr:'Bölüm VI · Hayal',zh:'第六章·梦想'}, icon:'✨',
      text:{ru:'«Зачемъ ты лѣтаешь?» — спросилъ механикъ Рыжикъ.\n\n«Потому что тамъ, наверху, нѣтъ границъ. Нѣтъ заборовъ, нѣтъ клетокъ. Тамъ только вѣтеръ, небо и свобода. И если я докажу, что котъ можетъ летать — значитъ, каждый котъ сможетъ.»',en:'"Why do you fly?" asked mechanic Ryzhik.\n\n"Because up there, there are no borders. No fences, no cages. Only wind, sky and freedom. And if I prove that a cat can fly — then every cat can."',tr:'"Neden uçuyorsun?" diye sordu tamirci Ryzhik.\n\n"Çünkü yukarıda sınır yok. Çit yok, kafes yok. Sadece rüzgar, gökyüzü ve özgürlük. Ve eğer bir kedinin uçabileceğini kanıtlarsam — o zaman her kedi uçabilir."',zh:'"你为什么飞？"机械师雷日克问。\n\n"因为在上面没有边界。没有围栏，没有笼子。只有风、天空和自由。如果我证明猫能飞——那么每只猫都能。"'} },
    { id:'epilogue', title:{ru:'Эпилогъ · Честь и Небо',en:'Epilogue · Honor and Sky',tr:'Son Söz · Onur ve Gökyüzü',zh:'尾声·荣誉与天空'}, icon:'🌅',
      text:{ru:'Эта исторія ещё не закончена. Каждый твой полётъ — новая страница. Каждый сбитый боссъ — новая глава.\n\nКнязь Василій Мурмыскій лѣтитъ. И пока онъ въ воздухѣ — Имперія Котовъ жива.\n\n«Честь и Небо — наше наслѣдіе».',en:'This story is not yet finished. Every flight is a new page. Every boss defeated is a new chapter.\n\nPrince Vasily Murmysky flies. And while he is in the air — the Cat Empire lives.\n\n"Honor and Sky — our heritage."',tr:'Bu hikaye henüz bitmedi. Her uçuş yeni bir sayfa. Yenilen her boss yeni bir bölüm.\n\nPrens Vasily Murmysky uçuyor. Ve o havadayken — Kedi İmparatorluğu yaşıyor.\n\n"Onur ve Gökyüzü — mirasımız."',zh:'这个故事尚未结束。每次飞行都是新的一页。每个被击败的Boss都是新的篇章。\n\n瓦西里·穆尔梅斯基王子在飞翔。只要他在空中——猫帝国就活着。\n\n"荣誉与天空——我们的遗产。"'} }
  ];

  function getUnlockedChapters() {
    const done = window.Save?.data?.done?.length || 0;
    const total = window.LEVELS?.length || 60;
    const pct = done / Math.max(1, total);
    if (pct >= 0.85) return 8; if (pct >= 0.70) return 7; if (pct >= 0.50) return 6;
    if (pct >= 0.30) return 5; if (pct >= 0.15) return 4; if (pct >= 0.05) return 3;
    if (pct > 0) return 2; return 1;
  }

  function renderJournal() {
    const app = document.getElementById('app'); if (!app) return;
    const unlocked = getUnlockedChapters();
    const done = window.Save?.data?.done?.length || 0;
    const total = window.LEVELS?.length || 60;
    const lang = window.I18n?.getLang?.() || 'ru';

    let chaptersHtml = '';
    CHAPTERS.forEach((ch, i) => {
      const isOpen = i < unlocked;
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