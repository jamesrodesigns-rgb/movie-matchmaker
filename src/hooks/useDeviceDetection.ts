import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  screenWidth: number;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasTouch: false,
    screenWidth: 1024,
  });

  useEffect(() => {
    const checkDevice = () => {
      const screenWidth = window.innerWidth;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Breakpoints based on common device sizes
      const isMobile = screenWidth < 768;
      const isTablet = screenWidth >= 768 && screenWidth < 1024;
      const isDesktop = screenWidth >= 1024;

      // Additional check for mobile user agents
      const mobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      setDeviceInfo({
        isMobile: isMobile || mobileUserAgent,
        isTablet: isTablet && !mobileUserAgent,
        isDesktop: isDesktop && !mobileUserAgent,
        hasTouch,
        screenWidth,
      });
    };

    // Check on mount
    checkDevice();

    // Listen for resize events
    window.addEventListener('resize', checkDevice);
    
    // Listen for orientation changes (mobile)
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return deviceInfo;
};

// Hook specifically for determining if we should show desktop controls
export const useShowDesktopControls = (): boolean => {
  const { isDesktop, hasTouch } = useDeviceDetection();
  
  // Show desktop controls if:
  // 1. We're on desktop screen size AND
  // 2. No touch capability (or we want to show them anyway for desktop touch screens)
  return isDesktop && !hasTouch;
};