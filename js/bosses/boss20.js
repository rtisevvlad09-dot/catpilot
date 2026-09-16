(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss20',{
name:'Кото-Императоръ',type:'sniper',color:'#d4a84b',hp:600,rate:1.5,size:2.5,
bg:['#3a2a1a','#6a4a2a','#9a6a3a'],music:'boss20',
taunt:'«Колѣнопреклоненно встрѣчай Императора!»',
tune:{bulletSpeed:380,telegraph:0.25},
prop:[40,53,1.0],
update:(b,dt,E)=>{
  b.a=(b.a||0)+dt;b.ang=(b.ang||0)+dt*2;
  if(b.a>2){b.a=0;b.y+=Math.sin(b.ang)*80;E.bullet(b.x-60,b.y,-400,0);E.bullet(b.x-60,b.y,-380,50);E.bullet(b.x-60,b.y,-380,-50);}
  if(b.a>5){b.a=0;for(let i=0;i<4;i++)E.minion();}
}
});})();