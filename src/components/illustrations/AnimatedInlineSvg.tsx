import { useEffect, useMemo, type CSSProperties } from 'react'
import { useAnimate, type AnimationPlaybackControls } from 'framer-motion'

export interface IllustrationProps {
  className?: string
  width?: number | string
  height?: number | string
}

type AnimationValue = number | string | Array<number | string>
type AnimationKeyframes = Record<string, AnimationValue>

export interface IllustrationAnimation {
  selector: string
  keyframes: AnimationKeyframes
  duration: number
  ease?: 'easeInOut' | 'linear'
  delay?: number
  repeat?: number
  repeatDelay?: number
  times?: number[]
  queryAll?: boolean
  stagger?: number
  staggerDelays?: number[]
  transformOrigin?: string
}

interface AnimatedInlineSvgProps extends IllustrationProps {
  svg: string
  animations: IllustrationAnimation[]
}

function getTargets(root: HTMLElement, animation: IllustrationAnimation) {
  if (animation.queryAll) {
    return Array.from(root.querySelectorAll<SVGElement>(animation.selector))
  }

  const target = root.querySelector<SVGElement>(animation.selector)
  return target ? [target] : []
}

export function AnimatedInlineSvg({
  svg,
  animations,
  className,
  width = '100%',
  height = '100%',
}: AnimatedInlineSvgProps) {
  const [scope, animate] = useAnimate()
  const markup = useMemo(() => ({ __html: svg }), [svg])

  useEffect(() => {
    const root = scope.current

    if (!root) {
      return
    }

    const svgElement = root.querySelector('svg')

    if (svgElement) {
      svgElement.setAttribute('width', '100%')
      svgElement.setAttribute('height', '100%')
      svgElement.style.display = 'block'
      svgElement.style.overflow = 'visible'
    }

    const controls: AnimationPlaybackControls[] = []
    type AnimateKeyframes = Parameters<typeof animate>[1]
    type AnimateOptions = Parameters<typeof animate>[2]

    for (const animation of animations) {
      const targets = getTargets(root, animation)

      targets.forEach((target, index) => {
        target.style.transformBox = 'fill-box'
        target.style.transformOrigin = animation.transformOrigin ?? 'center'
        target.style.willChange = 'transform, opacity'

        const delay = animation.staggerDelays
          ? (animation.delay ?? 0) + animation.staggerDelays[index % animation.staggerDelays.length]
          : (animation.delay ?? 0) + (animation.stagger ?? 0) * index

        const options: AnimateOptions = {
          duration: animation.duration,
          ease: animation.ease ?? 'easeInOut',
          delay,
          repeat: animation.repeat ?? 0,
          repeatDelay: animation.repeatDelay,
          times: animation.times,
        }

        controls.push(animate(target, animation.keyframes as AnimateKeyframes, options))
      })
    }

    return () => {
      controls.forEach((control) => control.stop())
    }
  }, [animate, animations, scope, svg])

  const style: CSSProperties = {
    width,
    height,
    position: 'relative',
    display: 'grid',
    placeItems: 'center',
  }

  return (
    <div ref={scope} className={className} style={style} aria-hidden="true">
      <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={markup} />
    </div>
  )
}

export function createAnimatedIllustration(
  displayName: string,
  svg: string,
  animations: IllustrationAnimation[],
) {
  const Illustration = ({ className, width, height }: IllustrationProps) => (
    <AnimatedInlineSvg
      svg={svg}
      animations={animations}
      className={className}
      width={width}
      height={height}
    />
  )

  Illustration.displayName = displayName

  return Illustration
}
