(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss4',{
name:'Атаманъ Мурка',type:'swarm',color:'#6d4a2f',hp:180,rate:2.6,size:1.8,
bg:['#4a3a2a','#7a6a4a','#aa9a7a'],music:'boss4',
taunt:'«Моя стая тебя съѣстъ!»',
tune:{minion:2.0},
prop:[27,51,0.88],
update:(b,dt,E)=>{b.a=(b.a||0)+dt;if(b.a>1.5){b.a=0;E.minion();E.minion();}}
});})();