'use client'

import { saveAs } from 'save-as'
import { DEGEN_ASSETS_DOWNLOAD_URL } from '@/constants/url'

const base64ToBlob = (base64: string): Blob => {
  const binaryStr = window.atob(base64)
  const bytes = Uint8Array.from(binaryStr, (char) => char.charCodeAt(0))
  return new Blob([bytes], { type: 'application/zip' })
}

export const downloadDegenAsZip = async (
  authToken: string,
  tokenId: string | number
): Promise<void> => {
  if (typeof window === 'undefined') {
    throw Error('Window undefined. Failed to save image.')
  }
  const res = await fetch(`${DEGEN_ASSETS_DOWNLOAD_URL as string}?id=${tokenId}`, {
    headers: { authorizationToken: authToken },
  })
  if (!res.ok)
    throw new Error(`Failed to download degen ${tokenId}: ${res.status} ${res.statusText}`)
  const text = await res.text()
  const blob = base64ToBlob(text)
  saveAs(blob, `degen_${tokenId}.zip`)
}
