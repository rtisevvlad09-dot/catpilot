(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss7',{
name:'Стальной Коготь',type:'ace',color:'#5a5a6a',hp:240,rate:1.3,size:1.9,
bg:['#3a3a4a','#6a6a7a','#9a9aaa'],music:'boss7',
taunt:'«Когти рвутъ звѣзды!»',
tune:{bulletSpeed:310,spread:4},
prop:[28,47,0.9],
update:(b,dt,E)=>{b.a=(b.a||0)+dt;if(b.a>2){b.a=0;b.x-=30;setTimeout(()=>b.x+=30,400);}}
});})();