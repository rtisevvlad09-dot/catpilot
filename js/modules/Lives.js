// ═══ СИСТЕМА ЖИЗНЕЙ: 9 попытокъ въ день при аваріяхъ (i18n) ═══
(function(){
'use strict';
const log=(...a)=>{if(window.Logger?.module)window.Logger.module('Lives',...a);};
const t=(k,p)=>window.I18n?window.I18n.t(k,p):k;
const MAX_LIVES=9;

function todayStr(){return new Date().toISOString().slice(0,10);}

function getLivesData(){
  const d=window.Save?.data; if(!d)return null;
  if(!d.xp)d.xp={};
  if(!d.xp.lives)d.xp.lives={date:'',crashes:0};
  // Новый день — сбросъ
  if(d.xp.lives.date!==todayStr()){
    d.xp.lives={date:todayStr(),crashes:0};
    window.Save.save();
  }
  return d.xp.lives;
}

function getRemaining(){
  const ld=getLivesData();
  if(!ld)return MAX_LIVES;
  return Math.max(0,MAX_LIVES-(ld.crashes||0));
}

function canFly(){return getRemaining()>0;}

function recordCrash(){
  const ld=getLivesData();
  if(!ld)return;
  ld.crashes=(ld.crashes||0)+1;
  window.Save.save();
  log('✈ Аварія! Осталось жизней: '+getRemaining());
}

function addLife(){
  const ld=getLivesData();
  if(!ld)return;
  if(ld.crashes>0){ld.crashes--;window.Save.save();}
}

function getTimeUntilReset(){
  const now=new Date();
  const tomorrow=new Date(now);
  tomorrow.setDate(tomorrow.getDate()+1);
  tomorrow.setHours(0,0,0,0);
  const ms=tomorrow-now;
  const h=Math.floor(ms/3600000);
  const m=Math.floor((ms%3600000)/60000);
  return {h,m,ms};
}

function showPanel(){
  const remaining=getRemaining();
  const tReset=getTimeUntilReset();
  const ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:9999;backdrop-filter:blur(8px);';
  
  let heartsHtml='';
  for(let i=0;i<MAX_LIVES;i++){
    heartsHtml+=`<span style="font-size:22px;${i<remaining?'':'opacity:.2;filter:grayscale(1);'}">${i<remaining?'❤️':'🖤'}</span>`;
  }
  
  const canBuyAd=window.YaBridge?.showRewardedAd || window.Monetization?.showRewarded;
  
  ov.innerHTML=`<div style="background:linear-gradient(180deg,#1a3568,#0a1f44);border:1px solid rgba(212,168,75,.4);border-radius:24px;padding:28px 24px;max-width:420px;width:92%;text-align:center;">
    <h2 style="font-family:'IM Fell English SC',serif;color:#f0d080;font-size:24px;margin:0 0 6px;">${t('livesTitle')}</h2>
    <p style="color:rgba(250,244,232,.6);margin:0 0 16px;font-size:13px;">${t('livesDesc',{n:MAX_LIVES})}</p>
    <div style="display:flex;justify-content:center;gap:4px;flex-wrap:wrap;margin-bottom:16px;">${heartsHtml}</div>
    <div style="font-size:15px;color:#faf4e8;margin-bottom:4px;">${t('remained')}: <b style="color:${remaining>3?'#a8e0a0':remaining>0?'#ffd080':'#ff6b6b'};">${remaining}</b> ${t('of')} ${MAX_LIVES}</div>
    <div style="font-size:12px;color:rgba(250,244,232,.5);margin-bottom:20px;">${t('resetIn')} ${tReset.h}ч ${tReset.m}м</div>
    ${remaining===0?`
      <div style="background:rgba(255,80,60,.15);border:1px solid rgba(255,80,60,.3);border-radius:12px;padding:14px;margin-bottom:16px;">
        <div style="color:#ff8a80;font-size:14px;font-weight:600;">✈ ${t('allSpent')}</div>
        <div style="color:rgba(250,244,232,.6);font-size:12px;margin-top:4px;">${t('waitOrAd')}</div>
      </div>
      ${canBuyAd?`<button id="livesAdBtn" style="padding:12px 32px;border:none;border-radius:99px;background:linear-gradient(180deg,rgba(120,200,120,.3),rgba(120,200,120,.15));color:#a8e0a0;font-weight:700;font-size:14px;cursor:pointer;font-family:'IM Fell English SC',serif;border:1px solid rgba(120,200,120,.4);margin-bottom:10px;width:100%;">${t('adForLife')}</button>`:''}
      <button id="livesWaitBtn" style="padding:10px 28px;border:1px solid rgba(255,255,255,.2);border-radius:99px;background:transparent;color:rgba(250,244,232,.6);cursor:pointer;font-size:13px;width:100%;">${t('waitTomorrow')}</button>
    `:`
      <div style="color:#a8e0a0;font-size:14px;margin-bottom:16px;">✓ ${t('canFly')}</div>
      <button id="livesCloseBtn" style="padding:10px 28px;border:1px solid rgba(255,255,255,.2);border-radius:99px;background:transparent;color:rgba(250,244,232,.6);cursor:pointer;font-size:13px;">${t('close')}</button>
    `}
  </div>`;
  
  document.body.appendChild(ov);
  const close=()=>document.body.removeChild(ov);
  
  if(remaining===0){
    const ab=document.getElementById('livesAdBtn');
    if(ab)ab.onclick=()=>{
      const showAd = window.Monetization?.showRewarded || window.YaBridge?.showRewardedAd;
      if(showAd) {
        showAd(()=>{
          addLife();window.Sound?.coin?.();
          if(window.UI?.toast)window.UI.toast(t('plusLife'),'success');
          close();
        },()=>{
          if(window.UI?.toast)window.UI.toast(t('adUnavailable'),'warn');
        });
      }
    };
    const wb=document.getElementById('livesWaitBtn');
    if(wb)wb.onclick=close;
  }else{
    const cb=document.getElementById('livesCloseBtn');
    if(cb)cb.onclick=close;
  }
  ov.onclick=e=>{if(e.target===ov)close();};
}

function showNoLivesScreen(){
  const tReset=getTimeUntilReset();
  const ov=document.createElement('div');
  ov.id='noLivesOverlay';
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:99999;backdrop-filter:blur(12px);';
  
  const canBuyAd=window.YaBridge?.showRewardedAd || window.Monetization?.showRewarded;
  
  ov.innerHTML=`<div style="background:linear-gradient(180deg,#2a1a1a,#1a0a0a);border:1px solid rgba(255,80,60,.4);border-radius:24px;padding:36px 28px;max-width:400px;width:90%;text-align:center;">
    <div style="font-size:60px;margin-bottom:12px;">💔</div>
    <h2 style="font-family:'IM Fell English SC',serif;color:#ff8a80;font-size:26px;margin:0 0 8px;">${t('crash')}!</h2>
    <p style="color:rgba(250,244,232,.7);margin:0 0 6px;font-size:14px;">${t('allSpentToday',{n:MAX_LIVES})}</p>
    <p style="color:rgba(250,244,232,.5);margin:0 0 24px;font-size:13px;">${t('resetIn')} ${tReset.h}ч ${tReset.m}м</p>
    ${canBuyAd?`<button id="nlAdBtn" style="padding:14px 36px;border:none;border-radius:99px;background:linear-gradient(180deg,rgba(120,200,120,.3),rgba(120,200,120,.15));color:#a8e0a0;font-weight:700;font-size:15px;cursor:pointer;font-family:'IM Fell English SC',serif;border:1px solid rgba(120,200,120,.4);width:100%;margin-bottom:12px;">${t('adForLife')}</button>`:''}
    <button id="nlMenuBtn" style="padding:12px 32px;border:1px solid rgba(255,255,255,.2);border-radius:99px;background:transparent;color:rgba(250,244,232,.6);cursor:pointer;font-size:14px;width:100%;font-family:'IM Fell English SC',serif;">${t('toMenu')}</button>
  </div>`;
  
  document.body.appendChild(ov);
  const close=()=>{const el=document.getElementById('noLivesOverlay');if(el)el.remove();};
  
  const ab=document.getElementById('nlAdBtn');
  if(ab)ab.onclick=()=>{
    const showAd = window.Monetization?.showRewarded || window.YaBridge?.showRewardedAd;
    if(showAd) {
      showAd(()=>{
        addLife();window.Sound?.coin?.();
        if(window.UI?.toast)window.UI.toast(t('plusLifeFly'),'success');
        close();
      },()=>{
        if(window.UI?.toast)window.UI.toast(t('adUnavailable'),'warn');
      });
    }
  };
  
  document.getElementById('nlMenuBtn').onclick=()=>{
    close();
    if(window.Screens?.show)window.Screens.show('menu');
  };
}

function init(){log('✓ Система жизней готова ('+MAX_LIVES+'/день)');return Promise.resolve();}

window.Lives={init,getRemaining,canFly,recordCrash,addLife,showPanel,showNoLivesScreen,getTimeUntilReset,MAX_LIVES};
})();