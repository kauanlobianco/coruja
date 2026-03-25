const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// The capsules have fill:#DBE5FC
// Let's remove them by making them fill:none or display:none
content = content.replace(/fill:#DBE5FC/g, 'display:none');

// Now, make the text use the app's font and be much larger.
// Previously I set: fill:#212529 and font-size:9px and font-family:'Montserrat-Bold'; font-weight:bold
content = content.replace(/fill:#212529;/g, 'fill:#ffffff;');
content = content.replace(/font-size:9px;/g, 'font-size:15px;');
content = content.replace(/font-family:'Montserrat-Bold'/g, "font-family: 'Inter', system-ui, sans-serif");

// Let's also restore any original #6A70D6 if it didn't get replaced to #212529
content = content.replace(/fill:#6A70D6;/g, 'fill:#ffffff;');
content = content.replace(/font-size:7\.\d+px;/g, 'font-size:15px;');
content = content.replace(/font-family:'Montserrat-Medium'/g, "font-family: 'Inter', system-ui, sans-serif; font-weight: bold;");

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Text fixed and capsules removed!');
