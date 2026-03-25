const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// 1. Remove ALL `class="..."`
content = content.replace(/class="[^"]*"/g, '');

// 2. Remove the injected CSS animations <style> section that I added.
// It starts with /* Storyset-style fluid animations */
const animStart = content.indexOf('/* Storyset-style fluid animations */');
if (animStart !== -1) {
  const styleClose = content.indexOf('</style>', animStart);
  content = content.slice(0, animStart) + content.slice(styleClose, content.length);
}

// 3. Let's make sure the <text> tags are intact:
const texts = [...content.matchAll(/<text[^>]*>([^<]+)<\/text>/g)];
console.log('Intact texts found:', texts.length);
if (texts.length < 7) {
   console.log('WARNING: Some texts are missing!');
}

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Cleaned all animations and classes!');
