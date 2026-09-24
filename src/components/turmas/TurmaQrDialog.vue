<script setup>
import { computed, ref, toRef, watch } from 'vue'
import { useSimulatedLoad } from '../../composables/useSimulatedLoad'
import { getTurmaJoinUrl, getTurmaQrImageUrl } from '../../utils/turmaQr'
import AppModal from '../ui/AppModal.vue'
import AppSkeleton from '../ui/AppSkeleton.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  turma: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const { isLoading } = useSimulatedLoad(toRef(props, 'open'), 520)

const qrImageReady = ref(false)

watch(
  () => [props.open, props.turma?.id],
  ([isOpen]) => {
    if (!isOpen) qrImageReady.value = false
  },
)

const qrUrl = computed(() => (props.turma ? getTurmaQrImageUrl(props.turma.id) : ''))
const joinUrl = computed(() => (props.turma ? getTurmaJoinUrl(props.turma.id) : ''))

const showContentSkeleton = computed(() => isLoading.value || (props.turma && !qrImageReady.value))

function onQrLoad() {
  qrImageReady.value = true
}

function onClose() {
  emit('close')
}
</script>

<template>
  <AppModal
    :open="open"
    title="QR Code da turma"
    :description="turma ? `Compartilhe o acesso à turma ${turma.name}.` : ''"
    max-width="22rem"
    @close="onClose"
  >
    <div v-if="turma" class="qr-dialog">
      <img
        v-if="qrUrl"
        class="qr-dialog__preload"
        :src="qrUrl"
        alt=""
        @load="onQrLoad"
      />
      <div v-if="showContentSkeleton" class="qr-dialog__skeleton" aria-busy="true" aria-label="Carregando QR Code">
        <AppSkeleton width="240px" height="240px" />
        <AppSkeleton variant="text" width="90%" class="qr-dialog__skel-line" />
        <AppSkeleton variant="text" width="100%" />
      </div>
      <template v-else>
        <img
          class="qr-dialog__image"
          :src="qrUrl"
          :alt="`QR Code da turma ${turma.name}`"
          width="240"
          height="240"
        />
        <p class="qr-dialog__hint">Os alunos podem escanear para entrar na turma.</p>
        <p class="qr-dialog__link">{{ joinUrl }}</p>
      </template>
    </div>

    <template #footer>
      <button type="button" class="btn-accent-sm" @click="onClose">Fechar</button>
    </template>
  </AppModal>
</template>

<style scoped>
.qr-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.qr-dialog__preload {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
}

.qr-dialog__skeleton {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 0.65rem;
}

.qr-dialog__skel-line {
  margin-top: 0.35rem;
}

.qr-dialog__image {
  display: block;
  border: 1px solid #ebe9e5;
  border-radius: 10px;
  background: #fff;
}

.qr-dialog__hint {
  margin: 0.85rem 0 0.35rem;
  font-size: 0.8125rem;
  color: #7a7772;
}

.qr-dialog__link {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.4;
  color: #9a958d;
  word-break: break-all;
}
</style>
