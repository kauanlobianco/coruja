const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// The bounds are: Left text goes to -40. Right text goes to 520.
// So x starts at -55.
// Width needs to be 520 - (-55) = 575. We set to 595 to be safe.
// Height is 500, but let's shift y up by 15.
const newViewBox = 'viewBox="-55 -15 595 530"';

content = content.replace(/viewBox="[^"]+"/, newViewBox);

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Tighter viewBox set!');
