const fs = require('fs');
let s = fs.readFileSync('public/meditation.svg', 'utf8');

let circles = [];
let reC = /<circle[^>]*cx="([\d\.]+)"[^>]*cy="([\d\.]+)"[^>]*r="19\.824"/g;
let m;
while(m = reC.exec(s)) circles.push({cx: +m[1], cy: +m[2]});

let texts = [];
// In the SVG, the matrix might be like matrix(1 0 0 1 x y) or matrix(something x y)
let reT = /<text[^>]*transform="matrix\([^\)]*\s+([\-\d\.]+)\s+([\d\.]+)\)"[^>]*>([^<]*)<\/text>/g;
while(m = reT.exec(s)) texts.push({x: +m[1], y: +m[2], text: m[3]});

console.log('Circles:', circles.length, circles);
console.log('Texts:', texts.length, texts);
