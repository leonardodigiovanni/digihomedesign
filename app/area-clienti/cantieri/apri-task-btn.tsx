'use client'

import { useRouter } from 'next/navigation'
import type { Task } from '@/app/area-lavoro/cantieri/cantieri-client'

export default function ApriTaskBtn({ task }: { task: Task }) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push(`/area-clienti/cantieri/task/${task.id}`)}
      className="btn-gold"
      style={{ padding: '0 24px' }}
    >
      {task.descrizione}
    </button>
  )
}
