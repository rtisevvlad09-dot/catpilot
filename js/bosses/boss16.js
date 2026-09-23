(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss16',{
name:'Старшина Гроза',type:'ace',color:'#cccc00',hp:260,rate:1.5,size:2.0,
bg:['#333300','#444400','#555500'],music:'boss16',
taunt:'«Молнія бьётъ дважды!»',
tune:{bulletSpeed:400,spread:2,telegraph:0.6},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;b.x = Math.random() < 0.02 ? Math.random()*window.innerWidth : b.x; b.y = 100; if (Math.random() < 0.05) b.fire();}
});})();
