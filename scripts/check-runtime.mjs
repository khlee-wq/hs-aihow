const requiredMajor = 22;
const currentVersion = process.versions.node;
const currentMajor = Number(currentVersion.split(".")[0]);

if (currentMajor !== requiredMajor) {
  console.error(
    `Node.js ${requiredMajor}.x is required, but ${currentVersion} is active. Run \`nvm install && nvm use\` from the repository root.`,
  );
  process.exit(1);
}

console.log(`Runtime is valid: Node.js ${currentVersion}.`);
