// ═══ ПРОЦЕДУРНАЯ МУЗЫКА БОССОВЪ (WebAudio) ═══
(function(){
'use strict';
let ctx=null, playing=false, loops=[], gain=null;

function init(){
  if(!ctx){
    try{ctx=new (window.AudioContext||window.webkitAudioContext)();}
    catch(e){console.warn('WebAudio not supported');}
  }
}

function stop(){
  playing=false;
  loops.forEach(l=>clearTimeout(l));
  loops=[];
  if(gain && ctx){
    try{
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime+0.5);
    }catch(e){}
    setTimeout(()=>{
      try{gain.disconnect();}catch(e){}
      gain=null;
    }, 600);
  }
}

function playNote(freq, dur, type, vol, t){
  if(!ctx)return;
  try{
    const o=ctx.createOscillator();
    const g=ctx.createGain();
    o.type=type;
    o.frequency.value=freq;
    g.gain.value=vol;
    o.connect(g);
    g.connect(gain);
    o.start(t);
    o.stop(t+dur);
  }catch(e){}
}

const THEMES={
  boss1:{bpm:100, notes:[220,262,330,392], type:'sawtooth', vol:0.12},
  boss2:{bpm:110, notes:[196,247,294,370], type:'square', vol:0.10},
  boss3:{bpm:90, notes:[165,220,262,330], type:'triangle', vol:0.14},
  boss4:{bpm:120, notes:[247,311,370,466], type:'sawtooth', vol:0.11},
  boss5:{bpm:130, notes:[262,330,392,523], type:'square', vol:0.13},
  boss6:{bpm:95, notes:[175,220,262,349], type:'sine', vol:0.15},
  boss7:{bpm:105, notes:[220,277,330,415], type:'sawtooth', vol:0.12},
  boss8:{bpm:115, notes:[185,233,277,349], type:'square', vol:0.10},
  boss9:{bpm:85, notes:[147,196,247,294], type:'triangle', vol:0.14},
  boss10:{bpm:100, notes:[208,262,311,392], type:'sine', vol:0.13},
  boss11:{bpm:125, notes:[247,311,370,494], type:'sawtooth', vol:0.12},
  boss12:{bpm:135, notes:[262,330,415,523], type:'square', vol:0.11},
  boss13:{bpm:110, notes:[220,277,349,440], type:'sawtooth', vol:0.13},
  boss14:{bpm:100, notes:[196,247,311,392], type:'square', vol:0.10},
  boss15:{bpm:90, notes:[165,208,262,330], type:'triangle', vol:0.14},
  boss16:{bpm:120, notes:[233,294,349,466], type:'sawtooth', vol:0.12},
  boss17:{bpm:130, notes:[262,330,415,523], type:'square', vol:0.11},
  boss18:{bpm:140, notes:[294,370,440,587], type:'sawtooth', vol:0.13},
  boss19:{bpm:95, notes:[175,220,277,349], type:'sine', vol:0.15},
  boss20:{bpm:80, notes:[147,185,220,294,370,440], type:'sawtooth', vol:0.16}
};

function loop(theme){
  if(!playing || !ctx) return;
  const beat=60/theme.bpm;
  const t=ctx.currentTime;
  theme.notes.forEach((f,i)=>playNote(f, beat*0.8, theme.type, theme.vol, t+i*beat));
  const id=setTimeout(()=>loop(theme), beat*theme.notes.length*1000);
  loops.push(id);
}

window.BossMusic={
  start(name){
    init();
    stop();
    const th=THEMES[name]||THEMES.boss1;
    try{
      gain=ctx.createGain();
      gain.gain.value=0;
      gain.gain.linearRampToValueAtTime(1, ctx.currentTime+1);
      gain.connect(ctx.destination);
      playing=true;
      loop(th);
    }catch(e){console.warn('Boss music error:',e);}
  },
  stop: stop
};
})();