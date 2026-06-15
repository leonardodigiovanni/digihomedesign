export function validatePassword(pw: string): string | null {
  if (pw.length < 8)           return 'La password deve essere di almeno 8 caratteri.'
  if (!/[A-Z]/.test(pw))      return 'La password deve contenere almeno una lettera maiuscola.'
  if (!/[a-z]/.test(pw))      return 'La password deve contenere almeno una lettera minuscola.'
  if (!/[0-9]/.test(pw))      return 'La password deve contenere almeno un numero.'
  if (!/[^A-Za-z0-9]/.test(pw)) return 'La password deve contenere almeno un simbolo (es. !, @, #, %).'
  return null
}
