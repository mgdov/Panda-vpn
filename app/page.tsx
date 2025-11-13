"use client"

import Navbar from "@/components/navbar"
import { useEffect, useState } from "react"
import DecorativeBlobs from "@/components/shared/decorative-blobs"
import HeroSection from "@/components/shared/hero-section"
import FeaturesSection from "@/components/shared/features-section"
import PricingSection from "@/components/shared/pricing-section"
import CTASection from "@/components/shared/cta-section"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Проверяем авторизацию на клиенте
    const authStatus = localStorage.getItem("isAuthenticated") === "true"
    setIsAuthenticated(authStatus)
  }, [])

  return (
    <>
      <Navbar />
      <DecorativeBlobs />
      <HeroSection isAuthenticated={isAuthenticated} />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
    </>
  )
}
