import os

bosses = [
    {
        "id": "boss1",
        "name": "Графъ Обломовъ",
        "type": "ace",
        "hp": 200,
        "rate": 2.0,
        "size": 2.5,
        "color": "#8a2f1d",
        "bg": "['#2a1a3a','#5a3a6a','#8a5a9a']",
        "taunt": "«Слишкомъ быстро! Дайте мнѣ поспать!»",
        "tune": "{bulletSpeed:200,spread:5,telegraph:1.2}",
        "update": "b.y += Math.sin(b.t * 1.5) * 15; b.x += Math.cos(b.t * 0.5) * 10; if (Math.random() < 0.01) b.fire();"
    },
    {
        "id": "boss2",
        "name": "Баронъ Штейнъ",
        "type": "ace",
        "hp": 150,
        "rate": 3.0,
        "size": 1.4,
        "color": "#334455",
        "bg": "['#112233','#223344','#334455']",
        "taunt": "«Одинъ выстрѣлъ — одна цѣль.»",
        "tune": "{bulletSpeed:400,spread:0,telegraph:0.5}",
        "update": "b.x = window.playerX || b.x; b.y = 50 + Math.sin(b.t) * 20; if (b.t % 3 < 0.1) b.fire();"
    },
    {
        "id": "boss3",
        "name": "Купецъ Брюхатый",
        "type": "ace",
        "hp": 300,
        "rate": 1.2,
        "size": 3.0,
        "color": "#aa8822",
        "bg": "['#443311','#665522','#887733']",
        "taunt": "«Мои деньги — моя броня!»",
        "tune": "{bulletSpeed:150,spread:7,telegraph:1.0}",
        "update": "b.x += Math.sin(b.t) * 50; if (Math.random() < 0.05) b.fire();"
    },
    {
        "id": "boss4",
        "name": "Атаманъ Мурка",
        "type": "ace",
        "hp": 180,
        "rate": 0.8,
        "size": 1.5,
        "color": "#cc5533",
        "bg": "['#441111','#662222','#883333']",
        "taunt": "«Всё твоё теперь моё!»",
        "tune": "{bulletSpeed:250,spread:4,telegraph:0.6}",
        "update": "b.x += Math.sin(b.t * 3) * 60; b.y += Math.cos(b.t * 2) * 40; if (Math.random() < 0.03) b.fire();"
    },
    {
        "id": "boss5",
        "name": "Князь Вихрь",
        "type": "ace",
        "hp": 160,
        "rate": 0.5,
        "size": 1.6,
        "color": "#55aaff",
        "bg": "['#113355','#225588','#3377aa']",
        "taunt": "«Узри истинную скорость!»",
        "tune": "{bulletSpeed:300,spread:2,telegraph:0.4}",
        "update": "b.a = (b.a || 0) + 0.1; b.x = window.innerWidth/2 + Math.sin(b.a)*150; b.y = 150 + Math.cos(b.a)*50; if (Math.random() < 0.04) b.fire();"
    },
    {
        "id": "boss6",
        "name": "Поручикъ Рѣзвый",
        "type": "ace",
        "hp": 140,
        "rate": 0.6,
        "size": 1.3,
        "color": "#ffff44",
        "bg": "['#555511','#777722','#999933']",
        "taunt": "«Догони, если сможешь!»",
        "tune": "{bulletSpeed:280,spread:1,telegraph:0.3}",
        "update": "if (!b.tx) b.tx = Math.random()*window.innerWidth; if (Math.abs(b.x - b.tx) < 10) b.tx = Math.random()*window.innerWidth; b.x += (b.tx - b.x)*0.05; b.y = 100 + Math.sin(b.t*4)*30;"
    },
    {
        "id": "boss7",
        "name": "Полковникъ Громъ",
        "type": "ace",
        "hp": 400,
        "rate": 4.0,
        "size": 2.8,
        "color": "#555555",
        "bg": "['#222','#333','#444']",
        "taunt": "«Я сотру тебя въ порошокъ!»",
        "tune": "{bulletSpeed:180,spread:8,telegraph:1.5}",
        "update": "b.x = window.innerWidth/2 + Math.sin(b.t * 0.5) * 100; if (b.t % 4 < 0.1) { for(let i=0;i<5;i++) b.fire(); }"
    },
    {
        "id": "boss8",
        "name": "Сѣрая Тѣнь",
        "type": "ace",
        "hp": 150,
        "rate": 1.0,
        "size": 1.4,
        "color": "#888888",
        "bg": "['#111','#222','#333']",
        "taunt": "«Меня здѣсь нѣтъ...»",
        "tune": "{bulletSpeed:350,spread:0,telegraph:0.2}",
        "update": "b.alpha = Math.abs(Math.sin(b.t * 2)); if (b.alpha > 0.8 && Math.random() < 0.1) b.fire();"
    },
    {
        "id": "boss9",
        "name": "Адмиралъ Коготь",
        "type": "ace",
        "hp": 250,
        "rate": 1.5,
        "size": 2.2,
        "color": "#224488",
        "bg": "['#001133','#112255','#223377']",
        "taunt": "«На дно, сухопутная крыса!»",
        "tune": "{bulletSpeed:260,spread:3,telegraph:0.8}",
        "update": "b.y = 80 + Math.sin(b.t) * 40; b.x = window.innerWidth/2 + Math.sin(b.t * 1.5) * 120; if (Math.random() < 0.03) b.fire();"
    },
    {
        "id": "boss10",
        "name": "Ханъ Барсъ",
        "type": "ace",
        "hp": 220,
        "rate": 0.9,
        "size": 1.8,
        "color": "#eeeeee",
        "bg": "['#444','#666','#888']",
        "taunt": "«Горы — моя стихія!»",
        "tune": "{bulletSpeed:320,spread:4,telegraph:0.5}",
        "update": "b.x += Math.sin(b.t * 2) * 80; b.y += Math.cos(b.t * 3) * 20; if (Math.random() < 0.05) b.fire();"
    },
    {
        "id": "boss11",
        "name": "Чёрный Командоръ",
        "type": "ace",
        "hp": 300,
        "rate": 1.2,
        "size": 2.4,
        "color": "#111111",
        "bg": "['#000','#111','#222']",
        "taunt": "«Трепещи передъ моимъ флагомъ!»",
        "tune": "{bulletSpeed:280,spread:5,telegraph:0.7}",
        "update": "b.x = window.innerWidth/2 + Math.sin(b.t) * 150; if (Math.random() < 0.04) b.fire();"
    },
    {
        "id": "boss12",
        "name": "Графиня Ночь",
        "type": "ace",
        "hp": 180,
        "rate": 0.7,
        "size": 1.5,
        "color": "#440066",
        "bg": "['#110022','#220033','#330044']",
        "taunt": "«Тьма поглотитъ тебя!»",
        "tune": "{bulletSpeed:300,spread:2,telegraph:0.4}",
        "update": "b.y = 100 + Math.sin(b.t * 3) * 60; b.x = window.innerWidth/2 + Math.cos(b.t * 2) * 100; if (Math.random() < 0.06) b.fire();"
    },
    {
        "id": "boss13",
        "name": "Магистръ Винтъ",
        "type": "ace",
        "hp": 200,
        "rate": 0.5,
        "size": 1.7,
        "color": "#aa6622",
        "bg": "['#332211','#443311','#554422']",
        "taunt": "«Мои расчёты безупречны!»",
        "tune": "{bulletSpeed:350,spread:8,telegraph:0.3}",
        "update": "b.a = (b.a || 0) + 0.05; b.x = window.innerWidth/2 + Math.sin(b.a * 5) * 100; b.y = 100 + Math.cos(b.a * 3) * 50; if (b.t % 1 < 0.1) b.fire();"
    },
    {
        "id": "boss14",
        "name": "Княжна Метель",
        "type": "ace",
        "hp": 210,
        "rate": 0.8,
        "size": 1.6,
        "color": "#aaddff",
        "bg": "['#113344','#224455','#335566']",
        "taunt": "«Замерзни во льдахъ!»",
        "tune": "{bulletSpeed:240,spread:6,telegraph:0.5}",
        "update": "b.x += Math.sin(b.t * 1.5) * 90; b.y += Math.cos(b.t) * 30; if (Math.random() < 0.05) b.fire();"
    },
    {
        "id": "boss15",
        "name": "Баронъ Штопоръ",
        "type": "ace",
        "hp": 190,
        "rate": 0.6,
        "size": 1.4,
        "color": "#ff3333",
        "bg": "['#330000','#440000','#550000']",
        "taunt": "«Держись крѣпче!»",
        "tune": "{bulletSpeed:310,spread:1,telegraph:0.4}",
        "update": "if(b.y < window.innerHeight/2 && !b.up) b.y += 5; else {b.up = true; b.y -= 2; if(b.y < 50) b.up = false;} b.x += Math.sin(b.y/20)*10; if (Math.random() < 0.05) b.fire();"
    },
    {
        "id": "boss16",
        "name": "Старшина Гроза",
        "type": "ace",
        "hp": 260,
        "rate": 1.5,
        "size": 2.0,
        "color": "#cccc00",
        "bg": "['#333300','#444400','#555500']",
        "taunt": "«Молнія бьётъ дважды!»",
        "tune": "{bulletSpeed:400,spread:2,telegraph:0.6}",
        "update": "b.x = Math.random() < 0.02 ? Math.random()*window.innerWidth : b.x; b.y = 100; if (Math.random() < 0.05) b.fire();"
    },
    {
        "id": "boss17",
        "name": "Графъ Рикошетъ",
        "type": "ace",
        "hp": 170,
        "rate": 0.4,
        "size": 1.3,
        "color": "#22ff22",
        "bg": "['#002200','#003300','#004400']",
        "taunt": "«Мои пули найдутъ тебя!»",
        "tune": "{bulletSpeed:200,spread:10,telegraph:0.2}",
        "update": "b.x += b.dx || 5; if(b.x < 0 || b.x > window.innerWidth) b.dx = -(b.dx || 5); b.y = 80 + Math.sin(b.t)*20; if (Math.random() < 0.08) b.fire();"
    },
    {
        "id": "boss18",
        "name": "Мадамъ Миражъ",
        "type": "ace",
        "hp": 160,
        "rate": 0.9,
        "size": 1.5,
        "color": "#ff00ff",
        "bg": "['#330033','#440044','#550055']",
        "taunt": "«Ты стреляешь въ пустоту!»",
        "tune": "{bulletSpeed:250,spread:3,telegraph:0.5}",
        "update": "if(Math.random()<0.01) { b.x = Math.random()*window.innerWidth; b.y = 50+Math.random()*150; } if(Math.random()<0.04) b.fire();"
    },
    {
        "id": "boss19",
        "name": "Генералъ Тайфунъ",
        "type": "ace",
        "hp": 500,
        "rate": 2.5,
        "size": 3.5,
        "color": "#0055aa",
        "bg": "['#001122','#002244','#003366']",
        "taunt": "«Я сдую тебя съ небесъ!»",
        "tune": "{bulletSpeed:220,spread:12,telegraph:1.0}",
        "update": "b.x = window.innerWidth/2; b.y = 120 + Math.sin(b.t)*30; if (b.t % 2 < 0.1) { for(let i=0;i<8;i++) b.fire(); }"
    },
    {
        "id": "boss20",
        "name": "Императоръ Пустоты",
        "type": "ace",
        "hp": 1000,
        "rate": 0.5,
        "size": 4.0,
        "color": "#000000",
        "bg": "['#000000','#110000','#000011']",
        "taunt": "«Твой полётъ оконченъ, Мурмыскій.»",
        "tune": "{bulletSpeed:450,spread:15,telegraph:0.2}",
        "update": "b.x = window.innerWidth/2 + Math.sin(b.t*0.5)*180; b.y = 150 + Math.cos(b.t*0.8)*80; if(Math.random()<0.1) b.fire(); if(b.t % 5 < 0.1) { b.hp += 5; }"
    }
]

for boss in bosses:
    content = f"""(function(){{if(!window.BossRegistry)return;
window.BossRegistry.register('{boss["id"]}',{{
name:'{boss["name"]}',type:'{boss["type"]}',color:'{boss["color"]}',hp:{boss["hp"]},rate:{boss["rate"]},size:{boss["size"]},
bg:{boss["bg"]},music:'{boss["id"]}',
taunt:'{boss["taunt"]}',
tune:{boss["tune"]},
prop:[35,45,0.9],
update:(b,dt,E)=>{{b.t=(b.t||0)+dt;{boss["update"]}}}
}});}})();
"""
    with open(f"js/bosses/{boss['id']}.js", "w") as f:
        f.write(content)

print("Updated 20 bosses logic.")
