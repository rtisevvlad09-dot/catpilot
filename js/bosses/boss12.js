(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss12',{
name:'Баронъ Мурръ',type:'dash',color:'#3a2a5a',hp:340,rate:1.2,size:2.0,
bg:['#2a1a4a','#4a3a7a','#6a5aaa'],music:'boss12',
taunt:'«Я быстрее страха!»',
tune:{dashMul:1.7,telegraph:0.4},
prop:[19,51,0.68],
update:(b,dt,E)=>{b.a=(b.a||0)+dt;if(b.a>4){b.a=0;b.y=E.H/2+Math.random()*300-150;}}
});})();