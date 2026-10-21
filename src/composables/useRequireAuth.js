import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchCurrentUser, getStoredUser } from '../services/auth'

export function useRequireAuth() {
  const router = useRouter()
  const user = ref(getStoredUser())
  const loading = ref(true)

  onMounted(async () => {
    try {
      const current = await fetchCurrentUser()
      if (!current) {
        await router.replace({ name: 'login' })
        return
      }
      user.value = current
    } catch {
      await router.replace({ name: 'login' })
    } finally {
      loading.value = false
    }
  })

  return { user, loading }
}
