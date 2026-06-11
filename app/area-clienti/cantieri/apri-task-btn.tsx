'use client'

import { useRouter } from 'next/navigation'
import type { Task } from '@/app/area-lavoro/cantieri/cantieri-client'
import { b } from '@/lib/btn'

export default function ApriTaskBtn({ task, isApp }: { task: Task; isApp?: boolean }) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push(`/area-clienti/cantieri/task/${task.id}`)}
      className={b('btn-gold', isApp)}
      style={{ padding: '0 24px' }}
    >
      {task.descrizione}
    </button>
  )
}
