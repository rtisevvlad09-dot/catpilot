(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss8',{
name:'Ночной Визгъ',type:'sniper',color:'#2a2a4a',hp:260,rate:1.7,size:1.8,
bg:['#0a1a3a','#1a3a6a','#2a5a9a'],music:'boss8',
taunt:'«Услышишь раньше, чемъ увидишь!»',
tune:{bulletSpeed:340,telegraph:0.4},
prop:[27,45,0.84],
update:(b,dt,E)=>{b.a=(b.a||0)+dt;if(b.a>3){b.a=0;b.y+=Math.cos(b.t*3)*50;}}
});})();