<template>
  <span class="app-spinner" aria-hidden="true" />
</template>

<style scoped>
.app-spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: app-spinner-spin 0.65s linear infinite;
  flex-shrink: 0;
}

@keyframes app-spinner-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-spinner {
    animation: none;
    border-right-color: currentColor;
    opacity: 0.65;
  }
}
</style>
