const fs = require('fs');
const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// 1. Remove old injected boxes
content = content.replace(/<rect[^>]+rx="25"[^>]+fill="rgba\(8, 12, 24,[^>]+>/g, '');
content = content.replace(/<g id="GLASS_BOXES">[\s\S]*?<\/g>\n?/, '');

// 2. Parse circles
const circleRx = /<circle[^>]*cx="([\d\.]+)"[^>]*cy="([\d\.]+)"/g;
let circles = [];
let mc;
while ((mc = circleRx.exec(content))) {
  if (!circles.some(c => c.cx === parseFloat(mc[1]) && c.cy === parseFloat(mc[2]))) {
     circles.push({ cx: parseFloat(mc[1]), cy: parseFloat(mc[2]) });
  }
}
circles = circles.filter(c => c.cx > 100 && c.cx < 400 && c.cy > 50 && c.cy < 450);

// 3. Fix the texts on the left side to be text-anchor="end" and correct their X coordinate
// We iterate over the 3 texts on the left and replace them with properly aligned ones.
const leftTexts = ["Clareza Mental", "Conexões Reais", "Energia Restaurada"];
leftTexts.forEach(lt => {
  // Find the text tag containing this phrase
  // Note: the regex must match the whole tag to replace it.
  const re = new RegExp(`<text[^>]*transform="matrix\\([^\\)]*\\s+([\\-\\d\\.]+)\\s+([\\d\\.]+)\\)"[^>]*>\\s*${lt}\\s*<\\/text>`, 'i');
  let match = content.match(re);
  if (match) {
     let oldTag = match[0];
     let oldX = match[1];
     let oldY = match[2];
     
     // New Target X is around cx - 35
     // c.cx is 172.03. So newX = 135
     let newX = '135';
     // Replace the matrix's X value
     let newTag = oldTag.replace(oldX, newX);
     // Insert text-anchor attribute
     if (!newTag.includes('text-anchor')) {
         newTag = newTag.replace('<text ', '<text text-anchor="end" ');
     }
     content = content.replace(oldTag, newTag);
  }
});


// 4. Parse all texts to generate boxes
const textRx = /<text\s*(?:text-anchor="end"\s*)?transform="matrix\([^\)]*\s+([\-\d\.]+)\s+([\d\.]+)\)"[^>]*>([^<]+)<\/text>/g;
let texts = [];
let mt;
while ((mt = textRx.exec(content))) {
  let txtContent = mt[3].trim();
  if (txtContent.length > 5) {
     let isEndAligned = mt[0].includes('text-anchor="end"');
     texts.push({ x: parseFloat(mt[1]), y: parseFloat(mt[2]), txt: txtContent, isEnd: isEndAligned });
  }
}

// 5. Generate the boxes
let rectsHTML = `<g id="GLASS_BOXES">\n`;

texts.forEach(t => {
  // Find circle with closest cy
  let c = [...circles].sort((a, b) => Math.abs(a.cy - t.y) - Math.abs(b.cy - t.y))[0];
  
  // Calculate bounding box
  let textW = t.txt.length * 8.5; 
  
  let textLeft = t.isEnd ? t.x - textW : t.x;
  let textRight = t.isEnd ? t.x : t.x + textW;
  
  let iconLeft = c.cx - 24;
  let iconRight = c.cx + 24;

  let boxLeft = Math.min(textLeft, iconLeft) - 20;
  let boxRight = Math.max(textRight, iconRight) + 20;
  
  let boxW = boxRight - boxLeft;
  let boxH = 50; 
  let boxY = c.cy - 25; 
  let rx = 25;

  rectsHTML += `  <rect x="${boxLeft}" y="${boxY}" width="${boxW}" height="${boxH}" rx="${rx}" fill="rgba(8, 12, 24, 0.65)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.5" style="backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);" />\n`;
});

rectsHTML += `</g>\n`;

// 6. Inject the box group
let insertTarget = '<linearGradient id="SVGID_1_"';
if (content.includes(insertTarget)) {
  content = content.replace(insertTarget, rectsHTML + insertTarget);
} else {
  // Check if we already injected them but somehow missed the remove regex
  // This is safe since we used precise targeting above
}

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Left texts shifted and all boxes recalculated!');
