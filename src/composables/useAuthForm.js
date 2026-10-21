import { useForm } from 'vee-validate'
import { authFieldConfig, validateOnSubmitOnly } from '../config/formValidation'

export function useAuthForm(options) {
    const form = useForm({
        ...validateOnSubmitOnly,
        ...options,
    })

    function defineAuthField(path) {
        return form.defineField(path, authFieldConfig)
    }

    return {
        ...form,
        defineAuthField,
    }
}
