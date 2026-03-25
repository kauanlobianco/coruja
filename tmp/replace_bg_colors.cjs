const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

const replacements = {
  '#e35b2e': '#1D3244',
  '#ec9e32': '#243F54',
  '#f97316': '#101E2E',
  '#fbbf24': '#354F66'
};

for (const [oldHex, newHex] of Object.entries(replacements)) {
  // global case-insensitive replace
  const regex = new RegExp(oldHex, 'gi');
  content = content.replace(regex, newHex);
}

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Background leaves replaced with dark cyan!');
