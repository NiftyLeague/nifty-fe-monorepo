export type FunctionType = (...args: unknown[]) => void;

const callAll =
  (...fns: FunctionType[]) =>
  (...args: unknown[]) =>
    fns.forEach(fn => fn && fn(...args));

export default callAll;
