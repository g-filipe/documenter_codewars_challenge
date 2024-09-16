import fs from "fs";
import "dotenv/config";
import { generateFromTemplate } from "./template.js";
import { diffieHellman } from "crypto";

const foldersExcludes = [".git", ".idea"];

const difficultyColorMapping = {
  "8 kyu": "#006628",
  "7 kyu": "#006628",
  "6 kyu": "#ecb631",
  "5 kyu": "#ecb631",
  "4 kyu": "#3c7ebb",
  "3 kyu": "#3c7ebb",
  "2 kyu": "#866CC7",
  "1 kyu": "#866CC7",
};

export function generateMainReadme() {
  const prefix = process.env.REPOSITORY_URL;
  const projectDir = process.env.PROJECT_DIR_PATH;
  const languageFolders = [];

  try {
    getDirectories(projectDir).forEach((languageDirectoryName) => {
      
      const languageFolder = {
        challenges: [],
        lang: languageDirectoryName
      }

      languageFolders.push(languageFolder)

      getDirectories(`${projectDir}/${languageDirectoryName}`).forEach((difficultyDirectoryName) => {

        getDirectories(`${projectDir}/${languageDirectoryName}/${difficultyDirectoryName}`).forEach(
          (directoryName) => {
            let formattedDirectoryName = directoryName.replaceAll("_", " ");
  
            const path = `${projectDir}/${languageDirectoryName}/${difficultyDirectoryName}/${directoryName}`;
  
            let difficulty;
  
            try {
              difficulty = getDifficulty(`${path}/README.md`);
            } catch (err) {
              console.error(err);
              difficulty = "Unknown";
            }
  
            languageFolder.challenges.push({
              title: formattedDirectoryName,
              url: `${prefix}/${difficultyDirectoryName}/${directoryName}`,
              difficulty,
              difficultyColor: difficultyColorMapping[difficulty],
            });
          }
        );
      });
    })
  } catch (err) {
    console.error("Error reading the folder:", err);
  }

  languageFolders.forEach((languageFolder) => languageFolder.challenges.sort((a, b) => b.difficulty.localeCompare(a.difficulty)))
  const readme = generateFromTemplate('mainReadme.hbs', {
    languageFolders,
    codewarsProfile: process.env.CODEWARS_PROFILE
  })

  fs.writeFileSync(`${projectDir}/README.md`, readme);
}

function getDirectories(directoryPath) {
  const files = fs.readdirSync(directoryPath, { withFileTypes: true });

  return files
    .filter((file) => file.isDirectory())
    .map((dir) => dir.name)
    .filter((dirName) => !foldersExcludes.includes(dirName));
}

function getDifficulty(filePath) {
  if (!fs.existsSync(filePath)) {
    throw `File not found: ${filePath}`;
  }

  const fileContent = fs.readFileSync(filePath);
  const result = fileContent.toString().match(/Difficulty: ([\w ]+)/);

  if (!result || !result[1]) {
    throw `Error extracting the difficulty in the file: ${filePath}`;
  }

  return result[1];
}
