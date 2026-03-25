const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// The greens to replace with cyan variations:
const replacements = {
  '#A2E0B8': '#4b9fbe', // Lightest green -> Cyan light-mid
  '#A7E1D5': '#67bfd2', // Base shadow -> Cyan light
  '#8ACAAF': '#3299c2', // Edge strokes -> Cyan main
  '#87C4B7': '#38a0c7', // Darker dots -> Cyan mid-dark
};

for (const [oldC, newC] of Object.entries(replacements)) {
  // Global replace (case-insensitive flag just in case)
  const regex = new RegExp(oldC, 'gi');
  content = content.replace(regex, newC);
}

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Colors replaced successfully!');
