import svg from '../../assets/illustrations/solution/mindfulness-cuate.svg?raw'
import { createAnimatedIllustration } from './AnimatedInlineSvg'

export const MindfulnessIllustration = createAnimatedIllustration('MindfulnessIllustration', svg, [
  {
    selector: '#freepik--Character--inject-40',
    keyframes: { y: [0, -8, 0] },
    duration: 3,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Shadow--inject-40',
    keyframes: { scale: [1, 0.85, 1], opacity: [0.1, 0.05, 0.1] },
    duration: 3,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Plant--inject-40',
    keyframes: { rotate: [-2, 2, -2] },
    duration: 4,
    repeat: Infinity,
    transformOrigin: 'bottom center',
  },
  {
    selector: '#freepik--Sparkles--inject-40 > *',
    keyframes: { opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] },
    duration: 2,
    repeat: Infinity,
    stagger: 0.4,
    queryAll: true,
  },
])
