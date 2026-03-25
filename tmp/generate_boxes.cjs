const fs = require('fs');
const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// 1. Remove old injected boxes if any
content = content.replace(/<rect[^>]+rx="23"[^>]+fill="rgba\(8, 12, 24,[^>]+>/g, '');

// 2. Parse all texts and circles
const circleRx = /<circle[^>]*cx="([\d\.]+)"[^>]*cy="([\d\.]+)"/g;
let circles = [];
let mc;
while ((mc = circleRx.exec(content))) {
  circles.push({ cx: parseFloat(mc[1]), cy: parseFloat(mc[2]) });
}

const textRx = /<text\s+transform="matrix\([\d\.\s\-]+([\d\.]+)\s+([\d\.]+)\)"[^>]*>(.*?)<\/text>/g;
let texts = [];
let mt;
while ((mt = textRx.exec(content))) {
  texts.push({ x: parseFloat(mt[1]), y: parseFloat(mt[2]), txt: mt[3].trim() });
}

// 3. For each text, find its closest circle and build a rect
let rectsHTML = `<g id="GLASS_BOXES">\n`;

texts.forEach(t => {
  // Find circle with closest cy
  let c = circles.sort((a, b) => Math.abs(a.cy - t.y) - Math.abs(b.cy - t.y))[0];
  
  let isRight = c.cx > 200; // cx=310 is right, cx=172 is left
  
  // Estimate text width. Approx 10px per character since it's 16px bold Inter.
  let textW = t.txt.length * 9.5; 
  
  let boxY = c.cy - 23;
  let boxH = 46;
  let rx = 23;

  let pad = 24; // padding outside
  let boxLeft = 0;
  let boxRight = 0;

  if (isRight) {
    // Icon is on left, text is on right.
    boxLeft = c.cx - pad;
    boxRight = t.x + textW + (pad/2);
  } else {
    // Icon is on right, text is on left. (Wait! In screenshot, text on left is left of the icon!)
    // So icon cx is e.g. 172. Text x is 68.
    // Box should start left of text, end right of icon.
    // If we look at screenshot, text x is the start of the text. So text goes from t.x to t.x + textW.
    // But wait, the SVG text tags for the left side might be right-aligned!
    // NO, SVG <text> is left aligned by default unless text-anchor="end". Let's check text x.
    // In previous dump: `Texts: { x: 6, y: 287.3994, content: 'Energia Restaurada' }` 
    // x=6. textW=18*9.5=171. Right edge=177. Circle cx=172. So text ends at the circle!
    boxLeft = t.x - pad;
    boxRight = c.cx + pad; 
  }

  let boxW = boxRight - boxLeft;

  rectsHTML += `  <rect x="${boxLeft}" y="${boxY}" width="${boxW}" height="${boxH}" rx="${rx}" fill="rgba(8, 12, 24, 0.6)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" style="backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);" />\n`;
});

rectsHTML += `</g>\n`;

// 4. Inject right before the first <linearGradient id="SVGID_1_"
if (content.includes('<g id="GLASS_BOXES">')) {
   content = content.replace(/<g id="GLASS_BOXES">[\s\S]*?<\/g>\n/, rectsHTML);
} else {
   content = content.replace('<linearGradient id="SVGID_1_"', rectsHTML + '<linearGradient id="SVGID_1_"');
}

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Perfect boxes regenerated!');
