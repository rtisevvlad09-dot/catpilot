(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss8',{
name:'Сѣрая Тѣнь',type:'ace',color:'#888888',hp:150,rate:1.0,size:1.4,
bg:['#111','#222','#333'],music:'boss8',
taunt:'«Меня здѣсь нѣтъ...»',
tune:{bulletSpeed:350,spread:0,telegraph:0.2},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;b.alpha = Math.abs(Math.sin(b.t * 2)); if (b.alpha > 0.8 && Math.random() < 0.1) b.fire();}
});})();
