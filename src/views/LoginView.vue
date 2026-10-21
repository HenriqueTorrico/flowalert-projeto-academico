<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthHeroPanel from '../components/auth/AuthHeroPanel.vue'
import AppActionButton from '../components/ui/AppActionButton.vue'
import AppMessage from '../components/ui/AppMessage.vue'
import { useAuthForm } from '../composables/useAuthForm'
import { loginSchema } from '../schemas/loginSchema'
import { login as loginRequest } from '../services/auth'

const router = useRouter()
const apiError = ref('')
const submitting = ref(false)

const { defineAuthField, handleSubmit, errors, submitCount } = useAuthForm({
    validationSchema: loginSchema,
    initialValues: {
        email: '',
        password: '',
    },
})

const [email, emailAttrs] = defineAuthField('email')
const [password, passwordAttrs] = defineAuthField('password')

const runLogin = handleSubmit(async (values) => {
    submitting.value = true
    try {
        await loginRequest(values.email, values.password)
        await router.push({ name: 'dashboard' })
    } catch (err) {
        apiError.value =
            err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.'
    } finally {
        submitting.value = false
    }
})

function onSubmit() {
    apiError.value = ''
    runLogin()
}

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
                    <form id="login-form" class="auth-form" @submit.prevent="onSubmit" novalidate>
                        <div class="field">
                            <label class="field__label" for="email">E-mail</label>
                            <input id="email" v-model="email" v-bind="emailAttrs" class="field__input"
                                :class="{ 'field__input--invalid': showError('email') }" type="email" name="email"
                                autocomplete="email" placeholder="nome@escola.com.br" autofocus />
                            <p v-if="showError('email')" class="field__error" role="alert">{{ errors.email }}</p>
                        </div>

                        <div class="field field--password">
                            <label class="field__label" for="password">Senha</label>
                            <input id="password" v-model="password" v-bind="passwordAttrs" class="field__input"
                                :class="{ 'field__input--invalid': showError('password') }" type="password"
                                name="password" autocomplete="current-password" placeholder="••••••••" />
                            <p v-if="showError('password')" class="field__error" role="alert">{{ errors.password }}</p>
                        </div>
                    </form>

                    <div class="auth-form__tail">
                        <p class="field__helper">
                            <RouterLink :to="{ name: 'forgot-password' }" class="link-accent">
                                Esqueceu sua senha?
                            </RouterLink>
                        </p>
                        <AppMessage v-if="apiError" severity="error" :message="apiError" />
                        <AppActionButton
                            type="submit"
                            form="login-form"
                            variant="primary"
                            :loading="submitting"
                            loading-label="Entrando…"
                        >
                            Entrar
                        </AppActionButton>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
@import '../styles/auth-form.css';
</style>
