import "dotenv/config";
import { login } from "./login.js";
import { getChallengesLinksFromList } from "./getChallengesLinksFromList.js";

await login();

const urls = await getChallengesLinksFromList(
  "https://www.codewars.com/kata/search/sql?q=&r%5B%5D=-8&xids=not_completed&beta=false&order_by=sort_date%20desc"
);

for (const url of urls) {
  const challengeInfo = await getChallengeInfo(url);
  console.log(challengeInfo)
}
