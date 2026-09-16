(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss3',{
name:'Купецъ Брюхатый',type:'bomber',color:'#2f5a2f',hp:160,rate:1.1,size:2.0,
bg:['#3a4a2a','#6a7a4a','#9aaa6a'],music:'boss3',
taunt:'«Закидаю тебя бомбами!»',
tune:{bulletSpeed:260},
prop:[32,45,1.0],
update:(b,dt,E)=>{b.a=(b.a||0)+dt;if(b.a>4){b.a=0;for(let i=0;i<3;i++)E.minion();}}
});})();