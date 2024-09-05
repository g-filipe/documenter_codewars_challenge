import puppeteer from "puppeteer";

export async function getChallengeInfo(url) {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: "session",
  });
  const page = await browser.newPage();

  await page.goto(url);

  const title = await getElementContent(page, "h4.ml-2");

  const difficulty = await getElementContent(page, ".inner-small-hex span");

  const description = await getElementInnerHtml(page, "#description");

  await page.evaluate('document.querySelector("#replay_btn").click()');

  const solution = await getElementContent(page, "pre.p-2 code");

  await page.waitForFunction(
    () =>
      document
        .querySelector("#fixture_container")
        ?.textContent?.match(/DB\[:([^\]]*)\]/)?.[1]
  );

  const sampleTests = await page.evaluate(() =>
    [
      ...document
        .querySelectorAll(".CodeMirror-code")[1]
        .querySelectorAll(".CodeMirror-line"),
    ]
      .map((line) => line.textContent)
      .join("\n")
  );

  await browser.close();

  return {
    title,
    difficulty,
    description,
    solution,
    sampleTests,
  };
}

async function getElementContent(page, selector) {
  await page.waitForSelector(selector, { timeout: 3000000 });

  const element = await page.$(selector);

  return await page.evaluate((el) => el.textContent, element);
}

async function getElementInnerHtml(page, selector) {
  await page.waitForSelector(selector);

  const element = await page.$(selector);

  return await page.evaluate((el) => el.innerHTML, element);
}
