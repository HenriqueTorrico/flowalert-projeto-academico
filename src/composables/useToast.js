import { reactive } from 'vue'

const DEFAULT_DURATION = 4800

const state = reactive({
  items: [],
})

let seed = 0

function remove(id) {
  const index = state.items.findIndex((item) => item.id === id)
  if (index !== -1) state.items.splice(index, 1)
}

function push(toast) {
  const id = ++seed
  const duration = toast.duration ?? DEFAULT_DURATION

  state.items.push({
    id,
    variant: toast.variant ?? 'success',
    message: toast.message ?? '',
    title: toast.title ?? '',
    duration,
  })

  return id
}

export function useToast() {
  function success(message, options = {}) {
    return push({ variant: 'success', message, ...options })
  }

  function error(title, message = '', options = {}) {
    return push({
      variant: 'error',
      title: title || 'Erro',
      message,
      ...options,
    })
  }

  function dismiss(id) {
    remove(id)
  }

  return {
    items: state.items,
    success,
    error,
    dismiss,
    remove,
  }
}
