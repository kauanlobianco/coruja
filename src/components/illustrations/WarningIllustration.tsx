import svg from '../../assets/illustrations/solution/warning-cuate.svg?raw'
import { createAnimatedIllustration } from './AnimatedInlineSvg'

export const WarningIllustration = createAnimatedIllustration('WarningIllustration', svg, [
  {
    selector: '#freepik--Sign--inject-88',
    keyframes: { rotate: [-2, 2, -2] },
    duration: 2,
    repeat: Infinity,
    transformOrigin: 'bottom center',
  },
  {
    selector: '#freepik--speech-bubble--inject-88',
    keyframes: { scale: [0.95, 1.05, 0.95] },
    duration: 1.5,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Character--inject-88',
    keyframes: { y: [0, -4, 0] },
    duration: 3,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Lines--inject-88 > *',
    keyframes: { opacity: [0.3, 1, 0.3] },
    duration: 1,
    repeat: Infinity,
    stagger: 0.1,
    queryAll: true,
  },
])
