(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss6',{
name:'Поручикъ Рѣзвый',type:'ace',color:'#ffff44',hp:140,rate:0.6,size:1.3,
bg:['#555511','#777722','#999933'],music:'boss6',
taunt:'«Догони, если сможешь!»',
tune:{bulletSpeed:280,spread:1,telegraph:0.3},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;if (!b.tx) b.tx = Math.random()*window.innerWidth; if (Math.abs(b.x - b.tx) < 10) b.tx = Math.random()*window.innerWidth; b.x += (b.tx - b.x)*0.05; b.y = 100 + Math.sin(b.t*4)*30;}
});})();
