import svg from '../../assets/illustrations/solution/goal-cuate-user.svg?raw'
import { createAnimatedIllustration } from './AnimatedInlineSvg'

export const GoalIllustration = createAnimatedIllustration('GoalIllustration', svg, [
  {
    selector: '#freepik--Character--inject-3',
    keyframes: { y: [0, -6, 0] },
    duration: 3,
    repeat: Infinity,
  },
  {
    selector: '#freepik--Mountain--inject-3',
    keyframes: { scale: [1, 1.01, 1] },
    duration: 6,
    repeat: Infinity,
  },
])
