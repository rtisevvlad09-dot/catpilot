// ═══ ТОРГОВЫЕ РЯДЫ (Улучшенія + Самолёты + Бустеры + Золото) (i18n) ═══
(function() {
  'use strict';
  const log=(...a)=>{try{window.Logger?.module?.('Shop',...a);}catch(e){}};
  const t=(k,p)=>window.I18n?window.I18n.t(k,p):k;
  
  let activeTab='up';
  const UPG=[
    {key:'engine',name:'Двигатель',base:150,max:5,desc:'Мощность и надёжность',lore:'Моторъ „Мурма-Мерлинъ" съ поршнями изъ альпійскаго дуба. Дубъ гаситъ вибрацію — тянетъ ровнѣе.'},
    {key:'wings',name:'Крылья',base:200,max:5,desc:'Подъёмная сила',lore:'Двойной перкаль съ аэролакомъ держитъ профиль даже въ штормъ.'},
    {key:'tank',name:'Бакъ',base:120,max:5,desc:'Объёмъ топлива',lore:'Лужёная жесть съ клёпанымъ швомъ не даётъ бензину сочиться.'},
    {key:'armor',name:'Броня',base:250,max:5,desc:'Защита отъ пуль',lore:'Златоустовская сталь: пуля скользитъ, не пробивая.'},
    {key:'fuselage',name:'Фюзеляжъ',base:180,max:5,desc:'Прочность корпуса',lore:'Карельская берёза на рыбьемъ клею держитъ ударъ.'},
    {key:'weapon',name:'Вооруженіе',base:220,max:5,desc:'Уронъ оружія',lore:'Синхронный „Максимъ-Кото" стрѣляетъ сквозь винтъ.'}
  ];
  const cost=(u,l)=>Math.floor((u.base||u.cost||100)*(l+1));
  window.UPGRADES=UPG; window.UpgCost=cost;

  function generateStars(n){let s='';for(let i=0;i<n;i++){const x=Math.random()*100,y=Math.random()*100,z=Math.random()*2+1,d=Math.random()*5,u=Math.random()*3+2;s+=`<div style="position:absolute;left:${x}%;top:${y}%;width:${z}px;height:${z}px;background:rgba(240,208,128,${Math.random()*0.5+0.2});border-radius:50%;animation:starTwinkle ${u}s ease-in-out ${d}s infinite;pointer-events:none;"></div>`;}return s;}
  const fmt=n=>n>=1000?(n/1000).toFixed(1).replace('.',',')+'к':(n||0).toLocaleString(window.I18n?.getLang?.()==='ru'?'ru-RU':'en-US');
  
  function getData(){
    const SD=window.ShopData||{SKINS:[],BOOSTS:[],GOLD:[]};
    const d=window.Save?.data||{};
    if(!d.skins)d.skins=['standard']; if(!d.skin)d.skin='standard';
    if(!d.boost)d.boost={}; if(!d.up)d.up={};
    if(!d.planes)d.planes=[(window.PLANES&&window.PLANES[0].id)||'murma'];
    return{SD,d};
  }

  function upCard(u,d){
    const lvl=d.up[u.key]||0, maxed=lvl>=u.max, c=cost(u,lvl), can=(d.coins||0)>=c;
    return `<div style="background:linear-gradient(180deg,rgba(212,168,75,.1),rgba(212,168,75,.03));border:1px solid rgba(212,168,75,.25);border-radius:10px;padding:18px;backdrop-filter:blur(12px);display:flex;flex-direction:column;gap:10px;">
      <div style="display:flex;justify-content:space-between;">
        <span style="font-family:'IM Fell English SC',serif;font-size:18px;color:#f0d080;">${u.name}</span>
        <span style="font-size:12px;color:rgba(240,208,128,.7);border:1px solid rgba(212,168,75,.3);border-radius:999px;padding:3px 10px;">${t('upgraded')} ${lvl}/${u.max}</span>
      </div>
      <div style="font-size:12px;color:rgba(250,244,232,.55);font-family:'Cormorant Garamond',serif;font-style:italic;">${u.desc}</div>
      <div style="height:6px;background:rgba(255,255,255,.08);border-radius:999px;overflow:hidden;"><div style="height:100%;width:${lvl/u.max*100}%;background:linear-gradient(90deg,#d4a84b,#f0d080);"></div></div>
      <button class="shop-btn" data-up="${u.key}" data-cost="${c}" ${maxed||!can?'disabled':''} style="width:100%;padding:12px;border-radius:6px;font-family:'IM Fell English SC',serif;font-size:14px;letter-spacing:.1em;text-transform:uppercase;cursor:${maxed?'not-allowed':'pointer'};border:1px solid;${maxed?'background:rgba(120,200,120,.1);color:rgba(120,200,120,.7);border-color:rgba(120,200,120,.3);':can?'background:linear-gradient(180deg,rgba(212,168,75,.2),rgba(212,168,75,.08));color:#f0d080;border-color:rgba(212,168,75,.4);':'background:rgba(255,255,255,.03);color:rgba(240,208,128,.3);border-color:rgba(212,168,75,.1);'}">${maxed?t('maxed'):can?`${t('upgrade')} · ${c}`:t('notEnoughCoins')}</button>
      <button class="lore-btn" data-lore="${u.key}" style="width:100%;padding:8px;border-radius:6px;font-family:'IM Fell English SC',serif;font-size:12px;background:transparent;color:rgba(212,168,75,.6);border:1px dashed rgba(212,168,75,.3);cursor:pointer;">${t('readLore')}</button>
    </div>`;
  }

  function planeCard(p,d){
    const owned=(d.planes||['murma']).includes(p.id), sel=(d.plane||'murma')===p.id, can=(d.coins||0)>=p.cost;
    const S=window.PlanesSVG||{render:()=>'',statRow:()=>''};
    return `<div style="background:linear-gradient(180deg,rgba(212,168,75,.1),rgba(212,168,75,.03));border:1px solid ${sel?'rgba(120,200,120,.5)':'rgba(212,168,75,.25)'};border-radius:10px;padding:16px;backdrop-filter:blur(12px);">
      <div style="height:96px;background:radial-gradient(ellipse at 50% 30%, rgba(255,255,255,.1), rgba(0,0,0,.2));border-radius:8px;margin-bottom:10px;">${S.render(p,{shop:true})}</div>
      <div style="font-family:'IM Fell English SC',serif;font-size:16px;color:#f0d080;">${p.name} ${p.premium?'💎':''}</div>
      <div style="display:flex;gap:6px;margin:8px 0;">
        <button class="shop-btn" data-planemore="${p.id}" style="flex:1;padding:9px;border-radius:6px;font-family:'IM Fell English SC',serif;font-size:12px;background:rgba(255,255,255,.06);color:rgba(240,208,128,.8);border:1px dashed rgba(212,168,75,.4);cursor:pointer;">${t('details')}</button>
      </div>
      <button class="shop-btn" data-plane="${p.id}" ${sel?'disabled':''} style="width:100%;padding:11px;border-radius:6px;font-family:'IM Fell English SC',serif;font-size:13px;text-transform:uppercase;cursor:${sel?'not-allowed':'pointer'};border:1px solid;${sel?'background:rgba(120,200,120,.1);color:rgba(120,200,120,.7);border-color:rgba(120,200,120,.3);':owned?'background:rgba(120,180,255,.12);color:#a8d0ff;border-color:rgba(120,180,255,.4);':p.premium?'background:linear-gradient(180deg,#7a4a9a,#5a2f7d);color:#e8d0ff;border-color:rgba(200,150,255,.5);':can?'background:linear-gradient(180deg,rgba(212,168,75,.2),rgba(212,168,75,.08));color:#f0d080;border-color:rgba(212,168,75,.4);':'background:rgba(255,255,255,.03);color:rgba(240,208,128,.3);border-color:rgba(212,168,75,.1);'}">${sel?t('selected'):owned?t('take'):p.premium?`💎 ${p.rub} ₽`:can?`${t('buy')} · ${p.cost}`:t('notEnoughCoins')}</button>
    </div>`;
  }

  function showPlaneModal(p){
    let m=document.getElementById('planeModal'); 
    if(!m){m=document.createElement('div');m.id='planeModal';m.style.cssText='position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:24px;';document.body.appendChild(m);}
    const S=window.PlanesSVG||{render:()=>'',statRow:()=>''};
    const d=window.Save?.data||{};
    const owned=(d.planes||['murma']).includes(p.id), sel=(d.plane||'murma')===p.id, can=(d.coins||0)>=p.cost;
    m.innerHTML=`<div class="pb" style="position:absolute;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(8px);"></div>
      <div style="position:relative;max-width:640px;width:100%;background:linear-gradient(180deg,rgba(26,53,104,.97),rgba(10,31,68,.98));border:1px solid rgba(212,168,75,.4);border-radius:16px;padding:26px 30px;box-shadow:0 20px 60px rgba(0,0,0,.6);color:#faf4e8;max-height:90vh;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <div style="font-family:'IM Fell English SC',serif;font-size:24px;color:#f0d080;">${p.name} ${p.premium?'💎':''}</div>
          <button class="pc" style="background:none;border:none;color:rgba(250,244,232,.6);font-size:22px;cursor:pointer;">✕</button>
        </div>
        <div style="height:220px;background:radial-gradient(ellipse at 50% 30%, rgba(255,255,255,.12), rgba(0,0,0,.25));border-radius:12px;margin-bottom:14px;">${S.render(p,{shop:true})}</div>
        <div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:14px;color:rgba(250,244,232,.7);margin-bottom:14px;">${p.lore}</div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:16px;">
          ${S.statRow(t('speed'),p.st.speed)}${S.statRow(t('durability'),p.st.hp)}${S.statRow(t('damage'),p.st.dmg)}${S.statRow(t('tank'),p.st.fuel)}
        </div>
        <button class="pbuy" ${sel?'disabled':''} style="width:100%;padding:13px;border-radius:8px;font-family:'IM Fell English SC',serif;font-size:15px;text-transform:uppercase;cursor:${sel?'not-allowed':'pointer'};border:1px solid;${sel?'background:rgba(120,200,120,.1);color:rgba(120,200,120,.7);border-color:rgba(120,200,120,.3);':owned?'background:rgba(120,180,255,.12);color:#a8d0ff;border-color:rgba(120,180,255,.4);':p.premium?'background:linear-gradient(180deg,#7a4a9a,#5a2f7d);color:#e8d0ff;border-color:rgba(200,150,255,.5);':can?'background:linear-gradient(180deg,#f5dfa0,#d4a84b 45%,#a67c2e);color:#1a0f00;font-weight:700;border-color:rgba(255,235,160,.6);':'background:rgba(255,255,255,.03);color:rgba(240,208,128,.3);border-color:rgba(212,168,75,.1);'}">${sel?t('selected'):owned?t('take'):p.premium?`💎 ${p.rub} ₽`:can?`${t('buy')} · ${p.cost}`:t('notEnoughCoins')}</button>
      </div>`;
    m.style.display='flex';
    const close=()=>m.style.display='none';
    m.querySelector('.pb').onclick=close; m.querySelector('.pc').onclick=close;
    m.querySelector('.pbuy').onclick=()=>{
      if(!d.planes)d.planes=[(window.PLANES&&window.PLANES[0].id)||'murma'];
      if(d.planes.includes(p.id)){
        d.plane=p.id; window.Save.save(); window.Sound?.click?.(); window.UI?.toast?.(t('planeChanged'),'success');
      } else if(p.premium){
        d.planes.push(p.id); d.plane=p.id; window.Save.save(); window.Sound?.coin?.(); window.UI?.toast?.(t('purchaseSuccess',{item:p.name}),'success');
      } else if((d.coins||0)>=p.cost){
        d.coins-=p.cost; d.planes.push(p.id); d.plane=p.id; window.Save.save(); window.Sound?.coin?.(); window.UI?.toast?.(t('purchaseSuccess',{item:p.name}),'success');
      } else {
        window.UI?.toast?.(t('notEnough'),'warn'); return;
      }
      close(); renderShop();
    };
    window.Sound?.click?.();
  }

  function showLoreModal(u){
    let m=document.getElementById('loreModal');
    if(!m){m=document.createElement('div');m.id='loreModal';m.style.cssText='position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:24px;';document.body.appendChild(m);}
    m.innerHTML=`<div class="lb" style="position:absolute;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(6px);"></div>
      <div style="position:relative;max-width:560px;width:100%;background:#e3d3ae;color:#3d2b16;border:2px solid #3d2b16;outline:1px solid #3d2b16;outline-offset:3px;border-radius:6px;padding:34px 38px;box-shadow:0 20px 60px rgba(0,0,0,.6);font-family:'Cormorant Garamond',serif;">
        <div style="text-align:center;border-bottom:1.5px solid #3d2b16;padding-bottom:16px;margin-bottom:20px;">
          <div style="font-size:11px;letter-spacing:.3em;opacity:.7;">${t('masterNotes')}</div>
          <div style="font-family:'IM Fell English SC',serif;font-size:28px;margin-top:8px;">${u.name}</div>
        </div>
        <div style="font-size:18px;line-height:1.7;font-style:italic;min-height:100px;">„${u.lore}"</div>
        <div style="text-align:right;"><button class="lc" style="background:rgba(61,43,22,.08);border:1.5px solid #3d2b16;color:#3d2b16;padding:10px 24px;border-radius:4px;font-family:'IM Fell English SC',serif;cursor:pointer;">${t('close')}</button></div>
      </div>`;
    m.style.display='flex';
    const close=()=>m.style.display='none';
    m.querySelector('.lb').onclick=close; m.querySelector('.lc').onclick=close;
    window.Sound?.click?.();
  }

  function boostCard(b,d){
    const c=d.boost[b.id]||0, can=(d.coins||0)>=b.cost;
    return `<div style="background:linear-gradient(180deg,rgba(212,168,75,.1),rgba(212,168,75,.03));border:1px solid rgba(212,168,75,.25);border-radius:10px;padding:18px;backdrop-filter:blur(12px);">
      <div style="display:flex;justify-content:space-between;">
        <span style="font-family:'IM Fell English SC',serif;font-size:16px;color:#f0d080;">${b.name}</span>
        <span style="font-size:12px;color:rgba(240,208,128,.7);border:1px solid rgba(212,168,75,.3);border-radius:999px;padding:3px 10px;">× ${c}</span>
      </div>
      <div style="font-size:12px;color:rgba(250,244,232,.5);margin:6px 0 12px;">${b.desc}</div>
      <button class="shop-btn" data-boost="${b.id}" data-cost="${b.cost}" ${can?'':'disabled'} style="width:100%;padding:11px;border-radius:6px;font-family:'IM Fell English SC',serif;font-size:13px;text-transform:uppercase;cursor:${can?'pointer':'not-allowed'};border:1px solid;${can?'background:linear-gradient(180deg,rgba(212,168,75,.2),rgba(212,168,75,.08));color:#f0d080;border-color:rgba(212,168,75,.4);':'background:rgba(255,255,255,.03);color:rgba(240,208,128,.3);border-color:rgba(212,168,75,.1);'}">${t('buy')} · ${b.cost}</button>
    </div>`;
  }

  function goldCard(g){
    return `<div style="background:linear-gradient(180deg,rgba(212,168,75,.15),rgba(212,168,75,.04));border:1px solid rgba(212,168,75,.4);border-radius:10px;padding:18px;text-align:center;">
      <div style="font-family:'IM Fell English SC',serif;font-size:24px;color:#f0d080;">${fmt(g.coins)}</div>
      <div style="font-size:12px;color:rgba(250,244,232,.5);margin-bottom:12px;">${t('coins')}</div>
      <button class="shop-btn" data-gold="${g.coins}" style="width:100%;padding:11px;border-radius:6px;font-family:'IM Fell English SC',serif;font-size:14px;font-weight:700;cursor:pointer;border:1px solid rgba(255,235,160,.6);background:linear-gradient(180deg,#f5dfa0,#d4a84b 45%,#a67c2e);color:#1a0f00;">${g.rub} ₽</button>
    </div>`;
  }

  function renderShop(){
    try{
      const app=document.getElementById('app'); if(!app)return;
      const {SD,d}=getData();
      const tabs=[
        {id:'up', label:t('upgrades')},
        {id:'boosts', label:t('boosters')},
        {id:'gold', label:t('gold')}
      ];
      let content='';
      if(activeTab==='up') content=UPG.map(u=>upCard(u,d)).join('');
      else if(activeTab==='boosts') content=(SD.BOOSTS||[]).map(b=>boostCard(b,d)).join('');
      else if(activeTab==='gold') content=(SD.GOLD||[]).map(g=>goldCard(g)).join('');
      else content='';

      app.innerHTML=`
        <style>
          #app{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;overflow:hidden!important;display:block!important;}
          @keyframes starTwinkle{0%,100%{opacity:.2;}50%{opacity:1;}}
          @keyframes fadeIn{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
          .back-btn{display:inline-flex;padding:10px 20px;border-radius:4px;font-family:'IM Fell English SC',serif;font-size:13px;letter-spacing:.12em;text-transform:uppercase;background:transparent;color:rgba(240,208,128,.7);border:1px solid rgba(212,168,75,.25);cursor:pointer;}
          .stat-chip{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.06);border:1px solid rgba(212,168,75,.2);border-radius:999px;padding:8px 16px;font-size:12px;color:rgba(250,244,232,.85);}
          .stat-chip b{color:#f0d080;}
          .tab-btn{padding:12px 22px;border-radius:4px;font-family:'IM Fell English SC',serif;font-size:14px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border:1px solid;transition:all .25s;}
          .tab-btn:hover{transform:translateY(-1px);}
          .shop-btn:not(:disabled):hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(212,168,75,.3);}
          .lore-btn:hover{color:#f0d080!important;border-color:rgba(212,168,75,.6)!important;}
        </style>
        <div style="position:fixed;inset:0;z-index:-3;background:radial-gradient(ellipse at 30% 30%, #1a3568 0%, #0a1f44 40%, #05102a 100%);"></div>
        <div style="position:fixed;inset:0;z-index:-2;overflow:hidden;pointer-events:none;">${generateStars(40)}</div>
        <div style="position:fixed;inset:0;z-index:-1;background:radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.75) 100%);pointer-events:none;"></div>
        <div style="position:fixed;inset:0;display:flex;flex-direction:column;z-index:1;">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:24px 32px 12px;flex-wrap:wrap;gap:12px;">
            <button class="back-btn" data-go="menu">${t('back')}</button>
            <span class="stat-chip">🪙 <b>${fmt(d.coins||0)}</b></span>
          </div>
          <div style="text-align:center;padding:0 24px 20px;">
            <div style="font-size:11px;color:#d4a84b;letter-spacing:.2em;text-transform:uppercase;margin-bottom:8px;font-family:'IM Fell English SC',serif;">${t('imperialFleet')}</div>
            <h1 style="font-family:'IM Fell English SC',serif;font-size:clamp(28px,4.5vw,48px);color:#faf4e8;margin:0;">${t('marketplace')}</h1>
          </div>
          <div style="display:flex;justify-content:center;gap:8px;padding:0 24px 24px;flex-wrap:wrap;">
            ${tabs.map(tab=>`<button class="tab-btn" data-tab="${tab.id}" style="${activeTab===tab.id?'background:linear-gradient(180deg,#f5dfa0,#d4a84b 45%,#a67c2e);color:#1a0f00;font-weight:700;border-color:rgba(255,235,160,.6);':'background:rgba(255,255,255,.05);color:rgba(240,208,128,.7);border-color:rgba(212,168,75,.25);'}">${tab.label}</button>`).join('')}
          </div>
          <div style="flex:1;overflow-y:auto;padding:0 24px 48px;">
            <div style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;animation:fadeIn .6s ease-out;">${content}</div>
          </div>
        </div>`;
      setup(); log('✓ Ряды отрисованы');
    }catch(e){log('Ошибка: '+e.message);console.error(e);}
  }

  function setup(){
    const {SD,d}=getData();
    document.querySelector('[data-go="menu"]').onclick=()=>{window.Sound?.click?.();window.Screens?.show?.('menu');};
    document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{window.Sound?.click?.();activeTab=b.getAttribute('data-tab');renderShop();});
    document.querySelectorAll('[data-lore]').forEach(b=>b.onclick=()=>{const u=UPG.find(x=>x.key===b.getAttribute('data-lore'));if(u)showLoreModal(u);});
    document.querySelectorAll('[data-planemore]').forEach(b=>b.onclick=()=>{
      const p=(window.PLANES||[]).find(x=>x.id===b.getAttribute('data-planemore')); if(p)showPlaneModal(p);
    });
    document.querySelectorAll('[data-plane]').forEach(b=>b.onclick=()=>{
      const id=b.getAttribute('data-plane'); const p=(window.PLANES||[]).find(x=>x.id===id); if(!p)return;
      if(!d.planes)d.planes=[(window.PLANES&&window.PLANES[0].id)||'murma'];
      if(d.planes.includes(id)){
        d.plane=id; window.Save.save(); window.Sound?.click?.(); window.UI?.toast?.(t('planeChanged'),'success');
      } else if(p.premium){
        d.planes.push(id); d.plane=id; window.Save.save(); window.Sound?.coin?.(); window.UI?.toast?.(t('purchaseSuccess',{item:p.name}),'success');
      } else if((d.coins||0)>=p.cost){
        d.coins-=p.cost; d.planes.push(id); d.plane=id; window.Save.save(); window.Sound?.coin?.(); window.UI?.toast?.(t('purchaseSuccess',{item:p.name}),'success');
      } else {
        window.UI?.toast?.(t('notEnough'),'warn'); return;
      }
      renderShop();
    });
    document.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{
      const k=b.getAttribute('data-up'), c=+b.getAttribute('data-cost'); const u=UPG.find(x=>x.key===k); const l=d.up[k]||0;
      if(u && l<u.max && (d.coins||0)>=c){
        d.coins-=c; d.up[k]=l+1; window.Save.save(); window.Sound?.coin?.(); window.UI?.toast?.(`${u.name}: ${t('upgraded')} ${l+1}!`,'success'); renderShop();
      } else {
        window.UI?.toast?.(t('notEnough'),'warn');
      }
    });
    document.querySelectorAll('[data-boost]').forEach(b=>b.onclick=()=>{
      const id=b.getAttribute('data-boost'), c=+b.getAttribute('data-cost');
      if((d.coins||0)>=c){
        d.coins-=c; d.boost[id]=(d.boost[id]||0)+1; window.Save.save(); window.Sound?.coin?.(); window.UI?.toast?.(t('purchaseSuccess',{item:b.textContent}),'success'); renderShop();
      } else {
        window.UI?.toast?.(t('notEnough'),'warn');
      }
    });
    document.querySelectorAll('[data-gold]').forEach(b=>b.onclick=()=>{
      const c=+b.getAttribute('data-gold'); d.coins=(d.coins||0)+c; window.Save.save(); window.Sound?.coin?.(); window.UI?.toast?.(`+${fmt(c)}! (демо)`,'success'); renderShop();
    });
  }

  if(window.Screens?.register){window.Screens.register('shop',renderShop);log('Ряды зарегистрированы');}
  if(window.Events?.on)window.Events.on('screen:changed',n=>{if(n==='shop')setTimeout(renderShop,100);},'ShopScreen');
})();