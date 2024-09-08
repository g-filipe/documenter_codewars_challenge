import { getBrowserPage } from "./browser.js";

export async function login() {
  console.log("Logging in... ");

  const page = await getBrowserPage();

  await page.goto("https://www.codewars.com/users/sign_in");
  await page.waitForFunction(
    'document.location.href == "https://www.codewars.com/dashboard"',
    {
      timeout: 3000000,
    }
  );

  console.log("Logged in successfully!");
}
