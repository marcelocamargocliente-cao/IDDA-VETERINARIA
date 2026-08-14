import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Hero() {
  const [heroImageUrl, setHeroImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHeroImage();
  }, []);

  const loadHeroImage = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'hero_image')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      if (data?.value) {
        setHeroImageUrl(data.value);
      }
    } catch (error) {
      console.error('Erro ao carregar foto hero:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="h-96 lg:h-[420px] bg-gray-200 rounded-3xl animate-pulse" />
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="grid grid-cols-2 gap-8 items-center">
        {/* Texto (lado esquerdo) */}
        <div className="-mt-16">
          <div className="inline-block mb-4 px-4 py-2 border border-green-600 rounded-full">
            <span className="text-sm text-green-600">✨ CUIDADO VETERINÁRIO PREMIUM</span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Saúde que seu pet merece.
          </h1>
          
          <p className="text-2xl text-green-600 italic mb-4">
            Amor que ele reconheça.
          </p>
          
          <p className="text-gray-700 mb-6">
            Combinamos tecnologia de ponta com atendimento humanizado.
            Porque seu pet não é só animal de estimação — é família.
          </p>
          
          <div className="flex gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition">
              📅 AGENDAR AGORA
            </button>
            <button className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition">
              CONHECER SERVIÇOS →
            </button>
          </div>

          {/* Depoimento */}
          <div className="mt-8 pt-8 border-t">
            <div className="flex gap-1 mb-2">
              ⭐⭐⭐⭐⭐
            </div>
            <p className="text-sm text-gray-700 italic">
              "Meu cachorro é tratado como família aqui. Recomendo muito!"
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-2">
              — Maria Silva
            </p>
          </div>
        </div>
        
        {/* Foto (lado direito) */}
        <div className="rounded-3xl overflow-hidden h-96 lg:h-[420px] shadow-lg">
          {heroImageUrl ? (
            <img 
              src={heroImageUrl} 
              alt="IDDA Veterinária"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-600 text-lg">Foto em breve</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t">
        <div>
          <p className="text-3xl font-bold text-gray-900">10k+</p>
          <p className="text-gray-600">Pets felizes</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">6+</p>
          <p className="text-gray-600">Serviços clínicos</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">5.0 ⭐</p>
          <p className="text-gray-600">Avaliação Google</p>
        </div>
      </div>
    </section>
  );
}
