'use client';

import type { DependencyList, EffectCallback } from 'react';
import { useEffect, useRef } from 'react';

interface DependencyChange {
  before: unknown;
  after: unknown;
}

type DependencyChanges = { [key: string | number]: DependencyChange };

export const useEffectDebugger = (
  effectHook: EffectCallback,
  dependencies: DependencyList,
  dependencyNames: string[] = [],
) => {
  const previousDepsRef = useRef<DependencyList>([]);

  useEffect(() => {
    const previousDeps = previousDepsRef.current;
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

    previousDepsRef.current = dependencies;
  }, [dependencies, dependencyNames]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effectHook, dependencies);
};

export default useEffectDebugger;
