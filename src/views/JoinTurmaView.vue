<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getStoredToken } from '../services/auth'
import { joinTurmaByQr } from '../services/turmas'

const route = useRoute()
const router = useRouter()

const turmaId = computed(() => route.params.id)
const status = ref('loading')
const message = ref('')

onMounted(async () => {
  if (!getStoredToken()) {
    status.value = 'login'
    message.value = 'Faça login com a conta de aluno para entrar na turma pelo QR Code.'
    return
  }

  try {
    await joinTurmaByQr(turmaId.value)
    status.value = 'success'
    message.value = 'Você entrou na turma com sucesso.'
  } catch (err) {
    status.value = 'error'
    message.value =
      err instanceof Error ? err.message : 'Não foi possível entrar na turma.'
  }
})

function goLogin() {
  router.push({ name: 'login' })
}
</script>

<template>
  <main class="join-turma">
    <h1>Entrar na turma</h1>
    <p class="join-turma__code">Código da turma: <strong>{{ turmaId }}</strong></p>

    <p v-if="status === 'loading'" class="join-turma__hint">Processando matrícula…</p>
    <p v-else class="join-turma__message" :class="`join-turma__message--${status}`">
      {{ message }}
    </p>

    <button v-if="status === 'login'" type="button" class="btn-primary join-turma__action" @click="goLogin">
      Ir para o login
    </button>

    <p class="join-turma__footnote">
      Professores matriculam alunos em <strong>Visualizar</strong> na turma. O QR é o atalho para o aluno.
    </p>
  </main>
</template>

<style scoped>
@import '../styles/auth-form.css';

.join-turma {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  font-family: var(--font-sans);
  max-width: 28rem;
  margin: 0 auto;
}

.join-turma__code {
  color: var(--color-ink-muted);
}

.join-turma__hint,
.join-turma__message {
  font-size: 0.95rem;
  line-height: 1.5;
}

.join-turma__message--success {
  color: #2f6b4f;
}

.join-turma__message--error,
.join-turma__message--login {
  color: #8b3a3a;
}

.join-turma__action {
  margin-top: 0.5rem;
  width: 100%;
  max-width: 16rem;
}

.join-turma__footnote {
  margin-top: 1.5rem;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--color-ink-muted);
}
</style>
