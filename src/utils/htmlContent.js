export function containsHtml(value) {
  return /<[a-z][\s\S]*>/i.test(String(value || ''))
}

export function localizedField(field, lang = 'en') {
  if (!field) return ''
  if (typeof field === 'string') return field.trim()
  const value = field[lang] || field.en || field.kr || ''
  return typeof value === 'string' ? value.trim() : ''
}
