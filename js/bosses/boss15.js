(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss15',{
name:'Чёрный Барсъ',type:'bomber',color:'#1a1a2a',hp:400,rate:0.85,size:2.3,
bg:['#0a0a1a','#1a1a2a','#2a2a3a'],music:'boss15',
taunt:'«Я тѣнь смерти!»',
tune:{bulletSpeed:240},
prop:[31,53,.92],
update:(b,dt,E)=>{b.a=(b.a||0)+dt;if(b.a>3){b.a=0;for(let i=0;i<5;i++)E.minion();}}
});})();