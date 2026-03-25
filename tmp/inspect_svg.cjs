const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// Find all circles that are around r=19.8 or so
const cxCyRx = /<circle[^>]*cx="([\d\.]+)"[^>]*cy="([\d\.]+)"[^>]*r="([\d\.]+)"/g;
let circles = [...content.matchAll(cxCyRx)].map(m => ({ cx: parseFloat(m[1]), cy: parseFloat(m[2]), r: parseFloat(m[3]) }));

// Find all texts inside <text> tag
const textRx = /<text[^>]*transform="matrix\([^)]+([\d\.]+)\s+([\d\.]+)\)"[^>]*>([^<]+)<\/text>/g;
let texts = [...content.matchAll(textRx)].map(m => ({ x: parseFloat(m[1]), y: parseFloat(m[2]), content: m[3] }));

console.log('Circles:', circles);
console.log('Texts:', texts);
