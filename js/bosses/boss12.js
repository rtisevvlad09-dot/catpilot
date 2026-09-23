(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss12',{
name:'Графиня Ночь',type:'ace',color:'#440066',hp:180,rate:0.7,size:1.5,
bg:['#110022','#220033','#330044'],music:'boss12',
taunt:'«Тьма поглотитъ тебя!»',
tune:{bulletSpeed:300,spread:2,telegraph:0.4},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;b.y = 100 + Math.sin(b.t * 3) * 60; b.x = window.innerWidth/2 + Math.cos(b.t * 2) * 100; if (Math.random() < 0.06) b.fire();}
});})();
