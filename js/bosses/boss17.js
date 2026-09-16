(function(){if(!window.BossRegistry)return;
window.BossRegistry.register('boss17',{
name:'Серебряный Клыкъ',type:'burst',color:'#c8c8d8',hp:440,rate:1.7,size:2.1,
bg:['#8a8a9a','#b8b8c8','#e8e8f8'],music:'boss17',
taunt:'«Клыкъ пронзаетъ небо!»',
tune:{bulletSpeed:310,ring:14},
prop:[43,54,1,2],
update:(b,dt,E)=>{b.ang=(b.ang||0)+dt*4;if(b.ang>6.28){b.ang=0;b.y+=Math.cos(b.t*3)*70;}}
});})();