(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss14',{
name:'Желѣзный Мяу',type:'sniper',color:'#6a6a7a',hp:380,rate:1.6,size:2.0,
bg:['#4a4a5a','#7a7a8a','#aaaabb'],music:'boss14',
taunt:'«Желѣзный законъ!»',
tune:{bulletSpeed:360,telegraph:0.35},
prop:[27,48,0.86],
update:(b,dt,E)=>{b.a=(b.a||0)+dt;if(b.a>2.8){b.a=0;b.y+=Math.sin(b.t*4)*60;}}
});})();