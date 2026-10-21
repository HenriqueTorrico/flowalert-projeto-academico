<script setup>
import { nextTick, ref, watch } from 'vue'
import {
  WHATSAPP_INPUT_PREFIX,
  extractNationalWhatsappDigits,
  formatWhatsappInputMasked,
} from '../../utils/whatsapp'

const props = defineProps({
  modelValue: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  invalid: { type: Boolean, default: false },
  id: { type: String, default: undefined },
})

const emit = defineEmits(['update:modelValue'])

const inputRef = ref(null)

function writeFormatted(nationalDigits) {
  const formatted = formatWhatsappInputMasked(nationalDigits)
  if (inputRef.value) {
    inputRef.value.value = formatted
  }
}

watch(
  () => props.modelValue,
  (value) => {
    writeFormatted(extractNationalWhatsappDigits(value))
  },
  { immediate: true },
)

function commitNational(raw, { afterFixedPrefix = false } = {}) {
  const trimmed = extractNationalWhatsappDigits(raw, { afterFixedPrefix })
  emit('update:modelValue', trimmed)
  writeFormatted(trimmed)

  nextTick(() => {
    const el = inputRef.value
    if (!el) return
    const end = el.value.length
    el.setSelectionRange(end, end)
  })
}

function onInput(event) {
  commitNational(event.target.value, { afterFixedPrefix: true })
}

function onPaste(event) {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text') ?? ''
  commitNational(pasted, { afterFixedPrefix: false })
}

function onKeydown(event) {
  if (props.disabled) return

  const el = event.target
  const prefixLen = WHATSAPP_INPUT_PREFIX.length
  const start = el.selectionStart ?? 0
  const end = el.selectionEnd ?? 0

  if (
    (event.key === 'Backspace' || event.key === 'Delete') &&
    start <= prefixLen &&
    end <= prefixLen
  ) {
    event.preventDefault()
    return
  }

  if (event.key === 'Backspace' && start < prefixLen) {
    event.preventDefault()
    el.setSelectionRange(prefixLen, prefixLen)
  }
}

function onFocus(event) {
  const el = event.target
  if (!el.value || el.value.length < WHATSAPP_INPUT_PREFIX.length) {
    writeFormatted(props.modelValue)
  }

  nextTick(() => {
    const pos = Math.max(el.selectionStart ?? 0, WHATSAPP_INPUT_PREFIX.length)
    el.setSelectionRange(pos, pos)
  })
}
</script>

<template>
  <input
    ref="inputRef"
    :id="id"
    type="tel"
    inputmode="tel"
    class="field__input"
    :class="{ 'field__input--invalid': invalid }"
    :disabled="disabled"
    autocomplete="off"
    :placeholder="WHATSAPP_INPUT_PREFIX"
    @input="onInput"
    @paste="onPaste"
    @keydown="onKeydown"
    @focus="onFocus"
  />
</template>
