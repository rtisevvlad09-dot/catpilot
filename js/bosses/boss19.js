(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss19',{
name:'Тѣнь Императора',type:'ace',color:'#0a0a1a',hp:500,rate:1.1,size:2.3,
bg:['#050510','#0a0a20','#151530'],music:'boss19',
taunt:'«Я — эхо власти!»',
tune:{bulletSpeed:330,spread:6},
prop:[41,53,0.92],
update:(b,dt,E)=>{b.a=(b.a||0)+dt;if(b.a>2){b.a=0;b.x-=50;setTimeout(()=>b.x+=50,300);}}
});})();