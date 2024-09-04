import "dotenv/config";
import { login } from "./login.js";
import { getChallengesLinksFromList } from "./getChallengesLinksFromList.js";

await login();

const urls = await getChallengesLinksFromList(
  "https://www.codewars.com/kata/search/sql?q=&r%5B%5D=-8&xids=not_completed&beta=false&order_by=sort_date%20desc"
);

console.log(urls.length)
console.log(urls)
