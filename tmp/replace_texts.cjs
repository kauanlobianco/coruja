const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

const replacements = {
  'CROWN CHAKRA': 'Controle Consciente',
  'THROAT CHAKRA': 'Orgulho Genuíno',
  'SOLAR PLEXUS': 'Autoconfiança Forte',
  'ROOT CHAKRA': 'Hábitos Saudáveis',
  'THIRD EYE': 'Clareza Mental',
  'HEART CHAKRA': 'Conexões Reais',
  'SACRAL CHAKRA': 'Energia Restaurada'
};

for (const [oldTxt, newTxt] of Object.entries(replacements)) {
  content = content.replace(oldTxt, newTxt);
}

// Ensure the texts are white or a light color that reads well on the dark background.
// The texts have style="fill:#6A70D6;..." We should change their color to white or amber for better legibility.
content = content.replace(/fill:#6A70D6/g, 'fill:#e9e6e2'); // e9e6e2 is the app's primary text color
content = content.replace(/font-size:7.2404px/g, 'font-size:9px'); // increase font slightly for readability
content = content.replace(/font-size:7.2405px/g, 'font-size:9px');

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Text replacements done!');
