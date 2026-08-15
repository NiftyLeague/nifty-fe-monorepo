export const formatNumberToDisplay = (num?: number, digits = 2): string =>
  num
    ? num.toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })
    : '0'
