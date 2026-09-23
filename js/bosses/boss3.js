(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss3',{
name:'Купецъ Брюхатый',type:'ace',color:'#aa8822',hp:300,rate:1.2,size:3.0,
bg:['#443311','#665522','#887733'],music:'boss3',
taunt:'«Мои деньги — моя броня!»',
tune:{bulletSpeed:150,spread:7,telegraph:1.0},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;b.x += Math.sin(b.t) * 50; if (Math.random() < 0.05) b.fire();}
});})();
