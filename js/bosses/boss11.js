(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss11',{
name:'Чёрный Командоръ',type:'ace',color:'#111111',hp:300,rate:1.2,size:2.4,
bg:['#000','#111','#222'],music:'boss11',
taunt:'«Трепещи передъ моимъ флагомъ!»',
tune:{bulletSpeed:280,spread:5,telegraph:0.7},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;b.x = window.innerWidth/2 + Math.sin(b.t) * 150; if (Math.random() < 0.04) b.fire();}
});})();
