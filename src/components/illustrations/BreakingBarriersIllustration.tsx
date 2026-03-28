import svg from '../../assets/illustrations/pain/breaking-barriers-amico.svg?raw'
import { createAnimatedIllustration } from './AnimatedInlineSvg'

export const BreakingBarriersIllustration = createAnimatedIllustration('BreakingBarriersIllustration', svg, [
  // Personagem flutua suavemente para cima e para baixo
  {
    selector: '#freepik--Character--inject-27',
    keyframes: { y: [0, -8, 0] },
    duration: 3.6,
    ease: 'easeInOut',
    repeat: Infinity,
  },
  // Nuvem grande desliza lentamente para a direita
  {
    selector: '#freepik--Clouds--inject-27',
    keyframes: { x: [0, 10, 0] },
    duration: 8,
    ease: 'easeInOut',
    repeat: Infinity,
  },
  // Parede pulsa muito suavemente (respira), com leve opacidade
  {
    selector: '#freepik--Wall--inject-27',
    keyframes: { opacity: [1, 0.88, 1], scale: [1, 1.012, 1] },
    duration: 4.2,
    ease: 'easeInOut',
    repeat: Infinity,
  },
])
