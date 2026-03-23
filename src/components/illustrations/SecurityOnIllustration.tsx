import svg from '../../assets/illustrations/solution/security-on-rafiki.svg?raw'
import { createAnimatedIllustration } from './AnimatedInlineSvg'

export const SecurityOnIllustration = createAnimatedIllustration('SecurityOnIllustration', svg, [
  {
    selector: '#freepik--Shield--inject-376',
    keyframes: { scale: [1, 1.08, 1] },
    duration: 2,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Character--inject-376',
    keyframes: { y: [0, -5, 0] },
    duration: 3,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Shadow--inject-376',
    keyframes: { scale: [1, 0.9, 1], opacity: [0.15, 0.08, 0.15] },
    duration: 3,
    repeat: Infinity,
  },
])
