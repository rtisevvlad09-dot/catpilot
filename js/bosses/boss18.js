(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss18',{
name:'Мадамъ Миражъ',type:'ace',color:'#ff00ff',hp:160,rate:0.9,size:1.5,
bg:['#330033','#440044','#550055'],music:'boss18',
taunt:'«Ты стреляешь въ пустоту!»',
tune:{bulletSpeed:250,spread:3,telegraph:0.5},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;if(Math.random()<0.01) { b.x = Math.random()*window.innerWidth; b.y = 50+Math.random()*150; } if(Math.random()<0.04) b.fire();}
});})();
