"use client";

import { useState, useEffect } from "react";
import { messagesStore, type MessageThread, type ThreadStatus } from "@/lib/messages-storage";

export default function MessagesPage() {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<MessageThread[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ThreadStatus | 'all'>('all');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = () => {
      messagesStore.seedIfEmpty();
      const allThreads = messagesStore.getAll();
      setThreads(allThreads);
      setFilteredThreads(allThreads);
      setLoading(false);
    };

    loadMessages();
  }, []);

  useEffect(() => {
    let filtered = threads;

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(thread =>
        thread.subject.toLowerCase().includes(term) ||
        thread.lastMessage.content.toLowerCase().includes(term) ||
        thread.clientId.includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(thread => thread.status === statusFilter);
    }

    // Apply unread filter
    if (unreadOnly) {
      filtered = filtered.filter(thread => !thread.isRead);
    }

    setFilteredThreads(filtered);
  }, [threads, searchTerm, statusFilter, unreadOnly]);

  const handleMarkAsRead = (threadId: string) => {
    messagesStore.markAsRead(threadId);
    const updatedThreads = messagesStore.getAll();
    setThreads(updatedThreads);
  };

  const handleArchive = (threadId: string) => {
    messagesStore.archive(threadId);
    const updatedThreads = messagesStore.getAll();
    setThreads(updatedThreads);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('cs-CZ', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffDays === 1) {
      return 'Včera';
    } else if (diffDays < 7) {
      return `Před ${diffDays} dny`;
    } else {
      return date.toLocaleDateString('cs-CZ');
    }
  };

  const getStatusColor = (status: ThreadStatus) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ThreadStatus) => {
    switch (status) {
      case 'active': return 'Aktivní';
      case 'archived': return 'Archivováno';
      case 'closed': return 'Uzavřeno';
      default: return 'Neznámý';
    }
  };

  const unreadCount = threads.filter(t => !t.isRead).length;
  const totalCount = threads.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Načítání zpráv...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Zprávy</h1>
          <p className="text-gray-600">
            {totalCount} celkem • {unreadCount} nepřečtených
          </p>
        </div>
        
        <button
          type="button"
          className="rounded-full bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          onClick={() => {
            messagesStore.create(
              'new-client',
              'Nová zpráva',
              'Dobrý den, chtěl bych se zeptat na vaše služby.'
            );
            const updatedThreads = messagesStore.getAll();
            setThreads(updatedThreads);
          }}
        >
          Nová zpráva
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-xl">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Vyhledat zprávy..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ThreadStatus | 'all')}
          className="rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="all">Všechny stavy</option>
          <option value="active">Aktivní</option>
          <option value="archived">Archivované</option>
          <option value="closed">Uzavřené</option>
        </select>
        
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            className="rounded border-gray-300"
          />
          Pouze nepřečtené
        </label>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {filteredThreads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {threads.length === 0 
              ? 'Nemáte žádné zprávy.'
              : 'Žádné zprávy nevyhovují zadaným filtrům.'
            }
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredThreads.map((thread) => (
              <div
                key={thread.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  !thread.isRead ? 'bg-blue-50' : ''
                }`}
                onClick={() => {
                  if (!thread.isRead) {
                    handleMarkAsRead(thread.id);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-sm font-semibold truncate ${
                        !thread.isRead ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {thread.subject}
                      </h3>
                      
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(thread.status)}`}>
                        {getStatusLabel(thread.status)}
                      </span>
                      
                      {!thread.isRead && (
                        <span className="inline-flex h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 truncate mb-2">
                      {thread.lastMessage.content}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Klient #{thread.clientId}</span>
                      <span>{formatTimestamp(thread.lastMessage.timestamp)}</span>
                      {thread.unreadForProvider > 0 && (
                        <span className="text-blue-600 font-medium">
                          {thread.unreadForProvider} nových zpráv
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!thread.isRead && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(thread.id);
                        }}
                        className="text-xs text-blue-700 hover:text-blue-900 font-medium"
                      >
                        Označit jako přečtené
                      </button>
                    )}
                    
                    {thread.status === 'active' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchive(thread.id);
                        }}
                        className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                      >
                        Archívovat
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {threads.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="text-2xl font-semibold text-gray-900">{totalCount}</div>
            <div className="text-sm text-gray-600">Celkem zpráv</div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="text-2xl font-semibold text-blue-600">{unreadCount}</div>
            <div className="text-sm text-gray-600">Nepřečtené</div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="text-2xl font-semibold text-emerald-600">
              {threads.filter(t => t.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Aktivní</div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="text-2xl font-semibold text-gray-600">
              {threads.filter(t => t.status === 'archived').length}
            </div>
            <div className="text-sm text-gray-600">Archivované</div>
          </div>
        </div>
      )}
    </div>
  );
}
