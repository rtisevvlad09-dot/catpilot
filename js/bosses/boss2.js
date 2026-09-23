(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss2',{
name:'Баронъ Штейнъ',type:'ace',color:'#334455',hp:150,rate:3.0,size:1.4,
bg:['#112233','#223344','#334455'],music:'boss2',
taunt:'«Одинъ выстрѣлъ — одна цѣль.»',
tune:{bulletSpeed:400,spread:0,telegraph:0.5},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;b.x = window.playerX || b.x; b.y = 50 + Math.sin(b.t) * 20; if (b.t % 3 < 0.1) b.fire();}
});})();
