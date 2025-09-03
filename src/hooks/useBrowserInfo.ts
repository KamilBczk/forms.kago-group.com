'use client';

import { useEffect, useState } from 'react';

interface BrowserInfo {
  userAgent: string;
  referrer: string;
  browserLanguage: string;
  screenResolution: string;
  timezone: string;
  route: string;
}

export function useBrowserInfo() {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo>({
    userAgent: '',
    referrer: '',
    browserLanguage: '',
    screenResolution: '',
    timezone: '',
    route: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBrowserInfo({
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'Direct',
        browserLanguage: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        route: window.location.pathname,
      });
    }
  }, []);

  return browserInfo;
}
