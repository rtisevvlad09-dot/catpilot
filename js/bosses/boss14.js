(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss14',{
name:'Княжна Метель',type:'ace',color:'#aaddff',hp:210,rate:0.8,size:1.6,
bg:['#113344','#224455','#335566'],music:'boss14',
taunt:'«Замерзни во льдахъ!»',
tune:{bulletSpeed:240,spread:6,telegraph:0.5},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;b.x += Math.sin(b.t * 1.5) * 90; b.y += Math.cos(b.t) * 30; if (Math.random() < 0.05) b.fire();}
});})();
