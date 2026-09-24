<template>
  <main class="join-turma">
    <h1>Entrar na turma</h1>
    <p>Código da turma: <strong>{{ turmaId }}</strong></p>
    <p class="join-turma__hint">Fluxo de inscrição do aluno será implementado em breve.</p>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const turmaId = computed(() => route.params.id)
</script>

<style scoped>
.join-turma {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  font-family: var(--font-sans);
}

.join-turma__hint {
  color: var(--color-ink-muted);
  font-size: 0.9rem;
}
</style>
