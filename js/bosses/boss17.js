(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss17',{
name:'Графъ Рикошетъ',type:'ace',color:'#22ff22',hp:170,rate:0.4,size:1.3,
bg:['#002200','#003300','#004400'],music:'boss17',
taunt:'«Мои пули найдутъ тебя!»',
tune:{bulletSpeed:200,spread:10,telegraph:0.2},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;b.x += b.dx || 5; if(b.x < 0 || b.x > window.innerWidth) b.dx = -(b.dx || 5); b.y = 80 + Math.sin(b.t)*20; if (Math.random() < 0.08) b.fire();}
});})();
