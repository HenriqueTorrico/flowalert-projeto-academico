<script setup>
import AuthHeroPanel from '../components/auth/AuthHeroPanel.vue'
import { useAuthForm } from '../composables/useAuthForm'
import { loginSchema } from '../schemas/loginSchema'

const { defineAuthField, handleSubmit, errors, submitCount } = useAuthForm({
  validationSchema: loginSchema,
  initialValues: {
    email: '',
    password: '',
  },
})

const [email, emailAttrs] = defineAuthField('email')
const [password, passwordAttrs] = defineAuthField('password')

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
          <h2 class="form-panel__title">Bem-vindo de volta</h2>
          <p class="form-panel__lead">Entre com sua conta de professor(a) para continuar.</p>
        </header>

        <div class="auth-form-wrap">
          <form
            id="login-form"
            class="auth-form"
            @submit.prevent="onSubmit"
            novalidate
          >
            <div class="field">
              <label class="field__label" for="email">E-mail</label>
              <input
                id="email"
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

            <div class="field field--password">
              <label class="field__label" for="password">Senha</label>
              <input
                id="password"
                v-model="password"
                v-bind="passwordAttrs"
                class="field__input"
                :class="{ 'field__input--invalid': showError('password') }"
                type="password"
                name="password"
                autocomplete="current-password"
                placeholder="••••••••"
              />
              <p v-if="showError('password')" class="field__error" role="alert">{{ errors.password }}</p>
            </div>
          </form>

          <div class="auth-form__tail">
            <p class="field__helper">
              <RouterLink :to="{ name: 'forgot-password' }" class="link-accent">
                Esqueceu sua senha?
              </RouterLink>
            </p>
            <button type="submit" form="login-form" class="btn-primary">Entrar</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import '../styles/auth-form.css';
</style>
