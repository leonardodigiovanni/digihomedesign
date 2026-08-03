'use client'

import Link from 'next/link'
import SetActionBar from '@/app/app/set-action-bar'

export default function PreventivoActionsBar({ id }: { id: number }) {
  return (
    <SetActionBar>
      <Link href="/app/preventivo" className="btn-black-app fs-12" style={{ margin: '0 auto' }}>
        ← lista preventivi
      </Link>
    </SetActionBar>
  )
}
