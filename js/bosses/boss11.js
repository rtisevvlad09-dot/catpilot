(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss11',{
name:'Шквалъ',type:'burst',color:'#4a6a3a',hp:320,rate:1.8,size:2.1,
bg:['#2a4a2a','#4a7a4a','#6aaa6a'],music:'boss11',
taunt:'«Небо трепещетъ!»',
tune:{bulletSpeed:300,ring:12},
prop:[30,51,0.93],
update:(b,dt,E)=>{b.ang=(b.ang||0)+dt*3;if(b.ang>6.28){b.ang=0;b.x+=Math.sin(b.t*2)*60;}}
});})();