const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

const replacements = {
  '#1D3244': '#2e5f72',
  '#243F54': '#356a7d',
  '#101E2E': '#1c3e4d',
  '#354F66': '#3b788c'
};

for (const [oldHex, newHex] of Object.entries(replacements)) {
  const regex = new RegExp(oldHex, 'gi');
  content = content.replace(regex, newHex);
}

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Background leaves replaced with aquatic cyan blue!');
