(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss9',{
name:'Адмиралъ Коготь',type:'ace',color:'#224488',hp:250,rate:1.5,size:2.2,
bg:['#001133','#112255','#223377'],music:'boss9',
taunt:'«На дно, сухопутная крыса!»',
tune:{bulletSpeed:260,spread:3,telegraph:0.8},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;b.y = 80 + Math.sin(b.t) * 40; b.x = window.innerWidth/2 + Math.sin(b.t * 1.5) * 120; if (Math.random() < 0.03) b.fire();}
});})();
