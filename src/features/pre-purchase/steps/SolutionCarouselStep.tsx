import type { ComponentType } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { solutionSlides } from '../data'
import { CarouselProgressNav } from '../../../shared/components/CarouselProgressNav'
import {
  ContemplatingIllustration,
  GoalIllustration,
  MindfulnessIllustration,
  OuterSpaceIllustration,
  SecureDataIllustration,
  SecurityOnIllustration,
  WarningIllustration,
  type IllustrationProps,
} from '../../../components/illustrations'

interface SolutionCarouselStepProps {
  slideIndex: number
  transitionDirection: 1 | -1
  onNext: () => void
  onBack: () => void
}

const solutionEditorialSlides = [
  {
    title: 'BEM VINDO!',
    body: 'Nossa missao e recuperar homens, devolvendo os prazeres reais da vida.',
    support: 'Nos nos baseamos nos melhores metodos da neurociencia para trazer o que realmente funciona para os usuarios.',
    illustration: OuterSpaceIllustration,
  },
] as const satisfies ReadonlyArray<{
  title: string
  body: string
  support: string
  illustration: ComponentType<IllustrationProps>
}>

const solutionStorySlides = [
  {
    title: 'BEM VINDO!',
    body: 'Nossa missao e recuperar homens, devolvendo os prazeres reais da vida.',
    support: 'Nos nos baseamos nos melhores metodos da neurociencia para trazer o que realmente funciona para os usuarios.',
    illustration: OuterSpaceIllustration,
  },
  {
    title: 'Nos removemos a tentacao.',
    body: 'Sua forca de vontade nao precisa lutar sozinha o tempo todo.',
    support: 'Nosso bloqueador inteligente cria uma barreira entre voce e os gatilhos, corta o acesso ao conteudo adulto e reduz o esforco mental de dizer nao.',
    illustration: SecurityOnIllustration,
  },
  {
    title: 'Evite a recaida.',
    body: 'Naqueles 5 minutos de fissura, nos te resgatamos da tentacao.',
    support: 'Com o SOS, voce interrompe o ciclo compulsivo com exercicios mentais e distracoes rapidas que devolvem o controle na hora mais critica.',
    illustration: WarningIllustration,
  },
  {
    title: 'Cada dia conta.',
    body: 'Recupere o orgulho de olhar no espelho.',
    support: 'Registre seus motivos para parar e acompanhe sua contagem de dias. Ver o progresso acumulado devolve a dopamina saudavel que o vicio tentou roubar.',
    illustration: GoalIllustration,
  },
  {
    title: 'Entenda seus impulsos.',
    body: 'Clareza e o seu maior superpoder contra o vicio.',
    support: 'Ao registrar dificuldades, sentimentos e avancos, voce entende o que te puxa para o porno e deixa de ser refem das suas emocoes.',
    illustration: MindfulnessIllustration,
  },
  {
    title: 'Privacidade total.',
    body: 'Aqui e o seu lugar seguro. Ninguem precisa saber, a menos que voce queira.',
    support: 'Seus dados, registros e progresso ficam protegidos com privacidade total e criptografia, porque sua recuperacao nao precisa ser exposta.',
    illustration: SecureDataIllustration,
  },
  {
    title: 'Conhecimento liberta.',
    body: 'Entenda o porque para dominar o como.',
    support: 'Nossos conteudos educativos explicam a quimica cerebral por tras do vicio, aliviam a culpa e te devolvem o poder da informacao.',
    illustration: ContemplatingIllustration,
  },
] as const satisfies ReadonlyArray<{
  title: string
  body: string
  support: string
  illustration: ComponentType<IllustrationProps>
}>

export function SolutionCarouselStep({
  slideIndex,
  transitionDirection,
  onNext,
  onBack,
}: SolutionCarouselStepProps) {
  const slide = solutionStorySlides[slideIndex]
  const isEditorialSlide = slideIndex === 0
  const editorialSlide = solutionEditorialSlides[0]
  const EditorialIllustration = editorialSlide.illustration
  const SlideIllustration = slide.illustration

  return (
    <section className="pain-carousel-screen">
      <div className="pain-carousel-logo foco-brand-logo-mini foco-brand-logo-mini--on">
        <div className="foco-brand-logo" aria-label="Foco Mode ativado">
          <div className="foco-brand-top">FOCO</div>
          <div className="foco-brand-bottom">
            <span>M</span>
            <div className="foco-brand-toggle is-on">
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
              className={
                isEditorialSlide
                  ? 'pain-carousel-content pain-carousel-content-editorial solution-carousel-hero-content'
                  : 'pain-carousel-content'
              }
              custom={transitionDirection}
              initial={{ x: transitionDirection > 0 ? 56 : -56, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: transitionDirection > 0 ? -56 : 56, opacity: 0 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            >
              {isEditorialSlide ? (
                <>
                  <div className="solution-carousel-hero-art" aria-hidden="true">
                    <EditorialIllustration className="solution-carousel-hero-illustration" />
                  </div>

                  <div className="pain-carousel-editorial-copy solution-carousel-hero-copy">
                    <h2 className="pain-carousel-title pain-carousel-title-editorial solution-carousel-title-editorial">
                      {editorialSlide.title}
                    </h2>
                    <p className="pain-carousel-lead solution-carousel-lead">{editorialSlide.body}</p>
                    <p className="pain-carousel-support solution-carousel-support">{editorialSlide.support}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="pain-carousel-brain-bubble is-solution solution-carousel-art-bubble" aria-hidden="true">
                    <div className="pain-carousel-brain-core">
                      <SlideIllustration className="pain-carousel-illustration-image solution-carousel-illustration-image" />
                    </div>
                  </div>

                  <div className="pain-carousel-copy-stack solution-carousel-copy-stack">
                    <h2 className="pain-carousel-title">{slide.title}</h2>
                    <p className="pain-carousel-lead solution-carousel-lead">{slide.body}</p>
                    <p className="pain-carousel-support solution-carousel-support">{slide.support}</p>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="pain-carousel-footer">
          <div className="press-logos">
            <span className="press-logo-text">Forbes</span>
            <span className="press-logo-divider">|</span>
            <span className="press-logo-text sans">TECH<br />TIMES</span>
            <span className="press-logo-divider">|</span>
            <span className="press-logo-text">LA WEEKLY</span>
          </div>

          <div className="solution-carousel-progress-accent">
            <CarouselProgressNav
              currentStep={slideIndex + 1}
              totalSteps={solutionSlides.length}
              onBack={onBack}
              showBackFromFirstStep
              onNext={onNext}
              nextLabel="Continuar"
              finishLabel="Avancar"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
