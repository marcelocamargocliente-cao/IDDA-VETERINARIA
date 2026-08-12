export interface Photo {
  id: string
  url: string
  caption: string
  category: 'gallery' | 'hero' | 'service'
  order: number
  created_at: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  active: boolean
  order: number
}

export interface Testimonial {
  id: string
  author_name: string
  pet_name: string
  content: string
  rating: number
  active: boolean
  created_at: string
}

export interface SiteSettings {
  id: string
  key: string
  value: string
}

export interface AdminUser {
  email: string
  password: string
}
