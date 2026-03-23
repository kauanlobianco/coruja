import svg from '../../assets/illustrations/solution/secure-data-user-cuate.svg?raw'
import { createAnimatedIllustration } from './AnimatedInlineSvg'

export const SecureDataIllustration = createAnimatedIllustration('SecureDataIllustration', svg, [
  {
    selector: '#freepik--Shield--inject-369',
    keyframes: { scale: [1, 1.06, 1] },
    duration: 2,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Letter--inject-369',
    keyframes: { y: [-8, 0, 0, -8], opacity: [0, 1, 1, 0] },
    duration: 4,
    delay: 0.8,
    repeat: Infinity,
    times: [0, 0.25, 0.8, 1],
  },
  {
    selector: '#freepik--Character--inject-369',
    keyframes: { rotate: [-1, 1, -1] },
    duration: 3,
    repeat: Infinity,
    transformOrigin: 'bottom center',
  },
  {
    selector: '#freepik--Plant--inject-369',
    keyframes: { rotate: [-2, 2, -2] },
    duration: 4.5,
    repeat: Infinity,
    transformOrigin: 'bottom center',
  },
])
