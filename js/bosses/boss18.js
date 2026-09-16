(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss18',{
name:'Золотой Ханъ',type:'dash',color:'#d4a84b',hp:460,rate:1.1,size:2.2,
bg:['#6a5a2a','#9a8a4a','#caba6a'],music:'boss18',
taunt:'«Ханъ летитъ!»',
tune:{dashMul:1.9,telegraph:0.3},
prop:[40,52,0.9],
update:(b,dt,E)=>{b.a=(b.a||0)+dt;if(b.a>3.5){b.a=0;b.y=E.H/2+Math.random()*400-200;}}
});})();