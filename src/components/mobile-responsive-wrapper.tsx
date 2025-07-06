"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface MobileResponsiveWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function MobileResponsiveWrapper({ children, className = "" }: MobileResponsiveWrapperProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return <div className={`${className} ${isMobile ? "mobile-optimized" : ""}`}>{children}</div>
}
