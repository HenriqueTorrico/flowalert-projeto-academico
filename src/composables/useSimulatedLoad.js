import { ref, watch } from 'vue'

/**
 * Simula carregamento ao abrir painéis até a API existir.
 */
export function useSimulatedLoad(openRef, delayMs = 480) {
  const isLoading = ref(false)
  let timer = null

  watch(
    openRef,
    (isOpen) => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      if (isOpen) {
        isLoading.value = true
        timer = setTimeout(() => {
          isLoading.value = false
          timer = null
        }, delayMs)
      } else {
        isLoading.value = false
      }
    },
    { immediate: false },
  )

  return { isLoading }
}
