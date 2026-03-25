const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

const replacements = {
  // Shirt
  '#7A44BE': '#F3791A',
  
  // Pants
  '#380D35': '#324B53',
  
  // Skin
  '#C17364': '#F29D88',
  
  // Hair, mustache, outlines
  '#1C011F': '#23323A',
  '#170C12': '#23323A',
  
  // Shadows (pants/details)
  '#381C2B': '#253B42',
  '#371D2B': '#253B42'
};

for (const [oldHex, newHex] of Object.entries(replacements)) {
  // Replace case-insensitive
  const regex = new RegExp(oldHex, 'gi');
  content = content.replace(regex, newHex);
}

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Character colors replaced to match reference image!');
