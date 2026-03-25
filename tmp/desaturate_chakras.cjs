const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// Build mappings to tone down neon saturations to matte UI colors
const colorGroups = [
  // Purple to Lavender
  { olds: ['C163FF', 'BA63FF', 'A561FF', '9C61FF'], newHex: '#997DC4' },
  // Cyan to Soft Teal
  { olds: ['00CDFF', '00D4FE', '00E6FD'], newHex: '#52ACB7' },
  // Yellow to Warm Gold
  { olds: ['FF9700', 'FC9E00', 'F2B300', 'E9C700'], newHex: '#D8AA4D' },
  // Red to Matte Coral
  { olds: ['FF4520', 'FF3E21', 'FF2924', 'FF0828', 'FF0029'], newHex: '#D16D6D' },
  // Blue to Slate Blue
  { olds: ['0079FF', '0080FF', '0095FF', '0097FF'], newHex: '#4E81A8' },
  // Green to Sage Green
  { olds: ['00D536', '00CE3B', '00B94A', '00B44E'], newHex: '#69A284' },
  // Orange to Soft Ember
  { olds: ['FF451C', 'FF4C20', 'FF612A', 'FF7333'], newHex: '#E08754' }
];

let replaced = 0;
colorGroups.forEach(group => {
  group.olds.forEach(old => {
    // Some SVGs don't capitalize hex. Handle case-insensitive replace.
    const re = new RegExp('#' + old, 'gi');
    let prev = content;
    content = content.replace(re, group.newHex);
    if (prev !== content) replaced++;
  });
});

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Successfully desaturated ' + replaced + ' neon shades!');
