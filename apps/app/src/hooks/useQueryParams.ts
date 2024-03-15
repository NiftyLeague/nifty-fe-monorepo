import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

const useQueryParams = () => {
  const searchParams = useSearchParams();
  return useMemo(() => new URLSearchParams(searchParams), [searchParams]);
};

export default useQueryParams;
