export function createChallengeReadme(challengeInfo) {
  return `## ${challengeInfo.title}
### Difficulty: ${challengeInfo.difficulty}
<br>
${challengeInfo.description}
<br>
#### Sample Tests:
\`\`\`
${challengeInfo.sampleTests}
\`\`\`
`;
}
