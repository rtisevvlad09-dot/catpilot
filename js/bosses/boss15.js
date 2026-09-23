(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss15',{
name:'Баронъ Штопоръ',type:'ace',color:'#ff3333',hp:190,rate:0.6,size:1.4,
bg:['#330000','#440000','#550000'],music:'boss15',
taunt:'«Держись крѣпче!»',
tune:{bulletSpeed:310,spread:1,telegraph:0.4},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;if(b.y < window.innerHeight/2 && !b.up) b.y += 5; else {b.up = true; b.y -= 2; if(b.y < 50) b.up = false;} b.x += Math.sin(b.y/20)*10; if (Math.random() < 0.05) b.fire();}
});})();
