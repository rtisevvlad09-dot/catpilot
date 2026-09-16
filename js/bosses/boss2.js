(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss2',{
name:'Баронъ Штейнъ',type:'sniper',color:'#4a2f6d',hp:140,rate:2.0,size:1.7,
bg:['#1a2a4a','#3a5a8a','#6a8aba'],music:'boss2',
taunt:'«Одинъ выстрѣлъ — одинъ трупъ.»',
tune:{bulletSpeed:320,telegraph:0.6},
prop:[32,48,0.85],
update:(b,dt,E)=>{b.a=(b.a||0)+dt;if(b.a>2.5){b.a=0;b.x-=20;setTimeout(()=>b.x+=20,500);}}
});})();