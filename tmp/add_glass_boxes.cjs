const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// Remove the inline display:none that I left last time since I want a clean slate
content = content.replace(/display:none/g, 'display:none');

// The pattern finds each chakra's linearGradient and circle.
const rx = /(<linearGradient[^>]+>[\s\S]{0,300}?<circle[^>]*cx="([\d\.]+)"[^>]*cy="([\d\.]+)".*?>)/g;

let matches = [...content.matchAll(rx)];

matches.forEach(m => {
  let cx = parseFloat(m[2]);
  let cy = parseFloat(m[3]);
  let fullMatch = m[1];
  
  let isRight = cx > 250; // cx is ~310 for right, ~172 for left
  
  // Right side: icon is at 310. Text is to the right. 
  // Box starts left of icon at 285, ends past text at 480. Width = 195.
  // Left side: icon is at 172. Text is to the left at ~68.
  // Box starts left of text at 55, ends right of icon at 197. Width = 142.
  let rxNum = 23; 
  let boxY = cy - 23;
  let boxH = 46;
  let boxX = isRight ? cx - 25 : cx - 117;
  let boxW = isRight ? 180 : 142;

  let rect = `\n<rect x="${boxX}" y="${boxY}" width="${boxW}" height="${boxH}" rx="${rxNum}" fill="rgba(8, 12, 24, 0.45)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" />\n`;

  content = content.replace(fullMatch, rect + fullMatch);
});

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Glassy boxes successfully injected!');
