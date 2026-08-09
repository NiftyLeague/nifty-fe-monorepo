import fs from 'fs'
import fetch from 'node-fetch'
import { config } from 'node-config-ts'

/**
 * Generates NFT image url from character traits.
 * @param {} traits - list of character traits from contract
 * @param {number} rarity - number of background rarity 0-3
 */
export function generateImageURL(traits: number[], rarity: number, token: number) {
  const traitArray = [
    ['Tribe', traits[0]],
    ['Skin Color', traits[1]],
    ['Fur Color', traits[2]],
    ['Eye Color', traits[3]],
    ['Pupil Color', traits[4]],
    ['Hair', traits[5]],
    ['Mouth', traits[6]],
    ['Beard', traits[7]],
    ['Top', traits[8]],
    ['Outerwear', traits[9]],
    ['Print', traits[10]],
    ['Bottom', traits[11]],
    ['Footwear', traits[12]],
    ['Belt', traits[13]],
    ['Hat', traits[14]],
    ['Eyewear', traits[15]],
    ['Piercing', traits[16]],
    ['Wrist', traits[17]],
    ['Hands', traits[18]],
    ['Neckwear', traits[19]],
    ['Left Item', traits[20]],
    ['Right Item', traits[21]],
  ]
  const params = new URLSearchParams({
    version: config.imageGenerator.version,
    traits: JSON.stringify(traitArray),
    secret: config.imageGenerator.secret,
    rarity: rarity.toString(),
    token: token.toString(),
  })
  return `${config.imageGenerator.baseURL}?${params.toString()}`
}

/**
 * Download NFT image from webserver.
 */
export async function downloadImage(url: string, dest: fs.PathLike) {
  const res = await fetch(url)
  /* Create an empty file where we can save data */
  const fileStream = fs.createWriteStream(dest)

  /* Using Promises so that we can use the ASYNC AWAIT syntax */
  await new Promise((resolve, reject) => {
    res.body?.pipe(fileStream)
    res.body?.on('error', reject)
    fileStream.on('finish', async () => {
      console.log(`✅ The file is finished downloading.`)
      resolve(undefined)
    })
  })
}
