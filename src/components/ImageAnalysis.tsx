import { useState } from 'react';
import { Upload, Loader2, Check } from 'lucide-react';
import { analyzeAncientText } from '../lib/gemini';
import { supabase } from '../lib/supabase';
import type { AnalysisResult, AncientScript } from '../types';

interface ImageAnalysisProps {
  onAnalysisComplete?: () => void;
}

export default function ImageAnalysis({ onAnalysisComplete }: ImageAnalysisProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [sharePublic, setSharePublic] = useState(true);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !preview) return;

    setAnalyzing(true);
    try {
      const base64 = preview.split(',')[1];
      const analysisResult = await analyzeAncientText(base64);
      setResult(analysisResult);

      const { data: scripts } = await supabase
        .from('ancient_scripts')
        .select('*')
        .ilike('name', `%${analysisResult.scriptType}%`)
        .maybeSingle();

      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('translations').insert({
        user_id: user?.id || null,
        image_url: preview,
        script_id: scripts?.id || null,
        original_text: analysisResult.originalText,
        translated_text: analysisResult.translation,
        confidence_score: analysisResult.confidence,
        analysis_data: analysisResult,
        is_public: sharePublic,
      });

      if (onAnalysisComplete) {
        onAnalysisComplete();
      }
    } catch (error) {
      console.error('Analiz hatası:', error);
      alert('Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-amber-300 rounded-xl p-8 text-center bg-amber-50/50">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 mx-auto mb-4 text-amber-600" />
          <p className="text-lg font-medium text-amber-900 mb-2">
            Arkeolojik Görüntü Yükle
          </p>
          <p className="text-sm text-amber-700">
            JPG, PNG veya WEBP formatında (Maks 10MB)
          </p>
        </label>
      </div>

      {preview && (
        <div className="space-y-4">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-96 object-contain rounded-lg border border-amber-200"
          />

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-amber-800">
              <input
                type="checkbox"
                checked={sharePublic}
                onChange={(e) => setSharePublic(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded"
              />
              Çeviriyi toplulukla paylaş
            </label>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:bg-amber-400 font-medium flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analiz ediliyor...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                Analiz Et
              </>
            )}
          </button>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-lg border border-amber-200 p-6 space-y-4">
          <h3 className="text-xl font-semibold text-amber-900">Analiz Sonuçları</h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-amber-700">Tespit Edilen Yazı</p>
              <p className="text-amber-900">{result.scriptType}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-amber-700">Dönem</p>
              <p className="text-amber-900">{result.period || 'Belirtilmemiş'}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-amber-700">Bölge</p>
              <p className="text-amber-900">{result.region || 'Belirtilmemiş'}</p>
            </div>

            {result.originalText && (
              <div>
                <p className="text-sm font-medium text-amber-700">Orijinal Metin</p>
                <p className="text-amber-900 font-mono text-sm bg-amber-50 p-3 rounded">
                  {result.originalText}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-amber-700">Türkçe Çeviri</p>
              <p className="text-amber-900 bg-orange-50 p-3 rounded">
                {result.translation}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-amber-700">Güven Skoru</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-amber-200 rounded-full h-2">
                  <div
                    className="bg-amber-600 h-2 rounded-full"
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
                <span className="text-amber-900 font-medium">{result.confidence}%</span>
              </div>
            </div>

            {result.notes && (
              <div>
                <p className="text-sm font-medium text-amber-700">Ek Notlar</p>
                <p className="text-amber-800 text-sm">{result.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
