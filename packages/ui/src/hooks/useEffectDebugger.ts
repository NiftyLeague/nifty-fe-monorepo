'use client';

import type { DependencyList, EffectCallback } from 'react';
import { useEffect, useRef } from 'react';

interface DependencyChange {
  before: unknown;
  after: unknown;
}

type DependencyChanges = { [key: string | number]: DependencyChange };

const usePrevious = <T>(value: T, initialValue: T): T => {
  const ref = useRef(initialValue);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useEffectDebugger = (
  effectHook: EffectCallback,
  dependencies: DependencyList,
  dependencyNames: string[] = [],
) => {
  const previousDeps = usePrevious<DependencyList>(dependencies, []);

  const changedDeps = dependencies.reduce<DependencyChanges>((accum, dependency, index) => {
    if (dependency !== previousDeps[index]) {
      const keyName = dependencyNames[index] || index;
      return { ...accum, [keyName]: { before: previousDeps[index], after: dependency } };
    }

    return accum;
  }, {});

  if (Object.keys(changedDeps).length) {
    console.log('[use-effect-debugger] ', changedDeps);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effectHook, dependencies);
};

export default useEffectDebugger;
