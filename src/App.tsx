import { useState } from 'react';
import { BookOpen, MessageSquare, Sparkles } from 'lucide-react';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Arkeolojik dilbilim analizi yapılıyor...'
      }]);
    } catch (error) {
      console.error('Hata:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Bir hata oluştu. Lütfen tekrar deneyin.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-amber-700" />
            <h1 className="text-4xl font-bold text-amber-900">ARCH-LING</h1>
          </div>
          <p className="text-lg text-amber-800">Arkeolojik Dilbilim AI Sistemi</p>
          <p className="text-sm text-amber-700 mt-2">Antik dilleri ve arkeolojik metinleri anlama ve analiz etme</p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-amber-200">
            <MessageSquare className="w-5 h-5 text-amber-700" />
            <h2 className="text-xl font-semibold text-amber-900">Sohbet</h2>
          </div>

          <div className="space-y-4 mb-6 min-h-[300px] max-h-[500px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-amber-600">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                <p className="text-lg">Arkeolojik dilbilim hakkında bir soru sorun</p>
                <p className="text-sm mt-2">Antik diller, yazıtlar ve arkeolojik metinler hakkında size yardımcı olabilirim</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-amber-100 ml-auto max-w-[80%]'
                      : 'bg-orange-50 mr-auto max-w-[80%]'
                  }`}
                >
                  <p className="text-sm font-medium mb-1 text-amber-900">
                    {msg.role === 'user' ? 'Siz' : 'AI Asistan'}
                  </p>
                  <p className="text-amber-800">{msg.content}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Sorunuzu yazın..."
              disabled={loading}
              className="flex-1 px-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-amber-50 disabled:text-amber-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:bg-amber-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur rounded-lg p-4 border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-2">Antik Diller</h3>
            <p className="text-sm text-amber-700">Sümerce, Akadca, Mısır Hiyeroglifleri ve daha fazlası</p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-lg p-4 border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-2">Metin Analizi</h3>
            <p className="text-sm text-amber-700">Yazıt ve arkeolojik buluntuların incelenmesi</p>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-lg p-4 border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-2">Çeviri Desteği</h3>
            <p className="text-sm text-amber-700">Antik metinlerin modern dillere aktarımı</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
