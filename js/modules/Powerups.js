// ═══ БОНУСЫ ВЪ ПОЛЁТѢ (8 типовъ: щитъ, магнитъ, ремонтъ, ускореніе, двойныя монеты, замедленіе, мега-выстрѣлъ, невидимость) ═══
(function(){
'use strict';
const log=(...a)=>{if(window.Logger?.module)window.Logger.module('Powerups',...a);};
const t=(k,p)=>window.I18n?window.I18n.t(k,p):k;

const TYPES={
  shield:   {icon:'🛡️',color:'#5ac8fa',dur:8,  labelKey:'powerupShield'},
  magnet:   {icon:'🧲',color:'#ff9500',dur:10, labelKey:'powerupMagnet'},
  repair:   {icon:'🔧',color:'#34c759',dur:0,  labelKey:'powerupRepair'},
  boost:    {icon:'⚡',color:'#ffcc00',dur:6,  labelKey:'powerupBoost'},
  double:   {icon:'💰',color:'#ffd700',dur:10, labelKey:'powerupDouble'},
  slowmo:   {icon:'⏱️',color:'#bf5af2',dur:5,  labelKey:'powerupSlowmo'}, // Добавлена иконка
  mega:     {icon:'💥',color:'#ff3b30',dur:6,  labelKey:'powerupMega'},
  stealth:  {icon:'👻',color:'#8e8e93',dur:7,  labelKey:'powerupStealth'}
};

let active=[];
let items=[];
let spawnT=0;
let megaShot=false;
let timeScale=1;

function reset(){active=[];items=[];spawnT=4+Math.random()*4;megaShot=false;timeScale=1;}

function spawn(W,H){
  const keys=Object.keys(TYPES);
  // Взвѣшенный выборъ: repair и shield чуть чаще
  const weights={shield:2,magnet:1.5,repair:2,boost:1,double:1.2,slowmo:0.8,mega:0.7,stealth:0.8};
  let total=0;for(const k of keys)total+=(weights[k]||1);
  let r=Math.random()*total;
  let type=keys[0];
  for(const k of keys){r-=(weights[k]||1);if(r<=0){type=k;break;}}
  items.push({x:W+30,y:50+Math.random()*(H-140),type,ph:Math.random()*6,vy:(Math.random()-0.5)*30,bob:Math.random()*6});
}

function update(dt,player,W,H,M){
  // Замедленіе времени
  const hasSlowmo=has('slowmo');
  timeScale=hasSlowmo?0.4:1;

  spawnT-=dt;
  if(spawnT<=0){spawnT=7+Math.random()*6;spawn(W,H);}

  for(const it of items){it.x-=110*dt;it.y+=Math.sin(it.ph+performance.now()/500)*18*dt;}
  items=items.filter(it=>it.x>-40);

  for(const a of active)a.tLeft-=dt;
  const expired=active.filter(a=>a.tLeft<=0);
  active=active.filter(a=>a.tLeft>0);
  // Сбросъ мега-выстрѣла при истеченіи
  if(expired.some(a=>a.type==='mega'))megaShot=false;

  const pr=28;
  for(const it of items){
    if(Math.hypot(it.x-player.x,it.y-player.y)<pr+14){
      it.got=true;
      apply(it.type,player,M);
      window.Sound?.coin?.();
    }
  }
  items=items.filter(it=>!it.got);
}

function apply(type,player,M){
  const def=TYPES[type];
  if(!def)return;
  if(type==='repair'){
    player.hp=Math.min(M.maxhp,player.hp+30);
    if(window.UI?.toast)window.UI.toast(t('powerupRepairMsg'),'success');
  }else{
    active=active.filter(a=>a.type!==type);
    active.push({type,tLeft:def.dur});
    if(type==='mega')megaShot=true;
    if(window.UI?.toast){
      const name=t(def.labelKey);
      // Опредѣляемъ сокращеніе секундъ въ зависимости отъ языка
      const lang=window.I18n?.getLang?.()||'ru';
      const sec=lang==='ru'?'с':(lang==='tr'?'sn':'s');
      window.UI.toast(`${def.icon} ${name} (${def.dur}${sec})`,'info');
    }
  }
}

function has(type){return active.some(a=>a.type===type);}
function magnetRadius(){return has('magnet')?200:0;}
function speedMul(){return has('boost')?1.5:1;}
function shielded(){return has('shield');}
function coinMul(){return has('double')?2:1;}
function isMegaShot(){return megaShot;}
function isStealth(){return has('stealth');}
function getTimeScale(){return timeScale;}

function draw(ctx,time){
  // Бонусы на картѣ
  for(const it of items){
    const def=TYPES[it.type];
    if(!def)continue;
    const bob=Math.sin(time*3+it.ph)*5;
    const pulse=1+Math.sin(time*5+it.bob)*0.1;
    ctx.save();
    ctx.shadowColor=def.color;ctx.shadowBlur=16;
    // Фонъ
    ctx.fillStyle=def.color+'33';
    ctx.beginPath();ctx.arc(it.x,it.y+bob,16*pulse,0,7);ctx.fill();
    // Кольцо
    ctx.strokeStyle=def.color;ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(it.x,it.y+bob,14*pulse,0,7);ctx.stroke();
    // Иконка
    ctx.shadowBlur=0;
    ctx.fillStyle='#fff';ctx.font='16px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(def.icon,it.x,it.y+bob);
    ctx.restore();
  }

  // Индикаторы активныхъ бонусовъ (верхъ экрана)
  let ix=80;
  for(const a of active){
    const def=TYPES[a.type];
    if(!def)continue;
    const pct=a.tLeft/def.dur;
    // Фонъ
    ctx.fillStyle='rgba(0,0,0,.55)';
    roundRect(ctx,ix,10,64,24,6);ctx.fill();
    // Полоска
    ctx.fillStyle=def.color+'88';
    roundRect(ctx,ix,10,64*pct,24,6);ctx.fill();
    // Рамка
    ctx.strokeStyle=def.color+'66';ctx.lineWidth=1;
    roundRect(ctx,ix,10,64,24,6);ctx.stroke();
    // Текстъ (иконка + время)
    const lang=window.I18n?.getLang?.()||'ru';
    const sec=lang==='ru'?'с':(lang==='tr'?'sn':'s');
    ctx.fillStyle='#fff';ctx.font='11px sans-serif';ctx.textAlign='left';ctx.textBaseline='middle';
    ctx.fillText(`${def.icon} ${Math.ceil(a.tLeft)}${sec}`,ix+5,22);
    ix+=70;
  }
  ctx.textAlign='left';ctx.textBaseline='alphabetic';

  // Эффектъ замедленія — фіолетовая рамка
  if(has('slowmo')){
    ctx.strokeStyle='rgba(191,90,242,.4)';ctx.lineWidth=4;
    ctx.strokeRect(2,2,ctx.canvas.width-4,ctx.canvas.height-4);
  }

  // Эффектъ невидимости — мерцаніе
  if(has('stealth')){
    ctx.fillStyle=`rgba(142,142,147,${0.05+Math.sin(time*8)*0.03})`;
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
  }
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

function init(){log('✓ Бонусы въ полётѣ готовы (8 типовъ)');return Promise.resolve();}

window.Powerups={init,reset,update,draw,has,magnetRadius,speedMul,shielded,coinMul,isMegaShot,isStealth,getTimeScale,TYPES};
})();