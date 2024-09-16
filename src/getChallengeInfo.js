import { yellow } from "yoctocolors";
import { getBrowserPage } from "./browser.js";

export async function getChallengeInfo(url) {
  const page = await getBrowserPage();

  await page.goto(url);

  const title = await getElementContent(page, "h4.ml-2");

  const difficulty = await getElementContent(page, ".inner-small-hex span");

  const description = await getElementInnerHtml(page, "#description");

  await page.evaluate('document.querySelector("#replay_btn").click()');

  await page.waitForSelector("pre[lang]");

  const submissionList = await page.evaluate(() => {
    const solutionsByLanguages = [
      ...document.querySelectorAll("pre[lang]"),
    ].reduce((acc, pre) => {
      const lang =
        pre.parentElement.parentElement.querySelector("p").textContent;
      const solution = pre.textContent;
      const langObj = acc.find((x) => x.lang == lang);
      if (!langObj) {
        acc.push({
          lang,
          solutions: [solution],
        });
      } else {
        langObj.solutions.push(solution);
      }
      return acc;
    }, []);

    return solutionsByLanguages.map(({ lang, solutions }) => ({
      lang,
      solution: solutions[solutions.length - 1],
    }));
  });

  await sleep(2000);

  const sampleTests = await page.evaluate(() =>
    [
      ...document
        .querySelectorAll(".CodeMirror-code")[1]
        .querySelectorAll(".CodeMirror-line"),
    ]
      .map((line) => line.textContent)
      .join("\n")
  );

  return {
    title,
    difficulty,
    description,
    submissionList,
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
