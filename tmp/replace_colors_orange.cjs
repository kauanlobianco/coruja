const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// The cyan colors to replace with amber/ember variations:
const replacements = {
  '#4b9fbe': '#e35b2e', // Cyan -> Ember
  '#67bfd2': '#ec9e32', // Cyan -> Amber
  '#3299c2': '#f97316', // Cyan -> Ember light
  '#38a0c7': '#fbbf24', // Cyan -> Gold
};

for (const [oldC, newC] of Object.entries(replacements)) {
  // Global replace (case-insensitive flag just in case)
  const regex = new RegExp(oldC, 'gi');
  content = content.replace(regex, newC);
}

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Colors replaced with orange/amber successfully!');
