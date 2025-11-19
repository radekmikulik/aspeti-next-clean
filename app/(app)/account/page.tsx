"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllOffers, setStatus, type Offer } from "@/lib/offers-storage";

type OfferStatus = Offer["status"];

// BLOCK: ACCOUNT_DASHBOARD
// PURPOSE: Přehled poskytovatelského účtu – KPI, rychlé akce, zprávy, rezervace, moje nabídky, kredit

const mockKpis = [
  { label: "Dnešní zobrazení", value: "1 284" },
  { label: "Kliky na detail", value: "142" },
  { label: "Nové zprávy", value: "3" },
  { label: "Rezervace dnes", value: "5" },
];

const mockMessages = [
  {
    id: 1,
    name: "Petra K.",
    text: "Dotaz k termínu na příští týden",
    isNew: true,
  },
  {
    id: 2,
    name: "Marek S.",
    text: "Lash lifting – dostupnost",
    isNew: true,
  },
  {
    id: 3,
    name: "Jitka R.",
    text: "Dárkový poukaz",
    isNew: true,
  },
];

const mockReservations = [
  {
    id: 1,
    time: "09:00",
    service: "Relax masáž 45 min",
    client: "Petra K.",
  },
  {
    id: 2,
    time: "11:30",
    service: "Lash lifting",
    client: "Marek S.",
  },
  {
    id: 3,
    time: "15:00",
    service: "Úprava obočí",
    client: "Jitka R.",
  },
];

export default function DashboardPage() {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    const data = getAllOffers() as Offer[] | null;
    setOffers(Array.isArray(data) ? data : []);
  }, []);

  const reloadOffers = () => {
    const data = getAllOffers() as Offer[] | null;
    setOffers(Array.isArray(data) ? data : []);
  };

  const handleToggleStatus = (offer: Offer) => {
    const nextStatus: OfferStatus =
      offer.status === "paused" ? "published" : "paused";
    setStatus(offer.id, nextStatus);
    reloadOffers();
    // TODO(TOAST): info - změna stavu nabídky z přehledu
  };

  const featuredOffers = offers.slice(0, 3);

  return (
    <div className="p-6 space-y-6">
      {/* KPI cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {mockKpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
          >
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {kpi.label}
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-900">
              {kpi.value}
            </div>
          </div>
        ))}
      </section>

      {/* Rychlé akce */}
      <section className="rounded-2xl border border-gray-200 bg-emerald-50/40 px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Rychlé akce
            </h2>
            <p className="text-xs text-gray-600">
              Přidejte novou nabídku, nahrajte fotky nebo pozvěte kolegu do
              týmu.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/account/offers/new"
              className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
            >
              + Přidat nabídku
            </Link>
            <button
              type="button"
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Nahrát fotky
              {/* TODO: future route /account/media nebo modal */}
            </button>
            <button
              type="button"
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              Pozvat člena
              {/* TODO: future route /account/team */}
            </button>
          </div>
        </div>
      </section>

      {/* Zprávy + Rezervace */}
      <section className="grid gap-4 lg:grid-cols-2">
        {/* Nedávné zprávy */}
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Nedávné zprávy
            </h2>
            <button
              type="button"
              className="text-xs font-medium text-blue-700 hover:underline"
            >
              Otevřít inbox
              {/* TODO: future route /account/messages */}
            </button>
          </div>
          <div className="space-y-2">
            {mockMessages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-50"
              >
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <div>
                  <div className="text-xs font-semibold text-gray-900">
                    {msg.name}
                  </div>
                  <div className="text-xs text-gray-600">{msg.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dnešní rezervace */}
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Dnešní rezervace
            </h2>
            <button
              type="button"
              className="text-xs font-medium text-blue-700 hover:underline"
            >
              Otevřít kalendář
              {/* TODO: future route /account/reservations/calendar */}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-slate-50">
                  <th className="px-3 py-2 text-left font-medium text-gray-700">
                    Čas
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">
                    Služba
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">
                    Klient
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700">
                    Akce
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockReservations.map((res) => (
                  <tr key={res.id} className="border-b border-gray-100">
                    <td className="whitespace-nowrap px-3 py-2 text-gray-900">
                      {res.time}
                    </td>
                    <td className="px-3 py-2 text-gray-800">
                      {res.service}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-gray-800">
                      {res.client}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="rounded-full border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-900 hover:bg-gray-50"
                        >
                          Potvrdit
                          {/* TODO: future reservation confirm */}
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-900 hover:bg-gray-50"
                        >
                          Zrušit
                          {/* TODO: future reservation cancel */}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Moje nabídky + Kredit */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Moje nabídky – preview */}
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">
              Moje nabídky
            </h2>
            <Link
              href="/account/offers"
              className="text-xs font-medium text-blue-700 hover:underline"
            >
              Zobrazit vše
            </Link>
          </div>

          {featuredOffers.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-slate-50 px-3 py-3 text-xs text-gray-600">
              Zatím nemáte žádné aktivní nabídky. Přidejte první pomocí
              tlačítka <span className="font-medium">„+ Přidat nabídku"</span>{" "}
              výše.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {featuredOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-slate-50"
                >
                  <div className="h-20 rounded-t-2xl bg-emerald-50" />
                  <div className="flex flex-1 flex-col px-3 py-3">
                    <div className="text-sm font-semibold text-gray-900">
                      {offer.title}
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                      {offer.city}
                      {offer.price ? ` • od ${offer.price} Kč` : null}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800">
                        TOP
                      </span>
                      <span className="text-gray-500">
                        {offer.status === "draft"
                          ? "Koncept"
                          : offer.status === "published"
                          ? "Publikováno"
                          : "Pozastaveno"}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href={`/account/offers/${offer.id}/edit`}
                        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-900 hover:bg-gray-50"
                      >
                        Upravit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(offer)}
                        className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-900 hover:bg-gray-50"
                      >
                        {offer.status === "paused"
                          ? "Obnovit"
                          : "Pozastavit"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kredit účtu */}
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold text-gray-900">
            Kredit účtu
          </h2>
          <div className="text-xs text-gray-600">Zůstatek:</div>
          <div className="mt-1 text-xl font-semibold text-gray-900">
            420 Kč
          </div>
          <p className="mt-2 text-xs text-gray-600">
            Kredit se postupně odečítá podle aktivních nabídek a kampaní.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-800"
            >
              Dobít kredit
              {/* TODO: future billing flow */}
            </button>
            <button
              type="button"
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-900 hover:bg-gray-50"
            >
              Faktury
              {/* TODO: future invoices page */}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// END BLOCK: ACCOUNT_DASHBOARD