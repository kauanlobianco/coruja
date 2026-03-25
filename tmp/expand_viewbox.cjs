const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// We massively increase the viewBox to ensure NOTHING is ever cut inside the SVG canvas.
content = content.replace(/viewBox="[^"]+"/, 'viewBox="-175 -50 850 600"');

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('SVG viewBox vastly expanded!');
