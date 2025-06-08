import { useState, useEffect } from 'react';
import { useLoading } from '@/context/loading-context';

interface FetchState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useFetch<T>(url: string, options?: RequestInit) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    isLoading: true,
  });
  const { startLoading, stopLoading, updateProgress } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      startLoading('Loading data...');
      try {
        const response = await fetch(url, options);
        updateProgress(30);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        updateProgress(70);
        
        setState({
          data,
          error: null,
          isLoading: false,
        });
        
        updateProgress(100);
      } catch (error) {
        setState({
          data: null,
          error: error as Error,
          isLoading: false,
        });
      } finally {
        stopLoading();
      }
    };

    fetchData();
  }, [url, options, startLoading, stopLoading, updateProgress]);

  return state;
} 