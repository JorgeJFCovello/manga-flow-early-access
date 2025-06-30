import { useEffect } from 'react';

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, any>) => void;
    };
  }
}

export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName, data);
  }
};

export const Analytics = () => {
  useEffect(() => {
    // Track page view on component mount
    trackEvent('page-view', { page: 'early-access' });
  }, []);

  return null;
};