(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss10',{
name:'Ханъ Барсъ',type:'ace',color:'#eeeeee',hp:220,rate:0.9,size:1.8,
bg:['#444','#666','#888'],music:'boss10',
taunt:'«Горы — моя стихія!»',
tune:{bulletSpeed:320,spread:4,telegraph:0.5},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;b.x += Math.sin(b.t * 2) * 80; b.y += Math.cos(b.t * 3) * 20; if (Math.random() < 0.05) b.fire();}
});})();
