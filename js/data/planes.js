// ═══ КАТАЛОГЪ 6 машинъ (картинки носомъ вправо + котъ въ кабинѣ) ═══
(function() {
  'use strict';
  const log=(...a)=>{if(window.Logger?.module)window.Logger.module('Planes',...a);};
  window.PLANES_VERSION=0;
  window.PLANES=[
    {id:'murma',name:'«Мурр-Скай»',design:'murrsky',img:'murrsky.png',img2:'murrsky_dmg1.png',img3:'murrsky_dmg2.png',game:'murrsky_game.png',props:[[170,70,0.9]],cockpit:[110,58],cost:0,premium:false,color:'#e8e8ee',size:0.95,lore:'Вашъ вѣрный бипланъ. Пари заключено на условіи, что Вы облетите міръ не мѣняя борта.',st:{speed:1.0,hp:1.0,dmg:1.0,fuel:1.0}}
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
    'murma': {
      name: {en:'Murra-Sky', tr:'Murra-Sky', zh:'穆拉天鹰'},
      lore: {en:'Your faithful biplane. The bet is to fly around the world without changing aircraft.', tr:'Sadık çift kanatlı uçağınız. İddia, uçağı değiştirmeden dünyayı dolaşmaktır.', zh:'您忠实的双翼机。赌注是不换飞机飞越世界。'}
    }
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