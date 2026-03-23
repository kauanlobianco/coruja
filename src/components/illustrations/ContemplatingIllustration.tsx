import svg from '../../assets/illustrations/solution/contemplating-pana.svg?raw'
import { createAnimatedIllustration } from './AnimatedInlineSvg'

export const ContemplatingIllustration = createAnimatedIllustration('ContemplatingIllustration', svg, [
  {
    selector: '#freepik--Sun--inject-19',
    keyframes: { y: [0, -3, 0], scale: [1, 1.02, 1] },
    duration: 6,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Sea--inject-19',
    keyframes: { x: [-5, 5, -5] },
    duration: 4,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Character--inject-19',
    keyframes: { y: [0, -4, 0] },
    duration: 3.5,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Plant--inject-19',
    keyframes: { rotate: [-2, 2, -2] },
    duration: 4,
    repeat: Infinity,
    transformOrigin: 'bottom center',
  },
])
