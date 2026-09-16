(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss1',{
name:'Графъ Обломовъ',type:'ace',color:'#8a2f1d',hp:120,rate:1.5,size:1.6,
bg:['#2a1a3a','#5a3a6a','#8a5a9a'],music:'boss1',
taunt:'«Ты ещё пожалеешь, Мурмыскій!»',
tune:{bulletSpeed:280,spread:3,telegraph:0.8},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.a=(b.a||0)+dt;if(b.a>3){b.a=0;b.y+=Math.sin(b.t*2)*30;}}
});})();