"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getOffer, updateOffer } from "@/lib/offers-storage";

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

// BLOCK: OFFER_EDIT_PAGE
// PURPOSE: Editace existující nabídky na /account/offers/[id]/edit

export default function OfferEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = params?.id;
    if (!id) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const existing = getOffer(id as string) as Offer | null;

    if (!existing) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setOffer(existing);
    setLoading(false);
  }, [params]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!offer) return;

    // Předpoklad: updateOffer(id, data) aktualizuje záznam v localStorage.
    updateOffer(offer.id, offer);
    // TODO(TOAST): Po integraci toast systému zde zobrazit success notifikaci.

    router.push("/account/offers");
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-600">
        Načítám nabídku…
      </div>
    );
  }

  if (notFound || !offer) {
    return (
      <div className="p-6 text-sm text-gray-700">
        <p className="mb-3 font-medium">
          Nabídka nebyla nalezena.
        </p>
        <Link
          href="/account/offers"
          className="text-sm text-blue-700 hover:underline"
        >
          Zpět na přehled nabídek
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="mb-4 text-lg font-semibold">
        Upravit nabídku
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Název */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Název
          </label>
          <input
            type="text"
            value={offer.title}
            onChange={(e) =>
              setOffer({ ...offer, title: e.target.value })
            }
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {/* Kategorie */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Kategorie
          </label>
          <input
            type="text"
            value={offer.category}
            onChange={(e) =>
              setOffer({ ...offer, category: e.target.value })
            }
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {/* Město */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Město
          </label>
          <input
            type="text"
            value={offer.city}
            onChange={(e) =>
              setOffer({ ...offer, city: e.target.value })
            }
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {/* Cena */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Cena (Kč)
          </label>
          <input
            type="number"
            min={0}
            value={offer.price}
            onChange={(e) =>
              setOffer({
                ...offer,
                price: e.target.value,
              })
            }
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Stav
          </label>
          <select
            value={offer.status}
            onChange={(e) =>
              setOffer({
                ...offer,
                status: e.target.value as OfferStatus,
              })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="draft">Koncept</option>
            <option value="published">Publikováno</option>
            <option value="paused">Pozastaveno</option>
          </select>
        </div>

        {/* TODO: Pokud jsou v nové nabídce další pole (popis, VIP, atd.),
                 může být rozšíření formuláře řešeno v samostatném úkolu. */}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Uložit změny
          </button>
          <button
            type="button"
            onClick={() => router.push("/account/offers")}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm"
          >
            Zrušit
          </button>
        </div>
      </form>
    </div>
  );
}

// END BLOCK: OFFER_EDIT_PAGE
