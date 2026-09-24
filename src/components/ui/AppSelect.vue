<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, default: () => [] },
  id: { type: String, default: undefined },
  placeholder: { type: String, default: 'Selecione' },
  invalid: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'blur'])

const open = ref(false)
const rootRef = ref(null)

const normalizedOptions = computed(() =>
  props.options.map((option) =>
    typeof option === 'object' && option !== null
      ? { value: option.value, label: option.label ?? String(option.value) }
      : { value: option, label: String(option) },
  ),
)

const selectedLabel = computed(() => {
  const match = normalizedOptions.value.find((opt) => opt.value === props.modelValue)
  return match?.label ?? props.placeholder
})

const hasValue = computed(() => props.modelValue !== '' && props.modelValue != null)

function toggle() {
  if (props.disabled) return
  open.value = !open.value
}

function close() {
  if (!open.value) return
  open.value = false
  emit('blur')
}

function selectOption(value) {
  emit('update:modelValue', value)
  close()
}

function onDocumentPointerDown(event) {
  const root = rootRef.value
  if (!root || root.contains(event.target)) return
  close()
}

function onKeydown(event) {
  if (event.key === 'Escape') close()
}

watch(open, (isOpen) => {
  if (isOpen) {
    document.addEventListener('pointerdown', onDocumentPointerDown)
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('pointerdown', onDocumentPointerDown)
    document.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="rootRef" class="app-select" :class="{ 'app-select--open': open, 'app-select--disabled': disabled }">
    <button
      :id="id"
      type="button"
      class="app-select__trigger field__input"
      :class="{ 'field__input--invalid': invalid, 'app-select__trigger--placeholder': !hasValue }"
      :disabled="disabled"
      :aria-expanded="open"
      aria-haspopup="listbox"
      @click="toggle"
    >
      <span class="app-select__value">{{ selectedLabel }}</span>
      <span class="app-select__chevron" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
    </button>

    <Transition name="app-select-drop">
      <ul v-if="open" class="app-select__menu" role="listbox" :aria-labelledby="id">
        <li
          v-for="option in normalizedOptions"
          :key="String(option.value)"
          role="option"
          class="app-select__option"
          :class="{ 'app-select__option--selected': option.value === modelValue }"
          :aria-selected="option.value === modelValue"
          @click="selectOption(option.value)"
        >
          {{ option.label }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
@import '../../styles/auth-form.css';

.app-select {
  position: relative;
  width: 100%;
}

.app-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  text-align: left;
  cursor: pointer;
}

.app-select__trigger--placeholder .app-select__value {
  color: var(--color-ink-soft);
}

.app-select--open .app-select__trigger {
  border-color: #b8b3ab;
}

.app-select--disabled .app-select__trigger {
  opacity: 0.65;
  cursor: not-allowed;
}

.app-select__value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.app-select__chevron {
  display: flex;
  color: #8a8680;
  transition: transform 0.2s ease;
}

.app-select--open .app-select__chevron {
  transform: rotate(180deg);
}

.app-select__menu {
  position: absolute;
  z-index: 20;
  top: calc(100% + 0.35rem);
  left: 0;
  right: 0;
  margin: 0;
  padding: 0.35rem;
  list-style: none;
  background: #fff;
  border: 1px solid #dcd9d4;
  border-radius: 10px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.1);
  max-height: 14rem;
  overflow-y: auto;
}

.app-select__option {
  padding: 0.65rem 0.75rem;
  font-size: 0.9375rem;
  line-height: 1.35;
  color: var(--color-ink);
  border-radius: 7px;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.app-select__option:hover {
  background: #f5f4f1;
}

.app-select__option--selected {
  font-weight: 600;
  color: #2a5c52;
  background: #eef6f3;
}

.app-select-drop-enter-active,
.app-select-drop-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.2s ease;
}

.app-select-drop-enter-from,
.app-select-drop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
