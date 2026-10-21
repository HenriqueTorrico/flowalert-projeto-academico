export const WHATSAPP_INPUT_PREFIX = '+55 '

/**
 * Dígitos nacionais (DDD + número), sem código do país.
 * @param {object} [options]
 * @param {boolean} [options.afterFixedPrefix] — valor do input mascarado (já exibe +55)
 */
export function extractNationalWhatsappDigits(raw, options = {}) {
  const { afterFixedPrefix = false } = options
  const text = String(raw ?? '').trim()
  if (!text) return ''

  if (afterFixedPrefix) {
    let rest = text
    if (rest.startsWith(WHATSAPP_INPUT_PREFIX)) {
      rest = rest.slice(WHATSAPP_INPUT_PREFIX.length)
    } else if (rest.startsWith('+55')) {
      rest = rest.replace(/^\+55\s*/, '')
    }
    return rest.replace(/\D/g, '').slice(0, 11)
  }

  let digits = text.replace(/\D/g, '')
  if (!digits) return ''

  if (digits.startsWith('55')) {
    const national = digits.slice(2)
    if (national.length >= 10 && national.length <= 11) {
      digits = national
    } else if (digits.length > 11) {
      digits = national.slice(0, 11)
    }
  }

  return digits.slice(0, 11)
}

/** Máscara de digitação: +55 11 98468-7621 */
export function formatWhatsappInputMasked(nationalDigits) {
  const d = extractNationalWhatsappDigits(nationalDigits)
  if (!d) return WHATSAPP_INPUT_PREFIX

  const ddd = d.slice(0, 2)
  const num = d.slice(2)

  if (d.length <= 2) {
    return `${WHATSAPP_INPUT_PREFIX}${ddd}`
  }

  const mobile = num[0] === '9'
  const maxNumLen = mobile ? 9 : 8
  const numPart = num.slice(0, maxNumLen)

  let formattedNum
  if (mobile) {
    formattedNum =
      numPart.length <= 5 ? numPart : `${numPart.slice(0, 5)}-${numPart.slice(5)}`
  } else {
    formattedNum =
      numPart.length <= 4 ? numPart : `${numPart.slice(0, 4)}-${numPart.slice(4)}`
  }

  return `${WHATSAPP_INPUT_PREFIX}${ddd} ${formattedNum}`
}

export function formatWhatsappDisplay(digits) {
  const national = extractNationalWhatsappDigits(digits)
  if (!national) return ''
  return formatWhatsappInputMasked(national)
}

export function whatsappHref(digits) {
  const value = String(digits ?? '').replace(/\D/g, '')
  if (!value) return ''
  const withCountry = value.startsWith('55') ? value : `55${value}`
  return `https://wa.me/${withCountry}`
}

/** Abre o WhatsApp com texto pré-preenchido (escolher contato ou grupo). */
export function whatsappShareHref(text) {
  const body = String(text ?? '').trim()
  if (!body) return ''
  return `https://wa.me/?text=${encodeURIComponent(body)}`
}
