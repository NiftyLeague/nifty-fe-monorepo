// ipfs parameters for more deterministic CIDs
export const IPFS_OPTIONS = {
  cidVersion: 1 as const,
  hashAlg: 'sha2-256',
  wrapWithDirectory: true,
}

// ipfs://bafybeibvp55mrgovy3m63fun4xyaxrqrqbvxmbhhz66onls72y6vzahfgm/comics
export const COMICS_IMAGES_CID = 'bafybeibvp55mrgovy3m63fun4xyaxrqrqbvxmbhhz66onls72y6vzahfgm'

// ipfs://bafybeiagvxj6bpixng77msfbasmvthgjri2cpoxkgj4xwvhfspi5omywsm/items
export const ITEMS_IMAGES_CID = 'bafybeiagvxj6bpixng77msfbasmvthgjri2cpoxkgj4xwvhfspi5omywsm'
