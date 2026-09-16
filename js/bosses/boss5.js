(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss5',{
name:'Князь Вихрь',type:'burst',color:'#6d2f4a',hp:200,rate:2.2,size:1.9,
bg:['#5a2a4a','#8a4a7a','#ba6aaa'],music:'boss5',
taunt:'«Кружись въ этомъ вихрѣ!»',
tune:{bulletSpeed:290,ring:10},
prop:[26,50,0.92],
update:(b,dt,E)=>{b.ang=(b.ang||0)+dt*2;if(b.ang>6.28){b.ang=0;b.y+=Math.sin(b.t)*40;}}
});})();