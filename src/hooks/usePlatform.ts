import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export function usePlatform() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(Capacitor.isNativePlatform());
  }, []);

  return { isMobile };
} 