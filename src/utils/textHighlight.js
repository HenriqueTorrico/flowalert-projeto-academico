export function highlightTextSegments(text, query) {
  const source = String(text ?? '')
  const term = String(query ?? '').trim()
  if (!term) {
    return [{ text: source, highlight: false }]
  }

  const lowerSource = source.toLowerCase()
  const lowerTerm = term.toLowerCase()
  const segments = []
  let start = 0
  let index = lowerSource.indexOf(lowerTerm, start)

  while (index !== -1) {
    if (index > start) {
      segments.push({ text: source.slice(start, index), highlight: false })
    }
    segments.push({
      text: source.slice(index, index + lowerTerm.length),
      highlight: true,
    })
    start = index + lowerTerm.length
    index = lowerSource.indexOf(lowerTerm, start)
  }

  if (start < source.length) {
    segments.push({ text: source.slice(start), highlight: false })
  }

  return segments.length > 0 ? segments : [{ text: source, highlight: false }]
}
