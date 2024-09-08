import fs from "fs";
import "dotenv/config";
import { generateFromTemplate } from "./template.js";

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
  const challenges = [];

  try {
    getDirectories(projectDir).forEach((difficultyDirectoryName) => {
      getDirectories(`${projectDir}/${difficultyDirectoryName}`).forEach(
        (directoryName) => {
          let formattedDirectoryName = directoryName.replaceAll("_", " ");

          const path = `${projectDir}/${difficultyDirectoryName}/${directoryName}`;

          let difficulty;

          try {
            difficulty = getDifficulty(`${path}/README.md`);
          } catch (err) {
            console.error(err);
            difficulty = "Unknown";
          }

          challenges.push({
            title: formattedDirectoryName,
            url: `${prefix}/${difficultyDirectoryName}/${directoryName}`,
            difficulty,
            difficultyColor: difficultyColorMapping[difficulty],
          });
        }
      );
    });
  } catch (err) {
    console.error("Erro ao ler a pasta:", err);
  }

  const readme = generateFromTemplate('mainReadme.hbs', {
    challenges,
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
    throw `Arquivo não encontrado: ${filePath}`;
  }

  const fileContent = fs.readFileSync(filePath);
  const result = fileContent.toString().match(/Difficulty: ([\w ]+)/);

  if (!result || !result[1]) {
    throw `Erro ao extrair a dificuldade no arquivo: ${filePath}`;
  }

  return result[1];
}
