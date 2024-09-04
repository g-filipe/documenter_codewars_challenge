import puppeteer from "puppeteer";

export async function login() {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "session",
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 800,
    deviceScaleFactor: 1,
    isMobile: false,
  });

  await page.goto("https://www.codewars.com/users/sign_in");
  await page.waitForFunction(
    'document.location.href == "https://www.codewars.com/dashboard"',
    {
      timeout: 3000000,
    }
  );

  await browser.close();
}
