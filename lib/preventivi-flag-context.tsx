'use client'
import React, { createContext, useContext } from 'react'

const PreventiviCtx = createContext<boolean>(true)

export function PreventiviProvider({ abilitato, children }: { abilitato: boolean; children: React.ReactNode }) {
  return <PreventiviCtx.Provider value={abilitato}>{children}</PreventiviCtx.Provider>
}

export function usePreventiviAbilitato(): boolean {
  return useContext(PreventiviCtx)
}
