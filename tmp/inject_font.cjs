const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// Inject <style> for Inter font if not already there
if (!content.includes('<style type="text/css">@import url')) {
  const styleInjection = `
  <defs>
    <style type="text/css">
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;800&amp;display=swap');
      text {
        font-family: 'Inter', system-ui, sans-serif !important;
        font-weight: 800 !important;
        fill: #FFFFFF !important;
        font-size: 16px !important;
        letter-spacing: -0.02em !important;
      }
    </style>
  </defs>
  `;
  content = content.replace('<g id="BACKGROUND">', styleInjection + '<g id="BACKGROUND">');
}

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Font style injected for Inter!');
