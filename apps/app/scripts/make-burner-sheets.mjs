/**
 * One-off generator: stacks the comics-burner button frame sequences into
 * vertical sprite sheets so the burner machine can cycle them with pure CSS
 * (steps() keyframes) instead of a JS interval swapping image sources.
 *
 * Run from apps/app:  bun scripts/make-burner-sheets.mjs
 * Re-run only when the source frames change; outputs are committed.
 */
import sharp from 'sharp'

const dir = 'public/img/comics/burner/machine'

const sequences = [
  { frames: ['button_burn_1', 'button_burn_2', 'button_burn_3', 'button_burn_4', 'button_burn_5'], out: 'button_burn_sheet.webp' },
  { frames: ['button_connectwallet_01', 'button_connectwallet_02'], out: 'button_connect_sheet.webp' },
]

for (const { frames, out } of sequences) {
  const raws = []
  let width = 0
  let height = 0
  for (const frame of frames) {
    const path = `${dir}/${frame}.webp`
    const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    if (width && (info.width !== width || info.height !== height)) {
      throw new Error(`Frame size mismatch in ${out}: ${frame} is ${info.width}x${info.height}`)
    }
    width = info.width
    height = info.height
    raws.push(data)
  }

  const combined = Buffer.concat(raws)
  await sharp(combined, { raw: { width, height: height * frames.length, channels: 4 } })
    .webp({ quality: 90 })
    .toFile(`${dir}/${out}`)

  const output = await sharp(`${dir}/${out}`).metadata()
  console.log(`${out}: ${output.width}x${output.height} (${frames.length} frames)`)
}
