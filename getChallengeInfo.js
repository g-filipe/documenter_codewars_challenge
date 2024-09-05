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

  await sleep(1500)

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
  await page.waitForSelector(selector);

  const element = await page.$(selector);

  return await page.evaluate((el) => el.textContent, element);
}

async function getElementInnerHtml(page, selector) {
  await page.waitForSelector(selector);

  const element = await page.$(selector);

  return await page.evaluate((el) => el.innerHTML, element);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
