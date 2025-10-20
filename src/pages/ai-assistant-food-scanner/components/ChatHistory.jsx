import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import useChatStorage from '../../../hooks/useChatStorage';

const ChatHistory = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    conversations,
    currentConversation,
    deleteConversation,
    clearCurrentConversation,
    loading,
    refreshData
  } = useChatStorage();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleConversationClick = (conversation) => {
    navigate(`/ai-assistant-food-scanner?conversation=${conversation.id}`);
    onClose();
  };

  const handleNewChat = () => {
    clearCurrentConversation();
    navigate('/ai-assistant-food-scanner');
    onClose();
  };

  const handleDeleteClick = (e, conversationId) => {
    e.stopPropagation();
    setShowDeleteConfirm(conversationId);
  };

  const confirmDelete = (conversationId) => {
    deleteConversation(conversationId);
    setShowDeleteConfirm(null);
    
    // If we deleted the current conversation, redirect to new chat
    if (currentConversation && currentConversation.id === conversationId) {
      handleNewChat();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Overlay for mobile */}
      <div 
        className="fixed inset-0 bg-black/50 lg:hidden" 
        onClick={onClose}
      ></div>
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-card border-r border-border lg:relative lg:w-full transform transition-transform lg:transform-none">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-card-foreground">Chat History</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-4 space-y-2">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center space-x-2 p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Icon name="Plus" size={16} />
            <span>New Chat</span>
          </button>
          
          <button
            onClick={() => {
              console.log('Refreshing conversations...');
              refreshData();
            }}
            className="w-full flex items-center space-x-2 p-2 text-sm bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
          >
            <Icon name="RefreshCw" size={14} />
            <span>Refresh</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              <Icon name="Loader" size={48} className="mx-auto mb-2 opacity-50 animate-spin" />
              <p>Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Icon name="MessageCircle" size={48} className="mx-auto mb-2 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-sm">Start a new chat to see your history here</p>
              <button
                onClick={() => {
                  console.log('Debug - Conversations:', conversations);
                  console.log('Debug - Loading:', loading);
                }}
                className="mt-2 text-xs px-2 py-1 bg-muted rounded"
              >
                Debug: Check console
              </button>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                    currentConversation && currentConversation.id === conversation.id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleConversationClick(conversation)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-card-foreground truncate">
                        {conversation.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {conversation.messageCount} messages
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(conversation.updatedAt)}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => handleDeleteClick(e, conversation.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-all"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                Delete Conversation
              </h3>
              <p className="text-muted-foreground mb-4">
                Are you sure you want to delete this conversation? This action cannot be undone.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;