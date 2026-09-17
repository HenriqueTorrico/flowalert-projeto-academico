<script setup>
import AuthHeroPanel from '../components/auth/AuthHeroPanel.vue'
import { useAuthForm } from '../composables/useAuthForm'
import { forgotPasswordSchema } from '../schemas/forgotPasswordSchema'

const { defineAuthField, handleSubmit, errors, submitCount } = useAuthForm({
  validationSchema: forgotPasswordSchema,
  initialValues: {
    email: '',
  },
})

const [email, emailAttrs] = defineAuthField('email')

const onSubmit = handleSubmit(() => {
  // Integração com API virá depois
})

function showError(field) {
  return submitCount.value > 0 && errors.value[field]
}
</script>

<template>
  <div class="auth-page">
    <AuthHeroPanel />

    <main class="form-panel">
      <div class="form-panel__inner">
        <header class="form-panel__header">
          <h2 class="form-panel__title">Recuperar senha</h2>
          <p class="form-panel__lead">
            Informe o e-mail da sua conta. Enviaremos um link para você criar uma nova senha.
          </p>
        </header>

        <form class="auth-form" @submit.prevent="onSubmit" novalidate>
          <div class="field">
            <label class="field__label" for="recovery-email">E-mail</label>
            <input
              id="recovery-email"
              v-model="email"
              v-bind="emailAttrs"
              class="field__input"
              :class="{ 'field__input--invalid': showError('email') }"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="nome@escola.com.br"
              autofocus
            />
            <p v-if="showError('email')" class="field__error" role="alert">{{ errors.email }}</p>
          </div>

          <button type="submit" class="btn-primary">Enviar link</button>
        </form>

        <p class="form-panel__footer">
          <span class="form-panel__footer-text">Lembrou a senha?</span>
          <RouterLink :to="{ name: 'login' }" class="link-accent link-accent--emphasis">
            Voltar para o login
          </RouterLink>
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import '../styles/auth-form.css';
</style>
