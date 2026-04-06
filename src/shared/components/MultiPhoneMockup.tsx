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

      {/* Left phone — right side face visible */}
      <div className="multi-phone-wrapper multi-phone-left">
        <div className="mpm-side mpm-side--right" aria-hidden="true" />
        <IPhoneMockup
          model="15-pro"
          color="space-black"
          scale={0.38}
          screenBg="#080a14"
          safeArea={false}
          showHomeIndicator={false}
          shadow="0 28px 56px rgba(0,0,0,0.65), 0 6px 16px rgba(0,0,0,0.4)"
          wallpaper={leftImage}
          wallpaperFit="cover"
        >
          {leftScreen}
          <div className="multi-phone-overlay multi-phone-overlay-left" />
        </IPhoneMockup>
      </div>

      {/* Right phone — left side face visible */}
      <div className="multi-phone-wrapper multi-phone-right">
        <div className="mpm-side mpm-side--left" aria-hidden="true" />
        <IPhoneMockup
          model="15-pro"
          color="space-black"
          scale={0.38}
          screenBg="#080a14"
          safeArea={false}
          showHomeIndicator={false}
          shadow="0 28px 56px rgba(0,0,0,0.65), 0 6px 16px rgba(0,0,0,0.4)"
          wallpaper={rightImage}
          wallpaperFit="cover"
        >
          {rightScreen}
          <div className="multi-phone-overlay multi-phone-overlay-right" />
        </IPhoneMockup>
      </div>

      {/* Center phone — slight backward tilt */}
      <div className="multi-phone-wrapper multi-phone-center">
        <IPhoneMockup
          model="15-pro"
          color="space-black"
          scale={0.50}
          screenBg="#080a14"
          safeArea={false}
          showHomeIndicator={false}
          shadow="0 48px 96px rgba(0,0,0,0.75), 0 20px 40px rgba(0,10,40,0.5), 0 6px 12px rgba(0,0,0,0.55)"
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
