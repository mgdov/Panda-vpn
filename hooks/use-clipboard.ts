import { useState, useCallback } from 'react'

export function useClipboard(resetDelay = 2000) {
    const [copiedText, setCopiedText] = useState<string | null>(null)

    const copyToClipboard = useCallback((text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedText(id)

        setTimeout(() => {
            setCopiedText(null)
        }, resetDelay)
    }, [resetDelay])

    return { copiedText, copyToClipboard }
}
