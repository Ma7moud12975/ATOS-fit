import React from 'react';
import Button from '../../../components/ui/Button';

const ChatHistory = ({ sessions = [], currentSessionId, onSelectSession, onDeleteSession }) => {
  const sorted = Array.isArray(sessions)
    ? [...sessions].sort((a, b) => new Date(b?.lastMessageAt || 0) - new Date(a?.lastMessageAt || 0))
    : [];

  const formatDt = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso || '';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-card-foreground">Chat History</h4>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">No conversations yet.</p>
      ) : (
        <div className="space-y-3">
          {sorted.map((s) => (
            <div key={s.id} className={`border border-border rounded-lg p-3 ${s.id === currentSessionId ? 'bg-muted' : 'bg-background'}`}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{s?.title ? s.title : `Conversation ${s.id}`}</p>
                  <p className="text-xs text-muted-foreground">Started: {formatDt(s?.startedAt)}</p>
                  <p className="text-xs text-muted-foreground">Last: {formatDt(s?.lastMessageAt)}</p>
                  <p className="text-xs text-muted-foreground">Messages: {s?.messageCount || 0}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => onSelectSession?.(s.id)} iconName="Eye" iconPosition="left">
                    Open
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onDeleteSession?.(s.id)} iconName="Trash2" iconPosition="left">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;