type AnyFunction = (...args: any[]) => any
export const debounce = (func: (...args: any[]) => any, delay: number, immediate = false): AnyFunction => {
  let timeoutId: any

  function debounced(this: any, ...params: any[]): void {
    if (immediate) {
      func.apply(this, params)
      immediate = false
      return
    }
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, params)
    }, delay)
  }
  return debounced
}