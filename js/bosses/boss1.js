(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss1',{
name:'Графъ Обломовъ',type:'ace',color:'#8a2f1d',hp:200,rate:2.0,size:2.5,
bg:['#2a1a3a','#5a3a6a','#8a5a9a'],music:'boss1',
taunt:'«Слишкомъ быстро! Дайте мнѣ поспать!»',
tune:{bulletSpeed:200,spread:5,telegraph:1.2},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;b.y += Math.sin(b.t * 1.5) * 15; b.x += Math.cos(b.t * 0.5) * 10; if (Math.random() < 0.01) b.fire();}
});})();
