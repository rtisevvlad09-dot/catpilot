(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss6',{
name:'Генералъ Морозъ',type:'dash',color:'#2f4a6d',hp:220,rate:1.4,size:1.8,
bg:['#1a3a5a','#3a6a9a','#6a9aca'],music:'boss6',
taunt:'«Замёрзнешь!»',
tune:{dashMul:1.5,telegraph:0.5},
prop:[25,50,0.87],
update:(b,dt,E)=>{b.a=(b.a||0)+dt;if(b.a>5){b.a=0;b.y=E.H/2+Math.random()*200-100;}}
});})();