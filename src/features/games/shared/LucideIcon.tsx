/**
 * Dynamic Lucide icon renderer.
 * Maps icon name strings (as used in the original iconBank) to lucide-react components.
 */
import {
  Anchor, Atom, Award, Bell, Book, Brain, Calculator, Camera,
  CheckCircle2, Clock, Cloud, Coffee, Compass, Droplet, Feather,
  Flame, Flower, Gift, Headphones, Heart, Key, Leaf, Map,
  Moon, Music, Palette, Radio, Search, Shield, Snowflake,
  Star, Sun, Target, Type, Umbrella, Watch, Wind, XCircle, Zap,
} from 'lucide-react'
import type { ComponentType } from 'react'

const ICON_MAP: Record<string, ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
  anchor: Anchor,
  atom: Atom,
  award: Award,
  bell: Bell,
  book: Book,
  brain: Brain,
  calculator: Calculator,
  camera: Camera,
  'check-circle-2': CheckCircle2,
  clock: Clock,
  cloud: Cloud,
  coffee: Coffee,
  compass: Compass,
  droplet: Droplet,
  feather: Feather,
  flame: Flame,
  flower: Flower,
  gift: Gift,
  headphones: Headphones,
  heart: Heart,
  key: Key,
  leaf: Leaf,
  map: Map,
  moon: Moon,
  music: Music,
  palette: Palette,
  radio: Radio,
  search: Search,
  shield: Shield,
  snowflake: Snowflake,
  star: Star,
  sun: Sun,
  target: Target,
  type: Type,
  umbrella: Umbrella,
  watch: Watch,
  wind: Wind,
  'x-circle': XCircle,
  zap: Zap,
}

interface LucideIconProps {
  name: string
  size?: number
  color?: string
  strokeWidth?: number
}

export function LucideIcon({ name, size = 24, color, strokeWidth }: LucideIconProps) {
  const Icon = ICON_MAP[name]
  if (!Icon) return null
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />
}
