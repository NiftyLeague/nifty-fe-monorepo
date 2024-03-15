export const formatNumberToDisplay = (num: number, digits = 2) =>
  num
    ? num.toLocaleString(undefined, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })
    : 0;

export const formatNumberToDisplay2 = (num: number, digits = 2) =>
  num
    ? num.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: digits,
      })
    : '0';

export const formatNumberToDisplayWithCommas = (num?: number) => {
  if (num) {
    const fixed = (Math.round(num * 100) / 100).toFixed(2);
    const parts = fixed.toString().split('.');
    parts[0] = parts[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') ?? '';
    return parts.join('.');
  }
  return 0;
};
