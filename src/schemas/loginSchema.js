import { toTypedSchema } from '@vee-validate/yup'
import { object, string } from 'yup'

export const loginSchema = toTypedSchema(
  object({
    email: string()
      .required('O e-mail é obrigatório.')
      .email('Informe um e-mail válido.'),
    password: string().required('A senha é obrigatória.'),
  }),
)
