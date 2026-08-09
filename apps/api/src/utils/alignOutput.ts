export default function alignOutput(labelValuePairs: any[]) {
  const maxLabelLength = labelValuePairs
    .map(([l]) => l.length)
    .reduce((len, max) => (len > max ? len : max))

  for (const [label, value] of labelValuePairs) {
    console.log(label.padEnd(maxLabelLength + 1), value)
  }
}
