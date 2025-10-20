import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import Icon from '../../components/AppIcon';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ChatHistory from './components/ChatHistory';
import useChatStorage from '../../hooks/useChatStorage';

const ChatPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark'); // Default to dark mode
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([{ id: 1, message: "Hello! I'm your AI fitness coach. How can I assist you today?", isUser: false, timestamp: new Date() }]);
  const chatContainerRef = useRef(null);
  
  // Chat storage hook
  const {
    conversations,
    currentConversation,
    createConversation,
    loadConversation,
    addMessage,
    settings,
    autoSaveConversation
  } = useChatStorage();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark
    setCurrentTheme(savedTheme);
    if (savedTheme === 'dark') document.documentElement?.classList?.add('dark');
    else document.documentElement?.classList?.remove('dark');
  }, []);

  // Load conversation from URL parameter or create new one
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId) {
      const conversation = loadConversation(conversationId);
      if (conversation && conversation.messages) {
        setMessages(conversation.messages);
      }
    } else if (currentConversation && currentConversation.messages) {
      setMessages(currentConversation.messages);
    }
  }, [searchParams, loadConversation, currentConversation]);

  // Auto-save messages when they change
  useEffect(() => {
    if (settings && settings.autoSave && messages.length > 1) {
      // Don't auto-save the initial welcome message
      const conversationMessages = messages.filter(m => !(m.id === 1 && !m.isUser));
      if (conversationMessages.length > 0) {
        autoSaveConversation(messages);
      }
    }
  }, [messages, settings, autoSaveConversation]);

  useEffect(() => {
    if (chatContainerRef?.current) {
      chatContainerRef.current.scrollTop = chatContainerRef?.current?.scrollHeight;
    }
  }, [messages, isTyping]);

  const CHATBOT_API_KEY = import.meta.env.VITE_CHATBOT_API_KEY;
  const handleSendMessage = async (message) => {
    const userMessage = { id: Date.now(), message, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    
    // Save user message to storage - create conversation if needed
    if (settings && settings.autoSave) {
      const result = addMessage(userMessage);
      console.log('User message saved:', result);
    }
    
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
      
      const aiMessage = { id: Date.now() + 1, message: aiText, isUser: false, timestamp: new Date() };
      setMessages(prev => [...prev, aiMessage]);
      
      // Save AI response to storage
      if (settings && settings.autoSave) {
        const result = addMessage(aiMessage);
        console.log('AI message saved:', result);
      }
    } catch (e) {
      const errorMessage = { id: Date.now() + 1, message: 'Error contacting AI service.', isUser: false, timestamp: new Date() };
      setMessages(prev => [...prev, errorMessage]);
      
      // Save error message to storage
      if (settings && settings.autoSave) {
        addMessage(errorMessage);
      }
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
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Chat History Sidebar */}
          <div className={`${isChatHistoryOpen ? 'block' : 'hidden'} lg:block w-80 border-r border-border`}>
            <ChatHistory 
              isOpen={isChatHistoryOpen} 
              onClose={() => setIsChatHistoryOpen(false)} 
            />
          </div>
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <button onClick={() => navigate('/dashboard')} className="hover:text-foreground transition-colors">Dashboard</button>
                  <Icon name="ChevronRight" size={16} />
                  <span className="text-foreground">AI Chatbot</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      console.log('Current conversations:', conversations);
                      console.log('Current conversation:', currentConversation);
                      console.log('Settings:', settings);
                      
                      // Test creating a conversation manually
                      const testMessage = { 
                        id: Date.now(), 
                        message: 'Test message', 
                        isUser: true, 
                        timestamp: new Date() 
                      };
                      const result = addMessage(testMessage);
                      console.log('Test message result:', result);
                    }}
                    className="p-2 hover:bg-muted rounded-lg transition-colors text-xs"
                    title="Debug: Log chat data & test save"
                  >
                    <Icon name="Bug" size={16} />
                  </button>
                  
                  <button
                    onClick={() => setIsChatHistoryOpen(!isChatHistoryOpen)}
                    className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Icon name="History" size={20} />
                  </button>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-xl h-[calc(100vh-12rem)] flex flex-col">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
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
                    
                    {currentConversation && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-card-foreground truncate max-w-48">
                          {currentConversation.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {currentConversation.messageCount} messages
                        </p>
                      </div>
                    )}
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;


