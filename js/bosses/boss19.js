(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss19',{
name:'Генералъ Тайфунъ',type:'ace',color:'#0055aa',hp:500,rate:2.5,size:3.5,
bg:['#001122','#002244','#003366'],music:'boss19',
taunt:'«Я сдую тебя съ небесъ!»',
tune:{bulletSpeed:220,spread:12,telegraph:1.0},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;b.x = window.innerWidth/2; b.y = 120 + Math.sin(b.t)*30; if (b.t % 2 < 0.1) { for(let i=0;i<8;i++) b.fire(); }}
});})();
