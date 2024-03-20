declare module '*.scss' {
  const exports: Record<string, string>;
  export default exports;
}

declare module '*.module.css' {
  const exports: Record<string, string>;
  export default exports;
}
