// Client inbox storage
import { showToast } from './utils';

export interface InboxMessage {
  id: string;
  clientId: string;
  title: string;
  content: string;
  type: 'invitation' | 'message' | 'system';
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

// Simple in-memory storage
let inboxMessages: InboxMessage[] = [];

// Mock data
const mockInboxMessages: InboxMessage[] = [
  {
    id: '1',
    clientId: '2',
    title: 'Pozvánka k registraci',
    content: 'Byla vám zaslána pozvánka k registraci do systému ASPETi.',
    type: 'invitation',
    isRead: false,
    createdAt: '2024-01-18T14:20:00Z'
  },
  {
    id: '2',
    clientId: '1',
    title: 'Vítejte v ASPETi',
    content: 'Děkujeme za registraci. Nyní můžete využívat všechny funkce aplikace.',
    type: 'system',
    isRead: true,
    createdAt: '2024-01-15T10:35:00Z',
    readAt: '2024-01-15T11:00:00Z'
  }
];

// Initialize with mock data
inboxMessages = [...mockInboxMessages];

export const clientInboxStore = {
  getAll: () => inboxMessages,
  
  getByClientId: (clientId: string) => {
    return inboxMessages.filter(msg => msg.clientId === clientId);
  },
  
  add: (message: Omit<InboxMessage, 'id' | 'createdAt'>) => {
    const newMessage: InboxMessage = {
      ...message,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    inboxMessages.push(newMessage);
    return newMessage;
  },
  
  markAsRead: (id: string) => {
    const message = inboxMessages.find(msg => msg.id === id);
    if (message && !message.isRead) {
      message.isRead = true;
      message.readAt = new Date().toISOString();
      return message;
    }
    return null;
  },
  
  markAsUnread: (id: string) => {
    const message = inboxMessages.find(msg => msg.id === id);
    if (message) {
      message.isRead = false;
      message.readAt = undefined;
      return message;
    }
    return null;
  },
  
  remove: (id: string) => {
    const index = inboxMessages.findIndex(msg => msg.id === id);
    if (index !== -1) {
      return inboxMessages.splice(index, 1)[0];
    }
    return null;
  },
  
  getUnreadCount: (clientId?: string) => {
    const messages = clientId ? inboxMessages.filter(msg => msg.clientId === clientId) : inboxMessages;
    return messages.filter(msg => !msg.isRead).length;
  },
  
  countUnread: (clientId: string) => {
    const messages = inboxMessages.filter(msg => msg.clientId === clientId);
    return messages.filter(msg => !msg.isRead).length;
  }
};