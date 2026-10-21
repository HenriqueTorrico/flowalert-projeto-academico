<script setup>
import { computed } from 'vue'
import { highlightTextSegments } from '../../utils/textHighlight'

const props = defineProps({
  text: { type: String, default: '' },
  query: { type: String, default: '' },
})

const segments = computed(() => highlightTextSegments(props.text, props.query))
</script>

<template>
  <span class="highlight-text">
    <template v-for="(part, index) in segments" :key="index">
      <mark v-if="part.highlight" class="highlight-text__mark">{{ part.text }}</mark>
      <template v-else>{{ part.text }}</template>
    </template>
  </span>
</template>

<style scoped>
.highlight-text__mark {
  padding: 0 0.05em;
  font: inherit;
  font-weight: inherit;
  color: inherit;
  background: #fff0c8;
  border-radius: 2px;
}
</style>
