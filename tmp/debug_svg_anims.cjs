const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// The white bug at the top left could be the `display:none` or the text replacements that broke.
// Let's print out what the `<text>` tags look like now!
const texts = [...content.matchAll(/<text[\s\S]*?<\/text>/g)];
texts.forEach(t => console.log('Text element:', t[0]));

// Let's check for any orphaned or broken elements near the top
const broken = [...content.matchAll(/<[^>]*class="anim-cascade[^>]*>/g)];
console.log('Broken classes or elements:', broken.slice(0, 5));
