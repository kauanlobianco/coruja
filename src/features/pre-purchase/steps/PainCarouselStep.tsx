import type { ComponentType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { painSlides } from '../data'
import { CarouselProgressNav } from '../../../shared/components/CarouselProgressNav'
import {
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
    lead: 'A linha entre o habito e a compulsao e invisivel ate voce tentar parar.',
    support: 'Voce promete que sera a ultima vez, mas volta em pouco tempo. Ela sequestra sua capacidade de escolha.',
    illustration: FeelingSorryIllustration,
    bubbleClassName: 'is-brain',
  },
  {
    titleLines: ['A morte da', 'intimidade.'],
    lead: 'Onde a comparacao comeca, a conexao real morre.',
    support: 'Voce troca a presenca real por uma imagem editada. Aos poucos, o afeto vira distancia e a solidao ocupa o lugar do encontro.',
    illustration: CoupleStressIllustration,
    bubbleClassName: 'is-heart',
  },
  {
    titleLines: ['Seu cerebro fica', 'diferente.'],
    lead: 'Voce nao busca mais prazer; busca apenas alivio para uma sede que nunca acaba.',
    support: 'A dopamina artificial vai anestesiando seus sensores. O que antes bastava perde a forca e seu cerebro passa a exigir estimulos cada vez maiores.',
    illustration: BrainChemistryIllustration,
    bubbleClassName: 'is-unplug',
  },
  {
    titleLines: ['O brilho da vida', 'some.'],
    lead: 'A tela que promete conforto e a mesma que entrega um vazio permanente.',
    support: 'Esse habito drena sua energia, apaga seu interesse e empurra sua mente para um estado de apatia, ansiedade e culpa silenciosa.',
    illustration: DepressionIllustration,
    bubbleClassName: 'is-frown',
  },
] as const satisfies ReadonlyArray<{
  titleLines: readonly [string, string]
  lead: string
  support: string
  illustration: ComponentType<IllustrationProps>
  bubbleClassName: string
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
      <div className="pain-carousel-logo">Coruja</div>

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
              <div className={`pain-carousel-brain-bubble ${editorialSlide.bubbleClassName}`} aria-hidden="true">
                <div className="pain-carousel-brain-core">
                  <SlideIllustration className="pain-carousel-illustration-image" />
                </div>
              </div>

              <div className="pain-carousel-editorial-copy">
                <h2 className="pain-carousel-title pain-carousel-title-editorial">
                  <span className="pain-carousel-title-line">{editorialSlide.titleLines[0]}</span>
                  <br />
                  <span className="pain-carousel-title-line">{editorialSlide.titleLines[1]}</span>
                </h2>
                <p className="pain-carousel-lead">{editorialSlide.lead}</p>
                <p className="pain-carousel-support">{editorialSlide.support}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="pain-carousel-footer">
          <CarouselProgressNav
            currentStep={slideIndex + 1}
            totalSteps={painSlides.length}
            onBack={onBack}
            onNext={onNext}
            nextLabel="Continuar"
            finishLabel="Avancar"
          />
        </div>
      </div>
    </section>
  )
}
