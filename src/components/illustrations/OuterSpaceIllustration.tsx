import svg from '../../assets/illustrations/solution/outer-space-cuate.svg?raw'
import { createAnimatedIllustration } from './AnimatedInlineSvg'

export const OuterSpaceIllustration = createAnimatedIllustration('OuterSpaceIllustration', svg, [
  {
    selector: '#freepik--Rocket--inject-2',
    keyframes: { y: [0, -12, 0], rotate: [-2, 2, -2] },
    duration: 3,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Stars--inject-2 > *',
    keyframes: { opacity: [0.4, 1, 0.4] },
    duration: 2,
    repeat: Infinity,
    queryAll: true,
    staggerDelays: [0, 0.36, 0.18, 0.57, 0.24, 0.46, 0.12],
  },
  {
    selector: '#freepik--Moon--inject-2',
    keyframes: { y: [0, -4, 0] },
    duration: 6,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Planets--inject-2',
    keyframes: { rotate: [0, 360] },
    duration: 30,
    repeat: Infinity,
    ease: 'linear',
  },
])
