import { toTypedSchema } from '@vee-validate/yup'
import { boolean, object, string } from 'yup'

const periods = ['Manhã', 'Tarde', 'Noite']

export function buildCreateTurmaSchema() {
  return toTypedSchema(
    object({
      name: string()
        .required('O nome da turma é obrigatório.')
        .trim()
        .min(1, 'O nome da turma é obrigatório.')
        .max(160, 'O nome deve ter no máximo 160 caracteres.'),
      room: string()
        .required('A sala é obrigatória.')
        .trim()
        .min(1, 'A sala é obrigatória.')
        .max(80, 'A sala deve ter no máximo 80 caracteres.'),
      period: string()
        .required('O turno é obrigatório.')
        .oneOf(periods, 'Selecione um turno válido.'),
      channelEmail: boolean(),
      channelWhatsapp: boolean(),
      channelTelegram: boolean(),
    }).test('channels', function (values) {
      const selected = Boolean(
        values?.channelEmail || values?.channelWhatsapp || values?.channelTelegram,
      )
      if (selected) return true
      return this.createError({
        path: 'channels',
        message: 'Selecione pelo menos um meio de aviso.',
      })
    }),
  )
}
