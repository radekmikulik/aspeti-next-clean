"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAllOffers,
  setStatus,
  deleteOffer,
} from "@/lib/offers-storage";

type OfferStatus = "draft" | "published" | "paused";

interface Offer {
  id: string;
  title: string;
  category: string;
  city: string;
  price: string;
  status: OfferStatus;
  createdAt: string;
}

// BLOCK: OFFERS_PAGE
// PURPOSE: Výpis a základní správa nabídek na route /account/offers

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorage je dostupné jen v browseru; komponenta je client-only.
    const data = getAllOffers() as Offer[] | null;
    setOffers(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  const reloadOffers = () => {
    const data = getAllOffers() as Offer[] | null;
    setOffers(Array.isArray(data) ? data : []);
  };

  const handleSetStatus = (id: string, status: OfferStatus) => {
    setStatus(id, status);
    reloadOffers();
    // TODO(TOAST): Po integraci toast systému zde zobrazit success/info notifikaci.
  };

  const handleDelete = (id: string) => {
    deleteOffer(id);
    reloadOffers();
    // TODO(TOAST): Po integraci toast systému zde zobrazit success notifikaci.
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">
          Moje nabídky
        </h1>
        <Link
          href="/account/offers/new"
          className="rounded-md px-3 py-2 text-sm font-medium border border-gray-300 hover:bg-gray-50"
        >
          Přidat nabídku
        </Link>
      </div>

      {loading ? (
        <div className="text-sm text-gray-600">
          Načítám nabídky…
        </div>
      ) : offers.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-300 p-4 text-sm text-gray-700">
          Zatím nemáte žádné nabídky. Přidejte první pomocí tlačítka
          <span className="font-medium"> „Přidat nabídku"</span> vpravo nahoře.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Název
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Město
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Cena
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Stav
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Vytvořeno
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Akce
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {offers.map((offer) => (
                <tr key={offer.id}>
                  <td className="whitespace-nowrap px-4 py-3">
                    {offer.title}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {offer.city}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {offer.price} Kč
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 capitalize">
                    {offer.status === "draft"
                      ? "Koncept"
                      : offer.status === "published"
                      ? "Publikováno"
                      : "Pozastaveno"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                    {new Date(offer.createdAt).toLocaleString("cs-CZ")}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {/* BLOCK: OFFERS_TABLE_ACTIONS */}
                    <div className="flex items-center gap-3">
                      {/* Upravit */}
                      <Link
                        href={`/account/offers/${offer.id}/edit`}
                        className="text-sm text-blue-700 hover:underline"
                      >
                        Upravit
                      </Link>

                      {/* Pozastavit / Obnovit */}
                      {offer.status === "paused" ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleSetStatus(offer.id, "published")
                          }
                          className="text-sm hover:underline"
                        >
                          Obnovit
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            handleSetStatus(offer.id, "paused")
                          }
                          className="text-sm hover:underline"
                        >
                          Pozastavit
                        </button>
                      )}

                      {/* Smazat */}
                      <button
                        type="button"
                        onClick={() => handleDelete(offer.id)}
                        className="text-sm text-red-700 hover:underline"
                      >
                        Smazat
                      </button>
                    </div>
                    {/* UPDATE(2025-11-19): Tlačítko "Upravit" vede na /account/offers/[id]/edit */}
                    {/* END BLOCK: OFFERS_TABLE_ACTIONS */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// END BLOCK: OFFERS_PAGE
