"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Message = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isNew: boolean;
  createdAt: string;
  offerTitle?: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<'all' | 'new'>('all');

  useEffect(() => {
    // Mock data - v produkci by se načetlo z API
    const mockMessages: Message[] = [
      {
        id: "1",
        name: "Petra K.",
        email: "petra.k@example.com",
        phone: "+420 777 123 456",
        subject: "Dotaz k termínu",
        message: "Dobrý den, máte volný termín na příští týden pro lash lifting? Ráda bych si ho zarezervovala.",
        isNew: true,
        createdAt: "2025-12-05T10:30:00Z",
        offerTitle: "Lash lifting + brow shape",
      },
      {
        id: "2",
        name: "Marek S.",
        email: "marek.s@example.com",
        subject: "Dostupnost služby",
        message: "Dobrý den, kolik stojí relax masáž zad a jak dlouho trvá? Můžeme se domluvit na více seancích?",
        isNew: true,
        createdAt: "2025-12-05T09:15:00Z",
        offerTitle: "Masáž zad 45 min",
      },
      {
        id: "3",
        name: "Jitka R.",
        email: "jitka.r@example.com",
        subject: "Dárkový poukaz",
        message: "Ráda bych si objednala dárkový poukaz na masáž pro svou sestru. Jak to funguje?",
        isNew: false,
        createdAt: "2025-12-04T16:20:00Z",
        offerTitle: "Relax masáž 45 min",
      },
      {
        id: "4",
        name: "Tomáš D.",
        email: "tomas.d@example.com",
        subject: "Dotaz na cenu",
        message: "Kolik stojí kompletní balíček masáží? Mám zájem o dlouhodobou spolupráci.",
        isNew: false,
        createdAt: "2025-12-04T11:45:00Z",
        offerTitle: "Masáž zad 45 min",
      },
      {
        id: "5",
        name: "Anna V.",
        email: "anna.v@example.com",
        phone: "+420 608 987 654",
        subject: "Rezervace termínu",
        message: "Dobrý den, chtěla bych si zarezervovat termín na úpravu obočí na pondělí 9. prosince.",
        isNew: false,
        createdAt: "2025-12-03T14:10:00Z",
        offerTitle: "Úprava obočí",
      },
    ];

    setMessages(mockMessages);
  }, []);

  const filteredMessages = filter === 'new' 
    ? messages.filter(msg => msg.isNew)
    : messages;

  const markAsRead = (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, isNew: false } : msg
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return "Dnes";
    } else if (days === 1) {
      return "Včera";
    } else if (days < 7) {
      return `Před ${days} dny`;
    } else {
      return date.toLocaleDateString('cs-CZ');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Zprávy</h1>
          <p className="text-sm text-gray-600 mt-1">
            Přehled všech zpráv od klientů
          </p>
        </div>
        <Link
          href="/account"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
        >
          Zpět
        </Link>
      </div>

      {/* Filtry */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              filter === 'all'
                ? 'bg-emerald-700 text-white'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Všechny ({messages.length})
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              filter === 'new'
                ? 'bg-emerald-700 text-white'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Nové ({messages.filter(m => m.isNew).length})
          </button>
        </div>
      </div>

      {/* Seznam zpráv */}
      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-gray-600">
              {filter === 'new' ? 'Žádné nové zprávy' : 'Žádné zprávy'}
            </p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`bg-white rounded-2xl border border-gray-200 p-6 transition-colors ${
                message.isNew ? 'border-emerald-200 bg-emerald-50/30' : ''
              }`}
              onClick={() => message.isNew && markAsRead(message.id)}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-emerald-700">
                    {getInitials(message.name)}
                  </span>
                </div>

                {/* Obsah zprávy */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{message.name}</h3>
                      {message.isNew && (
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{message.subject}</p>
                  
                  {message.offerTitle && (
                    <p className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full inline-block mb-2">
                      {message.offerTitle}
                    </p>
                  )}

                  <p className="text-sm text-gray-700 line-clamp-2">
                    {message.message}
                  </p>

                  {/* Kontaktní údaje */}
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                    <span>{message.email}</span>
                    {message.phone && <span>{message.phone}</span>}
                  </div>
                </div>

                {/* Akce */}
                <div className="flex flex-col gap-2">
                  {message.isNew && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(message.id);
                      }}
                      className="px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full hover:bg-emerald-100"
                    >
                      Označit jako přečtené
                    </button>
                  )}
                  <button className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200">
                    Odpovědět
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistiky */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Celkem zpráv
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">
            {messages.length}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Nové zprávy
          </div>
          <div className="mt-2 text-2xl font-semibold text-emerald-600">
            {messages.filter(m => m.isNew).length}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Odpovězeno
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">
            {messages.filter(m => !m.isNew).length}
          </div>
        </div>
      </div>
    </div>
  );
}