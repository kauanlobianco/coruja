const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

const cssAnims = `
    /* Slow, fluid animations without transform offsets */
    @keyframes slow-float {
      0%, 100% { opacity: 0.95; }
      50% { opacity: 0.75; }
    }
    
    @keyframes slow-fade {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }

    .leaf-float {
      animation: slow-float 10s ease-in-out infinite;
    }
    
    .leaf-float-slow {
      animation: slow-float 15s ease-in-out infinite;
      animation-delay: -5s;
    }

    .anim-cascade {
      opacity: 0;
      animation: slow-fade 2.0s ease-out forwards;
    }
    
    /* Cascata muito devagar, de 0.5s pra dar tempo de ver, até 4s */
    .del-1 { animation-delay: 0.5s; }
    .del-2 { animation-delay: 1.2s; }
    .del-3 { animation-delay: 1.9s; }
    .del-4 { animation-delay: 2.6s; }
    .del-5 { animation-delay: 3.3s; }
    .del-6 { animation-delay: 4.0s; }
    .del-7 { animation-delay: 4.7s; }
`;

content = content.replace('</style>', cssAnims + '\n</style>');

// 1. Only Background shapes animate opacity. Transforms are dangerous on absolute SVG paths.
const floatFills = ['#2e5f72', '#356a7d', '#1c3e4d', '#3b788c'];
floatFills.forEach((f, i) => {
   let cls = i % 2 === 0 ? 'leaf-float' : 'leaf-float-slow';
   // Find paths that have style="fill:#2e5f72;"
   content = content.replace(new RegExp(`(style="[^"]*fill:${f}[^"]*")`, 'gi'), `$1 class="${cls}"`);
});

// 2. Cascade texts
let tCount = 1;
content = content.replace(/<text[\s\S]*?<\/text>/g, (m) => {
   let cls = 'anim-cascade del-' + (tCount > 7 ? 7 : tCount);
   tCount++;
   return m.replace('<text ', `<text class="${cls}" `);
});

// 3. Cascade boxes
let bxCount = 1;
content = content.replace(/<rect x="[\-\d\.]+" y="[\d\.]+" width="[\d\.]+" height="50" rx="25"[^>]*>/g, (m) => {
   let cls = 'anim-cascade del-' + (bxCount > 7 ? 7 : bxCount);
   bxCount++;
   return m.replace('/>', ` class="${cls}" />`);
});

// 4. Circles
let cCount = 1;
content = content.replace(/<circle[^>]*r="19\.824"[^>]*>/g, (m) => {
   let cls = 'anim-cascade del-' + (cCount > 7 ? 7 : cCount);
   cCount++;
   return m.replace('/>', ` class="${cls}" />`);
});

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Fixed animations injected!');
