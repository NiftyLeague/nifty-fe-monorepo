export default function alignOutput(labelValuePairs: readonly (readonly [string, unknown])[]) {
  if (labelValuePairs.length === 0) return
  const maxLabelLength = labelValuePairs
    .map(([label]) => label.length)
    .reduce((max, len) => (len > max ? len : max), 0)

  for (const [label, value] of labelValuePairs) {
    console.log(label.padEnd(maxLabelLength + 1), value)
  }
}
