export const b = (cls: string, isApp?: boolean) =>
  isApp ? cls.split(' ').map(c => `${c}-app`).join(' ') : cls
