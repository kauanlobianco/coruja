const fs = require('fs');
const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// Update font size from 13.5px to 18px! Make it huge and extremely legible.
// We also increase letter-spacing slightly for bolder look.
content = content.replace(/font-size: 13.5px !important;/g, 'font-size: 18px !important;\n      letter-spacing: -0.01em !important;');

// To avoid the text bleeding out of the viewBox now that the font is 18px, let's slightly push the left-anchored texts 5px more to the right, and the right-anchored texts 5px more to the left?
// No, viewBox was generous enough (-55 to +540). The texts are close to the circles.

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Font size zoomed up to 18px!');
