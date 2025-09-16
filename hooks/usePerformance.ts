
import { useCallback, useRef } from 'react';

export function usePerformance() {
  const performanceMarks = useRef<{ [key: string]: number }>({});

  const startMark = useCallback((name: string) => {
    performanceMarks.current[name] = Date.now();
    console.log(`Performance mark started: ${name}`);
  }, []);

  const endMark = useCallback((name: string) => {
    const startTime = performanceMarks.current[name];
    if (startTime) {
      const duration = Date.now() - startTime;
      console.log(`Performance mark ended: ${name} - Duration: ${duration}ms`);
      delete performanceMarks.current[name];
      return duration;
    }
    return 0;
  }, []);

  const measureAsync = useCallback(async <T>(name: string, asyncFn: () => Promise<T>): Promise<T> => {
    startMark(name);
    try {
      const result = await asyncFn();
      endMark(name);
      return result;
    } catch (error) {
      endMark(name);
      throw error;
    }
  }, [startMark, endMark]);

  return {
    startMark,
    endMark,
    measureAsync,
  };
}
