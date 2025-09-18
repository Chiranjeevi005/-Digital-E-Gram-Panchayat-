import React from 'react';

// Utility functions for responsive design
export const isMobile = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth < 768;
  }
  return false;
};

export const isTablet = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  }
  return false;
};

export const isDesktop = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth >= 1024;
  }
  return false;
};

// Hook for responsive design
export const useResponsive = () => {
  const [isMobileView, setIsMobileView] = React.useState(false);
  const [isTabletView, setIsTabletView] = React.useState(false);
  const [isDesktopView, setIsDesktopView] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(isMobile());
      setIsTabletView(isTablet());
      setIsDesktopView(isDesktop());
    };

    // Set initial values
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: isMobileView,
    isTablet: isTabletView,
    isDesktop: isDesktopView,
  };
};