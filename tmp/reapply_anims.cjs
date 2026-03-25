const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

const cssAnims = `
    /* Slow, fluid animations */
    @keyframes float-leaves {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-10px) rotate(1.5deg); }
    }
    
    @keyframes slow-fade {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }

    .leaf-float {
      animation: float-leaves 10s ease-in-out infinite;
      transform-origin: center;
    }
    
    .leaf-float-slow {
      animation: float-leaves 15s ease-in-out infinite;
      transform-origin: center;
      animation-delay: -5s;
    }

    .anim-cascade {
      opacity: 0;
      animation: slow-fade 2.0s ease-out forwards;
    }
    
    /* Muito mais devagar */
    .del-1 { animation-delay: 0.5s; }
    .del-2 { animation-delay: 1.2s; }
    .del-3 { animation-delay: 1.9s; }
    .del-4 { animation-delay: 2.6s; }
    .del-5 { animation-delay: 3.3s; }
    .del-6 { animation-delay: 4.0s; }
    .del-7 { animation-delay: 4.7s; }
`;

content = content.replace('</style>', cssAnims + '\n</style>');

// 1. Only Background moves!
// Background colors: '#2e5f72', '#356a7d', '#1c3e4d', '#3b788c'
const floatFills = ['#2e5f72', '#356a7d', '#1c3e4d', '#3b788c'];
floatFills.forEach((f, i) => {
   let cls = i % 2 === 0 ? 'leaf-float' : 'leaf-float-slow';
   let reStr = `style="[^\"]*fill:${f}[^"]*"`;
   let rx = new RegExp(reStr, 'gi');
   content = content.replace(rx, (m) => m + ` class="${cls}"`);
});

// Calculate cascade classes
function applyCascade(srcRx, delayStart) {
  let count = 1;
  return content.replace(srcRx, (m) => {
     let cls = 'anim-cascade del-' + (count > 7 ? 7 : count);
     count++;
     // insert class before first closing angle or at the end
     if(m.includes('class=')) {
        return m.replace(/class="([^"]*)"/, `class="$1 ${cls}"`);
     } else {
        return m.replace(/(\/?>)(?!.*>)/, ` class="${cls}"$1`);
     }
  });
}

// 2. Cascade texts
const textRx = /<text[\s\S]*?<\/text>/g;
content = applyCascade(textRx, 1);

// 3. Cascade boxes
// Boxes are in <g id="GLASS_BOXES">. We can just class each rect.
content = content.replace(/<rect x="[\-\d\.]+" y="[\d\.]+" width="[\d\.]+" height="50" rx="25"/g, (match) => {
   let cls = 'anim-cascade del-' + (arguments[1] > 7 ? 7 : arguments[1] || 1); // wait, let's use a counter
   return match; 
});
// Better replace logic:
let bxCount = 1;
content = content.replace(/<rect x="[\-\d\.]+" y="[\d\.]+" width="[\d\.]+" height="50" rx="25"[^>]+>/g, (m) => {
   let cls = 'anim-cascade del-' + (bxCount > 7 ? 7 : bxCount);
   bxCount++;
   return m.replace('/>', ` class="${cls}" />`);
});

// 4. Icons... let's NOT cascade the circles to avoid complexity. Just texts and background boxes!
// Wait, the icons should also cascade, otherwise they look disconnected.
// Circles:
let cCount = 1;
content = content.replace(/<circle[^>]*r="19\.824"[^>]*>/g, (m) => {
   let cls = 'anim-cascade del-' + (cCount > 7 ? 7 : cCount);
   cCount++;
   return m.replace('/>', ` class="${cls}" />`);
});

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Anims reapplied (SAFELY)!');
