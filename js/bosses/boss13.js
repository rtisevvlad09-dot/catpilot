(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss13',{
name:'Адмиралъ Когтей',type:'ace',color:'#2a4a6a',hp:360,rate:1.2,size:2.1,
bg:['#1a3a5a','#2a5a8a','#3a7aba'],music:'boss13',
taunt:'«Мой флотъ — котики!»',
tune:{bulletSpeed:320,spread:5},
prop:[32,46,0.91],
update:(b,dt,E)=>{b.a=(b.a||0)+dt;if(b.a>2.5){b.a=0;b.x-=40;setTimeout(()=>b.x+=40,350);}}
});})();