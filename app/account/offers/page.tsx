"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllOffers, setStatus, deleteOffer, type Offer } from "@/lib/offers-storage";

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published' | 'paused'>('all');

  useEffect(() => {
    const data = getAllOffers() as Offer[] | null;
    setOffers(Array.isArray(data) ? data : []);
  }, []);

  const reloadOffers = () => {
    const data = getAllOffers() as Offer[] | null;
    setOffers(Array.isArray(data) ? data : []);
  };

  const handleToggleStatus = (offer: Offer) => {
    const nextStatus = offer.status === "paused" ? "published" : "paused";
    setStatus(offer.id, nextStatus);
    reloadOffers();
  };

  const handleDelete = (offer: Offer) => {
    if (confirm(`Opravdu chcete smazat nabídku "${offer.title}"?`)) {
      deleteOffer(offer.id);
      reloadOffers();
    }
  };

  const filteredOffers = filter === 'all' 
    ? offers 
    : offers.filter(offer => offer.status === filter);

  const getStatusBadge = (status: Offer['status']) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
            Publikováno
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-800">
            Pozastaveno
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
            Koncept
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Moje nabídky</h1>
          <p className="text-sm text-gray-600 mt-1">
            Správa vašich služeb a nabídek
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/account"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
          >
            Zpět
          </Link>
          <Link
            href="/account/offers/new"
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-700 rounded-full hover:bg-emerald-800"
          >
            + Přidat nabídku
          </Link>
        </div>
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
            Všechny ({offers.length})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              filter === 'published'
                ? 'bg-emerald-700 text-white'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Publikované ({offers.filter(o => o.status === 'published').length})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              filter === 'draft'
                ? 'bg-emerald-700 text-white'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Koncepty ({offers.filter(o => o.status === 'draft').length})
          </button>
          <button
            onClick={() => setFilter('paused')}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              filter === 'paused'
                ? 'bg-emerald-700 text-white'
                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Pozastavené ({offers.filter(o => o.status === 'paused').length})
          </button>
        </div>
      </div>

      {/* Seznam nabídek */}
      {filteredOffers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filter === 'all' ? 'Zatím nemáte žádné nabídky' : `Žádné nabídky se statusem "${filter}"`}
          </h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? 'Přidejte svou první nabídku pomocí tlačítka níže.'
              : 'Zkuste změnit filtr nebo přidejte novou nabídku.'
            }
          </p>
          {filter === 'all' && (
            <Link
              href="/account/offers/new"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-700 rounded-full hover:bg-emerald-800"
            >
              + Přidat nabídku
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-32 bg-gradient-to-br from-emerald-50 to-emerald-100"></div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {offer.title}
                  </h3>
                  {getStatusBadge(offer.status)}
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-medium">{offer.city}</span>
                  </div>
                  {offer.price && (
                    <div className="font-semibold text-emerald-700">
                      od {offer.price}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Vytvořeno: {new Date(offer.createdAt).toLocaleDateString('cs-CZ')}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/account/offers/${offer.id}/edit`}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    Upravit
                  </Link>
                  <button
                    onClick={() => handleToggleStatus(offer)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    {offer.status === "paused" ? "Obnovit" : "Pozastavit"}
                  </button>
                  <button
                    onClick={() => handleDelete(offer)}
                    className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-full hover:bg-red-100"
                  >
                    Smazat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}