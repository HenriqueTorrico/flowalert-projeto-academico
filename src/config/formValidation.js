/** Opções do useForm — validação explícita só no handleSubmit. */
export const validateOnSubmitOnly = {
  validateOnBlur: false,
  validateOnChange: false,
  validateOnInput: false,
  validateOnModelUpdate: false,
}

/**
 * defineField ignora as opções do useForm e usa o getConfig() global no blur.
 * Sempre passe isso em cada campo dos formulários de auth.
 */
export const authFieldConfig = {
  validateOnBlur: false,
  validateOnChange: false,
  validateOnInput: false,
  validateOnModelUpdate: false,
}
