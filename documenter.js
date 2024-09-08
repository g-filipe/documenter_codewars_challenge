import { execSync } from "child_process";
import { writeFileSync, existsSync } from "fs";
import sanitizeFilename from "sanitize-filename";
import { getChallengeInfo } from "./getChallengeInfo.js";
import { generateChallengeReadme } from "./generateChallengeReadme.js";

export async function documenter(url) {
  const challengeInfo = await getChallengeInfo(url);
  const challengeReadme = generateChallengeReadme(challengeInfo);
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

  if (existsSync(challengePath)) {
    return;
  }

  try {
    execSync(`mkdir -p ${challengePath}`);
    console.log(`Pasta ${challengeFolderName} criada com sucesso!`);
  } catch (error) {
    console.error(`Erro ao criar a pasta ${challengePath}:`, error);
  }

  writeFileSync(`${challengePath}/README.md`, challengeReadme);
  writeFileSync(`${challengePath}/solution.sql`, challengeInfo.solution);
}
