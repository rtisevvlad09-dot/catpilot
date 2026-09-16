// ═══ ЗВУКИ И МУЗЫКА (Web Audio API, процедурные, громкіе) ═══
(function(){
'use strict';
const log=(...a)=>{if(window.Logger?.module)window.Logger.module('Sound',...a);};
let actx=null;
let masterGain=null;
let musicGain=null;
let sfxGain=null;
let engineOsc=null;
let engineOsc2=null;
let engineGain=null;
let engineNoise=null;
let engineNoiseGain=null;
let engineSputterInterval=null;
let engineHealth=1;
let musicInterval=null;
let bossMusicInterval=null;
let muted=false;
let musicOn=true;
let userVolume=1.0;

function getCtx(){
  if(!actx){
    actx=new (window.AudioContext||window.webkitAudioContext)();
    masterGain=actx.createGain();masterGain.gain.value=userVolume;masterGain.connect(actx.destination);
    musicGain=actx.createGain();musicGain.gain.value=0.5;musicGain.connect(masterGain);
    sfxGain=actx.createGain();sfxGain.gain.value=1.0;sfxGain.connect(masterGain);
  }
  if(actx.state==='suspended')actx.resume();
  return actx;
}

// ═══ ЗВУКОВЫЕ ЭФФЕКТЫ ═══
function playTone(freq,dur,type,vol,dest){
  try{
    const c=getCtx();
    const o=c.createOscillator();
    const g=c.createGain();
    o.type=type||'square';
    o.frequency.setValueAtTime(freq,c.currentTime);
    g.gain.setValueAtTime(Math.min(1,vol||0.5),c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+dur);
    o.connect(g);g.connect(dest||sfxGain);
    o.start(c.currentTime);o.stop(c.currentTime+dur);
  }catch(e){}
}

function playNoise(dur,vol,dest,freq){
  try{
    const c=getCtx();
    const buf=c.createBuffer(1,c.sampleRate*dur,c.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1);
    const src=c.createBufferSource();src.buffer=buf;
    const g=c.createGain();
    g.gain.setValueAtTime(Math.min(1,vol||0.4),c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+dur);
    const flt=c.createBiquadFilter();flt.type='lowpass';flt.frequency.value=freq||1500;
    src.connect(flt);flt.connect(g);g.connect(dest||sfxGain);
    src.start(c.currentTime);src.stop(c.currentTime+dur);
  }catch(e){}
}

function shoot(){
  if(muted)return;
  playTone(900,0.07,'square',0.3);
  playTone(450,0.05,'sawtooth',0.22);
  playNoise(0.04,0.15,null,3000);
}

function coin(){
  if(muted)return;
  playTone(1400,0.1,'sine',0.35);
  setTimeout(()=>playTone(1800,0.12,'sine',0.3),50);
  setTimeout(()=>playTone(2200,0.08,'sine',0.2),100);
}

function hit(){
  if(muted)return;
  playNoise(0.18,0.5);
  playTone(120,0.15,'sawtooth',0.4);
  playTone(80,0.1,'square',0.25);
}

function explode(){
  if(muted)return;
  playNoise(0.4,0.55);
  playTone(60,0.3,'sawtooth',0.35);
  setTimeout(()=>playNoise(0.25,0.3),80);
  setTimeout(()=>playTone(40,0.2,'square',0.2),150);
}

function win(){
  if(muted)return;
  const notes=[523,659,784,1047,1319];
  notes.forEach((f,i)=>setTimeout(()=>playTone(f,0.22,'sine',0.35),i*110));
  setTimeout(()=>playNoise(0.15,0.12,null,4000),500);
}

function lose(){
  if(muted)return;
  const notes=[400,350,300,250,180];
  notes.forEach((f,i)=>setTimeout(()=>playTone(f,0.3,'sawtooth',0.25),i*140));
  setTimeout(()=>playNoise(0.3,0.25,null,600),600);
}

function click(){
  if(muted)return;
  playTone(700,0.04,'sine',0.2);
}

function bossStart(n){
  if(muted)return;
  playTone(80,0.6,'sawtooth',0.35);
  setTimeout(()=>playTone(60,0.5,'square',0.3),150);
  setTimeout(()=>playNoise(0.4,0.35,null,400),300);
  setTimeout(()=>playTone(100,0.3,'sawtooth',0.25),500);
}

function bossStop(){
  stopBossMusic();
  if(muted)return;
  const notes=[200,250,300,400,500,600,800,1000];
  notes.forEach((f,i)=>setTimeout(()=>playTone(f,0.15,'sine',0.3),i*70));
  setTimeout(()=>playNoise(0.2,0.18,null,5000),500);
}

// ═══ МОТОРЪ: ГРОМКІЙ гулъ + шумъ + поврежденія ═══
function engineStart(){
  try{
    const c=getCtx();
    if(engineOsc)return;
    engineHealth=1;

    // Основной тонъ мотора (пила 55 Гц) — ГРОМКО
    engineOsc=c.createOscillator();
    engineGain=c.createGain();
    engineOsc.type='sawtooth';
    engineOsc.frequency.value=55;
    engineGain.gain.value=0;
    const flt=c.createBiquadFilter();flt.type='lowpass';flt.frequency.value=300;
    engineOsc.connect(flt);flt.connect(engineGain);engineGain.connect(sfxGain);
    engineOsc.start();

    // Второй тонъ (октава выше, треугольникъ) — объёмъ
    engineOsc2=c.createOscillator();
    const eng2Gain=c.createGain();
    engineOsc2.type='triangle';
    engineOsc2.frequency.value=110;
    eng2Gain.gain.value=0;
    const flt2=c.createBiquadFilter();flt2.type='lowpass';flt2.frequency.value=400;
    engineOsc2.connect(flt2);flt2.connect(eng2Gain);eng2Gain.connect(engineGain);
    engineOsc2.start();
    engineOsc._gain2=eng2Gain;

    // Шумъ мотора — ГРОМКО, постоянный фонъ
    const bufLen=c.sampleRate*2;
    const buf=c.createBuffer(1,bufLen,c.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<bufLen;i++){
      d[i]=(Math.random()*2-1)*0.6+Math.sin(i/60)*0.4;
    }
    engineNoise=c.createBufferSource();
    engineNoise.buffer=buf;
    engineNoise.loop=true;
    engineNoiseGain=c.createGain();
    engineNoiseGain.gain.value=0;
    const nflt=c.createBiquadFilter();nflt.type='bandpass';nflt.frequency.value=200;nflt.Q.value=1.5;
    engineNoise.connect(nflt);nflt.connect(engineNoiseGain);engineNoiseGain.connect(sfxGain);
    engineNoise.start();

  }catch(e){log('Engine audio error:',e.message);}
}

function engineSet(vol){
  if(!engineGain)return;
  const c=getCtx();
  // ГРОМКО: vol * 0.35 (было 0.15)
  const v=muted?0:vol*0.35*userVolume;
  engineGain.gain.setTargetAtTime(v,c.currentTime,0.1);
  // Шумъ мотора: 80% отъ основного тона (было 60%)
  if(engineNoiseGain)engineNoiseGain.gain.setTargetAtTime(v*0.8,c.currentTime,0.1);
  // Второй тонъ: 40% отъ основного
  if(engineOsc&&engineOsc._gain2)engineOsc._gain2.gain.setTargetAtTime(v*0.4,c.currentTime,0.1);
}

function engineSetHealth(hp){
  engineHealth=Math.max(0,Math.min(1,hp));
  if(!engineOsc)return;
  const c=getCtx();
  // При поврежденіи — частота плаваетъ сильнее
  const baseFreq=55+Math.random()*8*(1-engineHealth);
  engineOsc.frequency.setTargetAtTime(baseFreq,c.currentTime,0.3);
  if(engineOsc2)engineOsc2.frequency.setTargetAtTime(baseFreq*2+Math.random()*10*(1-engineHealth),c.currentTime,0.3);
  // При поврежденіи — шумъ усиливается до 150%
  if(engineNoiseGain){
    const noiseVol=0.35*userVolume*(1+0.5*(1-engineHealth));
    engineNoiseGain.gain.setTargetAtTime(muted?0:noiseVol,c.currentTime,0.2);
  }
  // Перебои при HP < 50%
  if(engineHealth<0.5&&!engineSputterInterval){
    startSputter();
  }else if(engineHealth>=0.5&&engineSputterInterval){
    stopSputter();
  }
}

function startSputter(){
  if(engineSputterInterval)return;
  engineSputterInterval=setInterval(()=>{
    if(!engineOsc||muted||engineHealth>=0.5){stopSputter();return;}
    const c=getCtx();
    const dip=Math.random()*0.9*(1-engineHealth);
    engineGain.gain.setTargetAtTime(0.35*userVolume*(1-dip),c.currentTime,0.015);
    setTimeout(()=>{
      if(engineGain)engineGain.gain.setTargetAtTime(0.35*userVolume,c.currentTime,0.04);
    },40+Math.random()*80);
    if(Math.random()<0.4*(1-engineHealth)){
      playTone(25+Math.random()*50,0.06,'sawtooth',0.15*(1-engineHealth));
    }
  },120+Math.random()*180);
}

function stopSputter(){
  if(engineSputterInterval){clearInterval(engineSputterInterval);engineSputterInterval=null;}
}

function engineStop(){
  stopSputter();
  if(engineOsc){try{engineOsc.stop();}catch(e){}engineOsc=null;}
  if(engineOsc2){try{engineOsc2.stop();}catch(e){}engineOsc2=null;}
  if(engineNoise){try{engineNoise.stop();}catch(e){}engineNoise=null;}
  engineGain=null;engineNoiseGain=null;
  engineHealth=1;
}

// ═══ ФОНОВАЯ МУЗЫКА ═══
const SCALES={
  menu:[262,294,330,392,440,523],
  flight:[330,392,440,523,587,659],
  boss:[196,220,247,262,294,330],
  victory:[523,587,659,784,880,1047]
};

function startMusicLoop(scaleKey,tempo){
  stopMusic();
  if(muted||!musicOn)return;
  const scale=SCALES[scaleKey]||SCALES.menu;
  let step=0;
  musicInterval=setInterval(()=>{
    if(muted||!musicOn){stopMusic();return;}
    const freq=scale[step%scale.length]*(Math.random()>0.7?0.5:1);
    playTone(freq,0.18,'sine',0.15,musicGain);
    if(step%4===0)playTone(scale[0]*0.5,0.35,'triangle',0.1,musicGain);
    if(step%8===0)playTone(scale[2]*0.25,0.4,'sine',0.07,musicGain);
    step++;
  },tempo||240);
}

function stopMusic(){
  if(musicInterval){clearInterval(musicInterval);musicInterval=null;}
}

function musicStart(){startMusicLoop('flight',220);}
function musicStop(){stopMusic();}

function startBossMusic(n){
  stopMusic();stopBossMusic();
  if(muted||!musicOn)return;
  const scale=SCALES.boss;
  let step=0;
  const tempo=Math.max(110,190-n*7);
  bossMusicInterval=setInterval(()=>{
    if(muted||!musicOn){stopBossMusic();return;}
    const freq=scale[step%scale.length]*(step%8<4?1:0.5);
    playTone(freq,0.14,'square',0.12,musicGain);
    if(step%2===0)playTone(scale[(step+3)%scale.length]*0.25,0.22,'sawtooth',0.08,musicGain);
    if(step%6===0)playNoise(0.1,0.1,musicGain,800);
    if(step%12===0)playTone(scale[0]*0.125,0.5,'sine',0.06,musicGain);
    step++;
  },tempo);
}

function stopBossMusic(){
  if(bossMusicInterval){clearInterval(bossMusicInterval);bossMusicInterval=null;}
}

// ═══ НАСТРОЙКИ ═══
function setMuted(m){
  muted=m;
  if(muted){engineSet(0);stopMusic();stopBossMusic();stopSputter();}
}
function setMusicOn(on){musicOn=on;if(!on){stopMusic();stopBossMusic();}}
function setVolume(v){
  userVolume=Math.max(0,Math.min(1,v));
  if(masterGain)masterGain.gain.value=userVolume;
}
function getVolume(){return userVolume;}

function init(){
  log('✓ Звуковой движокъ готовъ (громкій моторъ съ шумомъ)');
  document.addEventListener('click',()=>{getCtx();},{once:true});
  document.addEventListener('keydown',()=>{getCtx();},{once:true});
  return Promise.resolve();
}

window.Sound={
  init,shoot,coin,hit,explode,win,lose,click,
  bossStart,bossStop,
  engineStart,engineSet,engineStop,engineSetHealth,
  musicStart,musicStop,
  startBossMusic,stopBossMusic,
  setMuted,setMusicOn,setVolume,getVolume,
  isMuted:()=>muted
};
})();