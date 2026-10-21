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
                        <input id="recovery-email" v-model="email" v-bind="emailAttrs" class="field__input"
                            :class="{ 'field__input--invalid': showError('email') }" type="email" name="email"
                            autocomplete="email" placeholder="nome@escola.com.br" autofocus />
                        <p v-if="showError('email')" class="field__error" role="alert">{{ errors.email }}</p>
                    </div>

                    <AppActionButton
                        type="submit"
                        variant="primary"
                        :loading="submitting"
                        loading-label="Enviando…"
                    >
                        Enviar link
                    </AppActionButton>
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

<script setup>
import { ref } from 'vue'
import AuthHeroPanel from '../components/auth/AuthHeroPanel.vue'
import AppActionButton from '../components/ui/AppActionButton.vue'
import { useAuthForm } from '../composables/useAuthForm'
import { forgotPasswordSchema } from '../schemas/forgotPasswordSchema'

const submitting = ref(false)

const { defineAuthField, handleSubmit, errors, submitCount } = useAuthForm({
    validationSchema: forgotPasswordSchema,
    initialValues: {
        email: '',
    },
})

const [email, emailAttrs] = defineAuthField('email')

const runSubmit = handleSubmit(async (values) => {
    submitting.value = true
    try {
        const base = import.meta.env.VITE_API_URL ?? ''
        await fetch(`${base}/api/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: values.email }),
        })
    } finally {
        submitting.value = false
    }
})

function onSubmit() {
    runSubmit()
}

function showError(field) {
    return submitCount.value > 0 && errors.value[field]
}
</script>

<style scoped>
@import '../styles/auth-form.css';
</style>
