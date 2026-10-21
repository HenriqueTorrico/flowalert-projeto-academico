export function useDebouncedFn(fn, delayMs = 450) {
  let timerId

  const debounced = (...args) => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      fn(...args)
    }, delayMs)
  }

  debounced.cancel = () => {
    clearTimeout(timerId)
  }

  return debounced
}
