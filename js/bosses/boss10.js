(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss10',{
name:'Метель-Хозяйка',type:'swarm',color:'#6a8aaa',hp:300,rate:2.0,size:2.0,
bg:['#4a6a8a','#7a9aba','#aacada'],music:'boss10',
taunt:'«Моя стая — буря!»',
tune:{minion:1.8},
prop:[35,57,1],
update:(b,dt,E)=>{b.a=(b.a||0)+dt;if(b.a>1.2){b.a=0;E.minion();E.minion();E.minion();}}
});})();