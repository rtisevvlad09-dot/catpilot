import json

boss_names = [
    'Графъ Обломовъ', 'Баронъ Штейнъ', 'Купецъ Брюхатый', 'Атаманъ Мурка', 'Князь Вихрь',
    'Поручикъ Рѣзвый', 'Полковникъ Громъ', 'Сѣрая Тѣнь', 'Адмиралъ Коготь', 'Ханъ Барсъ',
    'Чёрный Командоръ', 'Графиня Ночь', 'Магистръ Винтъ', 'Княжна Метель', 'Баронъ Штопоръ',
    'Старшина Гроза', 'Графъ Рикошетъ', 'Мадамъ Миражъ', 'Генералъ Тайфунъ', 'Императоръ Пустоты'
]

translations = {
    'Графъ Обломовъ': 'Count Oblomov',
    'Баронъ Штейнъ': 'Baron Stein',
    'Купецъ Брюхатый': 'Merchant Bryukhaty',
    'Атаманъ Мурка': 'Ataman Murka',
    'Князь Вихрь': 'Prince Whirlwind',
    'Поручикъ Рѣзвый': 'Lieutenant Frisky',
    'Полковникъ Громъ': 'Colonel Thunder',
    'Сѣрая Тѣнь': 'Gray Shadow',
    'Адмиралъ Коготь': 'Admiral Claw',
    'Ханъ Барсъ': 'Khan Snow Leopard',
    'Чёрный Командоръ': 'Black Commander',
    'Графиня Ночь': 'Countess Night',
    'Магистръ Винтъ': 'Magister Propeller',
    'Княжна Метель': 'Princess Blizzard',
    'Баронъ Штопоръ': 'Baron Corkscrew',
    'Старшина Гроза': 'Sergeant Major Storm',
    'Графъ Рикошетъ': 'Count Ricochet',
    'Мадамъ Миражъ': 'Madame Mirage',
    'Генералъ Тайфунъ': 'General Typhoon',
    'Императоръ Пустоты': 'Emperor of the Void'
}

boss_concepts = [
    "A slow but heavily armored blimp piloted by a lazy dog.",
    "A sniper dog in a sleek, fast monoplane with a long barrel extending from the nose.",
    "A fat merchant dog flying a wide, cargo-style plane that shoots gold coins or debris.",
    "A rogue cat flying a patchwork, stolen biplane with chaotic paint.",
    "A very fast, spinning plane creating small tornados, piloted by an aristocratic dog.",
    "A highly maneuverable, light fighter plane doing barrel rolls constantly.",
    "A heavy bomber dropping explosive shells, creating thunderous sounds.",
    "A stealthy, dark-colored plane that fades in and out of the fog.",
    "A naval-style seaplane with sharp, claw-like pontoons.",
    "An exotic, fur-lined plane flown by a fierce snow leopard.",
    "An imposing, black triplane with a menacing skull insignia.",
    "A gothic, bat-winged aircraft that attacks exclusively in night-like darkness.",
    "A bizarre, experimental aircraft with an absurd amount of propellers.",
    "A white, sleek plane that freezes the air around it, creating snow.",
    "A fighter plane that attacks by flying in rapid downward spirals.",
    "A rugged, battle-scarred heavy fighter crackling with static electricity.",
    "A plane that shoots projectiles which bounce off the edges of the screen.",
    "A deceptive aircraft that creates holographic duplicates of itself.",
    "A massive flying fortress that takes up half the screen, heavily armed.",
    "The ultimate boss: a futuristic, dark zeppelin with strange glowing energy weapons."
]

for i in range(20):
    boss_name_ru = boss_names[i]
    boss_name_en = translations.get(boss_name_ru, f"Boss {i+1}")
    concept = boss_concepts[i]

    prompt = f"""
Create a highly detailed, 2D game asset sprite for a boss character.
Name: {boss_name_en}
Description/Concept: {concept}
Art Style: Early 1900s aviation meets animal characters (dogs vs cats), steampunk/dieselpunk elements, hand-drawn aesthetic similar to Studio Ghibli but slightly grittier.
Perspective: Top-down or slight isometric view, suitable for a vertical scrolling shoot 'em up game.
Background: Transparent or solid green chroma key.
"""

    filename = f"prompts/bosses/boss{i+1}_{boss_name_en.replace(' ', '_').lower()}_prompt.txt"
    with open(filename, 'w') as f:
        f.write(prompt)

print(f"Created 20 boss prompts in prompts/bosses/")
