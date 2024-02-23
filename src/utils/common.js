export const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)

export const ALPHA_NUMERIC =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export const generateRandomName = (length, prefix = '') => {
  return (
    prefix +
    Array.from(
      { length },
      () => ALPHA_NUMERIC[Math.floor(Math.random() * ALPHA_NUMERIC.length)]
    ).join('')
  )
}
