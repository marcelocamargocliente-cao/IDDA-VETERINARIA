import React from 'react'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { Services } from './components/sections/Services'
import { WhyIDDA } from './components/sections/WhyIDDA'
import { Differentials } from './components/sections/Differentials'
import { PhotoCarousel } from './components/sections/PhotoCarousel'
import { Testimonials } from './components/sections/Testimonials'
import { CtaSection } from './components/sections/CtaSection'
import { Location } from './components/sections/Location'
import { WhatsAppButton } from './components/sections/WhatsAppButton'
import { AdminPanel } from './components/admin/AdminPanel'

export default function App() {
  const handleOpenAdmin = () => {
    window.location.hash = '#admin'
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1ED] text-[#1A1A1A] font-body selection:bg-[#6B8E6F]/20 selection:text-[#5A7A5F]">
      <Navbar onOpenAdmin={handleOpenAdmin} isAdminLoggedIn={false} />
      <main className="flex-grow">
        <Hero />
        <Services />
        <WhyIDDA />
        <Differentials />
        <PhotoCarousel />
        <Testimonials />
        <CtaSection />
        <Location />
      </main>
      <Footer />
      <WhatsAppButton />
      <AdminPanel />
    </div>
  )
}
