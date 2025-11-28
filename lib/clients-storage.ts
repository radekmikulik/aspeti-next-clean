// Client management storage and types
import { showToast } from './utils';

// Types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: ClientStatus;
  tags: string[];
  createdAt: string;
  lastActivity: string;
  avatar?: string;
  notes?: string;
}

export type ClientStatus = 'active' | 'inactive' | 'pending';

export interface ClientInvite {
  code: string;
  clientId: string;
  status: 'pending' | 'accepted' | 'expired';
  createdAt: string;
  acceptedAt?: string;
}

// Simple in-memory storage
let _clientsStore: Client[] = [];
let _invitesStore: ClientInvite[] = [];

// Mock data
const mockClients: Client[] = [
  {
    id: '1',
    name: 'Jana Nováková',
    email: 'jana@example.com',
    phone: '+420 123 456 789',
    status: 'active',
    tags: ['VIP', 'beauty'],
    createdAt: '2024-01-15T10:30:00Z',
    lastActivity: '2024-01-20T15:45:00Z',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=100&h=100&fit=crop&crop=face',
    notes: 'Preferuje ranní termíny'
  },
  {
    id: '2',
    name: 'Markéta Svobodová',
    email: 'marketa@example.com',
    phone: '+420 987 654 321',
    status: 'pending',
    tags: ['new'],
    createdAt: '2024-01-18T14:20:00Z',
    lastActivity: '2024-01-18T14:20:00Z',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  }
];

const mockInvites: ClientInvite[] = [
  {
    code: 'INV-2024-001',
    clientId: '2',
    status: 'pending',
    createdAt: '2024-01-18T14:20:00Z'
  }
];

// Initialize with mock data
_clientsStore = [...mockClients];
_invitesStore = [...mockInvites];

// Store operations
export const clientsStoreModule = {
  getAll: () => _clientsStore,
  
  get: (id: string) => {
    return _clientsStore.find(client => client.id === id);
  },
  
  add: (client: Omit<Client, 'id' | 'createdAt' | 'lastActivity'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      status: client.status || 'active',
      tags: client.tags || []
    };
    _clientsStore.push(newClient);
    return newClient;
  },
  
  update: (id: string, updates: Partial<Client>) => {
    const index = _clientsStore.findIndex(client => client.id === id);
    if (index !== -1) {
      _clientsStore[index] = { ..._clientsStore[index], ...updates };
      return _clientsStore[index];
    }
    return null;
  },
  
  remove: (id: string) => {
    const index = _clientsStore.findIndex(client => client.id === id);
    if (index !== -1) {
      return _clientsStore.splice(index, 1)[0];
    }
    return null;
  },
  
  getAllTags: () => {
    const allTags = _clientsStore.flatMap(client => client.tags);
    return Array.from(new Set(allTags)).sort();
  },
  
  updateStatus: (id: string, status: ClientStatus) => {
    const index = _clientsStore.findIndex(client => client.id === id);
    if (index !== -1) {
      _clientsStore[index] = { ..._clientsStore[index], status, lastActivity: new Date().toISOString() };
      return _clientsStore[index];
    }
    return null;
  },
  
  search: (searchTerm: string, statusFilter: ClientStatus | 'all', tagFilter: string) => {
    let filtered = _clientsStore;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        (client.phone && client.phone.includes(searchTerm))
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }
    
    if (tagFilter) {
      filtered = filtered.filter(client => client.tags.includes(tagFilter));
    }
    
    return filtered;
  },
  
  upsert: (client: Client) => {
    const existing = _clientsStore.find(c => c.id === client.id);
    if (existing) {
      const index = _clientsStore.findIndex(c => c.id === client.id);
      _clientsStore[index] = { ..._clientsStore[index], ...client };
      return _clientsStore[index];
    } else {
      const newClient: Client = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        name: client.name,
        email: client.email,
        phone: client.phone,
        status: client.status || 'active',
        tags: client.tags || [],
        avatar: client.avatar,
        notes: client.notes
      };
      _clientsStore.push(newClient);
      return newClient;
    }
  },
  
  setStatus: (id: string, status: ClientStatus) => {
    const index = _clientsStore.findIndex(client => client.id === id);
    if (index !== -1) {
      _clientsStore[index] = { ..._clientsStore[index], status, lastActivity: new Date().toISOString() };
      return _clientsStore[index];
    }
    return null;
  }
};

// Export as store objects
export const clientsStore = clientsStoreModule;
export const invitesStore = {
  getAll: () => _invitesStore,
  
  generate: (clientId: string) => {
    const code = `INV-${new Date().getFullYear()}-${String(_invitesStore.length + 1).padStart(3, '0')}`;
    const invite: ClientInvite = {
      code,
      clientId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    _invitesStore.push(invite);
    return invite;
  },
  
  markAccepted: (code: string, clientId: string) => {
    const invite = _invitesStore.find(i => i.code === code);
    if (invite) {
      invite.status = 'accepted';
      invite.acceptedAt = new Date().toISOString();
      // Update client status
      clientsStoreModule.update(clientId, { status: 'active' });
      return invite;
    }
    return null;
  }
};

// Re-export showToast for convenience
export { showToast };