import { useState } from 'react';
import { MessageSquare, Send, Loader2, Bot, User } from 'lucide-react';
import { chatWithGemini } from '../lib/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Merhaba! Ben arkeolojik dilbilim konusunda uzmanlaşmış AI asistanınızım. Antik diller, yazıtlar, medeniyetler ve arkeolojik bulgular hakkında sorularınızı yanıtlayabilirim.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const systemPrompt = `Sen arkeolojik dilbilim konusunda uzman bir AI asistansın. Antik diller (Sümer, Akadca, Mısır Hiyeroglifleri, Maya, Fenikece, Linear B, Eski Türkçe, Antik Yunanca vb.), arkeolojik bulgular, yazıtlar ve antik medeniyetler hakkında detaylı bilgi veriyorsun. Yanıtların bilimsel, açıklayıcı ve Türkçe olmalı.`;

      const response = await chatWithGemini(
        `${systemPrompt}\n\nKullanıcı sorusu: ${userMessage}`,
        messages
      );

      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Chat hatası:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg border border-amber-200">
      <div className="flex items-center gap-2 p-4 border-b border-amber-200 bg-amber-50">
        <Bot className="w-6 h-6 text-amber-700" />
        <h3 className="text-lg font-semibold text-amber-900">AI Uzman Asistan</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-amber-50 text-amber-900 border border-amber-200 p-3 rounded-lg">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-amber-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Sorunuzu yazın..."
            disabled={loading}
            className="flex-1 px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-amber-50"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 disabled:bg-amber-300 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
