import { createSignal, type Accessor } from 'solid-js'

type CopiedValue = string | null
type CopyFn = (text: string) => Promise<boolean> // Return success

export const useCopyToClipboard = (): [Accessor<CopiedValue>, CopyFn] => {
  const [copiedText, setCopiedText] = createSignal<CopiedValue>(null)

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      return false
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      return true
    } catch {
      setCopiedText(null)
      return false
    }
  }

  return [copiedText, copy]
}

export default useCopyToClipboard
