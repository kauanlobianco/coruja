import svg from '../../assets/illustrations/pain/feeling-sorry-cuate.svg?raw'
import { createAnimatedIllustration } from './AnimatedInlineSvg'

export const FeelingSorryIllustration = createAnimatedIllustration('FeelingSorryIllustration', svg, [
  {
    selector: '#freepik--Character--inject-141',
    keyframes: { y: [0, -4, 0] },
    duration: 4,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Plant--inject-141',
    keyframes: { rotate: [-2, 2, -2] },
    duration: 5,
    repeat: Infinity,
    transformOrigin: 'bottom center',
  },
])
