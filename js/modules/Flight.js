// ═══ ПОЛЁТЪ: 20 боссовъ + 8 бонусовъ + i18n + монетизація + GameplayAPI ═══
(function(){
'use strict';
const log=(...a)=>{if(window.Logger?.module)window.Logger.module('Flight',...a);};
const t=(k,p)=>window.I18n?window.I18n.t(k,p):k;
let canvas,ctx,W=0,H=0,running=false,paused=false,raf=0,lastT=0;
let levelIndex=0,level=null,M=null,SCROLL=100;
let player,bullets,ebullets,enemies,coins,fuels,cloudsB,cloudsM,cloudsF,boss,exhaust,birds=[],airships=[],flaks=[];
let dist,goal,rival,coinsGot,time,spawnT,coinT,fuelT,propT;
let curDB={list:[],speed:1,ctrl:1,vis:0,burn:0,gust:0},lastChips='';
let input={up:false,down:false,left:false,right:false,fire:false},pointer={active:false,x:0,y:0},listenersOn=false;
let planeImg=null,planeImgKey='',planeMode='vector';
const BOSS_TYPES=['ace','sniper','bomber','swarm','burst','dash'];
const BOSS_COLORS={ace:'#8a2f1d',sniper:'#4a2f6d',bomber:'#2f5a2f',swarm:'#6d4a2f',burst:'#6d2f4a',dash:'#2f4a6d'};
const BOSS_NAMES=['Графъ Обломовъ','Баронъ Штейнъ','Купецъ Брюхатый','Атаманъ Мурка','Князь Вихрь','Генералъ Морозъ','Стальной Коготь','Ночной Визгъ','Громъ-Пушка','Метель-Хозяйка','Шквалъ','Баронъ Мурръ','Адмиралъ Когтей','Желѣзный Мяу','Чёрный Барсъ','Багровый Рыкъ','Серебряный Клыкъ','Золотой Ханъ','Тѣнь Императора','Кото-Императоръ'];
const BOSS_IMGS={};
(function(){const B=['assets/planes/','img/planes/','planes/','assets/',''];
for(let n=1;n<=20;n++)(function(n){let i=0;(function next(){if(i>=B.length)return;
const im=new Image();im.onload=function(){BOSS_IMGS[n]=im;};im.onerror=function(){i++;next();};
im.src=B[i]+'boss'+n+'.png';})();})(n);})();

function calcMods(){const up=window.Save?.data?.up||{};const pl=window.currentPlane?window.currentPlane().st:{speed:1,hp:1,dmg:1,fuel:1};
return{speed:(26+(up.engine||0)*3)*pl.speed,ctrl:260+(up.wings||0)*30,maxhp:(100+(up.fuselage||0)*10)*pl.hp,armor:Math.max(0.4,1-(up.armor||0)*0.08),fuelmax:(100+(up.tank||0)*15)*pl.fuel,firerate:Math.max(0.2,0.5-(up.weapon||0)*0.05),dmg:(10+(up.weapon||0)*4)*pl.dmg};}
function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16&255,g=n>>8&255,b=n&255;if(amt<0){r*=1+amt;g*=1+amt;b*=1+amt;}else{r+=(255-r)*amt;g+=(255-g)*amt;b+=(255-b)*amt;}return `rgb(${r|0},${g|0},${b|0})`;}
function fxOn(){return (window.Save?.data?.settings?.fx)!==false;}
function sky(){switch(level?.w){case 'NIGHT':return['#050a20','#10204a','#2a4a7a'];case 'RAIN':return['#3a4a5a','#6a7a8a','#9aa8b0'];case 'STORM':return['#20262e','#4a545e','#7a848e'];case 'SNOW':case 'BLIZZARD':return['#7a8aa0','#a8b8cc','#d8e0ea'];case 'FOG':return['#6a7a7a','#98a8a8','#c0cccc'];default:return['#1a3a7a','#5a90d0','#ffd08a'];}}
function propAnchors(d){switch(d){case 'murrsky':return[[56,74,0.9]];case 'kogot':return[[80,40,0.8],[140,40,0.8]];case 'lev':return[[62,74,1]];case 'nochnoy':return[[62,74,1]];case 'shturmovik':return[[62,74,1.1]];case 'kurer':return[[52,74,0.8]];default:return[[62,74,1]];}}

function drawPropC(x,y,s){const R=22*s;
  ctx.fillStyle='rgba(60,42,18,.35)';ctx.beginPath();ctx.ellipse(x,y,3*s,R,0,0,7);ctx.fill();
  const bl=Math.sin(propT)*R;
  ctx.strokeStyle='rgba(50,35,15,.85)';ctx.lineWidth=3*s;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(x,y-bl);ctx.lineTo(x,y+bl);ctx.stroke();
  ctx.fillStyle='#d4a84b';ctx.strokeStyle='#6a4510';ctx.lineWidth=1;
  ctx.beginPath();ctx.arc(x,y,4*s,0,7);ctx.fill();ctx.stroke();}

function drawBossPropC(x,y,s){
  const R=26*s;const len=R*Math.abs(Math.sin(propT));const tilt=Math.cos(propT)*2.2*s;
  ctx.fillStyle='rgba(90,60,25,.13)';ctx.beginPath();ctx.ellipse(x,y,3.5*s,R,0,0,7);ctx.fill();
  if(len>2*s){
    ctx.save();ctx.translate(x,y);ctx.rotate(tilt*0.04);
    ctx.strokeStyle='#7a4a1a';ctx.lineWidth=4.5*s;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,-len);ctx.stroke();
    ctx.strokeStyle='rgba(210,160,90,.7)';ctx.lineWidth=1.4*s;
    ctx.beginPath();ctx.moveTo(-1.2*s,0);ctx.lineTo(-1.2*s,-len*0.85);ctx.stroke();
    ctx.strokeStyle='#7a4a1a';ctx.lineWidth=4.5*s;
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,len);ctx.stroke();
    ctx.strokeStyle='rgba(210,160,90,.7)';ctx.lineWidth=1.4*s;
    ctx.beginPath();ctx.moveTo(-1.2*s,0);ctx.lineTo(-1.2*s,len*0.85);ctx.stroke();
    ctx.restore();
    if(len>R*0.45){ctx.fillStyle='#2a1a0a';ctx.beginPath();ctx.arc(x,-len*0.55,1.6*s,0,7);ctx.fill();ctx.beginPath();ctx.arc(x,len*0.4,1.6*s,0,7);ctx.fill();ctx.strokeStyle='rgba(150,70,30,.8)';ctx.lineWidth=0.8*s;ctx.beginPath();ctx.arc(x,-len*0.55,2.6*s,0,7);ctx.stroke();ctx.beginPath();ctx.arc(x,len*0.4,2.6*s,0,7);ctx.stroke();}
  }
  ctx.fillStyle='#c8c8d0';ctx.strokeStyle='#5a5a66';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,4.5*s,0,7);ctx.fill();ctx.stroke();
  ctx.fillStyle='#3a3a44';ctx.beginPath();ctx.arc(x,y,2*s,0,7);ctx.fill();}

function drawCatC(x,y,s){
  ctx.save();ctx.translate(x,y);ctx.scale(s,s);const wv=Math.sin(time*10)*2;
  ctx.strokeStyle='#b82828';ctx.lineWidth=3;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-4,4);ctx.quadraticCurveTo(-12,4+wv,-20,3);ctx.quadraticCurveTo(-26,2-wv,-32,4);ctx.stroke();
  ctx.fillStyle='#d4702a';ctx.beginPath();ctx.arc(0,0,6,0,7);ctx.fill();
  ctx.beginPath();ctx.moveTo(-5,-4);ctx.lineTo(-7,-9);ctx.lineTo(-3,-6);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(1,-4);ctx.lineTo(3,-9);ctx.lineTo(-1,-6);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#a04f15';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-4,-5);ctx.lineTo(-3,-2);ctx.moveTo(2,-5);ctx.lineTo(1,-2);ctx.stroke();
  ctx.fillStyle='#c89840';ctx.strokeStyle='#1a1a1a';ctx.lineWidth=0.8;
  ctx.beginPath();ctx.arc(-2,-1,2,0,7);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(2,-1,2,0,7);ctx.fill();ctx.stroke();
  ctx.restore();}

function planeSprite(){
  const p=window.currentPlane?window.currentPlane():{id:'murma',color:'#e8e8ee',design:'murrsky'};
  const up=window.Save?.data?.up||{};
  if(p.gameData){planeMode='game';const key='game:'+p.id+':'+(window.PLANES_VERSION||0);
    if(planeImgKey!==key){planeImgKey=key;const img=new Image();img.src=p.gameData;planeImg=img;}return planeImg;}
  planeMode='vector';const key=p.id+':'+(window.PLANES_VERSION||0)+JSON.stringify(up);
  if(planeImgKey!==key){planeImgKey=key;
    const svg=window.PlanesSVG.render(p,{sprite:true,noProp:true,mods:{armor:up.armor||0,weapon:up.weapon||0,engine:up.engine||0,tank:up.tank||0}});
    const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);planeImg=img;}
  return planeImg;}

function start(i){
  levelIndex=i||0;
  level=(window.LEVELS||[])[levelIndex]||{n:'Полётъ',y:1909,t:'delivery',w:'CLEAR',dist:10};
  M=calcMods();SCROLL=100+(window.Save?.data?.up?.engine||0)*8;
  planeImgKey='';planeMode='vector';
  log('Машина: '+(window.currentPlane?window.currentPlane().name:'?'));
  window.Powerups?.reset?.();
  window.Achievements?.addFlight?.();
  const app=document.getElementById('app');if(!app)return;
  app.innerHTML=`
  <style>#app{position:fixed!important;inset:0!important;overflow:hidden!important;background:#000;}
  .glass{position:absolute;backdrop-filter:blur(20px) saturate(180%);background:rgba(15,25,45,.35);border:1px solid rgba(255,255,255,.18);border-radius:22px;color:#fff;}
  .pbar{height:6px;background:rgba(255,255,255,.15);border-radius:99px;overflow:hidden;}
  .pfill{height:100%;border-radius:99px;transition:width .2s;}
  .icon-btn{width:44px;height:44px;border-radius:50%;border:none;cursor:pointer;color:#fff;background:rgba(255,255,255,.12);font-size:16px;}
  .db-chip{padding:6px 12px;border-radius:99px;background:rgba(180,60,40,.4);border:1px solid rgba(255,120,90,.45);color:#ffd8c8;font-size:12px;font-weight:600;white-space:nowrap;}</style>
  <canvas id="gameCanvas" style="position:absolute;inset:0;width:100%;height:100%;"></canvas>
  <button id="btnPause" class="glass icon-btn" style="top:16px;left:16px;z-index:3;">❚❚</button>
  <div class="glass" style="top:16px;left:50%;transform:translateX(-50%);padding:10px 22px;z-index:2;text-align:center;min-width:220px;">
    <div style="font-size:12px;font-weight:600;opacity:.9;">${level.n}</div>
    <div class="pbar" style="margin-top:6px;"><div id="barDist" class="pfill" style="width:0%;background:linear-gradient(90deg,#ffd080,#f0a040);"></div></div></div>
  <div class="glass" style="top:16px;right:16px;padding:10px 18px;z-index:2;font-size:15px;font-weight:600;">🪙 <span id="hudCoins">0</span></div>
  <div id="debuffs" style="position:absolute;top:84px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:2;pointer-events:none;flex-wrap:wrap;justify-content:center;"></div>
  <div class="glass" style="bottom:16px;left:16px;right:16px;padding:12px 20px;z-index:2;display:flex;gap:20px;">
    <div style="flex:1;"><div style="font-size:10px;opacity:.7;margin-bottom:4px;">${t('hudFuel')}</div><div class="pbar"><div id="barFuel" class="pfill" style="width:100%;background:linear-gradient(90deg,#7ed957,#4caf50);"></div></div></div>
    <div style="flex:1;"><div style="font-size:10px;opacity:.7;margin-bottom:4px;">${t('hudMotor')}</div><div class="pbar"><div id="barHp" class="pfill" style="width:100%;background:linear-gradient(90deg,#ff6b57,#e05a4a);"></div></div></div></div>
  <button id="btnFire" class="glass" style="right:16px;bottom:96px;width:64px;height:64px;border-radius:50%;font-size:20px;z-index:3;cursor:pointer;color:#fff;">✥</button>
  <div id="overlay" style="position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.4);backdrop-filter:blur(8px);z-index:5;"></div>`;
  canvas=document.getElementById('gameCanvas');ctx=canvas.getContext('2d');resize();
  const startHp=Math.max(30,window.Save?.data?.engine||100);
  const fuelPct=(window.Save?.data?.fuel??100);
  player={x:W*0.25,y:H/2,vy:0,hp:Math.min(startHp,M.maxhp),fuel:M.fuelmax*fuelPct/100,fireCd:0,tilt:0,bob:0};
  bullets=[];ebullets=[];enemies=[];coins=[];fuels=[];exhaust=[];birds=[];airships=[];flaks=[];boss=null;lastChips='';
  curDB={list:[],speed:1,ctrl:1,vis:0,burn:0,gust:0};
  dist=0;goal=level.boss?1e9:level.dist*100;rival=0;coinsGot=0;time=0;spawnT=2;coinT=1.2;fuelT=7;propT=0;
  const mk=(n,d)=>Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H*0.55,d:d*(0.7+Math.random()*0.6),r:20+Math.random()*40}));
  cloudsB=mk(5,0.25);cloudsM=mk(4,0.5);cloudsF=mk(3,1);
  window.Sound?.bossStop?.();
  if(level.boss){const n=Math.floor(levelIndex/3)+1;
    const def=(window.BossRegistry&&window.BossRegistry.get('boss'+n))||null;
    const type=def?def.type:BOSS_TYPES[(n-1)%BOSS_TYPES.length];
    const mult=1+(n-1)*0.18;
    const hpMax=Math.round((def?def.hp:(100+levelIndex*5))*mult);
    boss={x:W-150,y:H/2,hp:hpMax,max:hpMax,t:0,fire:(def?def.rate:1.5)/mult,type,phase:0,phaseT:1,telegraph:0,dashV:0,def:def,num:n,mult:mult};
    if(def&&def.taunt)setTimeout(()=>window.UI?.toast?.(def.taunt,'warn'),600);
    window.Sound?.bossStart?.(n);
    window.Sound?.startBossMusic?.(n);}
  if(!listenersOn){attach();listenersOn=true;}
  window.Sound?.engineStart?.();window.Sound?.engineSet?.(0.5);
  window.Sound?.engineSetHealth?.(1);
  if((window.Save?.data?.settings?.music)!==false&&!level.boss)window.Sound?.musicStart?.();
  // Монетизація: скрыть sticky banner во время полёта
  window.Monetization?.hideStickyBanner?.();
  paused=false;running=true;lastT=performance.now();
  cancelAnimationFrame(raf);raf=requestAnimationFrame(loop);
  setupFire();setupPause();
  
  // ⚠️ Сообщаемъ Yandex SDK о началѣ геймплея (требованіе платформы)
  window.Monetization?.gameplayStart?.();
  
  log('✓ Вылетъ №'+(levelIndex+1));}
function resize(){W=canvas.width=canvas.clientWidth;H=canvas.height=canvas.clientHeight;}

function attach(){
  window.addEventListener('resize',()=>{if(running)resize();});
  window.addEventListener('keydown',e=>{
    if(e.code==='Escape'){e.preventDefault();togglePause();return;}
    if(e.code==='ArrowUp'||e.code==='KeyW')input.up=true;
    if(e.code==='ArrowDown'||e.code==='KeyS')input.down=true;
    if(e.code==='ArrowLeft'||e.code==='KeyA')input.left=true;
    if(e.code==='ArrowRight'||e.code==='KeyD')input.right=true;
    if(e.code==='Space'){e.preventDefault();input.fire=true;}
  });
  window.addEventListener('keyup',e=>{
    if(e.code==='ArrowUp'||e.code==='KeyW')input.up=false;
    if(e.code==='ArrowDown'||e.code==='KeyS')input.down=false;
    if(e.code==='ArrowLeft'||e.code==='KeyA')input.left=false;
    if(e.code==='ArrowRight'||e.code==='KeyD')input.right=false;
    if(e.code==='Space')input.fire=false;
  });
  window.addEventListener('pointerdown',e=>{if(running&&!e.target.closest('button')&&!e.target.closest('.glass')){pointer.active=true;pointer.x=e.clientX;pointer.y=e.clientY;}});
  window.addEventListener('pointermove',e=>{if(pointer.active){pointer.x=e.clientX;pointer.y=e.clientY;}});
  window.addEventListener('pointerup',()=>pointer.active=false);
  window.addEventListener('pointercancel',()=>pointer.active=false);}
function setupFire(){const bf=document.getElementById('btnFire');if(!bf)return;
  bf.addEventListener('pointerdown',e=>{e.preventDefault();input.fire=true;});
  bf.addEventListener('pointerup',()=>input.fire=false);
  bf.addEventListener('pointerleave',()=>input.fire=false);
  bf.addEventListener('pointercancel',()=>input.fire=false);}
function loop(t){if(!running)return;const dt=Math.min(0.033,(t-lastT)/1000);lastT=t;if(!paused)upd(dt);draw();raf=requestAnimationFrame(loop);}

function updateBoss(dt){boss.t+=dt;
  const T=(boss.def&&boss.def.tune)||{};const m=boss.mult||1;
  const bs=(T.bulletSpeed||300)*(1+(m-1)*0.5),sp=T.spread||3,ring=T.ring||8;
  const mi=Math.max(0.7,(T.minion||2.6)/m);const ds=(T.dashMul||1.3)*H*(1+(m-1)*0.4);
  const tg=(T.telegraph||0.7)/Math.sqrt(m);const fr=x=>x/m;
  switch(boss.type){
    case 'ace':boss.y=H/2+Math.sin(boss.t*1.2)*(H*0.3);boss.fire-=dt;if(boss.fire<=0){boss.fire=fr(boss.def?.rate||1.5);for(let k=-(sp>>1);k<=(sp>>1);k++)ebullets.push({x:boss.x-40,y:boss.y+k*16,vx:-bs,vy:k*40});}break;
    case 'sniper':boss.y+=(player.y-boss.y)*Math.min(1,dt*1.5);if(boss.telegraph>0){boss.telegraph-=dt;if(boss.telegraph<=0)ebullets.push({x:boss.x-40,y:boss.y,vx:-(bs+240),vy:0});}else{boss.fire-=dt;if(boss.fire<=0){boss.fire=fr(boss.def?.rate||2.0);boss.telegraph=tg;}}break;
    case 'bomber':boss.y=H/2+Math.sin(boss.t*0.6)*(H*0.35);boss.fire-=dt;if(boss.fire<=0){boss.fire=fr(boss.def?.rate||1.1);ebullets.push({x:boss.x-30,y:boss.y,vx:-bs*0.5,vy:bs*0.5});ebullets.push({x:boss.x-30,y:boss.y,vx:-bs*0.5,vy:-bs*0.5});}break;
    case 'swarm':boss.y=H/2+Math.sin(boss.t*1.0)*(H*0.25);boss.fire-=dt;if(boss.fire<=0){boss.fire=mi;enemies.push({x:boss.x-40,y:boss.y,vx:-(140+Math.random()*60),ph:Math.random()*6,shoot:false});}break;
    case 'burst':boss.y=H/2+Math.sin(boss.t*0.8)*(H*0.2);boss.fire-=dt;if(boss.fire<=0){boss.fire=fr(boss.def?.rate||2.2);for(let a=0;a<ring;a++){const ang=a*(Math.PI*2/ring);ebullets.push({x:boss.x,y:boss.y,vx:Math.cos(ang)*bs*0.7-90,vy:Math.sin(ang)*bs*0.7});}}break;
    case 'dash':boss.phaseT-=dt;if(boss.phase===0){boss.y+=(player.y-boss.y)*Math.min(1,dt*2);if(boss.phaseT<=0){boss.phase=1;boss.phaseT=0.6;boss.dashV=(Math.random()<0.5?-1:1)*ds;}}else{boss.y=Math.max(60,Math.min(H-80,boss.y+boss.dashV*dt));if(Math.random()<dt*18)ebullets.push({x:boss.x-40,y:boss.y,vx:-bs,vy:0});if(boss.phaseT<=0){boss.phase=0;boss.phaseT=1.0;}}break;}
  if(boss.def&&typeof boss.def.update==='function'){boss.def.update(boss,dt,{W,H,player,bullet:(x,y,vx,vy)=>ebullets.push({x,y,vx,vy}),minion:()=>enemies.push({x:boss.x-40,y:boss.y,vx:-150,ph:Math.random()*6,shoot:false})});}}

function upd(dt){
  time+=dt;propT+=dt*40;player.bob+=dt*2;
  if(window.Debuffs?.calc)curDB=window.Debuffs.calc({weather:level.w,hp:player.hp,fuel:player.fuel,fuelmax:M.fuelmax});
  if(curDB.burn>0)player.hp-=curDB.burn*dt;
  const oldY=player.y;
  if(pointer.active){const k=Math.min(1,dt*4);player.x+=(pointer.x-player.x)*k;player.y+=(pointer.y-player.y)*k;}
  else{const v=M.ctrl*curDB.ctrl;if(input.up)player.y-=v*dt;if(input.down)player.y+=v*dt;if(input.left)player.x-=v*dt;if(input.right)player.x+=v*dt;}
  if(curDB.gust>0){player.y+=Math.sin(time*2.7)*curDB.gust*dt;player.x+=Math.cos(time*1.9)*curDB.gust*0.4*dt;}
  player.x=Math.max(60,Math.min(W*0.7,player.x));player.y=Math.max(40,Math.min(H-70,player.y));
  player.tilt+=((player.y-oldY)*0.015-player.tilt)*0.15;
  for(let c of cloudsB)c.x-=SCROLL*0.25*c.d*dt;for(let c of cloudsM)c.x-=SCROLL*0.5*c.d*dt;for(let c of cloudsF)c.x-=SCROLL*1.0*c.d*dt;
  const rec=a=>{for(let c of a)if(c.x<-120){c.x=W+120;c.y=Math.random()*H*0.55;}};rec(cloudsB);rec(cloudsM);rec(cloudsF);
  const pwrSpeedMul=window.Powerups?.speedMul?.()||1;
  dist+=M.speed*curDB.speed*pwrSpeedMul*dt;const duration=goal/M.speed;
  player.fuel-=(M.fuelmax/Math.max(10,duration))*1.05*dt;
  if(input.fire){player.fireCd-=dt;if(player.fireCd<=0){
    if(window.Powerups?.isMegaShot?.()){
      bullets.push({x:player.x+30,y:player.y,vx:600,mega:true});
      bullets.push({x:player.x+30,y:player.y-12,vx:580,mega:true});
      bullets.push({x:player.x+30,y:player.y+12,vx:580,mega:true});
      player.fireCd=M.firerate*0.7;
    }else{bullets.push({x:player.x+30,y:player.y,vx:480});player.fireCd=M.firerate;}
    window.Sound?.shoot?.();}}
  if(fxOn())exhaust.push({x:player.x-28,y:player.y+2,a:0.5,r:3});
  for(let p of exhaust){p.x-=SCROLL*1.2*dt;p.a-=dt*1.2;p.r+=dt*8;}exhaust=exhaust.filter(p=>p.a>0);
  spawnT-=dt;if(spawnT<=0&&!level.boss){
    spawnT=(level.t==='combat'?1.4:2.8)-Math.min(1.2,levelIndex*0.03);
    enemies.push({x:W+40,y:60+Math.random()*(H-160),vx:-(80+Math.random()*50),ph:Math.random()*6,shoot:Math.random()<0.35});

    // Spawn Marketing Impressions Obstacles based on level config
    if(level.obs && level.obs.length > 0) {
      const ob = level.obs[Math.floor(Math.random() * level.obs.length)];
      const yy = 60 + Math.random()*(H-160);
      if(ob === 'birds') {
         // Spawn a flock of fast, fragile birds
         const v = 150 + Math.random()*50;
         birds.push({x: W+40, y: yy, vx: -v, ph: Math.random()*10, hp: 10, dead: false});
         birds.push({x: W+60, y: yy-20, vx: -v, ph: Math.random()*10, hp: 10, dead: false});
         birds.push({x: W+60, y: yy+20, vx: -v, ph: Math.random()*10, hp: 10, dead: false});
      } else if(ob === 'airship') {
         // Tanky slow airship
         airships.push({x: W+100, y: yy, vx: -40, hp: 150, dead: false});
      } else if(ob === 'flak') {
         // Ground-based anti-air, telegraphs an area, then explodes
         flaks.push({x: player.x + 200 + Math.random()*150, y: player.y + (Math.random()*100-50), timer: 2.0, state: 'warn'});
      }
    }
  }

  coinT-=dt;if(coinT<=0){coinT=1.6;const cy=60+Math.random()*(H-160);for(let k=0;k<4;k++)coins.push({x:W+40+k*30,y:cy,ph:k});}
  fuelT-=dt;if(fuelT<=0){fuelT=9;fuels.push({x:W+40,y:60+Math.random()*(H-160)});}
  for(let b of bullets)b.x+=b.vx*dt;bullets=bullets.filter(b=>b.x<W+50);
  const tScale=window.Powerups?.getTimeScale?.()||1;
  const isHidden=window.Powerups?.isStealth?.();
  for(let e of enemies){e.x+=e.vx*dt*tScale-SCROLL*0.3*dt;e.y+=Math.sin(time*2+e.ph)*25*dt*tScale;if(e.shoot&&!isHidden&&Math.random()<dt*0.6*tScale)ebullets.push({x:e.x-20,y:e.y,vx:-240*tScale,vy:0});}
  enemies=enemies.filter(e=>e.x>-60&&!e.dead);
  for(let b of birds) { b.x += b.vx*dt*tScale - SCROLL*0.3*dt; b.y += Math.sin(time*5+b.ph)*15*dt*tScale; }
  birds = birds.filter(b => b.x > -60 && !b.dead);

  for(let a of airships) { a.x += a.vx*dt*tScale - SCROLL*0.3*dt; }
  airships = airships.filter(a => a.x > -150 && !a.dead);

  for(let f of flaks) {
    f.x -= SCROLL*0.5*dt;
    f.timer -= dt;
    if(f.state === 'warn' && f.timer <= 0) { f.state = 'boom'; f.timer = 0.5; window.Sound?.hit?.(); }
    if(f.state === 'boom' && f.timer <= 0) { f.dead = true; }
  }
  flaks = flaks.filter(f => !f.dead);

  for(let b of ebullets){b.x+=b.vx*dt*tScale;b.y+=(b.vy||0)*dt*tScale;}ebullets=ebullets.filter(b=>b.x>-50&&b.y>-50&&b.y<H+50);
  const mr=window.Powerups?.magnetRadius?.()||0;
  if(mr>0){for(let c of coins){const dx=player.x-c.x,dy=player.y-c.y,d=Math.hypot(dx,dy);if(d<mr&&d>1){c.x+=dx/d*300*dt;c.y+=dy/d*300*dt;}}for(let fu of fuels){const dx=player.x-fu.x,dy=player.y-fu.y,d=Math.hypot(dx,dy);if(d<mr&&d>1){fu.x+=dx/d*300*dt;fu.y+=dy/d*300*dt;}}}
  for(let c of coins)c.x-=SCROLL*0.7*dt;coins=coins.filter(c=>c.x>-40&&!c.got);
  for(let fu of fuels)fu.x-=SCROLL*0.7*dt;fuels=fuels.filter(f=>f.x>-40&&!f.got);
  if(window.Powerups?.update)window.Powerups.update(dt,player,W,H,M);
  if(boss)updateBoss(dt);
  const pr=22;const cMul=window.Powerups?.coinMul?.()||1;
  for(let b of bullets){const bDmg=b.mega?M.dmg*2.5:M.dmg;const bRad=b.mega?36:26;
    for(let e of enemies){if(!e.dead&&Math.hypot(b.x-e.x,b.y-e.y)<bRad){e.dead=true;b.x=1e9;coinsGot+=2*cMul;window.Sound?.coin?.();}}
    for(let bi of birds) { if(!bi.dead && Math.hypot(b.x-bi.x, b.y-bi.y) < bRad - 10) { bi.hp -= bDmg; if(bi.hp<=0) { bi.dead=true; coinsGot += Math.floor(1*cMul); window.Sound?.coin?.(); } b.x=1e9; } }
    for(let a of airships) { if(!a.dead && Math.hypot(b.x-a.x, b.y-a.y) < bRad + 20) { a.hp -= bDmg; if(a.hp<=0) { a.dead=true; coinsGot += Math.floor(5*cMul); window.Sound?.coin?.(); } b.x=1e9; } }

    if(boss&&Math.hypot(b.x-boss.x,b.y-boss.y)<(b.mega?56:46)){boss.hp-=bDmg;b.x=1e9;}}
  for(let e of enemies){if(!e.dead&&Math.hypot(e.x-player.x,e.y-player.y)<pr+22){e.dead=true;hit(25);}}
  for(let bi of birds) { if(!bi.dead && Math.hypot(bi.x-player.x, bi.y-player.y) < pr+12) { bi.dead=true; hit(15); } }
  for(let a of airships) { if(!a.dead && Math.hypot(a.x-player.x, a.y-player.y) < pr+40) { a.dead=true; hit(30); } }
  for(let f of flaks) { if(f.state === 'boom' && Math.hypot(f.x-player.x, f.y-player.y) < pr+60) { hit(5 * dt * 60); } }

  for(let b of ebullets){if(Math.hypot(b.x-player.x,b.y-player.y)<pr){b.x=-1e9;hit(10);}}
  for(let c of coins){if(Math.hypot(c.x-player.x,c.y-player.y)<pr+12){c.got=true;coinsGot+=cMul;window.Sound?.coin?.();}}
  for(let fu of fuels){if(Math.hypot(fu.x-player.x,fu.y-player.y)<pr+14){fu.got=true;player.fuel=Math.min(M.fuelmax,player.fuel+25);}}
  if(level.t==='race'){const rivalSpeed=22+(levelIndex*1.5);rival+=rivalSpeed*dt;if(rival>=goal&&dist<goal)return end(false,t('crash'));}
  if(boss&&boss.hp<=0)return end(true,t('victory'));
  if(player.hp<=0)return end(false,t('crash'));
  if(player.fuel<=0)return end(false,t('crash'));
  if(dist>=goal)return end(true,t('victory'));
  const bd=document.getElementById('barDist');if(bd)bd.style.width=(boss?(1-boss.hp/boss.max)*100:Math.min(100,dist/goal*100))+'%';
  const bf=document.getElementById('barFuel');if(bf)bf.style.width=Math.max(0,player.fuel/M.fuelmax*100)+'%';
  const bh=document.getElementById('barHp');if(bh)bh.style.width=Math.max(0,player.hp/M.maxhp*100)+'%';
  window.Sound?.engineSetHealth?.(player.hp/M.maxhp);
  const hc=document.getElementById('hudCoins');if(hc)hc.textContent=coinsGot;
  const chips=document.getElementById('debuffs');
  if(chips){const html=curDB.list.map(d=>`<span class="db-chip">${d.icon} ${d.name}</span>`).join('');if(html!==lastChips){chips.innerHTML=html;lastChips=html;}}}
function hit(d){
  if(window.Powerups?.shielded?.()){if(window.UI?.toast)window.UI.toast(t('shieldAbsorb'),'info');return;}
  player.hp-=d*M.armor;window.Sound?.hit?.();}

function draw(){
  const s=(boss&&boss.def&&boss.def.bg)?boss.def.bg:sky();
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,s[0]);g.addColorStop(0.55,s[1]);g.addColorStop(1,s[2]);
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  if(level.w!=='NIGHT'){const sx=W*0.78,sy=H*0.2;const sg=ctx.createRadialGradient(sx,sy,0,sx,sy,160);sg.addColorStop(0,'rgba(255,240,190,.95)');sg.addColorStop(0.3,'rgba(255,210,130,.5)');sg.addColorStop(1,'rgba(255,200,120,0)');ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sx,sy,160,0,7);ctx.fill();}
  drawHills(0.2,'rgba(90,130,160,.5)',H*0.62,40);drawClouds(cloudsB,0.55);
  drawHills(0.45,'#3a6a4a',H*0.72,60);drawClouds(cloudsM,0.8);
  drawHills(0.8,'#2a4a38',H*0.82,80);drawClouds(cloudsF,1);
  if(fxOn())drawWeather();
  for(let p of exhaust){ctx.fillStyle=`rgba(200,200,200,${p.a*0.4})`;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();}
  for(let c of coins){ctx.fillStyle='#f0c040';ctx.beginPath();ctx.arc(c.x,c.y+Math.sin(time*4+c.ph)*4,9,0,7);ctx.fill();ctx.strokeStyle='#a07818';ctx.stroke();}
  for(let fu of fuels){ctx.fillStyle='#6ab04c';ctx.fillRect(fu.x-8,fu.y-10,16,20);ctx.fillStyle='#fff';ctx.font='10px sans-serif';ctx.fillText('Т',fu.x-3,fu.y+4);}
  ctx.lineCap='round';ctx.lineWidth=3;
  for(let b of bullets){if(b.mega){ctx.strokeStyle='rgba(255,60,40,.95)';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-20,b.y);ctx.stroke();ctx.strokeStyle='rgba(255,200,100,.7)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-16,b.y);ctx.stroke();ctx.lineWidth=3;ctx.strokeStyle='rgba(255,232,128,.9)';}else{ctx.strokeStyle='rgba(255,232,128,.9)';ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-14,b.y);ctx.stroke();}}
  for(let b of ebullets){ctx.fillStyle='rgba(255,90,70,.95)';ctx.beginPath();ctx.arc(b.x,b.y,4,0,7);ctx.fill();}
  if(window.Powerups?.draw)window.Powerups.draw(ctx,time);
  for(let e of enemies){drawShadow(e.x,e.y,1);drawPlane(e.x,e.y,'#5a5a6a',-1,1,0);}
  // --- New Obstacle Draw Logic ---
  for(let b of birds) {
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(b.x + 8, b.y - 4);
    ctx.quadraticCurveTo(b.x, b.y - 8, b.x - 8, b.y);
    ctx.moveTo(b.x + 8, b.y + 4);
    ctx.quadraticCurveTo(b.x, b.y + 8, b.x - 8, b.y);
    ctx.stroke();
  }

  for(let a of airships) {
    drawShadow(a.x, a.y + 40, 1.5);
    // Envelope
    ctx.fillStyle = '#cfd3cd';
    ctx.strokeStyle = '#5c636a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(a.x, a.y, 60, 25, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    // Gondola
    ctx.fillStyle = '#6e5c47';
    ctx.fillRect(a.x - 15, a.y + 25, 30, 10);
    // Tail fins
    ctx.fillStyle = '#852b2b';
    ctx.beginPath();
    ctx.moveTo(a.x + 50, a.y);
    ctx.lineTo(a.x + 70, a.y - 15);
    ctx.lineTo(a.x + 70, a.y + 15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  for(let f of flaks) {
    if(f.state === 'warn') {
       // Telegraph crosshair
       ctx.strokeStyle = `rgba(255, 60, 40, ${0.5 + 0.5 * Math.sin(time*15)})`;
       ctx.lineWidth = 2;
       ctx.beginPath();
       ctx.arc(f.x, f.y, 40, 0, Math.PI*2);
       ctx.moveTo(f.x - 50, f.y); ctx.lineTo(f.x + 50, f.y);
       ctx.moveTo(f.x, f.y - 50); ctx.lineTo(f.x, f.y + 50);
       ctx.stroke();
    } else if(f.state === 'boom') {
       // Explosion
       const progress = 1 - (f.timer / 0.5); // 0 to 1
       ctx.fillStyle = `rgba(40, 40, 40, ${1 - progress})`;
       ctx.beginPath();
       ctx.arc(f.x, f.y, 60 * progress, 0, Math.PI*2);
       ctx.fill();
       ctx.fillStyle = `rgba(255, 120, 40, ${1 - progress})`;
       ctx.beginPath();
       ctx.arc(f.x, f.y, 40 * progress, 0, Math.PI*2);
       ctx.fill();
    }
  }
  // -------------------------------

  if(boss){
    if(boss.type==='sniper'&&boss.telegraph>0){ctx.strokeStyle=`rgba(255,60,40,${0.4+0.4*Math.sin(time*20)})`;ctx.lineWidth=2;ctx.setLineDash([8,6]);ctx.beginPath();ctx.moveTo(boss.x-40,boss.y);ctx.lineTo(0,boss.y);ctx.stroke();ctx.setLineDash([]);}
    drawShadow(boss.x,boss.y,1.8);
    const bimg=BOSS_IMGS[boss.num];const bsc=(boss.def&&boss.def.size)||1.8;const bw=130*bsc,bh=bw*(140/220);
    if(bimg&&bimg.complete&&bimg.naturalWidth>0){ctx.drawImage(bimg,boss.x-bw/2,boss.y-bh/2,bw,bh);const bp=(boss.def&&boss.def.prop)||[35,50,0.85];const bpx=boss.x-bw*(bp[0]/100);const bpy=boss.y+bh*((bp[1]-50)/100);drawBossPropC(bpx,bpy,bsc*bp[2]);}
    else{drawPlane(boss.x,boss.y,(boss.def&&boss.def.color)||BOSS_COLORS[boss.type]||'#8a2f1d',-1,bsc,0);}
    ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(boss.x-50,boss.y-74,100,8);
    ctx.fillStyle='#e05a4a';ctx.fillRect(boss.x-50,boss.y-74,100*(boss.hp/boss.max),8);
    ctx.fillStyle='#fff';ctx.font='12px "IM Fell English SC",serif';ctx.textAlign='center';
    ctx.fillText('♛ '+((boss.def&&boss.def.name)||BOSS_NAMES[boss.num-1]||level.boss)+' · ×'+(boss.mult||1).toFixed(1),boss.x,boss.y-82);ctx.textAlign='left';}
  drawShadow(player.x,player.y,1);
  const pl=window.currentPlane?window.currentPlane():{color:'#e8e8ee',size:1,design:'murrsky'};
  const img=planeSprite();const w=130*pl.size,h=w*(140/220);
  ctx.save();ctx.translate(player.x,player.y+Math.sin(player.bob)*2);ctx.rotate(player.tilt);
  if(window.Powerups?.isStealth?.()){ctx.globalAlpha=0.3+Math.sin(time*10)*0.15;}
  if(img.complete&&img.naturalWidth>0)ctx.drawImage(img,-w/2,-h/2,w,h);
  ctx.globalAlpha=1;
  const props=planeMode==='game'?(pl.props||[[200,70,1]]):planeMode==='vector'?propAnchors(pl.design||'murrsky'):[];
  for(const a of props){const lx=(a[0]-110)/220*w,ly=(a[1]-70-10)/140*h;drawPropC(lx,ly,a[2]*(w/130));}
  if(planeMode==='game'){const ck=pl.cockpit||[115,58];const lx=(ck[0]-110)/220*w,ly=(ck[1]-70)/140*h;drawCatC(lx,ly,w/130);}
  ctx.restore();
  if(curDB.burn>0){ctx.fillStyle=`rgba(255,${(120+Math.random()*80)|0},40,.75)`;ctx.beginPath();ctx.arc(player.x-20,player.y+4,5+Math.random()*5,0,7);ctx.fill();}
  if(curDB.vis>0){const r=Math.max(90,H*(1.05-curDB.vis));const vg=ctx.createRadialGradient(player.x,player.y,r*0.35,player.x,player.y,r);vg.addColorStop(0,'rgba(8,12,20,0)');vg.addColorStop(1,`rgba(8,12,20,${0.35+curDB.vis*0.5})`);ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);}
  const v=ctx.createRadialGradient(W/2,H/2,H*0.4,W/2,H/2,H*0.9);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.35)');ctx.fillStyle=v;ctx.fillRect(0,0,W,H);}
function drawShadow(x,y,sc){const gy=H-26;const hFrac=Math.max(0,Math.min(1,(gy-y)/(H*0.7)));const size=(46-hFrac*26)*sc;ctx.fillStyle=`rgba(0,0,0,${Math.max(0.05,0.3-hFrac*0.2)})`;ctx.beginPath();ctx.ellipse(x,gy,size,size*0.22,0,0,7);ctx.fill();}
function drawHills(sp,col,base,amp){ctx.fillStyle=col;ctx.beginPath();const off=(dist*sp*4)%240;ctx.moveTo(-240,H);for(let x=-240;x<W+240;x+=240){ctx.quadraticCurveTo(x+120-off,base-amp,x+240-off,base);}ctx.lineTo(W+240,H);ctx.closePath();ctx.fill();}
function drawClouds(a,op){ctx.fillStyle=`rgba(255,255,255,${0.35*op+0.2})`;for(let c of a){ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,7);ctx.arc(c.x+c.r*0.7,c.y+6,c.r*0.7,0,7);ctx.fill();}}
function drawWeather(){const w=level.w;
  if(w==='RAIN'||w==='STORM'){ctx.strokeStyle='rgba(200,220,255,.4)';ctx.lineWidth=1;for(let i=0;i<40;i++){const x=(i*53+time*300)%W,y=(i*97+time*450)%H;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-4,y+12);ctx.stroke();}}
  if(w==='SNOW'||w==='BLIZZARD'){ctx.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<40;i++){const x=(i*61+time*50)%W,y=(i*89+time*100)%H;ctx.beginPath();ctx.arc(x,y,2,0,7);ctx.fill();}}
  if(w==='FOG'){ctx.fillStyle='rgba(200,210,210,.3)';ctx.fillRect(0,0,W,H);}}
function drawPlane(x,y,col,face,sc,tilt){
  sc=sc||1;ctx.save();ctx.translate(x,y);ctx.rotate((tilt||0)*face);ctx.scale(face*sc,sc);
  const bank=Math.min(0.35,Math.abs(tilt||0));ctx.scale(1,1-bank*0.25);
  const bodyG=ctx.createLinearGradient(0,-12,0,12);bodyG.addColorStop(0,shade(col,0.45));bodyG.addColorStop(0.5,col);bodyG.addColorStop(1,shade(col,-0.45));
  const wingG=ctx.createLinearGradient(0,-18,0,10);wingG.addColorStop(0,shade(col,0.55));wingG.addColorStop(1,shade(col,-0.2));
  ctx.save();ctx.translate(0,2.5);ctx.fillStyle=shade(col,-0.55);ctx.fillRect(-26,-16,52,6);ctx.fillRect(-22,4,44,5);ctx.beginPath();ctx.ellipse(0,0,26,8,0,0,7);ctx.fill();ctx.restore();
  ctx.fillStyle=wingG;ctx.fillRect(-26,-16,52,6);ctx.fillRect(-22,4,44,5);
  ctx.strokeStyle=shade(col,-0.5);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-14,-10);ctx.lineTo(-12,4);ctx.moveTo(14,-10);ctx.lineTo(12,4);ctx.stroke();
  ctx.fillStyle=bodyG;ctx.beginPath();ctx.ellipse(0,0,26,8,0,0,7);ctx.fill();
  ctx.beginPath();ctx.moveTo(-24,-2);ctx.lineTo(-34,-12);ctx.lineTo(-26,-2);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.ellipse(2,-4,18,3,0,0,7);ctx.fill();
  const cg=ctx.createLinearGradient(0,-10,0,0);cg.addColorStop(0,'#7ab0e0');cg.addColorStop(1,'#2a4578');ctx.fillStyle=cg;ctx.beginPath();ctx.ellipse(2,-6,8,5,0,0,7);ctx.fill();
  ctx.strokeStyle=shade(col,-0.5);ctx.beginPath();ctx.moveTo(-8,8);ctx.lineTo(-6,16);ctx.moveTo(8,8);ctx.lineTo(10,16);ctx.stroke();
  ctx.fillStyle='#222';ctx.beginPath();ctx.arc(-6,17,4,0,7);ctx.fill();ctx.beginPath();ctx.arc(10,17,4,0,7);ctx.fill();
  const pg=ctx.createRadialGradient(27,0,0,27,0,16);pg.addColorStop(0,'rgba(60,42,18,.5)');pg.addColorStop(1,'rgba(60,42,18,0)');ctx.fillStyle=pg;ctx.beginPath();ctx.ellipse(27,0,4,16,0,0,7);ctx.fill();
  ctx.strokeStyle='rgba(60,42,18,.7)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(27,0,3,14,propT,0,7);ctx.stroke();
  ctx.restore();}

// ═══ ПАУЗА (i18n + GameplayAPI) ═══
function togglePause(){
  if(!running)return;
  paused=!paused;
  const bp=document.getElementById('btnPause');
  if(bp) bp.textContent=paused?'▶':'❚❚';
  window.Sound?.engineSet?.(paused?0:0.5);
  
  // ⚠️ Останавливаемъ/возобновляемъ геймплей для Yandex SDK
  if(paused) {
    window.Monetization?.gameplayStop?.();
  } else {
    window.Monetization?.gameplayStart?.();
  }
  
  showPauseOverlay(paused);
}

function showPauseOverlay(show){
  let ov=document.getElementById('pauseOverlay');
  if(show){
    if(!ov){ov=document.createElement('div');ov.id='pauseOverlay';ov.style.cssText='position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);z-index:10;';document.getElementById('app').appendChild(ov);}
    ov.style.display='flex';
    ov.innerHTML=`<div style="background:linear-gradient(180deg,rgba(26,53,104,.97),rgba(10,31,68,.98));border:1px solid rgba(212,168,75,.4);border-radius:20px;padding:32px 36px;text-align:center;max-width:340px;width:85%;box-shadow:0 16px 50px rgba(0,0,0,.5);">
      <div style="font-family:'IM Fell English SC',serif;font-size:28px;color:#f0d080;margin-bottom:6px;">${t('pause')}</div>
      <div style="font-size:13px;color:rgba(250,244,232,.5);margin-bottom:24px;">${t('pauseDesc')}</div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <button id="pauseResume" style="padding:14px 28px;border:none;border-radius:99px;background:linear-gradient(180deg,#ffd080,#d4a84b);color:#1a0f00;font-weight:700;font-size:15px;cursor:pointer;font-family:'IM Fell English SC',serif;letter-spacing:.08em;">${t('resume')}</button>
        <button id="pauseHangar" style="padding:12px 24px;border:1px solid rgba(255,255,255,.25);border-radius:99px;background:rgba(255,255,255,.08);color:#faf4e8;font-size:14px;cursor:pointer;font-family:'IM Fell English SC',serif;letter-spacing:.06em;">${t('toHangar')}</button>
        <button id="pauseMap" style="padding:12px 24px;border:1px solid rgba(255,255,255,.15);border-radius:99px;background:transparent;color:rgba(250,244,232,.6);font-size:13px;cursor:pointer;font-family:'IM Fell English SC',serif;">${t('toMap')}</button>
      </div>
      <div style="margin-top:16px;font-size:11px;color:rgba(250,244,232,.3);font-family:'Cormorant Garamond',serif;">${t('escHint')}</div>
    </div>`;
    document.getElementById('pauseResume').onclick=()=>{togglePause();};
    document.getElementById('pauseHangar').onclick=()=>{exitToScreen('hangar');};
    document.getElementById('pauseMap').onclick=()=>{exitToScreen('map');};
  }else{if(ov)ov.style.display='none';}}

function exitToScreen(screenName){
  running=false;cancelAnimationFrame(raf);
  
  // ⚠️ Останавливаемъ геймплей для Yandex SDK
  window.Monetization?.gameplayStop?.();
  
  window.Sound?.engineStop?.();window.Sound?.bossStop?.();
  const d=window.Save?.data;
  if(d&&player){d.engine=Math.max(10,Math.round(player.hp));d.fuel=Math.max(0,Math.round(player.fuel/M.fuelmax*100));window.Save.save();}
  const pov=document.getElementById('pauseOverlay');if(pov)pov.remove();
  // Монетизація: показать sticky banner при выходѣ
  window.Monetization?.showStickyBanner?.();
  if(window.Screens?.show)window.Screens.show(screenName);}

function setupPause(){const bp=document.getElementById('btnPause');if(bp)bp.onclick=()=>{togglePause();};}

// ═══ END: ПОБѢДА / АВАРІЯ + ЖИЗНИ + РАНГИ + МОНЕТИЗАЦІЯ + GameplayAPI ═══
function end(win,reason){
  running=false;cancelAnimationFrame(raf);
  
  // ⚠️ Останавливаемъ геймплей для Yandex SDK
  window.Monetization?.gameplayStop?.();
  
  const pov=document.getElementById('pauseOverlay');if(pov)pov.remove();
  window.Sound?.engineStop?.();window.Sound?.bossStop?.();
  if(win)window.Sound?.win?.();else window.Sound?.lose?.();
  // Монетизація: показать sticky banner послѣ полёта
  window.Monetization?.showStickyBanner?.();
  const d=window.Save?.data;
  if(d){d.engine=Math.max(10,Math.round(player.hp));d.fuel=Math.max(0,Math.round(player.fuel/M.fuelmax*100));
    if(win){
      if(!d.done)d.done=[];if(!d.done.includes(levelIndex))d.done.push(levelIndex);
      const stars=1+(player.hp>60?1:0)+(player.fuel>M.fuelmax*0.35?1:0);
      if(!d.stars)d.stars={};d.stars[levelIndex]=Math.max(d.stars[levelIndex]||0,stars);
      const reward=20+levelIndex*3+(level.boss?50:0)+coinsGot;d.coins=(d.coins||0)+reward;
      window.Save.save();window.Journal?.add?.(levelIndex,level,stars);
      const perfect=player.hp>M.maxhp*0.8;
      window.Achievements?.addWin?.(perfect);
      if(level.boss)window.Achievements?.addBoss?.();
      window.Tournament?.addScore?.(coinsGot+(level.boss?100:0)+Math.floor(player.hp));
      setTimeout(()=>window.Achievements?.checkAll?.(),300);
      setTimeout(()=>window.Ranks?.checkPromotion?.(),600);
      // Монетизація: interstitial послѣ побѣды
      setTimeout(()=>window.Monetization?.onLevelEnd?.(true),800);
      showEnd(true,reason||t('victory'),stars,reward);
    }else{
      window.Lives?.recordCrash?.();
      window.Save.save();
      // Монетизація: interstitial послѣ пораженія
      setTimeout(()=>window.Monetization?.onLevelEnd?.(false),800);
      if(!window.Lives?.canFly?.()){window.Lives?.showNoLivesScreen?.();return;}
      showEnd(false,reason||t('crash'),0,coinsGot);
    }}
  else showEnd(win,reason||t('crash'),0,0);}

function showEnd(win,reason,stars,reward){
  const ov=document.getElementById('overlay');if(!ov)return;ov.style.display='flex';
  const livesLeft=window.Lives?.getRemaining?.()??9;const livesMax=window.Lives?.MAX_LIVES||9;
  ov.innerHTML=`<div class="glass" style="position:relative;padding:34px 40px;text-align:center;max-width:420px;border-radius:28px;">
    <div style="font-family:'IM Fell English SC',serif;font-size:32px;background:linear-gradient(180deg,#ffe8b0,#d4a84b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:700;">${win?t('victory'):t('crash')}</div>
    <div style="font-size:14px;opacity:.8;margin:8px 0 14px;">${reason}</div>
    ${win?`<div style="font-size:26px;color:#ffd080;margin-bottom:8px;">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><div style="font-size:15px;margin-bottom:18px;">🪙 +${reward}</div>`:`<div style="font-size:13px;opacity:.7;margin-bottom:8px;">${t('motorDamaged')}</div><div style="font-size:14px;margin-bottom:18px;color:${livesLeft<=3?'#ff8a80':'#ffd080'};">❤️ ${t('livesLeft')}: <b>${livesLeft}</b>/${livesMax}</div>`}
    <div style="display:flex;gap:10px;justify-content:center;">
      ${win?`<button id="btnNext" style="padding:12px 26px;border:none;border-radius:99px;background:linear-gradient(180deg,#ffd080,#d4a84b);color:#1a0f00;font-weight:700;cursor:pointer;">${t('next')}</button><button id="btnMap" style="padding:12px 26px;border:1px solid rgba(255,255,255,.3);border-radius:99px;background:rgba(255,255,255,.1);color:#fff;cursor:pointer;">${t('toMapEnd')}</button>`
           :`<button id="btnRetry" style="padding:12px 26px;border:none;border-radius:99px;background:linear-gradient(180deg,#ffd080,#d4a84b);color:#1a0f00;font-weight:700;cursor:pointer;">${t('retry')}</button><button id="btnHangar" style="padding:12px 26px;border:1px solid rgba(255,255,255,.3);border-radius:99px;background:rgba(255,255,255,.1);color:#fff;cursor:pointer;">${t('toHangarEnd')}</button>`}
    </div></div>`;
  const nx=document.getElementById('btnNext'),rt=document.getElementById('btnRetry'),mp=document.getElementById('btnMap'),hg=document.getElementById('btnHangar');
  if(nx)nx.onclick=()=>{ov.style.display='none';start(levelIndex+1);};
  if(rt)rt.onclick=()=>{ov.style.display='none';start(levelIndex);};
  if(mp)mp.onclick=()=>{ov.style.display='none';window.Sound?.engineStop?.();window.Sound?.bossStop?.();if(window.Screens?.show)window.Screens.show('map');};
  if(hg)hg.onclick=()=>{ov.style.display='none';window.Sound?.engineStop?.();window.Sound?.bossStop?.();if(window.Screens?.show)window.Screens.show('hangar');};}
function stop(){running=false;cancelAnimationFrame(raf);window.Sound?.engineStop?.();window.Sound?.bossStop?.();}
function init(){log('Движокъ полёта готовъ (20 боссовъ + 8 бонусовъ + i18n + монетизація + GameplayAPI)');return Promise.resolve();}
window.Flight={init,start,stop};
})();