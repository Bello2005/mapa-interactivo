// src/hooks/useResponsive.ts
// Hook para detectar breakpoints y responsive design

import { useState, useEffect } from 'react'

interface UseResponsiveReturn {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  width: number
  height: number
}

export function useResponsive(): UseResponsiveReturn {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    isMobile: windowSize.width < 768,
    isTablet: windowSize.width >= 768 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
    width: windowSize.width,
    height: windowSize.height,
  }
}
