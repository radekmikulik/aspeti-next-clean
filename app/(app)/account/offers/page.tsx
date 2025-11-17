"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadOffers, saveOffers, type Offer } from "@/lib/offers-storage";

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const router = useRouter();

  useEffect(() => {
    setOffers(loadOffers());
  }, []);

  const handleToggleStatus = (id: string) => {
    const updated = offers.map((offer) =>
      offer.id === id
        ? {
            ...offer,
            status:
              offer.status === "published" ? ("paused" as const) : ("published" as const),
          }
        : offer
    );
    setOffers(updated);
    saveOffers(updated);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Opravdu chcete smazat nabídku "${title}"?`)) {
      const updated = offers.filter((offer) => offer.id !== id);
      setOffers(updated);
      saveOffers(updated);
    }
  };

  const handleEdit = () => {
    alert("Editace bude doplněna");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-900">Moje nabídky</h1>
        <Link
          href="/account/offers/new"
          className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
        >
          Přidat nabídku
        </Link>
      </div>

      <div className="bg-white border border-[#D2DED8] rounded-md shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#E7EFEA] border-b border-[#D2DED8]">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-blue-900">
                Název
              </th>
              <th className="text-left px-4 py-3 font-semibold text-blue-900">
                Město
              </th>
              <th className="text-left px-4 py-3 font-semibold text-blue-900">
                Cena
              </th>
              <th className="text-left px-4 py-3 font-semibold text-blue-900">
                Stav
              </th>
              <th className="text-left px-4 py-3 font-semibold text-blue-900">
                Vytvořeno
              </th>
              <th className="text-left px-4 py-3 font-semibold text-blue-900">
                Akce
              </th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id} className="border-b border-[#D2DED8] last:border-b-0">
                <td className="px-4 py-3 font-medium">{offer.title}</td>
                <td className="px-4 py-3 text-gray-600">{offer.city}</td>
                <td className="px-4 py-3 text-gray-600">{offer.price}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${
                      offer.status === "published"
                        ? "bg-green-100 text-green-800"
                        : offer.status === "paused"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {offer.status === "published"
                      ? "Publikováno"
                      : offer.status === "paused"
                      ? "Pozastaveno"
                      : "Koncept"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(offer.createdAt).toLocaleDateString("cs-CZ")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={handleEdit}
                      className="text-blue-700 hover:text-blue-900 text-xs"
                    >
                      Upravit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(offer.id)}
                      className="text-orange-700 hover:text-orange-900 text-xs"
                    >
                      {offer.status === "published" ? "Pozastavit" : "Obnovit"}
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id, offer.title)}
                      className="text-red-700 hover:text-red-900 text-xs"
                    >
                      Smazat
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {offers.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-500">
            Zatím nemáte žádné nabídky. Přidejte první nabídku.
          </div>
        )}
      </div>
    </div>
  );
}
