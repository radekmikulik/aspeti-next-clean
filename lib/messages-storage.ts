// Messages storage and types
import { showToast } from './utils';

// Types
export interface MessageItem {
  id: string;
  content: string;
  sender: 'client' | 'professional';
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
}

export interface MessageThread {
  id: string;
  clientId: string;
  subject: string;
  lastMessage: MessageItem;
  messages: MessageItem[];
  status: ThreadStatus;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  unreadForProvider: number;
}

export type ThreadStatus = 'active' | 'archived' | 'closed';

// Simple in-memory storage
let _messagesStore: MessageThread[] = [];

// Mock data
const mockThreads: MessageThread[] = [
  {
    id: 'thread-1',
    clientId: '1',
    subject: 'Dotaz na masáž',
    lastMessage: {
      id: 'msg-3',
      content: 'Děkuji za odpověď, domluvíme si termín.',
      sender: 'client',
      timestamp: '2024-01-20T15:45:00Z',
      isRead: false
    },
    messages: [
      {
        id: 'msg-1',
        content: 'Dobrý den, chtěla bych se zeptat na dostupnost masáží.',
        sender: 'client',
        timestamp: '2024-01-20T14:30:00Z',
        isRead: true
      },
      {
        id: 'msg-2',
        content: 'Dobrý den! Samozřejmě, můžeme se domluvit na termín. Jaký typ masáže preferujete?',
        sender: 'professional',
        timestamp: '2024-01-20T15:00:00Z',
        isRead: true
      },
      {
        id: 'msg-3',
        content: 'Děkuji za odpověď, domluvíme si termín.',
        sender: 'client',
        timestamp: '2024-01-20T15:45:00Z',
        isRead: false
      }
    ],
    status: 'active',
    isRead: false,
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T15:45:00Z',
    unreadForProvider: 1
  },
  {
    id: 'thread-2',
    clientId: '2',
    subject: 'Nový klient - první kontakt',
    lastMessage: {
      id: 'msg-5',
      content: 'Děkuji za přivítání, těším se na spolupráci!',
      sender: 'client',
      timestamp: '2024-01-18T16:00:00Z',
      isRead: true
    },
    messages: [
      {
        id: 'msg-4',
        content: 'Vítejte v našem systému! Rádi vám pomůžeme s prvními kroky.',
        sender: 'professional',
        timestamp: '2024-01-18T15:30:00Z',
        isRead: true
      },
      {
        id: 'msg-5',
        content: 'Děkuji za přivítání, těším se na spolupráci!',
        sender: 'client',
        timestamp: '2024-01-18T16:00:00Z',
        isRead: true
      }
    ],
    status: 'active',
    isRead: true,
    createdAt: '2024-01-18T15:30:00Z',
    updatedAt: '2024-01-18T16:00:00Z',
    unreadForProvider: 0
  }
];

// Initialize with mock data
_messagesStore = [...mockThreads];

// Store operations
export const messagesStorage = {
  getAll: () => _messagesStore,
  
  get: (id: string) => {
    return _messagesStore.find(thread => thread.id === id);
  },
  
  getById: (id: string) => {
    return _messagesStore.find(thread => thread.id === id);
  },
  
  getByClientId: (clientId: string) => {
    return _messagesStore.filter(thread => thread.clientId === clientId);
  },
  
  create: (clientId: string, subject: string, initialMessage: string) => {
    const thread: MessageThread = {
      id: `thread-${Date.now()}`,
      clientId,
      subject,
      lastMessage: {
        id: `msg-${Date.now()}`,
        content: initialMessage,
        sender: 'client',
        timestamp: new Date().toISOString(),
        isRead: false
      },
      messages: [],
      status: 'active',
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unreadForProvider: 1
    };
    
    // Add initial message
    const message: MessageItem = {
      id: `msg-${Date.now()}`,
      content: initialMessage,
      sender: 'client',
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    thread.messages.push(message);
    thread.lastMessage = message;
    
    _messagesStore.push(thread);
    return thread;
  },
  
  addMessage: (threadId: string, content: string, sender: 'client' | 'professional') => {
    const thread = _messagesStore.find(t => t.id === threadId);
    if (!thread) return null;
    
    const message: MessageItem = {
      id: `msg-${Date.now()}`,
      content,
      sender,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    thread.messages.push(message);
    thread.lastMessage = message;
    thread.updatedAt = new Date().toISOString();
    
    // Mark as unread for the recipient
    thread.isRead = false;
    
    return message;
  },
  
  appendMessage: (threadId: string, message: MessageItem) => {
    const thread = _messagesStore.find(t => t.id === threadId);
    if (!thread) return null;
    
    thread.messages.push(message);
    thread.lastMessage = message;
    thread.updatedAt = new Date().toISOString();
    
    // Mark as unread for the recipient
    thread.isRead = false;
    
    return message;
  },
  
  markAsRead: (threadId: string) => {
    const thread = _messagesStore.find(t => t.id === threadId);
    if (thread) {
      thread.isRead = true;
      thread.messages.forEach(msg => msg.isRead = true);
      return thread;
    }
    return null;
  },
  
  markThreadRead: (threadId: string) => {
    const thread = _messagesStore.find(t => t.id === threadId);
    if (thread) {
      thread.isRead = true;
      thread.messages.forEach(msg => msg.isRead = true);
      return thread;
    }
    return null;
  },
  
  archive: (threadId: string) => {
    const thread = _messagesStore.find(t => t.id === threadId);
    if (thread) {
      thread.status = 'archived';
      return thread;
    }
    return null;
  },
  
  archiveThread: (threadId: string) => {
    const thread = _messagesStore.find(t => t.id === threadId);
    if (thread) {
      thread.status = 'archived';
      return thread;
    }
    return null;
  },
  
  close: (threadId: string) => {
    const thread = _messagesStore.find(t => t.id === threadId);
    if (thread) {
      thread.status = 'closed';
      return thread;
    }
    return null;
  },
  
  delete: (threadId: string) => {
    const index = _messagesStore.findIndex(t => t.id === threadId);
    if (index !== -1) {
      return _messagesStore.splice(index, 1)[0];
    }
    return null;
  },
  
  removeThread: (threadId: string) => {
    const index = _messagesStore.findIndex(t => t.id === threadId);
    if (index !== -1) {
      return _messagesStore.splice(index, 1)[0];
    }
    return null;
  },
  
  getUnreadCount: () => {
    return _messagesStore.filter(thread => !thread.isRead).length;
  },
  
  getTotalUnreadCount: () => {
    return _messagesStore.filter(thread => !thread.isRead).length;
  },
  
  seedIfEmpty: () => {
    if (_messagesStore.length === 0) {
      _messagesStore = [...mockThreads];
    }
  },
  
  search: (searchTerm: string, statusFilter: ThreadStatus | 'all', unreadOnlyFilter: boolean) => {
    let filtered = _messagesStore;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(thread => 
        thread.subject.toLowerCase().includes(term) ||
        thread.lastMessage.content.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(thread => thread.status === statusFilter);
    }
    
    if (unreadOnlyFilter) {
      filtered = filtered.filter(thread => !thread.isRead);
    }
    
    return filtered;
  }
};

// Export as store object
export const messagesStore = messagesStorage;

// Re-export showToast for convenience
export { showToast };