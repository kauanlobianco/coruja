const fs = require('fs');
const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// 1. Remove old injected boxes
content = content.replace(/<rect[^>]+rx="23"[^>]+fill="rgba\(8, 12, 24,[^>]+>/g, '');
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
// Keep only 7 circles that look like the icons
circles = circles.filter(c => c.cx > 100 && c.cx < 400 && c.cy > 50 && c.cy < 450);

// 3. Parse texts
const textRx = /<text[^>]*transform="matrix\([^\)]*\s+([\-\d\.]+)\s+([\d\.]+)\)"[^>]*>([^<]+)<\/text>/g;
let texts = [];
let mt;
while ((mt = textRx.exec(content))) {
  let txtContent = mt[3].trim();
  // Filter out any unwanted texts, though there should only be the 7 we replaced.
  if (txtContent.length > 5) {
     texts.push({ x: parseFloat(mt[1]), y: parseFloat(mt[2]), txt: txtContent });
  }
}

console.log(`Matched ${circles.length} circles and ${texts.length} texts.`);

// 4. Generate the boxes
let rectsHTML = `<g id="GLASS_BOXES">\n`;

texts.forEach(t => {
  // Find circle with closest cy
  let c = [...circles].sort((a, b) => Math.abs(a.cy - t.y) - Math.abs(b.cy - t.y))[0];
  
  // Calculate bounding box
  let textW = t.txt.length * 8.5; // Approx pixel width of bold Inter size 16px
  
  let isRightAligned = t.x < c.cx; // If text starts before the circle
  
  // Actually, we don't care about isRightAligned! We just use min and max!
  let textLeft = t.x;
  let textRight = t.x + textW;
  
  let iconLeft = c.cx - 24;
  let iconRight = c.cx + 24;

  // Add 16px padding on both sides
  let boxLeft = Math.min(textLeft, iconLeft) - 20;
  let boxRight = Math.max(textRight, iconRight) + 20;
  
  let boxW = boxRight - boxLeft;
  let boxH = 50; 
  let boxY = c.cy - 25; // Centered vertically around the circle
  let rx = 25; // Fully rounded pills

  rectsHTML += `  <rect x="${boxLeft}" y="${boxY}" width="${boxW}" height="${boxH}" rx="${rx}" fill="rgba(8, 12, 24, 0.65)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.5" style="backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);" />\n`;
});

rectsHTML += `</g>\n`;

// 5. Inject right before the first <linearGradient
// Because we might have replaced things, we search for `<linearGradient id="SVGID_1_"`
// or alternatively `<g id="OBJECTS">` 
let insertTarget = '<linearGradient id="SVGID_1_"';
if (content.includes(insertTarget)) {
  content = content.replace(insertTarget, rectsHTML + insertTarget);
} else {
  // fallback to after <g id="OBJECTS">
  content = content.replace('<g id="OBJECTS">\n\t<g>', '<g id="OBJECTS">\n\t<g>\n' + rectsHTML);
}

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Fixed boxes calculated and rebuilt perfectly!');
