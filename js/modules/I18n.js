// ═══ МУЛЬТИЯЗЫЧНОСТЬ (RU, EN, TR, ZH) ═══
(function(){
'use strict';
const log=(...a)=>{if(window.Logger?.module)window.Logger.module('I18n',...a);};

const LANGS={
  ru:{name:'Русскій',flag:'🇷🇺',dir:'ltr'},
  en:{name:'English',flag:'🇬🇧',dir:'ltr'},
  tr:{name:'Türkçe',flag:'🇹🇷',dir:'ltr'},
  zh:{name:'中文',flag:'🇨🇳',dir:'ltr'}
};

const T={
  // ── Меню ──
  gameTitle:{ru:'Котъ-Лётчикъ 2',en:'Cat Pilot 2',tr:'Kedi Pilot 2',zh:'猫飞行员 2'},
  empireName:{ru:'КРУГОСВѢТНЫЙ ПОЛЁТЪ',en:'AROUND THE WORLD',tr:'DÜNYA TURU',zh:'环游世界'},
  subtitle:{ru:'Вокругъ свѣта за 80 дней',en:'Around the World in 80 Days',tr:'80 Günde Devriâlem',zh:'80天环游世界'},
  motto:{ru:'«Пари на балу у Императора: облетѣть міръ за 80 дней!»',en:'"A bet at the Emperor\'s ball: round the world in 80 days!"',tr:'"İmparatorluk balosunda bahis: 80 günde devriâlem!"',zh:'「皇帝舞会上的赌注：80天环游世界！」'},
  play:{ru:'✈ Въ полётъ',en:'✈ Fly',tr:'✈ Uç',zh:'✈ 起飞'},
  livesOut:{ru:'💔 Жизни кончились',en:'💔 No lives left',tr:'💔 Can kalmadı',zh:'💔 没有生命了'},
  livesBtn:{ru:'❤️ Жизни пилота',en:'❤️ Pilot lives',tr:'❤️ Pilot canları',zh:'❤️ 飞行员生命'},
  dailyBonus:{ru:'🎁 Ежедневный бонусъ',en:'🎁 Daily bonus',tr:'🎁 Günlük ödül',zh:'🎁 每日奖励'},
  achievements:{ru:'🏆 Достиженія',en:'🏆 Achievements',tr:'🏆 Başarılar',zh:'🏆 成就'},
  tournament:{ru:'⚔️ Турниръ',en:'⚔️ Tournament',tr:'⚔️ Turnuva',zh:'⚔️ 锦标赛'},
  hangar:{ru:'Ангаръ',en:'Hangar',tr:'Hangar',zh:'机库'},
  map:{ru:'Карта Имперіи',en:'Empire Map',tr:'İmparatorluk Haritası',zh:'帝国地图'},
  shop:{ru:'Торговые ряды',en:'Marketplace',tr:'Pazar',zh:'商店'},
  settings:{ru:'Настройки',en:'Settings',tr:'Ayarlar',zh:'设置'},
  journal:{ru:'Дневникъ',en:'Journal',tr:'Günlük',zh:'日志'},
  back:{ru:'← Меню',en:'← Menu',tr:'← Menü',zh:'← 菜单'},
  imperialFleet:{ru:'Имперія Котовъ · Воздушный Флотъ',en:'Cat Empire · Air Fleet',tr:'Kedi İmparatorluğu · Hava Filosu',zh:'猫帝国·空中舰队'},

  // ── Пауза ──
  pause:{ru:'⏸ Пауза',en:'⏸ Paused',tr:'⏸ Duraklatıldı',zh:'⏸ 暂停'},
  pauseDesc:{ru:'Полётъ приостановленъ',en:'Flight paused',tr:'Uçuş duraklatıldı',zh:'飞行已暂停'},
  resume:{ru:'▶ Продолжить',en:'▶ Resume',tr:'▶ Devam et',zh:'▶ 继续'},
  toHangar:{ru:'🔧 Въ Ангаръ',en:'🔧 To Hangar',tr:'🔧 Hangara',zh:'🔧 去机库'},
  toMap:{ru:'🗺️ На Карту',en:'🗺️ To Map',tr:'🗺️ Haritaya',zh:'🗺️ 去地图'},
  escHint:{ru:'ESC — продолжить',en:'ESC — resume',tr:'ESC — devam et',zh:'ESC — 继续'},

  // ── Победа / Пораженіе ──
  victory:{ru:'ПОБѢДА!',en:'VICTORY!',tr:'ZAFER!',zh:'胜利！'},
  crash:{ru:'АВАРІЯ',en:'CRASH',tr:'KAZA',zh:'坠毁'},
  motorDamaged:{ru:'Моторъ повреждёнъ — загляни въ Ангаръ.',en:'Engine damaged — visit the Hangar.',tr:'Motor hasarlı — Hangarı ziyaret edin.',zh:'引擎损坏——请前往机库。'},
  livesLeft:{ru:'Жизней осталось',en:'Lives remaining',tr:'Kalan can',zh:'剩余生命'},
  next:{ru:'Далѣе',en:'Next',tr:'İleri',zh:'下一关'},
  retry:{ru:'Заново',en:'Retry',tr:'Tekrar',zh:'重试'},
  toHangarEnd:{ru:'Въ Ангаръ',en:'To Hangar',tr:'Hangara',zh:'去机库'},
  toMapEnd:{ru:'На карту',en:'To Map',tr:'Haritaya',zh:'去地图'},

  // ── Ангаръ ──
  integrity:{ru:'ЦѢЛОСТНОСТЬ',en:'INTEGRITY',tr:'BÜTÜNLÜK',zh:'完整性'},
  fuel:{ru:'ТОПЛИВО',en:'FUEL',tr:'YAKIT',zh:'燃料'},
  repaired:{ru:'✓ Исправно',en:'✓ Repaired',tr:'✓ Tamir edildi',zh:'✓ 已修复'},
  repair:{ru:'🔧 Починить',en:'🔧 Repair',tr:'🔧 Tamir et',zh:'🔧 修理'},
  full:{ru:'✓ Полонъ',en:'✓ Full',tr:'✓ Dolu',zh:'✓ 已满'},
  refuel:{ru:'⛽ Заправить',en:'⛽ Refuel',tr:'⛽ Yakıt doldur',zh:'⛽ 加油'},
  choosePlane:{ru:'Выборъ машины',en:'Choose plane',tr:'Uçak seç',zh:'选择飞机'},
  stats:{ru:'Характеристики',en:'Stats',tr:'Özellikler',zh:'属性'},
  upgrades:{ru:'Улучшенія',en:'Upgrades',tr:'Geliştirmeler',zh:'升级'},
  goToShop:{ru:'Улучшать въ Торговыхъ рядахъ →',en:'Upgrade in Marketplace →',tr:'Pazarda geliştir →',zh:'在商店升级 →'},
  speed:{ru:'Скорость',en:'Speed',tr:'Hız',zh:'速度'},
  durability:{ru:'Прочность',en:'Durability',tr:'Dayanıklılık',zh:'耐久'},
  damage:{ru:'Уронъ',en:'Damage',tr:'Hasar',zh:'伤害'},
  tank:{ru:'Бакъ',en:'Tank',tr:'Depo',zh:'油箱'},
  excellent:{ru:'Отличное состояніе',en:'Excellent condition',tr:'Mükemmel durum',zh:'状态极佳'},
  good:{ru:'Хорошее состояніе',en:'Good condition',tr:'İyi durum',zh:'状态良好'},
  damaged:{ru:'Повреждёнъ',en:'Damaged',tr:'Hasarlı',zh:'已损坏'},
  critical:{ru:'Критическое состояніе!',en:'Critical condition!',tr:'Kritik durum!',zh:'危急状态！'},
  planeChanged:{ru:'Машина смѣнена!',en:'Plane changed!',tr:'Uçak değiştirildi!',zh:'飞机已更换！'},
  engineRepaired:{ru:'Самолётъ исправенъ!',en:'Plane repaired!',tr:'Uçak tamir edildi!',zh:'飞机已修复！'},
  tankFull:{ru:'Бакъ полонъ!',en:'Tank full!',tr:'Depo dolu!',zh:'油箱已满！'},
  buyInShop:{ru:'Купи въ Торговыхъ рядахъ!',en:'Buy in Marketplace!',tr:'Pazardan satın al!',zh:'请在商店购买！'},

  // ── Настройки ──
  volume:{ru:'🔊 Громкость',en:'🔊 Volume',tr:'🔊 Ses',zh:'🔊 音量'},
  volumeDesc:{ru:'Общая громкость звуковъ и музыки',en:'Master volume for sounds and music',tr:'Ses ve müzik ana sesi',zh:'音效和音乐主音量'},
  mute:{ru:'🔇 Звукъ выкл.',en:'🔇 Mute all',tr:'🔇 Sesi kapat',zh:'🔇 静音'},
  muteDesc:{ru:'Полностью отключить весь звукъ',en:'Completely disable all audio',tr:'Tüm sesi tamamen kapat',zh:'完全禁用所有音频'},
  music:{ru:'🎵 Музыка',en:'🎵 Music',tr:'🎵 Müzik',zh:'🎵 音乐'},
  musicDesc:{ru:'Фоновая музыка въ полётѣ',en:'Background music during flight',tr:'Uçuş sırasında arka plan müziği',zh:'飞行中的背景音乐'},
  fx:{ru:'✨ Эффекты',en:'✨ Effects',tr:'✨ Efektler',zh:'✨ 特效'},
  fxDesc:{ru:'Частицы, дымъ, погода, блики',en:'Particles, smoke, weather, glare',tr:'Parçacıklar, duman, hava, parlama',zh:'粒子、烟雾、天气、光效'},
  dangerZone:{ru:'⚠ Опасная зона',en:'⚠ Danger zone',tr:'⚠ Tehlikeli bölge',zh:'⚠ 危险区域'},
  resetProgress:{ru:'Сбросить весь прогрессъ',en:'Reset all progress',tr:'Tüm ilerlemeyi sıfırla',zh:'重置所有进度'},
  resetWarn:{ru:'Удалитъ монеты, уровни, достиженія, настройки',en:'Deletes coins, levels, achievements, settings',tr:'Paraları, seviyeleri, başarıları, ayarları siler',zh:'删除金币、关卡、成就、设置'},
  resetConfirm:{ru:'Сбросить прогрессъ?',en:'Reset progress?',tr:'İlerleme sıfırlansın mı?',zh:'重置进度？'},
  resetConfirmDesc:{ru:'Всѣ монеты, уровни, достиженія и настройки будутъ удалены навсегда. Это дѣйствіе нельзя отмѣнить.',en:'All coins, levels, achievements and settings will be permanently deleted. This cannot be undone.',tr:'Tüm paralar, seviyeler, başarılar ve ayarlar kalıcı olarak silinecek. Bu işlem geri alınamaz.',zh:'所有金币、关卡、成就和设置将被永久删除。此操作无法撤销。'},
  resetYes:{ru:'Да, сбросить',en:'Yes, reset',tr:'Evet, sıfırla',zh:'确认重置'},
  cancel:{ru:'Отмѣна',en:'Cancel',tr:'İptal',zh:'取消'},
  language:{ru:'🌐 Языкъ',en:'🌐 Language',tr:'🌐 Dil',zh:'🌐 语言'},
  languageDesc:{ru:'Выберите языкъ интерфейса',en:'Choose interface language',tr:'Arayüz dilini seçin',zh:'选择界面语言'},

  // ── HUD ──
  hudFuel:{ru:'ТОПЛИВО',en:'FUEL',tr:'YAKIT',zh:'燃料'},
  hudMotor:{ru:'МОТОРЪ',en:'ENGINE',tr:'MOTOR',zh:'引擎'},

  // ── Брифингъ ──
  briefing:{ru:'Брифингъ',en:'Briefing',tr:'Brifing',zh:'任务简报'},
  sortie:{ru:'Вылетъ №',en:'Sortie #',tr:'Sefer #',zh:'出击 #'},
  mission:{ru:'Заданіе',en:'Mission',tr:'Görev',zh:'任务'},
  weather:{ru:'Погода',en:'Weather',tr:'Hava',zh:'天气'},
  distance:{ru:'Разстояніе',en:'Distance',tr:'Mesafe',zh:'距离'},
  plane:{ru:'Машина',en:'Plane',tr:'Uçak',zh:'飞机'},
  forecast:{ru:'Прогнозъ погоды',en:'Weather forecast',tr:'Hava tahmini',zh:'天气预报'},
  enemyAhead:{ru:'Врагъ на маршруте',en:'Enemy on route',tr:'Rotada düşman',zh:'航线上的敌人'},
  warnings:{ru:'⚠ Предупрежденія',en:'⚠ Warnings',tr:'⚠ Uyarılar',zh:'⚠ 警告'},
  motorWarn:{ru:'Моторъ повреждёнъ ({pct}%) — почини въ Ангарѣ!',en:'Engine damaged ({pct}%) — repair in Hangar!',tr:'Motor hasarlı (%{pct}) — Hangarda tamir et!',zh:'引擎损坏（{pct}%）——请在机库修理！'},
  fuelWarn:{ru:'Мало топлива ({pct}%) — заправься!',en:'Low fuel ({pct}%) — refuel!',tr:'Düşük yakıt (%{pct}) — yakıt doldur!',zh:'燃料不足（{pct}%）——请加油！'},
  livesWarn:{ru:'Осталось мало жизней ({n}/{max})',en:'Few lives remaining ({n}/{max})',tr:'Az can kaldı ({n}/{max})',zh:'剩余生命不多（{n}/{max}）'},
  bossWarn:{ru:'Впереди боссъ: {name}',en:'Boss ahead: {name}',tr:'Önde boss: {name}',zh:'前方Boss：{name}'},
  motorBar:{ru:'Моторъ',en:'Engine',tr:'Motor',zh:'引擎'},
  fuelBar:{ru:'Топливо',en:'Fuel',tr:'Yakıt',zh:'燃料'},
  flyBtn:{ru:'✈ Въ полётъ!',en:'✈ Fly!',tr:'✈ Uç!',zh:'✈ 起飞！'},

  // ─── Карта ───
  mapTitle:{ru:'КАРТА ИМПЕРІИ КОТОВЪ',en:'MAP OF THE CAT EMPIRE',tr:'KEDİ İMPARATORLUĞU HARİTASI',zh:'猫帝国地图'},
  mapSubtitle:{ru:'Военный атласъ · Воздушный Флотъ',en:'Military Atlas · Air Fleet',tr:'Askeri Atlas · Hava Filosu',zh:'军事地图集 · 空军舰队'},
  available:{ru:'Доступно',en:'Available',tr:'Mevcut',zh:'可用'},
  completed:{ru:'Пройдено',en:'Completed',tr:'Tamamlandı',zh:'已完成'},
  boss:{ru:'Боссъ',en:'Boss',tr:'Boss',zh:'Boss'},
  locked:{ru:'Заперто',en:'Locked',tr:'Kilitli',zh:'锁定'},
  flightRoute:{ru:'Маршрутъ полёта',en:'Flight route',tr:'Uçuş rotası',zh:'飞行路线'},
  city:{ru:'Городъ',en:'City',tr:'Şehir',zh:'城市'},
  mountains:{ru:'Горы',en:'Mountains',tr:'Dağlar',zh:'山脉'},
  levelNum:{ru:'Уровень №',en:'Level #',tr:'Seviye #',zh:'关卡 #'},
  unknownLands:{ru:'Невѣдомыя земли',en:'Unknown lands',tr:'Bilinmeyen topraklar',zh:'未知之地'},
  progress:{ru:'Прогрессъ',en:'Progress',tr:'İlerleme',zh:'进度'},
  flyBtn:{ru:'✈ Въ полётъ!',en:'✈ Fly!',tr:'✈ Uç!',zh:'✈ 起飞！'},
  lockedBtn:{ru:'🔒 Заперто',en:'🔒 Locked',tr:'🔒 Kilitli',zh:'🔒 锁定'},
  prevLevelWarn:{ru:'Сначала пройди предыдущій уровень!',en:'Complete the previous level first!',tr:'Önceki seviyeyi tamamla!',zh:'请先完成前一关！'},
  flightDevWarn:{ru:'Полётъ пока въ разработке!',en:'Flight is still in development!',tr:'Uçuş henüz geliştirme aşamasında!',zh:'飞行仍在开发中！'}, // ← ИСПРАВЛЕНО: добавлена запятая

  // ── Дневникъ ──
  journalTitle:{ru:'Дневникъ Князя Мурмыскаго',en:'Prince Murmysky\'s Journal',tr:'Prens Murmysky\'nin Günlüğü',zh:'穆尔梅斯基王子日志'},

  // ── Достиженія ──
  unlocked:{ru:'Открыто',en:'Unlocked',tr:'Açıldı',zh:'已解锁'},

  // ── Ежедневный бонусъ ──
  dailyTitle:{ru:'Ежедневный бонусъ',en:'Daily bonus',tr:'Günlük ödül',zh:'每日奖励'},
  streak:{ru:'Серія',en:'Streak',tr:'Seri',zh:'连续'},
  days:{ru:'дн.',en:'days',tr:'gün',zh:'天'},
  comeEveryDay:{ru:'заходи каждый день!',en:'come every day!',tr:'her gün gel!',zh:'每天来领取！'},
  day:{ru:'День',en:'Day',tr:'Gün',zh:'第'},
  claimedToday:{ru:'✓ Сегодняшній бонусъ полученъ!',en:'✓ Today\'s bonus claimed!',tr:'✓ Bugünün ödülü alındı!',zh:'✓ 今日奖励已领取！'},
  claim:{ru:'Забрать',en:'Claim',tr:'Al',zh:'领取'},
  received:{ru:'🎁 Получено:',en:'🎁 Received:',tr:'🎁 Alındı:',zh:'🎁 已获得：'},
  dailyWaiting:{ru:'🎁 Ежедневный бонусъ ждётъ! (Меню → Бонусъ)',en:'🎁 Daily bonus waiting! (Menu → Bonus)',tr:'🎁 Günlük ödül bekliyor! (Menü → Ödül)',zh:'🎁 每日奖励等待中！（菜单→奖励）'},

  // ── Жизни ──
  livesTitle:{ru:'Жизни пилота',en:'Pilot lives',tr:'Pilot canları',zh:'飞行员生命'},
  livesDesc:{ru:'Каждый день даётся {n} попытокъ. Аварія = −1 жизнь.',en:'You get {n} attempts per day. Crash = −1 life.',tr:'Günde {n} deneme hakkı. Kaza = −1 can.',zh:'每天有{n}次机会。坠毁=-1生命。'},
  remained:{ru:'Осталось',en:'Remaining',tr:'Kalan',zh:'剩余'},
  of:{ru:'изъ',en:'of',tr:'/',zh:'/ '},
  resetIn:{ru:'Сбросъ черезъ',en:'Resets in',tr:'Sıfırlanma:',zh:'重置倒计时'},
  allSpent:{ru:'✈ Все жизни потрачены!',en:'✈ All lives spent!',tr:'✈ Tüm canlar harcandı!',zh:'✈ 所有生命已用完！'},
  allSpentToday:{ru:'Все {n} жизней потрачены за сегодня',en:'All {n} lives spent today',tr:'Bugün tüm {n} can harcandı',zh:'今天{n}次生命已全部用完'},
  waitOrAd:{ru:'Подожди до завтра или получи бонусъ',en:'Wait until tomorrow or get a bonus',tr:'Yarına kadar bekle veya ödül al',zh:'等到明天或获取奖励'},
  adForLife:{ru:'📺 Реклама = +1 жизнь',en:'📺 Ad = +1 life',tr:'📺 Reklam = +1 can',zh:'📺 广告=+1生命'},
  waitTomorrow:{ru:'Ждать до завтра',en:'Wait until tomorrow',tr:'Yarını bekle',zh:'等到明天'},
  canFly:{ru:'✓ Можешь летать!',en:'✓ You can fly!',tr:'✓ Uçabilirsin!',zh:'✓ 可以起飞！'},
  toMenu:{ru:'Въ меню',en:'To Menu',tr:'Menüye',zh:'去菜单'},
  plusLife:{ru:'❤️ +1 жизнь!',en:'❤️ +1 life!',tr:'❤️ +1 can!',zh:'❤️ +1生命！'},
  plusLifeFly:{ru:'❤️ +1 жизнь! Лети!',en:'❤️ +1 life! Fly!',tr:'❤️ +1 can! Uç!',zh:'❤️ +1生命！起飞！'},
  adUnavailable:{ru:'Реклама недоступна',en:'Ad unavailable',tr:'Reklam mevcut değil',zh:'广告不可用'},

  // ── Магазинъ ──
  marketplace:{ru:'Торговые ряды',en:'Marketplace',tr:'Pazar',zh:'商店'},
  upgrade:{ru:'Улучшить',en:'Upgrade',tr:'Geliştir',zh:'升级'},
  maxed:{ru:'МАКСИМУМЪ',en:'MAXED',tr:'MAKSİMUM',zh:'已满级'},
  notEnoughCoins:{ru:'НЕ ХВАТАЕТЪ',en:'NOT ENOUGH',tr:'YETERSİZ',zh:'不足'},
  readLore:{ru:'📜 Читать исторію',en:'📜 Read lore',tr:'📜 Hikayeyi oku',zh:'📜 阅读故事'},
  details:{ru:'🔍 Подробнее',en:'🔍 Details',tr:'🔍 Detaylar',zh:'🔍 详情'},
  selected:{ru:'ВЫБРАНЪ',en:'SELECTED',tr:'SEÇİLDİ',zh:'已选择'},
  take:{ru:'ВЗЯТЬ',en:'TAKE',tr:'AL',zh:'装备'},
  buy:{ru:'КУПИТЬ',en:'BUY',tr:'SATIN AL',zh:'购买'},
  owned:{ru:'Владѣніе',en:'Owned',tr:'Sahip olunan',zh:'已拥有'},
  rewardAdCard:{ru:'📺 Смотрѣть рекламу',en:'📺 Watch ad',tr:'📺 Reklam izle',zh:'📺 观看广告'},
  rewardAdCoins:{ru:'монетъ за рекламу',en:'coins for watching ad',tr:'reklam izleyerek para kazan',zh:'观看广告获得金币'},
  upgraded:{ru:'ур.',en:'lvl.',tr:'svy.',zh:'等级'},

  // ── Турниръ ──
  weeklyTournament:{ru:'Недѣльный турниръ',en:'Weekly tournament',tr:'Haftalık turnuva',zh:'每周锦标赛'},
  week:{ru:'Недѣля',en:'Week',tr:'Hafta',zh:'周'},
  yourScore:{ru:'Твои очки',en:'Your score',tr:'Puanın',zh:'你的分数'},
  yourPlace:{ru:'Твоё мѣсто',en:'Your place',tr:'Sıran',zh:'你的排名'},
  scoreNote:{ru:'Очки начисляются за побѣды и сбитыхъ боссовъ',en:'Points awarded for victories and bosses defeated',tr:'Zaferler ve yenilen bosslar için puan verilir',zh:'胜利和击败Boss可获得积分'},

  // ── Ранги ──
  ranksTitle:{ru:'Воинскіе ранги',en:'Military ranks',tr:'Askeri rütbeler',zh:'军衔'},
  airFleet:{ru:'Воздушный Флотъ Имперіи Котовъ',en:'Cat Empire Air Fleet',tr:'Kedi İmparatorluğu Hava Filosu',zh:'猫帝国空中舰队'},
  current:{ru:'← текущій',en:'← current',tr:'← mevcut',zh:'← 当前'},
  required:{ru:'Требуется',en:'Required',tr:'Gerekli',zh:'需要'},
  levelsWord:{ru:'уровней',en:'levels',tr:'seviye',zh:'关卡'},
  starsWord:{ru:'звѣздъ',en:'stars',tr:'yıldız',zh:'星星'},
  nextRank:{ru:'До слѣдующаго ранга',en:'To next rank',tr:'Sonraki rütbeye',zh:'距下一军衔'},
  maxRank:{ru:'Максимальный рангъ!',en:'Maximum rank!',tr:'Maksimum rütbe!',zh:'最高军衔！'},
  maxRankDesc:{ru:'Ты — Генералъ-Фельдмаршалъ Воздушнаго Флота!',en:'You are the Air Fleet Field Marshal!',tr:'Hava Filosu Mareşalisin!',zh:'你是空中舰队元帅！'},
  promotion:{ru:'Повышеніе!',en:'Promotion!',tr:'Terfi!',zh:'晋升！'},
  allRanks:{ru:'Всѣ ранги',en:'All ranks',tr:'Tüm rütbeler',zh:'所有军衔'},

  // ── Общее ──
  close:{ru:'Закрыть',en:'Close',tr:'Kapat',zh:'关闭'},
  coins:{ru:'монетъ',en:'coins',tr:'para',zh:'金币'},
  notEnough:{ru:'Не хватаетъ монетъ!',en:'Not enough coins!',tr:'Yeterli para yok!',zh:'金币不足！'},
  shieldAbsorb:{ru:'🛡️ Щитъ поглотилъ ударъ!',en:'🛡️ Shield absorbed hit!',tr:'🛡️ Kalkan darbe emdi!',zh:'🛡️ 护盾吸收了攻击！'},
  purchaseSuccess:{ru:'Куплено: {item}!',en:'Purchased: {item}!',tr:'Satın alındı: {item}!',zh:'已购买：{item}！'},
  purchaseFailed:{ru:'Ошибка покупки',en:'Purchase failed',tr:'Satın alma hatası',zh:'购买失败'},
  rewardAdBtn:{ru:'📺 Реклама = награда',en:'📺 Ad = reward',tr:'📺 Reklam = ödül',zh:'📺 广告=奖励'},
  resetDone:{ru:'Прогрессъ сброшенъ!',en:'Progress reset!',tr:'İlerleme sıfırlandı!',zh:'进度已重置！'},
  flightDev:{ru:'Полётъ въ разработке!',en:'Flight in development!',tr:'Uçuş geliştirme aşamasında!',zh:'飞行开发中！'},
  vs:{ru:'вёрстъ',en:'versts',tr:'verst',zh:'俄里'},
  year:{ru:'годъ',en:'year',tr:'yıl',zh:'年'}
};

let currentLang='ru';

function detectLang(){
  const saved=window.Save?.data?.settings?.lang;
  if(saved&&LANGS[saved])return saved;
  const nav=(navigator.language||'').toLowerCase();
  if(nav.startsWith('ru'))return 'ru';
  if(nav.startsWith('tr'))return 'tr';
  if(nav.startsWith('zh'))return 'zh';
  return 'en';
}

function setLang(lang){
  if(!LANGS[lang])return;
  currentLang=lang;
  const d=window.Save?.data;
  if(d){if(!d.settings)d.settings={};d.settings.lang=lang;window.Save.save();}
  log('Языкъ: '+lang+' ('+LANGS[lang].name+')');
}

function t(key,params){
  const entry=T[key];
  if(!entry)return key;
  let str=entry[currentLang]||entry.en||entry.ru||key;
  if(params){for(const k in params)str=str.replace('{'+k+'}',params[k]);}
  return str;
}

function getLang(){return currentLang;}
function getLangs(){return LANGS;}

function init(){
  currentLang=detectLang();
  log('✓ I18n готовъ, языкъ: '+currentLang+' ('+LANGS[currentLang].name+')');
  return Promise.resolve();
}

window.I18n={init,t,setLang,getLang,getLangs,LANGS,T};
})();