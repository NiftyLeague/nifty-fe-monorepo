export const areEqualArrays = (a: unknown[], b: unknown[]) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export const getUniqueListBy = <T>(arr: { [key: string]: unknown }[], key: string): T[] => {
  return [...new Map(arr.map(item => [item[key], item])).values()] as T[];
};
