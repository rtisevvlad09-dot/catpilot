// ═══ РЕНДЕРЪ: магазинъ/ангаръ=картинки(съ винтомъ), игра=game/векторъ ═══
(function() {
  'use strict';
  const log=(...a)=>{if(window.Logger?.module)window.Logger.module('PlaneAsset',...a);};
  let _u=0; const uid=()=>'p'+(++_u);
  function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16&255,g=n>>8&255,b=n&255;
    if(amt<0){r*=1+amt;g*=1+amt;b*=1+amt;}else{r+=(255-r)*amt;g+=(255-g)*amt;b+=(255-b)*amt;}return `rgb(${r|0},${g|0},${b|0})`;}

  function getCondition(){
    const e=window.Save?.data?.engine||100;
    if(e>=75)return{level:'excellent',label:'Отличное',color:'#8bc34a',percent:e};
    if(e>=45)return{level:'good',label:'Лёгкія поврежденія',color:'#ffc107',percent:e};
    return{level:'critical',label:'Критическія поврежденія',color:'#f44336',percent:e};
  }

  function renderPlaneSVG(p,o){
    o=o||{};
    const c=p.color||'#a63a30'; const id=uid(); const cx=110, cy=74;

    // ═══ Картинки (съ винтомъ) для магазина/ангара; игра (noProp) → game/векторъ ═══
    if(!o.noProp){
      const dd=o.shop?0:(o.damage||0);
      let sd=null;
      if(dd===0&&p.imgData)sd=p.imgData;
      else if(dd===1&&p.img2Data)sd=p.img2Data;
      else if(dd>=2&&p.img3Data)sd=p.img3Data;
      if(sd){
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 140" width="100%" height="100%" preserveAspectRatio="xMidYMid meet"><image href="${sd}" x="5" y="5" width="210" height="130" preserveAspectRatio="xMidYMid meet"/></svg>`;
      }
    }

    // ═══ Простой векторный фолбэкъ ═══
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 140" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <defs><linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(c,0.5)}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${shade(c,-0.5)}"/></linearGradient></defs>
      ${o.sprite?'':'<ellipse cx="110" cy="128" rx="80" ry="7" fill="rgba(0,0,0,.3)"/>'}
      <path d="M156 68 L178 50 L170 70 Z" fill="${shade(c,-0.2)}" stroke="${shade(c,-0.55)}"/>
      <path d="M156 78 L174 90 L166 80 Z" fill="${shade(c,-0.2)}" opacity=".9"/>
      <ellipse cx="${cx}" cy="${cy}" rx="48" ry="12" fill="url(#${id}b)" stroke="${shade(c,-0.6)}" stroke-width="1.5"/>
      <rect x="58" y="58" width="104" height="7" rx="3.5" fill="${shade(c,0.3)}" stroke="${shade(c,-0.55)}"/>
      <rect x="70" y="88" width="84" height="6" rx="3" fill="${shade(c,0.1)}" stroke="${shade(c,-0.55)}"/>
      <line x1="86" y1="64" x2="84" y2="90" stroke="${shade(c,-0.6)}" stroke-width="2"/>
      <line x1="136" y1="64" x2="134" y2="90" stroke="${shade(c,-0.6)}" stroke-width="2"/>
      <path d="M104 62 L112 54 L114 63 Z" fill="#2a4578"/>
      <circle cx="104" cy="59" r="6" fill="#3a2a1a"/>
      <circle cx="102" cy="57" r="1.6" fill="#c89840"/><circle cx="106" cy="57" r="1.6" fill="#c89840"/>
      <line x1="92" y1="86" x2="90" y2="110" stroke="${shade(c,-0.6)}" stroke-width="2.5"/>
      <line x1="124" y1="86" x2="126" y2="110" stroke="${shade(c,-0.6)}" stroke-width="2.5"/>
      <circle cx="90" cy="114" r="7" fill="#221a10"/><circle cx="90" cy="114" r="2.4" fill="#d4a84b"/>
      <circle cx="126" cy="114" r="7" fill="#221a10"/><circle cx="126" cy="114" r="2.4" fill="#d4a84b"/>
      ${o.noProp?'':`<g><animateTransform attributeName="transform" type="rotate" from="0 60 74" to="360 60 74" dur="0.25s" repeatCount="indefinite"/><ellipse cx="60" cy="74" rx="3" ry="20" fill="#8a5a2a"/><ellipse cx="60" cy="74" rx="20" ry="3" fill="#8a5a2a" opacity=".7"/></g><circle cx="60" cy="74" r="4" fill="#d4a84b" stroke="#6a4510"/>`}
    </svg>`;
  }

  function statRow(label,v){const w=Math.round(Math.max(5,Math.min(100,((v-0.6)/1.0)*100)));
    return `<div style="display:flex;align-items:center;gap:8px;font-size:11px;color:rgba(250,244,232,.6);"><span style="width:70px;">${label}</span><div style="flex:1;height:5px;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden;"><div style="height:100%;width:${w}%;background:linear-gradient(90deg,#d4a84b,#f0d080);"></div></div></div>`;}

  window.PlanesSVG={render:(p,o)=>renderPlaneSVG(p,o),statRow};
  window.PlaneAsset={
    getCondition,
    render(condition){
      const cond=condition||getCondition();
      const d=window.Save?.data||{}; 
      const p=window.currentPlane?window.currentPlane():{color:'#e8e8ee',design:'murrsky'};
      const damage=cond.percent<45?2:cond.percent<75?1:0;
      return renderPlaneSVG(p,{damage});
    }
  };
  log('✓ Рендеръ готовъ (картинки + векторъ)');
})();