export function errorMsgHandler(e: unknown): string {
  if (e instanceof Error) {
    return e.message;
  } else if ((e as { message: string })?.message) {
    return (e as { message: string }).message;
  } else {
    console.error(e);
    return `Unknown error: ${e}`;
  }
}
