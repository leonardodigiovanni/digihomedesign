export function cantiereSrc(taskId: number, filename: string): string {
  return filename.startsWith('https://') ? filename : `/uploads/cantieri/tasks/${taskId}/${filename}`
}

export function documentoSrc(filename: string): string {
  return filename.startsWith('https://') ? filename : `/uploads/documenti/${filename}`
}

export function marketingSrc(filename: string): string {
  return filename.startsWith('https://') ? filename : `/uploads/marketing/${filename}`
}
