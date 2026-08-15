/**
 * Utilitários de otimização de imagem para o IDDA Veterinária
 * Usa a API de transformação nativa do Supabase Storage
 */

const SUPABASE_URL = 'https://nbdwgblwkvirdmbbfmaw.supabase.co'
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/idda-photos`
const TRANSFORM_BASE = `${SUPABASE_URL}/storage/v1/render/image/public/idda-photos`

interface TransformOptions {
  width?: number
  height?: number
  quality?: number   // 1-100
  format?: 'webp' | 'jpeg' | 'png'
  resize?: 'cover' | 'contain' | 'fill'
}

/**
 * Retorna URL otimizada com transformação do Supabase
 * Funciona APENAS para imagens hospedadas no bucket idda-photos
 */
export function getOptimizedUrl(url: string, opts: TransformOptions = {}): string {
  if (!url) return url
  
  // Só transforma URLs do nosso bucket Supabase
  if (!url.includes('nbdwgblwkvirdmbbfmaw.supabase.co/storage')) return url
  
  // Extrair o path do arquivo
  const path = url.split('/idda-photos/')[1]
  if (!path) return url

  const params = new URLSearchParams()
  if (opts.width)   params.set('width', String(opts.width))
  if (opts.height)  params.set('height', String(opts.height))
  if (opts.quality) params.set('quality', String(opts.quality))
  if (opts.format)  params.set('format', opts.format)
  if (opts.resize)  params.set('resize', opts.resize)

  const query = params.toString()
  return `${TRANSFORM_BASE}/${path}${query ? '?' + query : ''}`
}

// Presets prontos por uso
export const imgPresets = {
  // Hero — alta qualidade, prioridade máxima
  hero: (url: string) => getOptimizedUrl(url, { width: 900, quality: 85, format: 'webp', resize: 'cover' }),
  
  // Galeria — thumbnail no carousel
  galleryThumb: (url: string) => getOptimizedUrl(url, { width: 600, quality: 80, format: 'webp', resize: 'cover' }),
  
  // Galeria — modal fullscreen
  galleryFull: (url: string) => getOptimizedUrl(url, { width: 1200, quality: 90, format: 'webp', resize: 'cover' }),
  
  // Serviços — card
  service: (url: string) => getOptimizedUrl(url, { width: 800, quality: 80, format: 'webp', resize: 'cover' }),
  
  // Localização — 16:9
  location: (url: string) => getOptimizedUrl(url, { width: 1200, quality: 85, format: 'webp', resize: 'cover' }),
  
  // Miniatura no admin
  adminThumb: (url: string) => getOptimizedUrl(url, { width: 200, quality: 70, format: 'webp', resize: 'cover' }),
}
