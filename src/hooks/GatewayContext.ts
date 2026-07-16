import { createContext, useContext } from 'react'
import type { useGatewayData } from './useGatewayData'

type GatewayData = ReturnType<typeof useGatewayData>

export const GatewayContext = createContext<GatewayData | null>(null)

export function useGateway() {
  const ctx = useContext(GatewayContext)
  if (!ctx) throw new Error('useGateway must be used within Layout')
  return ctx
}
