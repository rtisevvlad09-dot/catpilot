// ═══ КАТАЛОГЪ 6 машинъ (картинки носомъ вправо + котъ въ кабинѣ) ═══
(function() {
  'use strict';
  const log=(...a)=>{if(window.Logger?.module)window.Logger.module('Planes',...a);};
  window.PLANES_VERSION=0;
  window.PLANES=[
    {id:'murma',name:'«Мурр-Скай»',design:'murrsky',img:'murrsky.png',img2:'murrsky_dmg1.png',img3:'murrsky_dmg2.png',game:'murrsky_game.png',props:[[170,70,0.9]],cockpit:[110,58],cost:0,premium:false,color:'#e8e8ee',size:0.95,lore:'Лёгкій развѣдчикъ.',st:{speed:1.15,hp:0.85,dmg:1,fuel:1.1}},
    {id:'kogot',name:'«Коготь-1»',design:'kogot',img:'kogot.png',img2:'kogot_dmg1.png',img3:'kogot_dmg2.png',game:'kogot_game.png',props:[[165,77,0.9]],cockpit:[110,50],cost:6000,premium:false,color:'#1a1a1a',size:1.35,lore:'Тяжёлый бипланъ.',st:{speed:0.8,hp:1.6,dmg:1.4,fuel:1.3}},
    {id:'lev',name:'«Золотой Левъ»',design:'lev',img:'lev.png',img2:'lev_dmg1.png',img3:'lev_dmg2.png',game:'lev_game.png',props:[[173,71,1]],cockpit:[100,55],cost:5000,premium:false,color:'#5a2f8a',size:1.05,lore:'Флагманъ.',st:{speed:1.1,hp:1.1,dmg:1.15,fuel:1}},
    {id:'nochnoy',name:'«Ночной Коготь»',design:'nochnoy',img:'nochnoy.png',img2:'nochnoy_dmg1.png',img3:'nochnoy_dmg2.png',game:'nochnoy_game.png',props:[[182,73,1]],cockpit:[100,55],cost:0,premium:true,rub:299,color:'#7a1a2a',size:1,lore:'Ночной перехватчикъ.',st:{speed:1.2,hp:0.9,dmg:1.25,fuel:0.9}},
    {id:'shturmovik',name:'«Пушистый Штурмовикъ»',design:'shturmovik',img:'shturmovik.png',img2:'shturmovik_dmg1.png',img3:'shturmovik_dmg2.png',game:'shturmovik_game.png',props:[[181,71,1.1]],cockpit:[100,49],cost:8000,premium:false,color:'#5a6a3a',size:1.2,lore:'Штурмовикъ.',st:{speed:0.85,hp:1.5,dmg:1.35,fuel:1.2}},
    {id:'kurer',name:'«Императорскій Курьеръ»',design:'kurer',img:'kurer.png',img2:'kurer_dmg1.png',img3:'kurer_dmg2.png',game:'kurer_game.png',props:[[180,70,0.8]],cockpit:[98,50],cost:0,premium:true,rub:499,color:'#d8d8e0',size:0.9,lore:'Гоночный курьеръ.',st:{speed:1.35,hp:0.75,dmg:0.9,fuel:0.85}}
  ];
  window.getPlane=id=>window.PLANES.find(p=>p.id===id)||window.PLANES[0];
  window.currentPlane=()=>window.getPlane(window.Save?.data?.plane||window.PLANES[0].id);
  const BASES=['assets/planes/','img/planes/','planes/','assets/',''];
  function loadKey(p,key){
    const f=p[key]; if(!f)return;
    let i=0;
    (function next(){
      if(i>=BASES.length){p[key+'Data']=null;log('✗ '+key+': '+f+' — НЕ НАЙДЕНЪ');return;}
      const im=new Image();
      im.onload=function(){p[key+'Data']=im.src;window.PLANES_VERSION++;log('✓ '+key+': '+f);};
      im.onerror=function(){i++;next();};
      im.src=BASES[i]+f;
    })();
  }
  window.PLANES.forEach(p=>{['game','img','img2','img3'].forEach(k=>loadKey(p,k));});

  // ═══ ЛОКАЛИЗАЦІЯ НАЗВАНІЙ И ОПИСАНІЙ САМОЛЁТОВЪ (RU/EN/TR/ZH) ═══
  const PLANE_LOCALE = {
    'murma':      { name:{en:'Murra-Sky',        tr:'Murra-Sky',              zh:'穆拉天鹰'},     lore:{en:'Light scout.',             tr:'Hafif keşif uçağı.',      zh:'轻型侦察机。'}},
    'kogot':      { name:{en:'Claw-1',           tr:'Pençe-1',                zh:'利爪-1'},       lore:{en:'Heavy biplane.',         tr:'Ağır çift kanatlı.',      zh:'重型双翼机。'}},
    'lev':        { name:{en:'Golden Lion',      tr:'Altın Aslan',            zh:'金狮'},         lore:{en:'Flagship.',            tr:'Amiral gemisi.',          zh:'旗舰。'}},
    'nochnoy':    { name:{en:'Night Claw',       tr:'Gece Pençesi',           zh:'夜爪'},         lore:{en:'Night interceptor.',   tr:'Gece avcısı.',            zh:'夜间拦截机。'}},
    'shturmovik': { name:{en:'Fluffy Sturmovik', tr:'Tüylü Saldırı Uçağı',    zh:'绒毛攻击机'},   lore:{en:'Attack aircraft.',     tr:'Saldırı uçağı.',          zh:'攻击机。'}},
    'kurer':      { name:{en:'Imperial Courier', tr:'İmparatorluk Kuryesi',   zh:'帝国信使'},     lore:{en:'Racing courier.',      tr:'Yarış kuryesi.',          zh:'竞速信使。'}}
  };

  window.PLANES.forEach(function(p){
    const dict = PLANE_LOCALE[p.id];
    if(!dict) return;

    const origName = p.name;
    const origLore = p.lore;

    Object.defineProperty(p, 'name', {
      configurable: true,
      enumerable: true,
      get: function(){
        const lang = window.I18n?.getLang?.() || 'ru';
        if (lang === 'ru') return origName;
        return (dict.name && dict.name[lang]) || dict.name?.en || origName;
      }
    });

    Object.defineProperty(p, 'lore', {
      configurable: true,
      enumerable: true,
      get: function(){
        const lang = window.I18n?.getLang?.() || 'ru';
        if (lang === 'ru') return origLore;
        return (dict.lore && dict.lore[lang]) || dict.lore?.en || origLore;
      }
    });
  });

  log('✓ каталогъ готовъ (+ i18n для 6 самолётовъ)');
})();