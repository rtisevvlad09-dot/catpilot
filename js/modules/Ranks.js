// ═══ СИСТЕМА РАНГОВЪ (Поручикъ → Генералъ-Фельдмаршалъ) (i18n) ═══
(function(){
'use strict';
const log=(...a)=>{if(window.Logger?.module)window.Logger.module('Ranks',...a);};
const t=(k,p)=>window.I18n?window.I18n.t(k,p):k;

const RANKS=[
  {id:'cadet',       name:{ru:'Кадетъ',en:'Cadet',tr:'Asteğmen',zh:'学员'}, icon:'🎖️', minDone:0,  minStars:0,   color:'#8e8e93', desc:{ru:'Новобранецъ Воздушнаго Флота',en:'Air Fleet recruit',tr:'Hava Filosu acemisi',zh:'空军舰队新兵'}},
  {id:'poruchik',    name:{ru:'Поручикъ',en:'Lieutenant',tr:'Teğmen',zh:'中尉'}, icon:'⭐',  minDone:3,  minStars:5,   color:'#a8d0ff', desc:{ru:'Младшій офицеръ, доказавшій храбрость',en:'Junior officer who proved bravery',tr:'Cesaretini kanıtlamış genç subay',zh:'证明勇敢的初级军官'}},
  {id:'kapitan',     name:{ru:'Капитанъ',en:'Captain',tr:'Kaptan',zh:'上尉'}, icon:'⭐⭐', minDone:8,  minStars:15,  color:'#5ac8fa', desc:{ru:'Командиръ звена, вѣтеранъ боёвъ',en:'Squadron commander, battle veteran',tr:'Filo komutanı, savaş gazisi',zh:'中队长，战斗老兵'}},
  {id:'major',       name:{ru:'Маіоръ',en:'Major',tr:'Binbaşı',zh:'少校'}, icon:'🌟',  minDone:15, minStars:30,  color:'#34c759', desc:{ru:'Старшій офицеръ, гроза небесъ',en:'Senior officer, terror of the skies',tr:'Kıdemli subay, gökyüzünün belası',zh:'高级军官，天空的噩梦'}},
  {id:'polkovnik',   name:{ru:'Полковникъ',en:'Colonel',tr:'Albay',zh:'上校'}, icon:'🌟🌟',minDone:25, minStars:50,  color:'#ffd080', desc:{ru:'Командиръ полка, легенда фронта',en:'Regiment commander, legend of the front',tr:'Alay komutanı, cephenin efsanesi',zh:'团长，前线的传奇'}},
  {id:'general',     name:{ru:'Генералъ',en:'General',tr:'General',zh:'将军'}, icon:'👑',  minDone:35, minStars:70,  color:'#ff9500', desc:{ru:'Генералъ Воздушнаго Флота Имперіи',en:'General of the Imperial Air Fleet',tr:'İmparatorluk Hava Filosu Generali',zh:'帝国空军舰队将军'}},
  {id:'feldmarshal', name:{ru:'Генералъ-Фельдмаршалъ',en:'Field Marshal',tr:'Mareşal',zh:'元帅'}, icon:'🏆', minDone:50, minStars:100, color:'#ff3b30', desc:{ru:'Высшій рангъ. Покоритель небесъ и земель',en:'Highest rank. Conqueror of skies and lands',tr:'En yüksek rütbe. Gökyüzünün ve toprağın fatihi',zh:'最高军衔。天空与大地的征服者'}}
];

function getProgress(){
  const d=window.Save?.data||{};
  const done=(d.done||[]).length;
  const starsObj=d.stars||{};
  let totalStars=0;
  for(const k in starsObj)totalStars+=starsObj[k]||0;
  return {done,totalStars};
}

function getCurrentRank(){
  const {done,totalStars}=getProgress();
  let current=RANKS[0];
  for(let i=RANKS.length-1;i>=0;i--){
    if(done>=RANKS[i].minDone&&totalStars>=RANKS[i].minStars){
      current=RANKS[i];break;
    }
  }
  return current;
}

function getNextRank(){
  const {done,totalStars}=getProgress();
  for(let i=0;i<RANKS.length;i++){
    if(done<RANKS[i].minDone||totalStars<RANKS[i].minStars)return RANKS[i];
  }
  return null;
}

function getProgressToNext(){
  const next=getNextRank();
  if(!next)return {donePct:100,starsPct:100,label:t('maxRank')};
  const {done,totalStars}=getProgress();
  const donePct=Math.min(100,Math.round(done/Math.max(1,next.minDone)*100));
  const starsPct=Math.min(100,Math.round(totalStars/Math.max(1,next.minStars)*100));
  return {donePct,starsPct,label:t('nextRank')};
}

function checkPromotion(){
  const d=window.Save?.data||{};
  if(!d._lastRank){
    d._lastRank=getCurrentRank().id;
    window.Save.save();
    return null;
  }
  const newRank=getCurrentRank();
  if(newRank.id!==d._lastRank){
    d._lastRank=newRank.id;
    window.Save.save();
    const lang=window.I18n?.getLang?.()||'ru';
    const rankName=newRank.name[lang]||newRank.name.en||newRank.name.ru;
    setTimeout(()=>{
      if(window.UI?.toast)window.UI.toast(`${newRank.icon} ${t('promotion')} ${rankName}`,'success');
      if(window.Sound?.win)window.Sound.win();
    },500);
    return newRank;
  }
  return null;
}

function showPanel(){
  const current=getCurrentRank();
  const next=getNextRank();
  const prog=getProgressToNext();
  const {done,totalStars}=getProgress();
  const lang=window.I18n?.getLang?.()||'ru';
  
  const ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(8px);overflow-y:auto;';
  
  let ranksHtml='';
  RANKS.forEach(r=>{
    const achieved=done>=r.minDone&&totalStars>=r.minStars;
    const isCurrent=r.id===current.id;
    const isNext=next&&r.id===next.id;
    const rName=r.name[lang]||r.name.en||r.name.ru;
    const rDesc=r.desc[lang]||r.desc.en||r.desc.ru;
    ranksHtml+=`<div style="display:flex;align-items:center;gap:14px;padding:12px 16px;border-radius:10px;margin-bottom:6px;
      background:${isCurrent?'rgba(212,168,75,.2)':achieved?'rgba(120,200,120,.1)':'rgba(255,255,255,.03)'};
      border:1px solid ${isCurrent?'rgba(212,168,75,.6)':achieved?'rgba(120,200,120,.3)':isNext?'rgba(255,200,80,.3)':'rgba(255,255,255,.08)'};
      opacity:${achieved||isNext?1:0.5};">
      <div style="font-size:24px;width:40px;text-align:center;">${achieved||isNext?r.icon:'🔒'}</div>
      <div style="flex:1;">
        <div style="font-family:'IM Fell English SC',serif;font-size:15px;color:${achieved?r.color:'rgba(240,208,128,.4)'};">${rName} ${isCurrent?'← '+t('current'):''}</div>
        <div style="font-size:11px;color:rgba(250,244,232,.4);margin-top:2px;">${rDesc}</div>
        <div style="font-size:10px;color:rgba(250,244,232,.3);margin-top:2px;">${t('required')}: ${r.minDone} ${t('levelsWord')} · ${r.minStars} ${t('starsWord')}</div>
      </div>
      <div style="font-size:12px;color:${achieved?'#a8e0a0':'rgba(250,244,232,.3)'};">${achieved?'✓':''}</div>
    </div>`;
  });

  const curName=current.name[lang]||current.name.en||current.name.ru;
  const curDesc=current.desc[lang]||current.desc.en||current.desc.ru;

  ov.innerHTML=`<div style="background:linear-gradient(180deg,#1a3568,#0a1f44);border:1px solid rgba(212,168,75,.4);border-radius:24px;padding:28px 24px;max-width:480px;width:92%;max-height:85vh;overflow-y:auto;">
    <h2 style="font-family:'IM Fell English SC',serif;color:#f0d080;font-size:24px;margin:0 0 4px;text-align:center;">${t('ranksTitle')}</h2>
    <p style="text-align:center;color:rgba(250,244,232,.5);margin:0 0 16px;font-size:12px;">${t('airFleet')}</p>
    <div style="background:rgba(212,168,75,.1);border:1px solid rgba(212,168,75,.3);border-radius:12px;padding:16px;margin-bottom:16px;text-align:center;">
      <div style="font-size:36px;margin-bottom:6px;">${current.icon}</div>
      <div style="font-family:'IM Fell English SC',serif;font-size:20px;color:${current.color};">${curName}</div>
      <div style="font-size:12px;color:rgba(250,244,232,.5);margin-top:4px;">${curDesc}</div>
      <div style="display:flex;gap:16px;justify-content:center;margin-top:10px;">
        <span style="font-size:12px;color:rgba(250,244,232,.6);">🏆 ${done} ${t('levelsWord')}</span>
        <span style="font-size:12px;color:rgba(250,244,232,.6);">⭐ ${totalStars} ${t('starsWord')}</span>
      </div>
    </div>
    ${next?`<div style="background:rgba(255,200,80,.08);border:1px solid rgba(255,200,80,.2);border-radius:10px;padding:12px 16px;margin-bottom:16px;">
      <div style="font-size:11px;color:rgba(255,200,80,.6);letter-spacing:.1em;text-transform:uppercase;font-family:'IM Fell English SC',serif;margin-bottom:8px;">${prog.label}: ${next.icon} ${next.name[lang]||next.name.en||next.name.ru}</div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
        <span style="font-size:11px;color:rgba(250,244,232,.5);min-width:60px;">${t('levelsWord')}</span>
        <div style="flex:1;height:6px;background:rgba(255,255,255,.08);border-radius:99px;overflow:hidden;"><div style="height:100%;width:${prog.donePct}%;background:linear-gradient(90deg,#d4a84b,#f0d080);border-radius:99px;"></div></div>
        <span style="font-size:11px;color:#f0d080;min-width:50px;text-align:right;">${done}/${next.minDone}</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:11px;color:rgba(250,244,232,.5);min-width:60px;">${t('starsWord')}</span>
        <div style="flex:1;height:6px;background:rgba(255,255,255,.08);border-radius:99px;overflow:hidden;"><div style="height:100%;width:${prog.starsPct}%;background:linear-gradient(90deg,#ffd080,#ffe8b0);border-radius:99px;"></div></div>
        <span style="font-size:11px;color:#f0d080;min-width:50px;text-align:right;">${totalStars}/${next.minStars}</span>
      </div>
    </div>`:`<div style="background:rgba(255,60,40,.1);border:1px solid rgba(255,60,40,.3);border-radius:10px;padding:14px;margin-bottom:16px;text-align:center;">
      <div style="font-size:14px;color:#ff8a80;font-weight:600;">🏆 ${t('maxRank')}</div>
      <div style="font-size:12px;color:rgba(250,244,232,.5);margin-top:4px;">${t('maxRankDesc')}</div>
    </div>`}
    <div style="margin-bottom:8px;">
      <div style="font-size:11px;color:rgba(240,208,128,.5);letter-spacing:.1em;text-transform:uppercase;font-family:'IM Fell English SC',serif;margin-bottom:8px;">${t('allRanks')}</div>
      ${ranksHtml}
    </div>
    <div style="text-align:center;margin-top:12px;"><button id="closeRanks" style="padding:8px 24px;background:transparent;border:1px solid rgba(255,255,255,.2);border-radius:99px;color:rgba(250,244,232,.6);cursor:pointer;font-size:13px;">${t('close')}</button></div>
  </div>`;
  
  document.body.appendChild(ov);
  const close=()=>document.body.removeChild(ov);
  document.getElementById('closeRanks').onclick=close;
  ov.onclick=e=>{if(e.target===ov)close();};
}

function init(){
  log('✓ Система ранговъ готова ('+RANKS.length+' ранговъ)');
  const d=window.Save?.data;
  if(d&&!d._lastRank){d._lastRank=getCurrentRank().id;window.Save.save();}
  return Promise.resolve();
}

window.Ranks={init,getCurrentRank,getNextRank,getProgressToNext,getProgress,checkPromotion,showPanel,RANKS};
})();