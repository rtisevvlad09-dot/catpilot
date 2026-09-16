(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss16',{
name:'Багровый Рыкъ',type:'swarm',color:'#8a2a2a',hp:420,rate:1.8,size:2.2,
bg:['#4a1a1a','#7a2a2a','#aa3a3a'],music:'boss16',
taunt:'«Мой рыкъ — орды!»',
tune:{minion:1.5},
prop:[34,49,0.96],
update:(b,dt,E)=>{b.a=(b.a||0)+dt;if(b.a>1.0){b.a=0;for(let i=0;i<3;i++)E.minion();}}
});})();