(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss20',{
name:'Императоръ Пустоты',type:'ace',color:'#000000',hp:1000,rate:0.5,size:4.0,
bg:['#000000','#110000','#000011'],music:'boss20',
taunt:'«Твой полётъ оконченъ, Мурмыскій.»',
tune:{bulletSpeed:450,spread:15,telegraph:0.2},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;b.x = window.innerWidth/2 + Math.sin(b.t*0.5)*180; b.y = 150 + Math.cos(b.t*0.8)*80; if(Math.random()<0.1) b.fire(); if(b.t % 5 < 0.1) { b.hp += 5; }}
});})();
