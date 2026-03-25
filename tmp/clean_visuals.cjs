const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// 1. Remove the glass boxes group completely
content = content.replace(/<g id="GLASS_BOXES">[\s\S]*?<\/g>\n?/, '');

// 2. Add text-shadow to CSS to ensure readability over character/background, and shrink text a bit.
// font-size: 16px !important; -> font-size: 13.5px !important;
content = content.replace(/font-size: 16px !important;/g, 'font-size: 13.5px !important;\n      text-shadow: 0px 2px 8px rgba(0,0,0, 0.8), 0px 1px 3px rgba(0,0,0, 0.6) !important;');

// 3. Make background floating elements semi-transparent to reduce clutter
content = content.replace(/.leaf-float {/g, '.leaf-float {\n      opacity: 0.25;');
content = content.replace(/.leaf-float-slow {/g, '.leaf-float-slow {\n      opacity: 0.15;');

// Also, the animation @keyframes slow-float had opacity: 0.95 -> 0.75. Let's make it 0.3 -> 0.15
content = content.replace(/@keyframes slow-float {[\s\S]*?}/, `@keyframes slow-float {\n      0%, 100% { opacity: 0.3; }\n      50% { opacity: 0.15; }\n    }`);

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Visual clutter significantly reduced!');
