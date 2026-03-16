import { createContext } from 'react'
import type { AppStateContextValue } from './app-state'

export const AppStateContext = createContext<AppStateContextValue | null>(null)
