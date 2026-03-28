import type { ComponentType, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { painSlides } from '../data'
import { CarouselProgressNav } from '../../../shared/components/CarouselProgressNav'
import {
  BreakingBarriersIllustration,
  BrainChemistryIllustration,
  CoupleStressIllustration,
  DepressionIllustration,
  FeelingSorryIllustration,
  type IllustrationProps,
} from '../../../components/illustrations'

interface PainCarouselStepProps {
  slideIndex: number
  transitionDirection: 1 | -1
  onNext: () => void
  onBack: () => void
}

const editorialPainSlides = [
  {
    titleLines: ['A pornografia', 'vicia.'],
    lead: 'A linha entre o hábito e a compulsão é invisível até você tentar parar.',
    support: 'Você promete que será a última vez, mas volta em pouco tempo. Ela sequestra sua capacidade de escolha.',
    illustration: FeelingSorryIllustration,
  },
  {
    titleLines: ['A morte da', 'intimidade.'],
    lead: 'Onde a comparação começa, a conexão real morre.',
    support: 'Você troca a presença real por uma imagem editada. Aos poucos, o afeto vira distância e a solidão ocupa o lugar do encontro.',
    illustration: CoupleStressIllustration,
  },
  {
    titleLines: ['Seu cérebro fica', 'diferente.'],
    lead: 'Você não busca mais prazer; busca apenas alívio.',
    support: 'A dopamina artificial vai anestesiando seus sensores. O que antes bastava perde a força e seu cérebro passa a exigir estímulos cada vez maiores.',
    illustration: BrainChemistryIllustration,
  },
  {
    titleLines: ['O brilho da vida', 'some.'],
    lead: 'A tela que promete conforto é a mesma que entrega um vazio permanente.',
    support: 'Esse hábito drena sua energia, apaga seu interesse e empurra sua mente para um estado de apatia, ansiedade e culpa silenciosa.',
    illustration: DepressionIllustration,
  },
  {
    titleLines: ['Você pode voltar', 'a ser livre.'],
    lead: 'O vício é um caminho, mas ele não define quem você é.',
    support: <>O primeiro passo foi dado: você reconheceu o problema. O vício em pornografia é uma reconfiguração do cérebro, e o <strong>Foco Mode</strong> é a ferramenta para desfazer esse estrago.</>,
    illustration: BreakingBarriersIllustration,
  },
] satisfies ReadonlyArray<{
  titleLines: readonly [string, string]
  lead: string
  support: ReactNode
  illustration: ComponentType<IllustrationProps>
}>

export function PainCarouselStep({
  slideIndex,
  transitionDirection,
  onNext,
  onBack,
}: PainCarouselStepProps) {
  const editorialSlide = editorialPainSlides[slideIndex]
  const SlideIllustration = editorialSlide.illustration

  return (
    <section className="pain-carousel-screen">
      <div className="pain-carousel-logo foco-brand-logo-mini foco-brand-logo-mini--off">
        <div className="foco-brand-logo" aria-label="Foco Mode desativado">
          <div className="foco-brand-top">FOCO</div>
          <div className="foco-brand-bottom">
            <span>M</span>
            <div className="foco-brand-toggle is-off">
              <div className="foco-brand-toggle-knob"></div>
            </div>
            <span>E</span>
          </div>
        </div>
      </div>

      <div className="pain-carousel-body">
        <div className="pain-carousel-stage">
          <AnimatePresence mode="wait" initial={false} custom={transitionDirection}>
            <motion.div
              key={slideIndex}
              className="pain-carousel-content pain-carousel-content-editorial"
              custom={transitionDirection}
              initial={{ x: transitionDirection > 0 ? 56 : -56, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: transitionDirection > 0 ? -56 : 56, opacity: 0 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="pain-carousel-brain-bubble" aria-hidden="true">
                <div className="pain-carousel-brain-core">
                  <SlideIllustration className="pain-carousel-illustration-image" />
                </div>
              </div>

              <div className="pain-carousel-editorial-copy">
                <h2 className="pain-carousel-title pain-carousel-title-editorial">
                  {editorialSlide.titleLines[0]} {editorialSlide.titleLines[1]}
                </h2>
                <p className="pain-carousel-lead">{editorialSlide.lead}</p>
                <p className="pain-carousel-support">{editorialSlide.support}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="pain-carousel-footer pain-carousel-pain-nav">
          <CarouselProgressNav
            currentStep={slideIndex + 1}
            totalSteps={painSlides.length}
            onBack={onBack}
            onNext={onNext}
            nextLabel="Continuar"
            finishLabel="Avançar"
          />
        </div>
      </div>
    </section>
  )
}
