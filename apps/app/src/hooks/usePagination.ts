'use client';

import { useCallback, useMemo, useState } from 'react';

const usePagination = <T>(data: T[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  const maxPage = Math.ceil(data.length / itemsPerPage);

  const dataForCurrentPage = useMemo(() => {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }, [currentPage, itemsPerPage, data]);

  const jump = useCallback(
    (page: number) => {
      const pageNumber = Math.max(1, page);
      setCurrentPage(() => Math.min(pageNumber, maxPage));
    },
    [maxPage],
  );

  return {
    jump,
    dataForCurrentPage,
    currentPage,
    maxPage,
  };
};

export default usePagination;
