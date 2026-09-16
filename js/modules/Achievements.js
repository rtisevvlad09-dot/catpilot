// ═══ ДОСТИЖЕНІЯ (i18n) ═══
(function(){
'use strict';
const log=(...a)=>{if(window.Logger?.module)window.Logger.module('Achievements',...a);};
const t=(k,p)=>window.I18n?window.I18n.t(k,p):k;

const ACHIEVEMENTS=[
  {id:'first_flight',
    name:{ru:'Первый полётъ',en:'First Flight',tr:'İlk Uçuş',zh:'首次飞行'},
    desc:{ru:'Соверши первый вылетъ',en:'Complete your first sortie',tr:'İlk seferini tamamla',zh:'完成你的第一次出击'},
    icon:'✈️',check:s=>(s.xp?.stats?.flights||0)>=1,reward:50},
  {id:'ten_flights',
    name:{ru:'Опытный лётчикъ',en:'Veteran Pilot',tr:'Deneyimli Pilot',zh:'资深飞行员'},
    desc:{ru:'10 полётовъ',en:'10 flights completed',tr:'10 uçuş tamamlandı',zh:'完成10次飞行'},
    icon:'🛩️',check:s=>(s.xp?.stats?.flights||0)>=10,reward:100},
  {id:'first_boss',
    name:{ru:'Укротитель боссовъ',en:'Boss Tamer',tr:'Boss Evcilleştirici',zh:'Boss驯服者'},
    desc:{ru:'Сбей первого босса',en:'Defeat your first boss',tr:'İlk bossunu yen',zh:'击败你的第一个Boss'},
    icon:'♛',check:s=>(s.xp?.stats?.bosses||0)>=1,reward:150},
  {id:'five_bosses',
    name:{ru:'Гроза небесъ',en:'Sky Terror',tr:'Gökyüzü Kabusu',zh:'天空噩梦'},
    desc:{ru:'Сбей 5 боссовъ',en:'Defeat 5 bosses',tr:'5 boss yen',zh:'击败5个Boss'},
    icon:'⚔️',check:s=>(s.xp?.stats?.bosses||0)>=5,reward:300},
  {id:'all_bosses',
    name:{ru:'Покоритель Имперіи',en:'Empire Conqueror',tr:'İmparatorluk Fatihi',zh:'帝国征服者'},
    desc:{ru:'Сбей всѣхъ 20 боссовъ',en:'Defeat all 20 bosses',tr:'20 bossun hepsini yen',zh:'击败全部20个Boss'},
    icon:'👑',check:s=>(s.xp?.stats?.bosses||0)>=20,reward:1000},
  {id:'rich',
    name:{ru:'Кошачій магнатъ',en:'Cat Tycoon',tr:'Kedi Zengini',zh:'猫大亨'},
    desc:{ru:'Накопи 1000 монетъ',en:'Accumulate 1000 coins',tr:'1000 para biriktir',zh:'积累1000金币'},
    icon:'🪙',check:s=>(s.coins||0)>=1000,reward:200},
  {id:'collector',
    name:{ru:'Коллекціонеръ',en:'Collector',tr:'Koleksiyoncu',zh:'收藏家'},
    desc:{ru:'Купи 3 самолёта',en:'Own 3 planes',tr:'3 uçağa sahip ol',zh:'拥有3架飞机'},
    icon:'🏆',check:s=>(s.planes?.length||1)>=3,reward:250},
  {id:'upgraded',
    name:{ru:'Мастеръ ангара',en:'Hangar Master',tr:'Hangar Ustası',zh:'机库大师'},
    desc:{ru:'Улучши что-нибудь 5 разъ',en:'Upgrade anything 5 times',tr:'Herhangi bir şeyi 5 kez geliştir',zh:'升级任意项目5次'},
    icon:'🔧',check:s=>{let n=0;const u=s.up||{};for(const k in u)n+=(u[k]||0);return n>=5;},reward:150},
  {id:'survivor',
    name:{ru:'Живучій',en:'Survivor',tr:'Hayatta Kalan',zh:'幸存者'},
    desc:{ru:'Пройди уровень съ HP>80%',en:'Complete a level with HP>80%',tr:'HP>%80 ile seviye tamamla',zh:'以>80%生命值完成关卡'},
    icon:'💪',check:s=>(s.xp?.stats?.perfect||0)>=1,reward:100},
  {id:'streak3',
    name:{ru:'Завсегдатай',en:'Regular',tr:'Müdavim',zh:'常客'},
    desc:{ru:'Серія входовъ 3 дня',en:'Login streak of 3 days',tr:'3 günlük giriş serisi',zh:'连续登录3天'},
    icon:'🔥',check:s=>(s.xp?.daily?.streak||0)>=2,reward:120}
];

function getUnlocked(){
  const s=window.Save?.data;if(!s)return[];
  if(!s.xp)s.xp={};if(!s.xp.medals)s.xp.medals=[];
  return s.xp.medals;
}

function checkAll(){
  const s=window.Save?.data;if(!s)return[];
  const unlocked=getUnlocked();
  const justUnlocked=[];
  for(const a of ACHIEVEMENTS){
    if(!unlocked.includes(a.id)&&a.check(s)){
      unlocked.push(a.id);
      s.coins=(s.coins||0)+a.reward;
      justUnlocked.push(a);
    }
  }
  if(justUnlocked.length){
    s.xp.medals=unlocked;
    window.Save.save();
    const lang=window.I18n?.getLang?.()||'ru';
    justUnlocked.forEach((a,i)=>{
      setTimeout(()=>{
        const aName=a.name[lang]||a.name.en||a.name.ru;
        if(window.UI?.toast)window.UI.toast(`${a.icon} ${t('achievements')}: ${aName} (+${a.reward}🪙)`,'success');
        window.Sound?.win?.();
      },i*1200);
    });
  }
  return justUnlocked;
}

function showPanel(){
  const unlocked=getUnlocked();
  const lang=window.I18n?.getLang?.()||'ru';
  const ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(8px);overflow-y:auto;';
  let listHtml='';
  for(const a of ACHIEVEMENTS){
    const done=unlocked.includes(a.id);
    const aName=a.name[lang]||a.name.en||a.name.ru;
    const aDesc=a.desc[lang]||a.desc.en||a.desc.ru;
    listHtml+=`<div style="display:flex;align-items:center;gap:14px;padding:12px 16px;border-radius:12px;margin-bottom:8px;
      background:${done?'rgba(120,200,120,.15)':'rgba(255,255,255,.05)'};
      border:1px solid ${done?'rgba(120,200,120,.4)':'rgba(255,255,255,.12)'};opacity:${done?1:0.6};">
      <div style="font-size:28px;width:40px;text-align:center;">${done?a.icon:'🔒'}</div>
      <div style="flex:1;text-align:left;">
        <div style="font-family:'IM Fell English SC',serif;color:#f0d080;font-size:15px;">${aName}</div>
        <div style="font-size:12px;color:rgba(250,244,232,.6);">${aDesc}</div>
      </div>
      <div style="font-size:13px;color:#f0d080;font-weight:600;">${done?'✓':'+ '+a.reward+'🪙'}</div>
    </div>`;
  }
  ov.innerHTML=`<div style="background:linear-gradient(180deg,#1a3568,#0a1f44);border:1px solid rgba(212,168,75,.4);border-radius:24px;padding:28px;max-width:520px;width:90%;max-height:85vh;overflow-y:auto;">
    <h2 style="font-family:'IM Fell English SC',serif;color:#f0d080;font-size:26px;margin:0 0 6px;text-align:center;">${t('achievements')}</h2>
    <p style="text-align:center;color:rgba(250,244,232,.6);margin:0 0 20px;font-size:13px;">${t('unlocked')}: ${unlocked.length} / ${ACHIEVEMENTS.length}</p>
    ${listHtml}
    <div style="text-align:center;margin-top:16px;"><button id="closeAch" style="padding:8px 24px;background:transparent;border:1px solid rgba(255,255,255,.2);border-radius:99px;color:rgba(250,244,232,.6);cursor:pointer;">${t('close')}</button></div>
  </div>`;
  document.body.appendChild(ov);
  const close=()=>document.body.removeChild(ov);
  ov.querySelector('#closeAch').onclick=close;
  ov.onclick=e=>{if(e.target===ov)close();};
}

function addFlight(){const s=window.Save?.data;if(!s)return;if(!s.xp)s.xp={};if(!s.xp.stats)s.xp.stats={flights:0,wins:0,bosses:0,perfect:0};s.xp.stats.flights++;window.Save.save();}
function addWin(perfect){const s=window.Save?.data;if(!s)return;if(!s.xp)s.xp={};if(!s.xp.stats)s.xp.stats={flights:0,wins:0,bosses:0,perfect:0};s.xp.stats.wins++;if(perfect)s.xp.stats.perfect++;window.Save.save();}
function addBoss(){const s=window.Save?.data;if(!s)return;if(!s.xp)s.xp={};if(!s.xp.stats)s.xp.stats={flights:0,wins:0,bosses:0,perfect:0};s.xp.stats.bosses++;window.Save.save();}

function init(){log('✓ Достиженія готовы ('+ACHIEVEMENTS.length+')');return Promise.resolve();}

window.Achievements={init,checkAll,showPanel,addFlight,addWin,addBoss,ACHIEVEMENTS};
})();