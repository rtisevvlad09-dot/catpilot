(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss13',{
name:'Магистръ Винтъ',type:'ace',color:'#aa6622',hp:200,rate:0.5,size:1.7,
bg:['#332211','#443311','#554422'],music:'boss13',
taunt:'«Мои расчёты безупречны!»',
tune:{bulletSpeed:350,spread:8,telegraph:0.3},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;b.a = (b.a || 0) + 0.05; b.x = window.innerWidth/2 + Math.sin(b.a * 5) * 100; b.y = 100 + Math.cos(b.a * 3) * 50; if (b.t % 1 < 0.1) b.fire();}
});})();
