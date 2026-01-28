import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Navigation } from '../components/Navigation';
import { supabase } from '../supabase';
import { useAuth } from '../hooks/useAuth';
import { LOGO_URL } from '../constants';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

const ChatScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: user ? `Welcome back, ${user.user_metadata?.full_name || user.email?.split('@')[0]}! How can I assist your culinary journey at Olkkari today?` : "Welcome to Ravinteli Olkkari! I'm your digital host. How can I assist your culinary journey today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // Mapping for Gemini model/user roles
      // Must start with 'user'
      const chatHistory = messages
        .filter((_, idx) => idx > 0)
        .map(m => ({
          role: m.role === 'bot' ? 'model' : 'user',
          parts: [{ text: m.text }]
        }));

      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: userMessage,
          chatHistory: chatHistory
        }
      });

      if (error) throw error;
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (err: any) {
      console.error('Chat Error:', err);
      setMessages(prev => [...prev, { role: 'bot', text: "Host connectivity issue. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="min-h-screen text-gray-900 dark:text-white font-display flex flex-col">
      <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5">
        <div className="flex items-center p-4 py-3 justify-between">
          <div onClick={() => navigate(-1)} className="text-primary dark:text-accent-gold flex size-12 shrink-0 items-center justify-start cursor-pointer">
            <span className="material-symbols-outlined">chevron_left</span>
          </div>
          <div className="flex-1 flex justify-center translate-x-3">
            <img src={LOGO_URL} alt="Olkkari" className="h-7 w-auto object-contain" />
          </div>
          <div className="flex w-12 items-center justify-end">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-40">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end ml-auto max-w-[85%]' : 'max-w-[85%]'}`}>
            {msg.role === 'bot' && (
              <div
                className="bg-primary border border-accent-gold/30 aspect-square bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0 flex items-center justify-center overflow-hidden"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAnGD3ZnY1d0KPJbtEb_b4OHHQ5VEJrPa4NQVaWF4P0jjcWgdFiRUSHFHO1UlThywxNO0wp-Uy2AD1n2pOYB5C3NBIfA2jOLoz7gOUe8CyrQ4fUpeZTD4YIT4fbtQGyT-qvHoK3EFtBedkyfFxVYaGnymyYZUqTexeSHIsuuv2GUIneLcu4nyovtLUR03doY1N2eHzynmLWXD6Bh0k0JKdxmmMoKNZhEE9hjdOw4DvulgbcCpD3kAJmBm19W--McVlxA3pz-J2nXKw")' }}
              ></div>
            )}
            <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <p className="text-gray-500 dark:text-gray-400 text-[11px] font-medium px-1">
                {msg.role === 'user' ? 'You' : 'Olkkari Concierge'}
              </p>
              <div className={`rounded-2xl px-4 py-3 shadow-sm border text-sm leading-relaxed ${msg.role === 'user'
                ? 'bg-primary border-primary text-white rounded-br-none'
                : 'bg-white dark:bg-chat-bot text-gray-800 dark:text-gray-200 border-gray-100 dark:border-white/5 rounded-bl-none'
                }`}>
                {msg.role === 'user' ? (
                  msg.text
                ) : (
                  <div className="prose dark:prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-strong:text-accent-gold prose-strong:font-bold prose-ul:my-2 prose-li:my-0.5">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
            {msg.role === 'user' && (
              <div
                className="bg-gray-300 dark:bg-gray-700 aspect-square rounded-full size-10 shrink-0 flex items-center justify-center overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAepBGV-i1XpHjHc0av9oyEx8t-N-4mOtMWFxUGL1A0ZBIDdYJKhwLOpjeDvLvQHv-oeSe0FRm2wja02Y8ctGeX3ZRVSRN-YZvbO7hOcK9sakNY_trxi7MIPaZO09YNz--qzPDDgtG9UeL1G6_Ou-tLDUhnU3yAtXHuMvzSJovOiQjZcPDJUJmTsWnH7UgSq37G8TeZTFOGEH5N_ZEpOfw5HVALTdTKpGgCH9i22yrDMbkDKDLLhld5K1fe0zBe9SpQxy4O2g_f9N0")' }}
              ></div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-end gap-3 max-w-[85%]">
            <div className="bg-primary border border-accent-gold/30 aspect-square bg-center bg-no-repeat bg-cover rounded-full size-10 shrink-0"></div>
            <div className="flex flex-col gap-1 items-start">
              <p className="text-gray-500 dark:text-gray-400 text-[11px] font-medium ml-1">Olkkari Concierge</p>
              <div className="rounded-2xl px-5 py-3 bg-white dark:bg-chat-bot shadow-sm border border-gray-100 dark:border-white/5 flex gap-1">
                <span className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-accent-gold rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <div className="fixed bottom-[84px] left-0 right-0 z-10 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent pt-10">
        <div className="flex gap-2.5 px-4 pb-4 overflow-x-auto no-scrollbar mx-auto max-w-lg">
          <button
            onClick={() => navigate('/menu')}
            className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-chat-bot border border-gray-200 dark:border-white/10 px-4 shadow-sm active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-accent-gold text-lg">restaurant_menu</span>
            <p className="text-gray-700 dark:text-gray-200 text-xs font-semibold">Full Menu</p>
          </button>
          <button
            onClick={() => navigate('/booking')}
            className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-chat-bot border border-gray-200 dark:border-white/10 px-4 shadow-sm active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-accent-gold text-lg">calendar_month</span>
            <p className="text-gray-700 dark:text-gray-200 text-xs font-semibold">Book Table</p>
          </button>
          <button
            onClick={() => navigate('/gallery')}
            className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-chat-bot border border-gray-200 dark:border-white/10 px-4 shadow-sm active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-accent-gold text-lg">palette</span>
            <p className="text-gray-700 dark:text-gray-200 text-xs font-semibold">Art Tour</p>
          </button>
        </div>

        <div className="px-4 pb-4 max-w-lg mx-auto">
          <div className="relative flex items-center">
            <input
              className="w-full bg-white dark:bg-[#251b1c] border-gray-200 dark:border-white/5 rounded-full py-3.5 pl-5 pr-14 text-sm focus:ring-accent-gold focus:border-accent-gold dark:text-white placeholder-gray-400 shadow-lg"
              placeholder="Ask Olkkari..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              type="text"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="absolute right-1.5 bg-primary p-2.5 rounded-full text-white shadow-md active:scale-90 transition-transform disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default ChatScreen;

