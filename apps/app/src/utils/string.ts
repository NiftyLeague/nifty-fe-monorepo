export function capitalize(str: string): string {
  const firstLetter = str.charAt(0).toUpperCase();
  const restOfString = str.substring(1).toLowerCase();
  return firstLetter + restOfString;
}
