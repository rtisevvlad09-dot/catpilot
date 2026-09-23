(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss7',{
name:'Полковникъ Громъ',type:'ace',color:'#555555',hp:400,rate:4.0,size:2.8,
bg:['#222','#333','#444'],music:'boss7',
taunt:'«Я сотру тебя въ порошокъ!»',
tune:{bulletSpeed:180,spread:8,telegraph:1.5},
prop:[35,45,0.9],
update:(b,dt,E)=>{b.t=(b.t||0)+dt;b.x = window.innerWidth/2 + Math.sin(b.t * 0.5) * 100; if (b.t % 4 < 0.1) { for(let i=0;i<5;i++) b.fire(); }}
});})();
