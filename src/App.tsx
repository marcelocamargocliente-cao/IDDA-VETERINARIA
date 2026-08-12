import React, { useState } from 'react'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { Services } from './components/sections/Services'
import { PhotoCarousel } from './components/sections/PhotoCarousel'
import { WhyIDDA } from './components/sections/WhyIDDA'
import { Testimonials } from './components/sections/Testimonials'
import { Location } from './components/sections/Location'
import { WhatsAppFloat } from './components/sections/WhatsAppFloat'
import { AdminLogin } from './components/admin/AdminLogin'
import { AdminDashboard } from './components/admin/AdminDashboard'

import { usePhotos } from './hooks/usePhotos'
import { useServices } from './hooks/useServices'
import { useTestimonials } from './hooks/useTestimonials'

export default function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)

  const { photos, loading: photosLoading } = usePhotos()
  const { services, loading: servicesLoading } = useServices()
  const { testimonials, loading: testimonialsLoading } = useTestimonials()

  // Find hero category photo if available
  const heroPhoto = photos.find(p => p.category === 'hero') || photos[0]

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setShowAdminDashboard(true)
    } else {
      setShowAdminLogin(true)
    }
  }

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true)
    setShowAdminLogin(false)
    setShowAdminDashboard(true)
  }

  const handleLogout = () => {
    setIsAdminLoggedIn(false)
    setShowAdminDashboard(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-800 font-body selection:bg-verde-100 selection:text-verde-900">
      
      {/* Header Navigation */}
      <Navbar
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Public Page Content */}
      <main className="flex-grow">
        <Hero heroPhoto={heroPhoto} />
        <Services services={services} loading={servicesLoading} />
        <PhotoCarousel photos={photos} loading={photosLoading} />
        <WhyIDDA />
        <Testimonials testimonials={testimonials} loading={testimonialsLoading} />
        <Location />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloat />

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      {/* Full-Screen Admin Dashboard Overlay */}
      {showAdminDashboard && (
        <AdminDashboard
          onLogout={handleLogout}
          onClose={() => setShowAdminDashboard(false)}
        />
      )}

    </div>
  )
}
