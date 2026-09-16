(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss9',{
name:'Громъ-Пушка',type:'bomber',color:'#4a3a2a',hp:280,rate:0.9,size:2.2,
bg:['#3a2a1a','#6a4a2a','#9a6a3a'],music:'boss9',
taunt:'«Грохотъ — послѣдній звукъ!»',
tune:{bulletSpeed:250},
prop:[30,48,1.05],
update:(b,dt,E)=>{b.a=(b.a||0)+dt;if(b.a>3.5){b.a=0;for(let i=0;i<4;i++)E.minion();}}
});})();