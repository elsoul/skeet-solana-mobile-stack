export const copyToClipboard = async (content: string | null | undefined) => {
  if (content == null) return false
  if (navigator == null) return false
  await navigator.clipboard.writeText(content)
}
