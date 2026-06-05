export const isObject = (content) =>
  (content !== null && typeof content === 'object') && !Array.isArray(content)
