export default function FaceIcon({ size = 22, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* riquadro */}
      <rect x="1.5" y="1.5" width="21" height="21" rx="3" />

      {/* testa */}
      <circle cx="12" cy="12" r="4.8" />

      {/* capelli — arco sopra la testa */}
      <path d="M7.2 11.5 Q7 5 12 5 Q17 5 16.8 11.5" strokeWidth={2.2} />

      {/* occhio sinistro */}
      <line x1="10" y1="11.5" x2="10" y2="11.51" strokeWidth={2.2} />
      {/* occhio destro */}
      <line x1="14" y1="11.5" x2="14" y2="11.51" strokeWidth={2.2} />

      {/* bocca neutra */}
      <path d="M10 14 h4" />

      {/* spalle */}
      <path d="M3 22.5 c0-3 3-4 9-4 s9 1 9 4" />
    </svg>
  )
}
