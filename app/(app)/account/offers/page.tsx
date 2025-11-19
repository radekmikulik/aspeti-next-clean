"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAllOffers,
  setStatus,
  deleteOffer,
  duplicateOffer,
  type Offer,
} from "@/lib/offers-storage";

type OfferStatus = "draft" | "published" | "paused";

// BLOCK: OFFERS_PAGE
// PURPOSE: Výpis a základní správa nabídek na route /account/offers

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  type StatusFilter = "all" | "active" | "inactive" | "draft";
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  useEffect(() => {
    const data = getAllOffers() as Offer[] | null;
    setOffers(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  const reloadOffers = () => {
    // UPDATE(2025-11-19): Přidán debug log pro sledování reload operace
    console.log(`[DEBUG] reloadOffers called`);
    const data = getAllOffers() as Offer[] | null;
    const offersCount = Array.isArray(data) ? data.length : 0;
    console.log(`[DEBUG] reloadOffers - loaded ${offersCount} offers`);
    setOffers(Array.isArray(data) ? data : []);
  };

  const handleSetStatus = (id: string, status: OfferStatus) => {
    console.log(`[DEBUG] handleSetStatus called for ${id} with status ${status}`);
    const result = setStatus(id, status);
    console.log(`[DEBUG] setStatus result:`, result);
    if (result) {
      reloadOffers();
      // TODO(TOAST): success/info - změna stavu nabídky
    } else {
      console.error(`[ERROR] Failed to set status for offer ${id}`);
    }
  };

  const handleDelete = (id: string) => {
    console.log(`[DEBUG] handleDelete called for ${id}`);
    try {
      deleteOffer(id);
      reloadOffers();
      // TODO(TOAST): success - nabídka smazána
    } catch (error) {
      console.error(`[ERROR] Failed to delete offer ${id}:`, error);
    }
  };

  const handleDuplicate = (id: string) => {
    console.log(`[DEBUG] handleDuplicate called for ${id}`);
    try {
      const result = duplicateOffer(id);
      console.log(`[DEBUG] duplicateOffer result:`, result);
      if (result) {
        reloadOffers();
        // TODO(TOAST): success - vytvořen duplikát jako koncept
      } else {
        console.error(`[ERROR] Failed to duplicate offer ${id}`);
      }
    } catch (error) {
      console.error(`[ERROR] Exception in handleDuplicate for ${id}:`, error);
    }
  };

  const filteredOffers = offers.filter((offer) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "draft") return offer.status === "draft";
    if (statusFilter === "active") return offer.status === "published";
    if (statusFilter === "inactive") return offer.status === "paused";
    return true;
  });

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">
          🚨 DEPLOYMENT TEST - Moje nabídky
        </h1>
        <Link
          href="/account/offers/new"
          className="rounded-md px-3 py-2 text-sm font-medium border border-gray-300 hover:bg-gray-50"
        >
          Přidat nabídku
        </Link>
      </div>

      {/* BLOCK: OFFERS_STATUS_FILTER */}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-600">Filtrovat podle stavu:</span>
        {(
          [
            { value: "all", label: "Vše" },
            { value: "active", label: "Aktivní" },
            { value: "inactive", label: "Neaktivní" },
            { value: "draft", label: "Koncept" },
          ] as const
        ).map((item) => {
          const isActive = statusFilter === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setStatusFilter(item.value)}
              className={[
                "rounded-full border px-3 py-1",
                "transition text-xs",
                isActive
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {/* END BLOCK: OFFERS_STATUS_FILTER */}

      {loading ? (
        <div className="text-sm text-gray-600">
          Načítám nabídky…
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-300 p-4 text-sm text-gray-700">
          {statusFilter === "all" ? (
            <>
              Zatím nemáte žádné nabídky. Přidejte první pomocí tlačítka
              <span className="font-medium"> „Přidat nabídku"</span> vpravo nahoře.
            </>
          ) : (
            <>
              Žádné nabídky nenalezeny pro vybraný filtr „{statusFilter === "active" ? "Aktivní" : statusFilter === "inactive" ? "Neaktivní" : "Koncept"}".
              Zkuste vybrat jiný filtr nebo přidat novou nabídku.
            </>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
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
            <tbody className="divide-y divide-gray-100">
              {filteredOffers.map((offer) => (
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
                  <td className="whitespace-nowrap px-4 py-3">
                    {/* BLOCK: OFFER_STATUS_BADGE */}
                    {offer.status === "draft" && (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800">
                        Koncept
                      </span>
                    )}
                    {offer.status === "published" && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                        Aktivní
                      </span>
                    )}
                    {offer.status === "paused" && (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        Neaktivní
                      </span>
                    )}
                    {/* END BLOCK: OFFER_STATUS_BADGE */}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                    {new Date(offer.createdAt).toLocaleString("cs-CZ")}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {/* BLOCK: OFFERS_TABLE_ACTIONS */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Upravit */}
                      <Link
                        href={`/account/offers/${offer.id}/edit`}
                        className="text-sm text-blue-700 hover:underline"
                      >
                        Upravit
                      </Link>

                      {/* Duplikovat */}
                      <button
                        type="button"
                        onClick={() => handleDuplicate(offer.id)}
                        className="text-sm hover:underline"
                      >
                        Duplikovat
                      </button>

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
                    {/* UPDATE(2025-11-19): Přidána akce "Duplikovat" - vytvoří koncept z existující nabídky */}
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