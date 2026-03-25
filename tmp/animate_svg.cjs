const fs = require('fs');

const FILE_PATH = 'c:\\vibecode\\coruja\\public\\meditation.svg';
let content = fs.readFileSync(FILE_PATH, 'utf8');

// 1. Let's inject CSS animations into the existing <style> tag
const cssAnimations = `
    /* Storyset-style fluid animations */
    @keyframes float {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-8px) rotate(1deg); }
      100% { transform: translateY(0px) rotate(0deg); }
    }
    
    @keyframes breathe {
      0% { transform: scaleY(1); }
      50% { transform: scaleY(1.02) translateY(-2px); }
      100% { transform: scaleY(1); }
    }

    @keyframes twinkle {
      0% { opacity: 0.3; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.1); }
      100% { opacity: 0.3; transform: scale(0.9); }
    }

    @keyframes cascade-in {
      0% { opacity: 0; transform: translateY(15px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    /* Adding properties to classes */
    .anim-float {
      animation: float 6s ease-in-out infinite;
      transform-origin: center;
    }
    
    .anim-float-slow {
      animation: float 8s ease-in-out infinite;
      transform-origin: center;
      animation-delay: -3s;
    }

    .anim-breathe {
      animation: breathe 4s ease-in-out infinite;
      transform-origin: bottom center;
    }

    .anim-twinkle {
      animation: twinkle 3s ease-in-out infinite;
    }
    
    .anim-twinkle-alt {
      animation: twinkle 4s ease-in-out infinite;
      animation-delay: -1.5s;
    }

    .anim-cascade {
      opacity: 0;
      animation: cascade-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    
    /* Delays for the 7 chakras */
    .delay-1 { animation-delay: 0.2s; }
    .delay-2 { animation-delay: 0.4s; }
    .delay-3 { animation-delay: 0.6s; }
    .delay-4 { animation-delay: 0.8s; }
    .delay-5 { animation-delay: 1.0s; }
    .delay-6 { animation-delay: 1.2s; }
    .delay-7 { animation-delay: 1.4s; }
`;

// Insert the CSS rules into existing <style>
if (!content.includes('cascade-in')) {
   content = content.replace('</style>', cssAnimations + '\n</style>');
}

// 2. Identify elements to animate.
// In Storyset SVGs, stars usually have a fill like #fbbf24 (Gold) and are small paths.
// Let's add .anim-twinkle to paths with fill="#fbbf24" or small elements.
// Wait, the background leaves have #2e5f72, #356a7d, #1c3e4d, #3b788c. Let's make them float!
// We can just add class="anim-float" to paths with fill="#243F54" etc. But we replaced hex codes, so they are #356a7d, #2e5f72 etc.
let floatFills = ['#2e5f72', '#356a7d', '#1c3e4d', '#3b788c'];
floatFills.forEach((f, i) => {
   let altClass = i % 2 === 0 ? 'anim-float' : 'anim-float-slow';
   // Replace `style="fill:#2e5f72;"` with `style="fill:#2e5f72;" class="anim-float"`
   content = content.replace(new RegExp(`style="fill:${f};"`, 'gi'), `style="fill:${f};" class="${altClass}"`);
   content = content.replace(new RegExp(`fill="${f}"`, 'gi'), `fill="${f}" class="${altClass}"`);
});

// Character shirt is #F3791A. We can add class="anim-breathe" to it.
content = content.replace(/style="fill:#F3791A;"/gi, 'style="fill:#F3791A;" class="anim-breathe"');

// 3. Cascade animations for Chakras.
// We need to find the <g id="GLASS_BOXES"> rects, the <linearGradient...> to </g> groups, and <text> elements.
// Since they are listed sequentially or we can just find them and class them.
// Let's gather the 7 texts.
const textRx = /(<text\s*(?:text-anchor="end"\s*)?transform="matrix[^>]*>)(.*?)(<\/text>)/g;
let tCount = 1;
content = content.replace(textRx, (match, p1, p2, p3) => {
   let delayClass = 'delay-' + (tCount > 7 ? 7 : tCount);
   let res = p1.replace('<text ', `<text class="anim-cascade ${delayClass}" `) + p2 + p3;
   tCount++;
   return res;
});

// The boxes in <g id="GLASS_BOXES">
let bxCount = 1;
content = content.replace(/<rect x="[\-\d\.]+" y="[\d\.]+" width="[\d\.]+" height="50" rx="25"/g, (match) => {
   let delayClass = 'delay-' + (bxCount > 7 ? 7 : bxCount);
   let res = match + ` class="anim-cascade ${delayClass}" `;
   bxCount++;
   return res;
});

// The circles (icons base) 
let cCount = 1;
content = content.replace(/<circle[^>]*r="19\.824"/g, (match) => {
   let delayClass = 'delay-' + (cCount > 7 ? 7 : cCount);
   if (!match.includes('anim-cascade')) {
       let res = match.replace('<circle', `<circle class="anim-cascade ${delayClass}"`);
       cCount++;
       return res;
   }
   return match;
});

// The icon paths (which are immediately following the circles, wrapped in <g>)
// Actually, applying animation to the circles is good, but the detailed paths inside the circle also need the cascade delay.
// This is harder to parse with Regex. Alternatively, we can wrap the whole group?
// Since we can't easily group them in Node, what if we just add the animation class to all matching paths that are positioned at the icon? It's too complex.
// Better to just apply an entry animation on the WHOLE SVG, and only cascade the text and the glass box? 
// No, the user will see the colored circles immediately. It's better if we wrap the icons in <g> with classes!
// Or wait, the script above adds classes to text and glass-box, which is already a huge visual impact. 
// If the icon circles also cascade, they will pop in. If the icon inside them doesn't cascade, they will appear, and then the box/circle will pop behind/around them!
// Let's just cascade the texts and the glass boxes for now to make the "texts appearing in cascade" happen!
// The user said: "Blocos com os textos aparecendo em cascata", this implies the textual blocks fading in cascade! The icons fading in is optional but nice.

fs.writeFileSync(FILE_PATH, content, 'utf8');
console.log('Animations injected successfully!');
