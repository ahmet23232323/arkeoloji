import { useState } from 'react';
import { BookOpen, Zap, Database, MessageSquare, Upload, Users } from 'lucide-react';
import ImageAnalysis from './components/ImageAnalysis';
import ChatBot from './components/ChatBot';
import AncientScripts from './components/AncientScripts';
import CommunityFeed from './components/CommunityFeed';

type TabType = 'home' | 'analyze' | 'chat' | 'database' | 'community';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'analyze':
        return <ImageAnalysis onAnalysisComplete={() => setActiveTab('community')} />;
      case 'chat':
        return <ChatBot />;
      case 'database':
        return <AncientScripts />;
      case 'community':
        return <CommunityFeed />;
      default:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">
                Arkeolojik Dilbilim AI Sistemi
              </h2>
              <p className="text-lg text-amber-800 max-w-2xl mx-auto">
                Gelişmiş yapay zeka destekli yazı analizi ile antik medeniyetlerin sırlarını
                keşfedin. Arkeolojik bulgularınızı yükleyin, analiz edin ve toplulukla
                paylaşın.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveTab('analyze')}
                className="bg-white border-2 border-amber-300 rounded-xl p-6 hover:shadow-xl transition-all hover:scale-105 text-left"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-amber-700" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  Gemini AI Analizi
                </h3>
                <p className="text-amber-700">
                  Google Gemini ile kapsamlı arkeolojik analiz
                </p>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className="bg-white border-2 border-amber-300 rounded-xl p-6 hover:shadow-xl transition-all hover:scale-105 text-left"
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-orange-700" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  Gemini AI Uzman
                </h3>
                <p className="text-amber-700">Arkeoloji ve dilbilim konusunda soru sorun</p>
              </button>

              <button
                onClick={() => setActiveTab('database')}
                className="bg-white border-2 border-amber-300 rounded-xl p-6 hover:shadow-xl transition-all hover:scale-105 text-left"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-amber-700" />
                </div>
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  Paleografi Veritabanı
                </h3>
                <p className="text-amber-700">
                  Desteklenen antik yazı ve medeniyetler
                </p>
              </button>
            </div>

            <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-amber-900 mb-6 text-center">
                Arkeolojik Görüntü Yükle
              </h3>
              <div className="max-w-2xl mx-auto">
                <div
                  onClick={() => setActiveTab('analyze')}
                  className="border-2 border-dashed border-amber-400 rounded-xl p-12 text-center bg-white/50 hover:bg-white/80 cursor-pointer transition-all"
                >
                  <Upload className="w-16 h-16 mx-auto mb-4 text-amber-600" />
                  <p className="text-lg font-medium text-amber-900 mb-2">
                    Görüntünüzü buraya sürükleyip bırakın veya tıklayın
                  </p>
                  <p className="text-sm text-amber-700">
                    Desteklenen formatlar: JPG, PNG, WEBP (Maks 10MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-amber-700" />
                <h3 className="text-xl font-semibold text-amber-900">Topluluk</h3>
              </div>
              <p className="text-amber-700 mb-4">
                Çevirilerinizi paylaşın, diğer arkeologların çalışmalarını inceleyin ve
                yorum yapın. Birlikte antik medeniyetlerin sırlarını çözün.
              </p>
              <button
                onClick={() => setActiveTab('community')}
                className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 font-medium"
              >
                Topluluk Çevirilerini Gör
              </button>
            </div>

            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <h3 className="text-xl font-semibold text-amber-900 mb-4">
                Desteklenen Antik Yazılar ve Medeniyetler
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Sümer Çivi Yazısı', period: 'MÖ 3200-MS 100' },
                  { name: 'Mısır Hiyeroglifleri', period: 'MÖ 3200-MS 400' },
                  { name: 'Antik Yunanca', period: 'MÖ 800-MS 600' },
                  { name: 'Maya Glifleri', period: 'MS 300-1500' },
                  { name: 'Fenikece', period: 'MÖ 1200-300' },
                  { name: 'Eski Türkçe (Orhun)', period: 'MS 700-1000' },
                  { name: 'Linear B', period: 'MÖ 1450-1200' },
                  { name: 'Akadca', period: 'MÖ 2500-MS 100' },
                ].map((script) => (
                  <div
                    key={script.name}
                    className="bg-white p-3 rounded-lg border border-amber-200"
                  >
                    <p className="font-medium text-amber-900 text-sm">{script.name}</p>
                    <p className="text-xs text-amber-600">{script.period}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-900">ARCH-LING</h1>
                <p className="text-sm text-amber-700">
                  Arkeolojik Dilbilim AI - Gelişmiş yapay zeka destekli yazı analizi
                </p>
              </div>
            </button>
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'home'
                  ? 'bg-amber-700 text-white'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              Ana Sayfa
            </button>
            <button
              onClick={() => setActiveTab('analyze')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'analyze'
                  ? 'bg-amber-700 text-white'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              Görüntü Analizi
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'chat'
                  ? 'bg-amber-700 text-white'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Gemini AI Uzman
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'database'
                  ? 'bg-amber-700 text-white'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              <Database className="w-4 h-4" />
              Paleografi Veritabanı
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'community'
                  ? 'bg-amber-700 text-white'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Topluluk Çevirileri
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">{renderContent()}</div>
      </main>

      <footer className="bg-white/50 backdrop-blur-sm border-t border-amber-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-amber-700">
          <p className="text-sm">
            ARCH-LING © 2024 - Antik medeniyetlerin dilini çözmek için yapay zeka
            destekli platform
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
