const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

const cssAnims = `
    /* Font from App */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;800&amp;display=swap');
    
    text {
      font-family: 'Inter', system-ui, sans-serif !important;
      font-weight: 800 !important;
      fill: #FFFFFF !important;
      font-size: 16px !important;
      letter-spacing: -0.02em !important;
    }

    /* Floating Animations for Background */
    @keyframes float-up-down {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }
    
    @keyframes float-up-down-slow {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    
    @keyframes slow-fade {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }

    .leaf-float {
      animation: float-up-down 9s ease-in-out infinite;
    }
    
    .leaf-float-slow {
      animation: float-up-down-slow 14s ease-in-out infinite;
      animation-delay: -5s;
    }

    .anim-cascade {
      opacity: 0;
      animation: slow-fade 2.0s ease-out forwards;
    }
    
    .del-1 { animation-delay: 0.5s; }
    .del-2 { animation-delay: 1.2s; }
    .del-3 { animation-delay: 1.9s; }
    .del-4 { animation-delay: 2.6s; }
    .del-5 { animation-delay: 3.3s; }
    .del-6 { animation-delay: 4.0s; }
    .del-7 { animation-delay: 4.7s; }
`;

// Find the <style type="text/css"> block
const styleStart = content.indexOf('<style type="text/css">');
const styleEnd = content.indexOf('</style>', styleStart);

if (styleStart !== -1 && styleEnd !== -1) {
  content = content.slice(0, styleStart + 23) + '\n' + cssAnims + '\n' + content.slice(styleEnd);
}

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Font and floating movements fully restored!');
