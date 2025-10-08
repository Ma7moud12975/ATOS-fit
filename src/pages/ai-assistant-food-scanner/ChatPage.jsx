import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import Icon from '../../components/AppIcon';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';

const ChatPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([{ id: 1, message: "Hello! I'm your AI fitness coach. How can I assist you today?", isUser: false, timestamp: new Date() }]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setCurrentTheme(savedTheme);
    if (savedTheme === 'dark') document.documentElement?.classList?.add('dark');
    else document.documentElement?.classList?.remove('dark');
  }, []);

  useEffect(() => {
    if (chatContainerRef?.current) {
      chatContainerRef.current.scrollTop = chatContainerRef?.current?.scrollHeight;
    }
  }, [messages, isTyping]);

  const CHATBOT_API_KEY = import.meta.env.VITE_CHATBOT_API_KEY;
  const handleSendMessage = async (message) => {
    const userMessage = { id: Date.now(), message, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    try {
      const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-goog-api-key': CHATBOT_API_KEY },
        body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
      });
      const data = await response.json();
      let aiText = 'Sorry, no response from AI.';
      if (Array.isArray(data?.candidates) && data.candidates.length > 0) {
        const parts = data.candidates[0]?.content?.parts;
        if (Array.isArray(parts) && parts.length > 0 && typeof parts[0].text === 'string') {
          aiText = parts[0].text.trim() || aiText;
        }
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, message: aiText, isUser: false, timestamp: new Date() }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 1, message: 'Error contacting AI service.', isUser: false, timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleTheme = () => setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light');
  const handleLogout = () => navigate('/login-screen');

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        onSidebarToggle={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        onThemeToggle={toggleTheme}
        currentTheme={currentTheme}
        user={JSON.parse(localStorage.getItem('user')) || {}}
        onLogout={handleLogout}
      />
      <SidebarNavigation isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="pt-16 lg:pl-72 min-h-screen">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <button onClick={() => navigate('/dashboard')} className="hover:text-foreground transition-colors">Dashboard</button>
            <Icon name="ChevronRight" size={16} />
            <span className="text-foreground">AI Chatbot</span>
          </div>
          <div className="bg-card border border-border rounded-xl h-[600px] flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Bot" size={20} color="white" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">ATOS fit</h3>
                  <p className="text-sm text-muted-foreground flex items-center space-x-1">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span>Online</span>
                  </p>
                </div>
              </div>
            </div>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages?.map((m) => (
                <ChatMessage key={m?.id} message={m?.message} isUser={m?.isUser} timestamp={m?.timestamp} />
              ))}
              {isTyping && <ChatMessage message="" isUser={false} timestamp={new Date()} isTyping={true} />}
            </div>
            <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;


