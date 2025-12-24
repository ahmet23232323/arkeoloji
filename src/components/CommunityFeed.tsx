import { useEffect, useState } from 'react';
import { MessageCircle, User, Calendar, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Translation, Comment } from '../types';

export default function CommunityFeed() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTranslation, setSelectedTranslation] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadPublicTranslations();
  }, []);

  const loadPublicTranslations = async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select(`
          *,
          ancient_scripts (*)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setTranslations(data || []);
    } catch (error) {
      console.error('Yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (translationId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('translation_id', translationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Yorumlar yüklenemedi:', error);
    }
  };

  const handleCommentSubmit = async (translationId: string) => {
    if (!newComment.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from('comments').insert({
        translation_id: translationId,
        user_id: user?.id || null,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment('');
      loadComments(translationId);
    } catch (error) {
      console.error('Yorum eklenemedi:', error);
      alert('Yorum eklemek için giriş yapmanız gerekiyor.');
    }
  };

  const toggleComments = (translationId: string) => {
    if (selectedTranslation === translationId) {
      setSelectedTranslation(null);
      setComments([]);
    } else {
      setSelectedTranslation(translationId);
      loadComments(translationId);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-amber-700">Çeviriler yükleniyor...</p>
      </div>
    );
  }

  if (translations.length === 0) {
    return (
      <div className="text-center py-12 bg-amber-50 rounded-lg border border-amber-200">
        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-amber-400" />
        <p className="text-lg text-amber-800">Henüz paylaşılmış çeviri yok</p>
        <p className="text-sm text-amber-600 mt-2">
          İlk kişi siz olun ve bulgularınızı toplulukla paylaşın!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-amber-700" />
        <h2 className="text-2xl font-bold text-amber-900">Topluluk Çevirileri</h2>
      </div>

      <div className="space-y-4">
        {translations.map((translation) => (
          <div
            key={translation.id}
            className="bg-white border border-amber-200 rounded-lg overflow-hidden"
          >
            <div className="p-4">
              <div className="flex gap-4 mb-4">
                <img
                  src={translation.image_url}
                  alt="Arkeolojik buluntu"
                  className="w-32 h-32 object-cover rounded border border-amber-200"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-amber-900">
                        {translation.ancient_scripts?.name || 'Bilinmeyen Yazı'}
                      </h3>
                      <p className="text-sm text-amber-600">
                        {translation.ancient_scripts?.region || 'Bölge belirtilmemiş'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-amber-700">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(translation.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {translation.original_text && (
                      <div>
                        <p className="text-xs font-medium text-amber-700">Orijinal Metin</p>
                        <p className="text-sm text-amber-900 font-mono bg-amber-50 p-2 rounded">
                          {translation.original_text}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-amber-700">Türkçe Çeviri</p>
                      <p className="text-sm text-amber-900 bg-orange-50 p-2 rounded">
                        {translation.translated_text}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-amber-600">
                      <span>Güven: {translation.confidence_score}%</span>
                    </div>
                    <button
                      onClick={() => toggleComments(translation.id)}
                      className="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-900"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Yorumlar</span>
                    </button>
                  </div>
                </div>
              </div>

              {selectedTranslation === translation.id && (
                <div className="border-t border-amber-200 pt-4 mt-4">
                  <h4 className="font-medium text-amber-900 mb-3">Yorumlar</h4>

                  <div className="space-y-3 mb-4">
                    {comments.length === 0 ? (
                      <p className="text-sm text-amber-600 text-center py-4">
                        Henüz yorum yapılmamış
                      </p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="bg-amber-50 p-3 rounded">
                          <div className="flex items-start gap-2 mb-1">
                            <User className="w-4 h-4 text-amber-600 mt-1" />
                            <div className="flex-1">
                              <p className="text-sm text-amber-900">{comment.content}</p>
                              <p className="text-xs text-amber-600 mt-1">
                                {new Date(comment.created_at).toLocaleString('tr-TR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Yorumunuzu yazın..."
                      className="flex-1 px-3 py-2 text-sm border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={() => handleCommentSubmit(translation.id)}
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-amber-700 text-white text-sm rounded hover:bg-amber-800 disabled:bg-amber-300"
                    >
                      Gönder
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
