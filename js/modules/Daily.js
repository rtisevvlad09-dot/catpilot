// ═══ ЕЖЕДНЕВНЫЕ БОНУСЫ (i18n) ═══
(function(){
'use strict';
const log=(...a)=>{if(window.Logger?.module)window.Logger.module('Daily',...a);};
const t=(k,p)=>window.I18n?window.I18n.t(k,p):k;

function todayStr(){return new Date().toISOString().slice(0,10);}
function yesterdayStr(){const d=new Date();d.setDate(d.getDate()-1);return d.toISOString().slice(0,10);}

function getDaily(){
  const d=window.Save?.data; if(!d)return null;
  if(!d.xp)d.xp={}; if(!d.xp.daily)d.xp.daily={last:'',streak:0};
  return d.xp.daily;
}

// Хелперъ для перевода наградъ
function getRewardLabel(r){
  const c=t('coins');
  const f=t('fuel');
  if(r.fuel>0) return `${r.coins} + ${r.fuel} ${f}`;
  return `${r.coins} ${c}`;
}

const REWARDS=[
  {day:1,coins:30,fuel:0},
  {day:2,coins:50,fuel:10},
  {day:3,coins:80,fuel:0},
  {day:4,coins:100,fuel:20},
  {day:5,coins:150,fuel:0},
  {day:6,coins:200,fuel:30},
  {day:7,coins:500,fuel:50}
];

function canClaim(){const dl=getDaily();if(!dl)return false;return dl.last!==todayStr();}

function claim(){
  const dl=getDaily(); if(!dl||!canClaim())return null;
  const today=todayStr();
  if(dl.last===yesterdayStr())dl.streak=Math.min(6,(dl.streak||0)+1);
  else dl.streak=0;
  dl.last=today;
  const reward=REWARDS[dl.streak%7];
  const d=window.Save.data;
  d.coins=(d.coins||0)+reward.coins;
  if(reward.fuel)d.fuel=Math.min(100,(d.fuel||100)+reward.fuel);
  window.Save.save();
  log('✓ Бонусъ дня '+(dl.streak+1));
  return {reward,streak:dl.streak+1};
}

function showPanel(){
  const dl=getDaily(); if(!dl)return;
  const claimed=!canClaim();
  const streak=(dl.streak||0)%7;
  const ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(8px);';
  
  let daysHtml='';
  for(let i=0;i<7;i++){
    const r=REWARDS[i];
    const done=i<streak||(claimed&&i===streak);
    const cur=!claimed&&i===streak;
    const rLabel=getRewardLabel(r);
    daysHtml+=`<div style="flex:1;min-width:0;padding:8px 4px;border-radius:10px;text-align:center;
      background:${done?'rgba(120,200,120,.25)':cur?'rgba(212,168,75,.3)':'rgba(255,255,255,.06)'};
      border:1px solid ${done?'rgba(120,200,120,.5)':cur?'rgba(212,168,75,.7)':'rgba(255,255,255,.15)'};">
      <div style="font-size:10px;opacity:.7;white-space:nowrap;">${t('day')} ${i+1}</div>
      <div style="font-size:16px;margin:2px 0;">${i===6?'🎁':'🪙'}</div>
      <div style="font-size:11px;font-weight:600;color:#f0d080;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${rLabel}</div>
      ${done?'<div style="font-size:9px;color:#a8e0a0;">✓</div>':''}
    </div>`;
  }
  
  const currentRewardLabel=getRewardLabel(REWARDS[streak]);
  
  ov.innerHTML=`<div style="background:linear-gradient(180deg,#1a3568,#0a1f44);border:1px solid rgba(212,168,75,.4);border-radius:24px;padding:28px 24px;max-width:480px;width:92%;text-align:center;">
    <h2 style="font-family:'IM Fell English SC',serif;color:#f0d080;font-size:24px;margin:0 0 6px;">${t('dailyBonus')}</h2>
    <p style="color:rgba(250,244,232,.7);margin:0 0 16px;font-size:13px;">${t('streak')}: <b style="color:#f0d080;">${streak+(claimed?1:0)} ${t('days')}</b> — ${t('comeEveryDay')}</p>
    <div style="display:flex;gap:6px;margin-bottom:20px;justify-content:center;">${daysHtml}</div>
    ${claimed
      ?`<div style="color:#a8e0a0;font-size:15px;margin-bottom:14px;">${t('claimedToday')}</div>`
      :`<button id="claimBtn" style="padding:12px 36px;border:none;border-radius:99px;background:linear-gradient(180deg,#ffd080,#d4a84b);color:#1a0f00;font-weight:700;font-size:15px;cursor:pointer;font-family:'IM Fell English SC',serif;">${t('claim')} ${currentRewardLabel}</button>`}
    <div style="margin-top:14px;"><button id="closeDaily" style="padding:7px 18px;background:transparent;border:1px solid rgba(255,255,255,.2);border-radius:99px;color:rgba(250,244,232,.6);cursor:pointer;font-size:13px;">${t('close')}</button></div>
  </div>`;
  
  document.body.appendChild(ov);
  const close=()=>document.body.removeChild(ov);
  ov.querySelector('#closeDaily').onclick=close;
  ov.onclick=e=>{if(e.target===ov)close();};
  
  if(!claimed){
    ov.querySelector('#claimBtn').onclick=()=>{
      const res=claim();
      if(res){
        window.Sound?.coin?.();
        close();
        showPanel(); // Обновить панель, чтобы показать галочку
        if(window.UI?.toast) window.UI.toast(`${t('received')} ${currentRewardLabel}`, 'success');
      }
    };
  }
}

function autoCheck(){
  if(canClaim() && window.UI?.toast) window.UI.toast(t('dailyWaiting'), 'info');
}

function init(){log('✓ Ежедневные бонусы готовы');return Promise.resolve();}

window.Daily={init,claim,canClaim,showPanel,autoCheck,getDaily};
})();