export const GA_TRACKING_ID = 'G-ZLZPB1DD0Y';

// Send a Google Analytics page view hit
export const pageview = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
      page_title: title || (typeof document !== 'undefined' ? document.title : ''),
    });
    (window as any).gtag('event', 'page_view', {
      page_path: url,
      page_title: title || (typeof document !== 'undefined' ? document.title : ''),
    });
  }
};

// Send custom events (e.g., registrations, conversions, button clicks)
export const event = (
  action: string,
  params: Record<string, any> = {}
) => {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', action, params);
  }
};

