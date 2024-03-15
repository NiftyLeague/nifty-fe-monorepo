export function safeJSONParse(input: unknown) {
  try {
    return JSON.parse(input as string);
  } catch (e) {
    return input;
  }
}
