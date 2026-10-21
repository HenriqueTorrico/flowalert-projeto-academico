<script setup>
defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: undefined },
  circle: { type: Boolean, default: false },
  variant: {
    type: String,
    default: '',
    validator: (v) => ['', 'text', 'title', 'input', 'label'].includes(v),
  },
})
</script>

<template>
  <span
    class="skeleton"
    :class="{
      'skeleton--circle': circle,
      [`skeleton--${variant}`]: variant,
    }"
    :style="{ width, height: height || undefined }"
    aria-hidden="true"
  />
</template>
