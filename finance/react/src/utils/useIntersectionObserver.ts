import { type RefObject, useEffect } from 'react';

type IntersectionObserverHandler = (entry: IntersectionObserverEntry) => void;

interface Params {
  elementRef: RefObject<Element | null>;
  onChange: IntersectionObserverHandler;
  options?: IntersectionObserverInit;
}

export const useIntersectionObserver = ({ elementRef, onChange, options }: Params) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        onChange(entry);
      }
    }, options);
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, onChange, options]);
};
