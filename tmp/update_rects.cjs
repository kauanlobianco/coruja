const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// Replace width="180" with width="230"
content = content.replace(/width="180"/g, 'width="230"');

// Left side boxX was `cx - 117`. If I increase width by 40, to keep icon contained, it should grow to the left.
// so boxX needs to move left by another 40. Originally it was -117, meaning it goes 117 to the left.
// And width was 142. So right edge was `cx + 25`. This correctly encompasses the icon!
// Let's replace width="142" with width="182", and x="cx-117" with x="cx-157".
// Instead of complex math, I'll just change all the `<rect>` attributes based on their current x.

const rx = /<rect x="([\d\.]+)" y="([\d\.]+)" width="([\d\.]+)" height="46" rx="23" fill="rgba\(8, 12, 24, 0.45\)" stroke="rgba\(255, 255, 255, 0.2\)" stroke-width="1.5" \/>/g;

let newContent = content.replace(rx, (match, p1, p2, p3) => {
  let x = parseFloat(p1);
  let isRight = x > 200; // Right side x was 285 (310-25)
  if (isRight) {
     return `<rect x="${x}" y="${p2}" width="230" height="46" rx="23" fill="rgba(8, 12, 24, 0.6)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" style="backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);" />`;
  } else {
     // Left side, x was 55. Let's make it 25 to give 30px more space to the left.
     let newX = x - 30;
     let newW = parseFloat(p3) + 30;
     return `<rect x="${newX}" y="${p2}" width="${newW}" height="46" rx="23" fill="rgba(8, 12, 24, 0.6)" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5" style="backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);" />`;
  }
});

fs.writeFileSync(FILE_PATH, newContent, 'utf8');
console.log('Rect widths updated and backdrop-filter applied!');
