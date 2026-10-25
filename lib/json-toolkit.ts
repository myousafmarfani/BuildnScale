export function transformJSON(
  input: string,
  indent: number | 'minify' = 2
): { output: string; error: string | null } {
  if (!input.trim()) return { output: '', error: 'Paste JSON to get started.' }
  try {
    const value: unknown = JSON.parse(input)
    // JSON.parse rounds integers outside this range. Avoid quietly exporting changed data.
    const unsafe = (item: unknown): boolean =>
      typeof item === 'number'
        ? !Number.isFinite(item) ||
          (Number.isInteger(item) && !Number.isSafeInteger(item))
        : Array.isArray(item)
          ? item.some(unsafe)
          : item !== null && typeof item === 'object'
            ? Object.values(item).some(unsafe)
            : false
    if (unsafe(value))
      return {
        output: '',
        error:
          'This JSON contains a number outside JavaScript’s safe range. Quote large numeric identifiers to preserve them exactly.',
      }
    return {
      output: JSON.stringify(
        value,
        null,
        indent === 'minify' ? undefined : indent
      ),
      error: null,
    }
  } catch (error) {
    return {
      output: '',
      error: error instanceof Error ? error.message : 'Invalid JSON',
    }
  }
}
