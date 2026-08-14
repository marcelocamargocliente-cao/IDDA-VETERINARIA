import React, { useState, useCallback } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { ZoomIn, ZoomOut, Scissors, X, Check, RotateCw } from 'lucide-react'

interface ImageCropperProps {
  imageSrc: string
  onCropComplete: (croppedBlob: Blob, croppedDataUrl: string) => void
  onCancel: () => void
  aspectRatio?: number // default 16 / 9 for banner/service cards
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  onCropComplete,
  onCancel,
  aspectRatio = 16 / 9,
}) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onCropChangeHandler = useCallback((location: { x: number; y: number }) => {
    setCrop(location)
  }, [])

  const onCropAreaChangeHandler = useCallback((_croppedArea: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const createCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels) return

    setIsProcessing(true)

    try {
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.src = imageSrc

      await new Promise((resolve, reject) => {
        image.onload = resolve
        image.onerror = reject
      })

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Não foi possível obter contexto do canvas')
      }

      // Safe dimensions
      canvas.width = Math.max(1, Math.round(croppedAreaPixels.width))
      canvas.height = Math.max(1, Math.round(croppedAreaPixels.height))

      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        canvas.width,
        canvas.height
      )

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
            onCropComplete(blob, dataUrl)
          }
          setIsProcessing(false)
        },
        'image/jpeg',
        0.92
      )
    } catch (error) {
      console.error('Erro ao recortar imagem:', error)
      setIsProcessing(false)
    }
  }, [croppedAreaPixels, imageSrc, onCropComplete])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 sm:px-8 sm:py-5 flex justify-between items-center z-10">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-stone-900 flex items-center gap-2">
              <Scissors className="w-5 h-5 text-verde-600" />
              Ajustar & Cortar Imagem
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Arraste a foto para enquadrar ou use o controle de zoom.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-stone-400 hover:text-stone-700 p-2 rounded-xl hover:bg-stone-100 transition-colors"
            title="Cancelar ajuste"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Interactive Area */}
        <div className="relative flex-1 min-h-[280px] sm:min-h-[360px] bg-stone-950 overflow-hidden select-none">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            cropShape="rect"
            showGrid={true}
            onCropChange={onCropChangeHandler}
            onCropAreaChange={onCropAreaChangeHandler}
            onZoomChange={setZoom}
            objectFit="contain"
          />
        </div>

        {/* Controls & Toolbar */}
        <div className="border-t border-stone-200 bg-stone-50 p-5 sm:p-6 space-y-4">
          
          {/* Zoom Slider */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-2">
              <span className="flex items-center gap-1.5">
                <ZoomIn className="w-4 h-4 text-verde-600" />
                Zoom / Escala da Foto
              </span>
              <span className="text-verde-700 font-mono bg-verde-50 px-2 py-0.5 rounded-md text-[11px]">
                {Math.round(zoom * 100)}%
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(1)))}
                className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
                title="Diminuir Zoom"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-verde-600"
              />
              
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3, +(z + 0.1).toFixed(1)))}
                className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
                title="Aumentar Zoom"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-stone-500 text-center">
            💡 Enquadre o foco principal na área em destaque para exibição perfeita no site.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 py-3 px-4 rounded-xl font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
            
            <button
              type="button"
              onClick={createCroppedImage}
              disabled={isProcessing}
              className="flex-1 bg-[#6B8E6F] hover:bg-[#5A7A5F] text-white py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Ajustando foto...</span>
              ) : (
                <>
                  <Scissors className="w-4 h-4" />
                  <span>Cortar & Usar Foto</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
