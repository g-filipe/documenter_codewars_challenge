import puppeteer from "puppeteer";

export async function login() {
  console.log("Logging in... ");

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "session",
    defaultViewport: null,
    args: ["--hide-crash-restore-bubble"],
  });

  const page = (await browser.pages())[0];

  await page.goto("https://www.codewars.com/users/sign_in");
  await page.waitForFunction(
    'document.location.href == "https://www.codewars.com/dashboard"',
    {
      timeout: 3000000,
    }
  );

  await browser.close();

  console.log("Logged in successfully!");
}
