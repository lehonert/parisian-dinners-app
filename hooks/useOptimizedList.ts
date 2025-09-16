
import { useMemo, useState, useCallback } from 'react';

interface UseOptimizedListProps<T> {
  data: T[];
  pageSize?: number;
  searchKey?: keyof T;
}

export function useOptimizedList<T>({ data, pageSize = 20, searchKey }: UseOptimizedListProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!searchQuery || !searchKey) return data;
    
    return data.filter(item => {
      const value = item[searchKey];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    });
  }, [data, searchQuery, searchKey]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(0, endIndex);
  }, [filteredData, currentPage, pageSize]);

  const hasMore = useMemo(() => {
    return paginatedData.length < filteredData.length;
  }, [paginatedData.length, filteredData.length]);

  const loadMore = useCallback(() => {
    if (hasMore) {
      console.log('Loading more items...');
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore]);

  const resetPagination = useCallback(() => {
    console.log('Resetting pagination');
    setCurrentPage(1);
  }, []);

  const updateSearch = useCallback((query: string) => {
    console.log('Updating search query:', query);
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  return {
    data: paginatedData,
    searchQuery,
    hasMore,
    loadMore,
    resetPagination,
    updateSearch,
    totalCount: filteredData.length,
  };
}
