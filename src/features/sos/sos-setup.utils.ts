export function finalizeResponseDraft(response: string): string {
  return response
    .replace(/\s+/g, ' ')
    .trim()
}
