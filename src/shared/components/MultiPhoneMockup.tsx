import type { ReactNode } from 'react'
import { IPhoneMockup } from './IPhoneMockup'

interface MultiPhoneMockupProps {
  leftScreen?: ReactNode
  centerScreen?: ReactNode
  rightScreen?: ReactNode
  leftImage?: string
  centerImage?: string
  rightImage?: string
}

export function MultiPhoneMockup({
  leftScreen,
  centerScreen,
  rightScreen,
  leftImage,
  centerImage,
  rightImage,
}: MultiPhoneMockupProps) {
  return (
    <div className="multi-phone-stage">
      <div className="multi-phone-glow" aria-hidden="true" />
      
      <div className="multi-phone-wrapper multi-phone-left">
        <IPhoneMockup
          model="15-pro"
          color="space-black"
          scale={0.42}
          screenBg="#0a0c16"
          safeArea={false}
          showHomeIndicator={false}
          shadow="0 24px 48px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.35)"
          wallpaper={leftImage}
          wallpaperFit="cover"
        >
          {leftScreen}
          <div className="multi-phone-overlay multi-phone-overlay-left" />
        </IPhoneMockup>
      </div>

      <div className="multi-phone-wrapper multi-phone-right">
        <IPhoneMockup
          model="15-pro"
          color="space-black"
          scale={0.42}
          screenBg="#0a0c16"
          safeArea={false}
          showHomeIndicator={false}
          shadow="0 24px 48px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.35)"
          wallpaper={rightImage}
          wallpaperFit="cover"
        >
          {rightScreen}
          <div className="multi-phone-overlay multi-phone-overlay-right" />
        </IPhoneMockup>
      </div>

      <div className="multi-phone-wrapper multi-phone-center">
        <IPhoneMockup
          model="15-pro"
          color="space-black"
          scale={0.48}
          screenBg="#0a0c16"
          safeArea={false}
          showHomeIndicator={false}
          shadow="0 32px 64px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)"
          wallpaper={centerImage}
          wallpaperFit="cover"
        >
          {centerScreen}
          <div className="multi-phone-overlay multi-phone-overlay-center" />
        </IPhoneMockup>
      </div>
    </div>
  )
}
