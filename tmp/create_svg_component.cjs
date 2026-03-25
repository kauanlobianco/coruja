const fs = require('fs');

const SVG_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let svgContent = fs.readFileSync(SVG_PATH, 'utf8');

// Strip out @import and font-family forcefully to let it inherit DOM fonts natively!
svgContent = svgContent.replace(/@import url\(.+?\);\s*/g, '');
svgContent = svgContent.replace(/font-family: [^;]+ !important;\s*/g, '');

// Let's also enforce `fill: currentColor` or keep #FFFFFF? 
// #FFFFFF is fine for contrast! The user praised it.
fs.writeFileSync(SVG_PATH, svgContent, 'utf8');

// Generate React Component wrapper with dangerouslySetInnerHTML
const tsxContent = `import React from 'react';

export function MeditationIllustration({ className = '' }: { className?: string }) {
  // SVG injetado direto no DOM para herdar as fontes e propriedades CSS nativas do app (como a famigerada \`--font-family\`)
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: \`${svgContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} 
    />
  );
}
`;

const destPath = 'c:\\vibecode\\coruja\\src\\features\\pre-purchase\\components\\MeditationIllustration.tsx';
// Ensure dir string
if(!fs.existsSync('c:\\vibecode\\coruja\\src\\features\\pre-purchase\\components')) {
    fs.mkdirSync('c:\\vibecode\\coruja\\src\\features\\pre-purchase\\components', { recursive: true });
}

fs.writeFileSync(destPath, tsxContent, 'utf8');
console.log('Component MeditationIllustration.tsx successfully generated!');
