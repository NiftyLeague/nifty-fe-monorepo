export const areEqualArrays = (a: unknown[], b: unknown[]): boolean => {
  return JSON.stringify(a) === JSON.stringify(b)
}

export const getUniqueListBy = <T>(arr: T[], key: keyof T): T[] => {
  return [...new Map(arr.map((item) => [item[key], item])).values()]
}
