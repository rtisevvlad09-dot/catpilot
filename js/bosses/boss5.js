(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss5',{
name:'Князь Вихрь',type:'ace',color:'#55aaff',hp:160,rate:0.5,size:1.6,
bg:['#113355','#225588','#3377aa'],music:'boss5',
taunt:'«Узри истинную скорость!»',
tune:{bulletSpeed:300,spread:2,telegraph:0.4},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;b.a = (b.a || 0) + 0.1; b.x = window.innerWidth/2 + Math.sin(b.a)*150; b.y = 150 + Math.cos(b.a)*50; if (Math.random() < 0.04) b.fire();}
});})();
