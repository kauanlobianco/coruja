import svg from '../../assets/illustrations/pain/depression-cuate.svg?raw'
import { createAnimatedIllustration } from './AnimatedInlineSvg'

export const DepressionIllustration = createAnimatedIllustration('DepressionIllustration', svg, [
  {
    selector: '#freepik--Cloud--inject-22',
    keyframes: { x: [-4, 4, -4] },
    duration: 6,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Character--inject-22',
    keyframes: { y: [0, -3, 0] },
    duration: 4,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Puddles--inject-22',
    keyframes: { opacity: [0.6, 1, 0.6] },
    duration: 3,
    repeat: Infinity,
  },
])
