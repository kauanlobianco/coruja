import svg from '../../assets/illustrations/pain/brain-chemistry-cuate.svg?raw'
import { createAnimatedIllustration } from './AnimatedInlineSvg'

export const BrainChemistryIllustration = createAnimatedIllustration('BrainChemistryIllustration', svg, [
  {
    selector: '#freepik--Brain--inject-46',
    keyframes: { scale: [1, 1.04, 1] },
    duration: 2,
    repeat: Infinity,
  },
  {
    selector: '#freepik--speech-bubble--inject-46',
    keyframes: { opacity: [0, 1], y: [-10, 0] },
    duration: 0.8,
    delay: 0.5,
  },
  {
    selector: '#freepik--character-1--inject-46',
    keyframes: { rotate: [-1, 1, -1] },
    duration: 3,
    repeat: Infinity,
    transformOrigin: 'bottom center',
  },
  {
    selector: '#freepik--character-2--inject-46',
    keyframes: { rotate: [1, -1, 1] },
    duration: 3.5,
    repeat: Infinity,
    transformOrigin: 'bottom center',
  },
])
