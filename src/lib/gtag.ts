export const GA_TRACKING_ID = 'G-ZLZPB1DD0Y';

// Send a Google Analytics page view hit safely
export const pageview = (url: string, title?: string) => {
  try {
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
  } catch (err) {
    // Fail silently so analytics never affects UI
    console.warn('GA pageview notice:', err);
  }
};

// Send custom events safely
export const event = (
  action: string,
  params: Record<string, any> = {}
) => {
  try {
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      const safeParams = { ...params };
      // If value is passed as string with currency symbol (e.g. "€299"), convert to numeric
      if ('value' in safeParams && typeof safeParams.value === 'string') {
        const num = parseFloat(safeParams.value.replace(/[^0-9.]/g, ''));
        if (!isNaN(num)) {
          safeParams.value = num;
        }
      }
      (window as any).gtag('event', action, safeParams);
    }
  } catch (err) {
    // Fail silently so analytics never affects UI
    console.warn('GA event notice:', err);
  }
};
