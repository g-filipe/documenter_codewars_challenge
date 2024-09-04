import puppeteer from "puppeteer";

export async function getChallengesLinksFromList(url) {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto(url);

  await page.waitForSelector(".list-item-kata a.ml-2");

  await page.evaluate(loadPage);

  await page.waitForFunction('window.finishLoadingChallenges')

  const challenges = await getChallengesLinks(page, ".list-item-kata a.ml-2");

  await browser.close();

  return challenges;
}

async function getChallengesLinks(page, selector) {
  const links = await page.$$eval(selector, (elements) =>
    elements.map((a) => a.href).filter((url) => url != "")
  );

  return links;
}

function loadPage() {
  const interval = setInterval(() => {
    const totalKatasFoundByFiltering = parseInt(
      document.querySelector(".text-ui-text div").textContent.split(" ")[0]
    );
    const kataList = [...document.querySelectorAll(".list-item-kata a.ml-2")]
      .map((a) => a.href)
      .filter((url) => url != "");

    if (kataList.length < totalKatasFoundByFiltering) {
      console.log(
        `Scrolling more... ${kataList.length} / ${totalKatasFoundByFiltering}`
      );
      window.scrollTo(0, document.body.scrollHeight);
    } else {
      console.log(
        `Finish scroll :D  ${kataList.length} / ${totalKatasFoundByFiltering}`
      );

      window.finishLoadingChallenges = true;

      clearInterval(interval);
    }
  }, 2000);
}
