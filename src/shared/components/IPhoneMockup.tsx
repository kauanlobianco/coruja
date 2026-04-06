import React from 'react'
import type { CSSProperties, ReactNode } from 'react'

type IPhoneModel = '14' | '14-pro' | '15' | '15-pro' | 'x' | 'plain'
type Orientation = 'portrait' | 'landscape'
type WallpaperFit = 'cover' | 'contain' | 'fill'

export interface IPhoneMockupProps {
  model?: IPhoneModel
  color?: string
  orientation?: Orientation
  scale?: number
  bezel?: number
  radius?: number
  shadow?: boolean | string
  screenBg?: string
  wallpaper?: string
  wallpaperFit?: WallpaperFit
  wallpaperPosition?: string
  showDynamicIsland?: boolean
  showNotch?: boolean
  islandWidth?: number
  islandHeight?: number
  islandRadius?: number
  notchWidth?: number
  notchHeight?: number
  notchRadius?: number
  safeArea?: boolean
  safeAreaOverrides?: Partial<{ top: number; bottom: number; left: number; right: number }>
  showHomeIndicator?: boolean
  innerShadow?: boolean
  showButtons?: boolean
  style?: CSSProperties
  className?: string
  frameStyle?: CSSProperties
  screenStyle?: CSSProperties
  children?: ReactNode
}

const DEVICE_SPECS = {
  x:        { w: 375, h: 812,  radius: 50, bezel: 12, topSafe: 47, bottomSafe: 34, notch: { w: 210, h: 35, r: 18 } },
  '14':     { w: 390, h: 844,  radius: 56, bezel: 12, topSafe: 47, bottomSafe: 34, notch: { w: 225, h: 33, r: 18 } },
  '14-pro': { w: 393, h: 852,  radius: 56, bezel: 12, topSafe: 59, bottomSafe: 34, island: { w: 126, h: 37, r: 20 } },
  '15':     { w: 393, h: 852,  radius: 56, bezel: 12, topSafe: 59, bottomSafe: 34, island: { w: 126, h: 37, r: 20 } },
  '15-pro': { w: 393, h: 852,  radius: 56, bezel: 12, topSafe: 59, bottomSafe: 34, island: { w: 126, h: 37, r: 20 } },
  plain:    { w: 390, h: 844,  radius: 56, bezel: 12, topSafe: 16, bottomSafe: 16 },
}

const PRESET_COLORS: Record<string, string> = {
  black:              '#0b0b0d',
  midnight:           '#0b0c10',
  silver:             '#d7d8dc',
  starlight:          '#f1eee9',
  'space-black':      '#1c1e22',
  gold:               '#f2dfb3',
  blue:               '#2b4fa8',
  pink:               '#ffbfd1',
  titanium:           '#837a72',
  'natural-titanium': '#a69a8a',
  green:              '#2b622e',
  red:                '#c81f2f',
}

function shade(hex: string, pct: number): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!m) return hex
  const [r, g, b] = [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
  const k = (100 + pct) / 100
  const to = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)))
  return `#${to(r).toString(16).padStart(2, '0')}${to(g).toString(16).padStart(2, '0')}${to(b).toString(16).padStart(2, '0')}`
}

export const IPhoneMockup: React.FC<IPhoneMockupProps> = ({
  model = '15-pro', color = 'space-black', orientation = 'portrait', scale = 1,
  bezel, radius, shadow = true,
  screenBg = '#000', wallpaper, wallpaperFit = 'cover', wallpaperPosition = 'center',
  showDynamicIsland, showNotch,
  islandWidth, islandHeight, islandRadius,
  notchWidth, notchHeight, notchRadius,
  safeArea = true, safeAreaOverrides,
  showHomeIndicator = true, innerShadow = true,
  showButtons = true,
  style, className, frameStyle, screenStyle, children,
}) => {
  const spec = DEVICE_SPECS[model]
  const isLandscape = orientation === 'landscape'
  const W = isLandscape ? spec.h : spec.w
  const H = isLandscape ? spec.w : spec.h

  const useIsland = typeof showDynamicIsland === 'boolean' ? showDynamicIsland : Boolean('island' in spec && spec.island)
  const useNotch  = typeof showNotch === 'boolean' ? showNotch : Boolean('notch' in spec && spec.notch) && !useIsland

  const resolvedRadius = radius ?? spec.radius
  const resolvedBezel  = bezel ?? spec.bezel
  const outerRadius    = resolvedRadius + resolvedBezel

  const colorHex = PRESET_COLORS[color] ?? color

  // Realistic titanium-style gradient: lighter top-left → base → darker bottom-right
  const frameGradient = [
    `linear-gradient(145deg,`,
    `  ${shade(colorHex, 34)} 0%,`,
    `  ${shade(colorHex, 16)} 18%,`,
    `  ${colorHex} 40%,`,
    `  ${shade(colorHex, -16)} 65%,`,
    `  ${shade(colorHex, -30)} 100%`,
    `)`,
  ].join(' ')

  // Multi-layer shadow for 3D depth
  const outerShadow = typeof shadow === 'string'
    ? shadow
    : shadow
      ? [
          `0 32px 64px rgba(0,0,0,0.52)`,
          `0 16px 32px rgba(0,0,10,0.38)`,
          `0 5px 10px rgba(0,0,0,0.42)`,
          `inset 0 1.5px 0 rgba(255,255,255,0.18)`,
          `inset 0 0 0 1px rgba(0,0,0,0.38)`,
        ].join(', ')
      : 'none'

  const innerShadowCss = innerShadow
    ? 'inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 8px 18px rgba(0,0,0,0.38), inset 0 -6px 14px rgba(0,0,0,0.26)'
    : 'none'

  const notchSpec  = 'notch' in spec ? spec.notch : undefined
  const islandSpec = 'island' in spec ? spec.island : undefined

  const finalIslandW = islandWidth  ?? islandSpec?.w ?? 0
  const finalIslandH = islandHeight ?? islandSpec?.h ?? 0
  const finalIslandR = islandRadius ?? islandSpec?.r ?? 0
  const finalNotchW  = notchWidth   ?? notchSpec?.w  ?? 0
  const finalNotchH  = notchHeight  ?? notchSpec?.h  ?? 0
  const finalNotchR  = notchRadius  ?? notchSpec?.r  ?? 0

  const insets = {
    top:    safeAreaOverrides?.top    ?? spec.topSafe,
    bottom: safeAreaOverrides?.bottom ?? spec.bottomSafe,
    left:   safeAreaOverrides?.left   ?? 0,
    right:  safeAreaOverrides?.right  ?? 0,
  }

  const cutoutCommon: CSSProperties = {
    position: 'absolute', left: '50%', transform: 'translateX(-50%)',
    background: '#000', zIndex: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.7)',
  }

  const outerW = W + resolvedBezel * 2
  const outerH = H + resolvedBezel * 2

  // Physical button dimensions (scaled with bezel thickness)
  const btnThickness  = Math.round(resolvedBezel * 0.45)
  const btnDepth      = Math.round(resolvedBezel * 1.1)
  const silentH       = Math.round(H * 0.045)
  const volH          = Math.round(H * 0.08)
  const powerH        = Math.round(H * 0.115)
  const volGap        = Math.round(H * 0.018)
  const silentTop     = Math.round(H * 0.17)
  const volTop        = Math.round(H * 0.24)
  const powerTop      = Math.round(H * 0.24)

  const btnBase = shade(colorHex, -5)
  const btnFront = shade(colorHex, 12)

  const leftBtnStyle: CSSProperties = {
    position: 'absolute',
    left: -btnDepth,
    width: btnDepth,
    borderRadius: `${btnThickness}px 0 0 ${btnThickness}px`,
    background: `linear-gradient(90deg, ${btnFront} 0%, ${btnBase} 100%)`,
    boxShadow: `-1px 0 3px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)`,
  }

  const rightBtnStyle: CSSProperties = {
    position: 'absolute',
    right: -btnDepth,
    width: btnDepth,
    borderRadius: `0 ${btnThickness}px ${btnThickness}px 0`,
    background: `linear-gradient(90deg, ${btnBase} 0%, ${btnFront} 100%)`,
    boxShadow: `1px 0 3px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)`,
  }

  // USB-C and speaker dots at the bottom
  const cutoutColor = shade(colorHex, -40)
  const usbcW  = Math.round(W * 0.072)
  const usbcH  = Math.round(resolvedBezel * 0.45)
  const dotR   = Math.round(resolvedBezel * 0.15)
  const dotGap = dotR * 2.2

  return (
    <div className={className} style={{ boxSizing: 'border-box', display: 'block', width: outerW * scale, height: outerH * scale, position: 'relative', flexShrink: 0, ...style }}>
      <div
        aria-label={`iPhone mockup (${model})`}
        style={{
          width: outerW, height: outerH,
          borderRadius: outerRadius,
          background: frameGradient,
          padding: resolvedBezel,
          boxSizing: 'border-box',
          boxShadow: outerShadow,
          position: 'absolute', top: 0, left: 0,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          overflow: 'visible',
          ...frameStyle,
        }}
      >
        {/* ── Left rail buttons ── */}
        {showButtons && (
          <>
            {/* Silent / mute toggle */}
            <div aria-hidden style={{ ...leftBtnStyle, top: silentTop, height: silentH }} />
            {/* Volume up */}
            <div aria-hidden style={{ ...leftBtnStyle, top: volTop, height: volH }} />
            {/* Volume down */}
            <div aria-hidden style={{ ...leftBtnStyle, top: volTop + volH + volGap, height: volH }} />
          </>
        )}

        {/* ── Right rail: power button ── */}
        {showButtons && (
          <div aria-hidden style={{ ...rightBtnStyle, top: powerTop, height: powerH }} />
        )}

        {/* ── Screen ── */}
        <div style={{
          width: '100%', height: '100%',
          borderRadius: resolvedRadius,
          position: 'relative', overflow: 'hidden',
          background: screenBg,
          boxShadow: innerShadowCss,
          ...screenStyle,
        }}>
          {/* Screen glass reflection */}
          <div aria-hidden style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '32%',
            borderRadius: `${resolvedRadius}px ${resolvedRadius}px 60% 60%`,
            background: 'linear-gradient(172deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 45%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 10,
          }} />

          {wallpaper && <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: `url(${wallpaper})`, backgroundSize: wallpaperFit, backgroundPosition: wallpaperPosition, backgroundRepeat: 'no-repeat', zIndex: 0 }} />}

          {useIsland && finalIslandW > 0 && (
            <div aria-hidden style={{ ...cutoutCommon, top: 12, width: finalIslandW, height: finalIslandH, borderRadius: finalIslandR }} />
          )}
          {!useIsland && useNotch && finalNotchW > 0 && (
            <div aria-hidden style={{ ...cutoutCommon, top: 8, width: finalNotchW, height: finalNotchH, borderRadius: finalNotchR }} />
          )}

          <div style={safeArea
            ? { position: 'absolute', top: insets.top, right: insets.right, bottom: insets.bottom, left: insets.left, overflow: 'hidden', zIndex: 1, display: 'flex', flexDirection: 'column' }
            : { position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1, display: 'flex', flexDirection: 'column' }
          }>
            {children}
          </div>

          {showHomeIndicator && (
            <div aria-hidden style={{
              position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
              width: Math.round(W * 0.34), maxWidth: 140, height: 5,
              borderRadius: 3,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.35))',
              opacity: 0.9, zIndex: 3, pointerEvents: 'none',
            }} />
          )}
        </div>

        {/* ── Bottom rail: USB-C + speaker dots ── */}
        {showButtons && (
          <div aria-hidden style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: resolvedBezel,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: resolvedBezel * 1.2,
            pointerEvents: 'none',
          }}>
            {/* Left speaker cluster */}
            <div style={{ display: 'flex', gap: dotGap, alignItems: 'center' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ width: dotR * 2, height: dotR * 2, borderRadius: '50%', background: cutoutColor, boxShadow: `inset 0 1px 1px rgba(0,0,0,0.6)` }} />
              ))}
            </div>
            {/* USB-C */}
            <div style={{
              width: usbcW, height: usbcH,
              borderRadius: usbcH / 2,
              background: cutoutColor,
              boxShadow: `inset 0 1px 2px rgba(0,0,0,0.75), 0 0 0 1px ${shade(colorHex, 8)}`,
            }} />
            {/* Right speaker cluster */}
            <div style={{ display: 'flex', gap: dotGap, alignItems: 'center' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ width: dotR * 2, height: dotR * 2, borderRadius: '50%', background: cutoutColor, boxShadow: `inset 0 1px 1px rgba(0,0,0,0.6)` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default IPhoneMockup
