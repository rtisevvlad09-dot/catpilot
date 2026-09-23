import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Enable console logging to see what's happening
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

        await page.goto("http://localhost:3000")

        # We need to manually jump to the night level to check city rendering.
        # Let's bypass UI interactions and inject javascript to load level 13 (index 12, Night) directly.
        await page.evaluate("""
            window.Screens.show('Briefing', { level: 12, data: window.LEVELS[12] });
        """)

        print("Briefing shown for level 13. Attempting to click start flight.")
        # Try to click start, or bypass it
        await asyncio.sleep(1)

        # If click fails, we bypass the button entirely and trigger flight.
        await page.evaluate("""
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Въ полётъ!') || b.innerText.includes('Start') || b.innerText.includes('полёт'));
            if (btn) {
                btn.click();
            } else {
                console.log("Button not found. Forcing flight screen.");
                if (window.FlightGame) window.FlightGame.start({ level: 12, data: window.LEVELS[12] });
            }
        """)

        print("Flight started for level 13 (Night). Waiting for rendering.")
        await asyncio.sleep(4)

        print("Capturing screenshot.")
        await page.screenshot(path="verification/screenshots/verification_night.png")
        print("Done.")
        await browser.close()

asyncio.run(main())
