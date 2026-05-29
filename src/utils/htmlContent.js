const ALLOWED_RICH_TEXT_TAG_RE = /<\/?(?:i|em|b|strong|br|a)(?:\s[^>]*)?>/gi

/** Escape `<...>` for v-html unless it is a whitelisted inline tag (e.g. `<i>`). */
export function sanitizeRichText(value) {
  const text = String(value || '')
  if (!text) return ''
  const preserved = []
  const masked = text.replace(ALLOWED_RICH_TEXT_TAG_RE, (tag) => {
    const id = preserved.length
    preserved.push(tag)
    return `\uE000${id}\uE001`
  })
  const escaped = masked
    .replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[\da-f]+;)/gi, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  return preserved.reduce(
    (out, tag, id) => out.replace(`\uE000${id}\uE001`, tag),
    escaped,
  )
}

export function containsHtml(value) {
  return /<[a-z][\s\S]*>/i.test(String(value || ''))
}

export function localizedField(field, lang = 'en') {
  if (!field) return ''
  if (typeof field === 'string') return field.trim()
  const value = field[lang] || field.en || field.kr || ''
  return typeof value === 'string' ? value.trim() : ''
}
