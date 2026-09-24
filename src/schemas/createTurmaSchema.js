import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'

export const createTurmaSchema = toTypedSchema(
  object({
    name: string().required('O nome da turma é obrigatório.').trim(),
    room: string().required('A sala é obrigatória.').trim(),
    period: string()
      .required('O turno é obrigatório.')
      .oneOf(['Manhã', 'Tarde', 'Noite'], 'Selecione um turno válido.'),
  }),
)
