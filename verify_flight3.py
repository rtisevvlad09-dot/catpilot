import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # Enable console logging to see what's happening
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

        await page.goto("http://localhost:3000")

        print("Waiting for game to initialize...")
        # Wait a bit longer to ensure scripts are fully loaded
        await asyncio.sleep(3)

        print("Bypassing menu logic via JS.")
        await page.evaluate("""
            if (window.FlightGame) {
                window.FlightGame.start({ level: 12, data: window.LEVELS[12] });
            } else {
                console.error("window.FlightGame not found!");
            }
        """)

        print("Flight started for level 13 (Night). Waiting for rendering.")
        await asyncio.sleep(4)

        print("Capturing screenshot.")
        await page.screenshot(path="verification/screenshots/verification_night.png")
        print("Done.")
        await browser.close()

asyncio.run(main())
