import { execSync } from "child_process";
import { writeFileSync } from "fs";
import sanitizeFilename from "sanitize-filename";
import { blue, yellow } from "yoctocolors";
import { getChallengeInfo } from "./getChallengeInfo.js";
import { generateFromTemplate } from "./template.js";
import { languagesExtensions } from "./langExtensions.js";

export async function documenter(url) {
  const challengeInfo = await getChallengeInfo(url);
  const challengeReadme = generateFromTemplate(
    "challengeReadme.hbs",
    challengeInfo
  );
  const projectDir = process.env.PROJECT_DIR_PATH;

  const challengeFolderName = sanitizeFilename(challengeInfo.title, {
    replacement: "_",
  })
    .replaceAll(" ", "_")
    .replaceAll(/[,!\-#.'"()]/g, "_")
    .replaceAll(/_+/g, "_")
    .replace(/_$/, "");

  const difficultyFolderName = sanitizeFilename(
    challengeInfo.difficulty.replaceAll(" ", ""),
    { replacement: "_" }
  );

  for (const { lang, solution } of challengeInfo.submissionList) {
    const challengePath = `${projectDir}/${lang}/${difficultyFolderName}/${challengeFolderName}`;

    try {
      execSync(`mkdir -p ${challengePath}`);
    } catch (error) {
      console.error(`Error creating folder ${challengePath}:`, error);
    }

    writeFileSync(`${challengePath}/README.md`, challengeReadme);
    writeFileSync(`${challengePath}/solution${languagesExtensions[lang]}`, solution);
  }

  console.log(
    `Challenge ${blue(challengeInfo.title)} documented successfully!`
  );
}
