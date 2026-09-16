// ═══ МОНЕТИЗАЦІЯ (Ads + IAP + Sticky Banner + GameplayAPI) ═══
(function(){
'use strict';
const log=(...a)=>{if(window.Logger?.module)window.Logger.module('Monetization',...a);};

let ysdk=null;
let payments=null;
let adCooldown=0;
const AD_COOLDOWN=90; // секундъ между interstitial
let stickyVisible=true;

// ═══ ИНИЦИАЛИЗАЦИЯ (используетъ готовый SDK изъ main.js) ═══
async function init(){
  try{
    // SDK уже инициализированъ въ main.js — берёмъ его изъ window.ysdk
    if(typeof window.ysdk === 'undefined'){
      log('⚠ Yandex SDK не найденъ — демо-режимъ');
      return Promise.resolve();
    }
    ysdk = window.ysdk;
    log('✓ SDK полученъ изъ main.js');
    
    // Payments
    try{
      payments = await ysdk.getPayments();
      log('✓ Payments готовы');
    }catch(e){
      log('⚠ Payments недоступны:', e.message);
    }
    
    // Sticky banner — показать при старте
    showStickyBanner();
    
    // Обработчики паузы для Яндексъ (требованіе платформы)
    setupPauseHandlers();
    
  }catch(e){
    log('⚠ Monetization init error:', e.message);
  }
  return Promise.resolve();
}

// ═══ ОБРАБОТЧИКИ ПАУЗЫ (требованіе Яндексъ) ═══
function setupPauseHandlers(){
  if(!ysdk) return;
  
  // Пауза при потерѣ фокуса / сворачиваніи вкладки
  window.addEventListener('blur', () => {
    if(ysdk) {
      try { ysdk.adv.hideBannerAdv(); } catch(e){}
    }
  });
  
  // Возобновленіе при возвратѣ фокуса
  window.addEventListener('focus', () => {
    if(ysdk && stickyVisible) {
      try { ysdk.adv.showBannerAdv(); } catch(e){}
    }
  });
}

// ═══ INTERSTITIAL (между уровнями) ═══
function showInterstitial(callback){
  if(!ysdk){
    if(callback) callback(false);
    return;
  }
  const now = Date.now()/1000;
  if(now < adCooldown){
    log('⏳ Interstitial cooldown (' + Math.ceil(adCooldown-now) + 'с)');
    if(callback) callback(false);
    return;
  }
  log('📺 Interstitial...');
  
  // Сообщаемъ SDK о началѣ рекламы (обязательно для Яндексъ)
  try { if(ysdk.features?.GameplayAPI) ysdk.features.GameplayAPI.gameplayStop(); } catch(e){}
  
  ysdk.adv.showFullscreenAdv({
    callbacks:{
      onOpen:()=>{
        hideStickyBanner();
      },
      onClose:(wasShown)=>{
        adCooldown = Date.now()/1000 + AD_COOLDOWN;
        showStickyBanner();
        log(wasShown ? '✓ Interstitial показанъ' : '⚠ Не показанъ');
        if(callback) callback(wasShown);
      },
      onError:(e)=>{
        adCooldown = Date.now()/1000 + AD_COOLDOWN;
        showStickyBanner();
        log('⚠ Interstitial error:', e);
        if(callback) callback(false);
      }
    }
  });
}

// ═══ REWARDED VIDEO (за награду) ═══
function showRewarded(onReward, onFail){
  if(!ysdk){
    // Демо-режимъ: всегда даёмъ награду
    log('🎁 Rewarded (демо)');
    if(onReward) onReward();
    return;
  }
  log('🎁 Rewarded video...');
  hideStickyBanner();
  
  // Сообщаемъ SDK о началѣ рекламы
  try { if(ysdk.features?.GameplayAPI) ysdk.features.GameplayAPI.gameplayStop(); } catch(e){}
  
  ysdk.adv.showRewardedVideo({
    callbacks:{
      onOpen:()=>{
        log('📺 Rewarded открыта');
      },
      onRewarded:()=>{
        log('🎁 Награда получена!');
        adCooldown = Date.now()/1000 + AD_COOLDOWN;
        if(onReward) onReward();
      },
      onClose:(wasShown)=>{
        showStickyBanner();
        log('📺 Rewarded закрыта');
      },
      onError:(e)=>{
        showStickyBanner();
        log('⚠ Rewarded error:', e);
        adCooldown = Date.now()/1000 + AD_COOLDOWN;
        if(onFail) onFail();
      }
    }
  });
}

// ═══ STICKY BANNER ═══
function showStickyBanner(){
  if(!ysdk || !stickyVisible) return;
  try { ysdk.adv.showBannerAdv(); } catch(e){}
}

function hideStickyBanner(){
  if(!ysdk) return;
  try { ysdk.adv.hideBannerAdv(); } catch(e){}
}

function setStickyVisible(v){
  stickyVisible = v;
  if(v) showStickyBanner();
  else hideStickyBanner();
}

// ═══ GAMEPLAY API (требованіе Яндексъ) ═══
function gameplayStart(){
  if(!ysdk || !ysdk.features?.GameplayAPI) return;
  try {
    ysdk.features.GameplayAPI.gameplayStart();
    log('▶ gameplayStart()');
  } catch(e){}
}

function gameplayStop(){
  if(!ysdk || !ysdk.features?.GameplayAPI) return;
  try {
    ysdk.features.GameplayAPI.gameplayStop();
    log('⏸ gameplayStop()');
  } catch(e){}
}

// ═══ IAP: ПОКУПКИ ═══
const PRODUCTS=[
  {id:'coins_100',  name:{ru:'100 монетъ',en:'100 coins',tr:'100 para',zh:'100金币'},price:'49₽',reward:{coins:100}},
  {id:'coins_500',  name:{ru:'500 монетъ',en:'500 coins',tr:'500 para',zh:'500金币'},price:'199₽',reward:{coins:500}},
  {id:'coins_2000', name:{ru:'2000 монетъ',en:'2000 coins',tr:'2000 para',zh:'2000金币'},price:'599₽',reward:{coins:2000}},
  {id:'lives_pack', name:{ru:'+5 жизней',en:'+5 lives',tr:'+5 can',zh:'+5生命'},price:'99₽',reward:{lives:5}},
  {id:'starter',    name:{ru:'Наборъ новичка',en:'Starter pack',tr:'Başlangıç paketi',zh:'新手礼包'},price:'149₽',reward:{coins:300,lives:3,fuel:100}},
  {id:'no_ads',     name:{ru:'Безъ рекламы',en:'No ads',tr:'Reklamsız',zh:'无广告'},price:'299₽',reward:{noAds:true}}
];

function getProducts(){return PRODUCTS;}

async function purchase(productId){
  const prod = PRODUCTS.find(p => p.id === productId);
  if(!prod){
    log('⚠ Product not found:', productId);
    return false;
  }
  
  const lang = window.I18n?.getLang?.() || 'ru';
  const itemName = prod.name[lang] || prod.name.en || prod.name.ru;

  if(!payments){
    // Демо: бесплатная покупка
    applyReward(prod.reward);
    if(window.UI?.toast) window.UI.toast(window.I18n.t('purchaseSuccess', {item:itemName}), 'success');
    return true;
  }
  
  try{
    await payments.purchase({id: productId});
    log('💰 Purchase success:', productId);
    applyReward(prod.reward);
    consumePurchase(productId);
    if(window.UI?.toast) window.UI.toast(window.I18n.t('purchaseSuccess', {item:itemName}), 'success');
    return true;
  }catch(e){
    log('⚠ Purchase error:', e.message);
    if(window.UI?.toast) window.UI.toast(window.I18n.t('purchaseFailed'), 'warn');
    return false;
  }
}

async function consumePurchase(productId){
  if(!payments) return;
  try{
    const purchases = await payments.getPurchases();
    for(const p of purchases){
      if(p.productID === productId) {
        await payments.consumePurchase(p.purchaseToken);
      }
    }
  }catch(e){
    log('⚠ Consume error:', e.message);
  }
}

function applyReward(reward){
  const d = window.Save?.data;
  if(!d) return;
  if(reward.coins) d.coins = (d.coins || 0) + reward.coins;
  
  // Надёжное добавленіе жизней (даже если Lives.js ещё не инициализировался)
  if(reward.lives){
    if(!d.xp) d.xp = {};
    if(!d.xp.lives) d.xp.lives = {date: new Date().toISOString().slice(0,10), crashes: 0};
    d.xp.lives.crashes = Math.max(0, (d.xp.lives.crashes || 0) - reward.lives);
  }
  
  if(reward.fuel) d.fuel = Math.min(100, (d.fuel || 100) + reward.fuel);
  if(reward.noAds){
    if(!d.settings) d.settings = {};
    d.settings.noAds = true;
    setStickyVisible(false);
  }
  window.Save.save();
}

function hasNoAds(){
  return !!window.Save?.data?.settings?.noAds;
}

// ═══ ТОЧКИ ВЫЗОВА РЕКЛАМЫ ═══
function onLevelEnd(win){
  if(hasNoAds()) return;
  // Interstitial послѣ каждого 2-го пройденнаго уровня
  const done = (window.Save?.data?.done || []).length;
  if(done > 0 && done % 2 === 0){
    setTimeout(() => showInterstitial(), 800);
  }
}

// ═══ ЭКСПОРТЪ (теперь настоящая init!) ═══
window.Monetization = {
  init: init,                    // ← ИСПРАВЛЕНО: было init2!
  showInterstitial: showInterstitial,
  showRewarded: showRewarded,
  showStickyBanner: showStickyBanner,
  hideStickyBanner: hideStickyBanner,
  setStickyVisible: setStickyVisible,
  getProducts: getProducts,
  purchase: purchase,
  hasNoAds: hasNoAds,
  onLevelEnd: onLevelEnd,
  gameplayStart: gameplayStart,  // ← НОВОЕ для Flight.js
  gameplayStop: gameplayStop,    // ← НОВОЕ для Flight.js
  PRODUCTS: PRODUCTS
};
})();