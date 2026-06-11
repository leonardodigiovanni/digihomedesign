'use client'

import { useContext } from 'react'
import { ActionBarCtx } from './action-bar-context'

export default function AppActionBar() {
  const { content } = useContext(ActionBarCtx)
  if (!content) return null
  return <div className="app-action-bar">{content}</div>
}
