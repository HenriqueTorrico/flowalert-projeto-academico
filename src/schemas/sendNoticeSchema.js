import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'

const scenarios = ['room_change', 'no_class', 'general']

export const sendNoticeSchema = toTypedSchema(
  object({
    turmaId: string().required('Selecione uma turma.'),
    scenario: string().oneOf(scenarios, 'Selecione o tipo de aviso.').required(),
    currentRoom: string().when('scenario', {
      is: 'room_change',
      then: (schema) => schema.required('Informe a sala atual.').trim(),
      otherwise: (schema) => schema.notRequired(),
    }),
    newRoom: string().when('scenario', {
      is: 'room_change',
      then: (schema) => schema.required('Informe a nova sala.').trim(),
      otherwise: (schema) => schema.notRequired(),
    }),
    date: string().when('scenario', {
      is: (value) => value === 'room_change' || value === 'no_class',
      then: (schema) => schema.required('Informe a data.'),
      otherwise: (schema) => schema.notRequired(),
    }),
    message: string().when('scenario', {
      is: 'general',
      then: (schema) =>
        schema.required('Escreva o aviso.').trim().min(5, 'O aviso deve ter pelo menos 5 caracteres.'),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
)

export const NOTICE_SCENARIOS = [
  { value: 'room_change', label: 'Mudança de sala' },
  { value: 'no_class', label: 'Sem aula' },
  { value: 'general', label: 'Aviso geral' },
]
