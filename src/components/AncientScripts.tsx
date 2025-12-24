import { useEffect, useState } from 'react';
import { BookOpen, MapPin, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AncientScript } from '../types';

export default function AncientScripts() {
  const [scripts, setScripts] = useState<AncientScript[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScripts();
  }, []);

  const loadScripts = async () => {
    try {
      const { data, error } = await supabase
        .from('ancient_scripts')
        .select('*')
        .order('name');

      if (error) throw error;
      setScripts(data || []);
    } catch (error) {
      console.error('Veritabanı hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-amber-700">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-amber-900 mb-2">
          Desteklenen Antik Yazılar ve Medeniyetler
        </h2>
        <p className="text-amber-700">
          Sistemimizin analiz edebildiği antik dil ve yazı sistemleri
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scripts.map((script) => (
          <div
            key={script.id}
            className="bg-white border border-amber-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-amber-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-900">{script.name}</h3>
                <p className="text-sm text-amber-600">{script.code}</p>
              </div>
            </div>

            <p className="text-sm text-amber-800 mb-4">{script.description}</p>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <Calendar className="w-4 h-4" />
                <span>{script.period}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <MapPin className="w-4 h-4" />
                <span>{script.region}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
