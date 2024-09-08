import { execSync } from "child_process";
import { writeFileSync } from "fs";
import sanitizeFilename from "sanitize-filename";
import { blue } from "yoctocolors";
import { getChallengeInfo } from "./getChallengeInfo.js";
import { generateFromTemplate } from "./template.js";

export async function documenter(url) {
  const challengeInfo = await getChallengeInfo(url);
  const challengeReadme = generateFromTemplate('challengeReadme.hbs', challengeInfo)
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

  const challengePath = `${projectDir}/${difficultyFolderName}/${challengeFolderName}`;

  try {
    execSync(`mkdir -p ${challengePath}`);
  } catch (error) {
    console.error(`Error creating folder ${challengePath}:`, error);
  }

  writeFileSync(`${challengePath}/README.md`, challengeReadme);
  writeFileSync(`${challengePath}/solution.sql`, challengeInfo.solution);

  console.log(
    `Challenge ${blue(challengeInfo.title)} documented successfully!`
  );
}
