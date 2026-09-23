(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss4',{
name:'Атаманъ Мурка',type:'ace',color:'#cc5533',hp:180,rate:0.8,size:1.5,
bg:['#441111','#662222','#883333'],music:'boss4',
taunt:'«Всё твоё теперь моё!»',
tune:{bulletSpeed:250,spread:4,telegraph:0.6},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;b.x += Math.sin(b.t * 3) * 60; b.y += Math.cos(b.t * 2) * 40; if (Math.random() < 0.03) b.fire();}
});})();
