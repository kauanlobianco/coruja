const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// I recently replaced text colors to 'fill:#e9e6e2'
// But the text is upon light blue/white boxes (likely '#DBE5FC')
// So I will change the text fill back to a very dark legible color.
// Maybe a dark purple or navy like '#1E293B' or the original '#6A70D6' but darker. Let's use '#1C1525'
content = content.replace(/fill:#e9e6e2/g, 'fill:#212529'); 

// And let's make the font size a tiny bit larger or bold? 
// Original was 7.24, I made it 9px. Let's keep 9px, but add font-weight: bold.
content = content.replace(/font-family:'Montserrat-Medium'/g, "font-family:'Montserrat-Bold'; font-weight:bold");

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Text fixed!');
