import svg from '../../assets/illustrations/pain/couple-stress-cuate.svg?raw'
import { createAnimatedIllustration } from './AnimatedInlineSvg'

export const CoupleStressIllustration = createAnimatedIllustration('CoupleStressIllustration', svg, [
  {
    selector: '#freepik--Speech_Bubbles--inject-5 > *',
    keyframes: { scale: [0, 1], opacity: [0, 1] },
    duration: 0.7,
    stagger: 0.6,
    queryAll: true,
  },
  {
    selector: '#freepik--Character_1--inject-5',
    keyframes: { x: [-2, 2, -2] },
    duration: 3,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Character_2--inject-5',
    keyframes: { x: [2, -2, 2] },
    duration: 3.5,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Lines--inject-5 > *',
    keyframes: { opacity: [0.4, 1, 0.4] },
    duration: 1.5,
    repeat: Infinity,
    stagger: 0.12,
    queryAll: true,
  },
])
