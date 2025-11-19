"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOffer } from "@/lib/offers-storage";

type OfferStatus = "draft" | "published" | "paused";

interface NewOfferFormValues {
  title: string;
  category: string;
  city: string;
  streetAddress: string;
  price: string;
  description: string;
  priceVariants: string;
  bonusText: string;
  duration: string;
  included: string;
  conditions: string;
  suitableFor: string;
  availabilityNote: string;
}

// BLOCK: OFFER_NEW_PAGE
// PURPOSE: Formulář pro vytvoření nové nabídky na /account/offers/new

export default function OfferNewPage() {
  const router = useRouter();
  const [submitStatus, setSubmitStatus] = useState<OfferStatus>("draft");

  const [form, setForm] = useState<NewOfferFormValues>({
    title: "",
    category: "",
    city: "",
    streetAddress: "",
    price: "",
    description: "",
    priceVariants: "",
    bonusText: "",
    duration: "",
    included: "",
    conditions: "",
    suitableFor: "",
    availabilityNote: "",
  });

  const handleChange =
    (field: keyof NewOfferFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Předpoklad: createOffer(data) vytvoří nabídku, vygeneruje id a createdAt.
    createOffer({
      title: form.title,
      category: form.category,
      city: form.city,
      streetAddress: form.streetAddress || undefined,
      price: form.price,
      description: form.description || undefined,
      priceVariants: form.priceVariants || undefined,
      bonusText: form.bonusText || undefined,
      duration: form.duration || undefined,
      included: form.included || undefined,
      conditions: form.conditions || undefined,
      suitableFor: form.suitableFor || undefined,
      availabilityNote: form.availabilityNote || undefined,
      status: submitStatus,
    });

    // TODO(TOAST): Po integraci toast systému zde zobrazit success notifikaci.

    router.push("/account/offers");
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold">
          Přidat novou nabídku
        </h1>
        <Link
          href="/account/offers"
          className="text-sm text-blue-700 hover:underline"
        >
          Zpět na přehled
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ZÁKLADNÍ INFORMACE */}
        <section className="space-y-4 rounded-md border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold">
            1️⃣ Základní informace
          </h2>

          {/* Název nabídky */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Název nabídky <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Kosmetické ošetření pleti – hydratace"
            />
          </div>

          {/* Kategorie (zatím jedna) */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Kategorie <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={form.category}
              onChange={handleChange("category")}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Kosmetika, Masáže, Gastro…"
            />
            <p className="mt-1 text-xs text-gray-500">
              Více kategorií / podkategorií bude řešeno v samostatném
              úkolu. Zatím uveď hlavní kategorii textově.
            </p>
          </div>

          {/* Lokalita: město + ulice */}
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Město <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={form.city}
                onChange={handleChange("city")}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Praha, Brno…"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Ulice / adresa
              </label>
              <input
                type="text"
                value={form.streetAddress}
                onChange={handleChange("streetAddress")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Např. Národní 1"
              />
            </div>
          </div>

          {/* Popis nabídky */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Popis nabídky <span className="text-red-600">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              required
              rows={5}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Popiš průběh služby, co klient zažije, jaký je efekt…"
            />
          </div>
        </section>

        {/* CENY A AKCE */}
        <section className="space-y-4 rounded-md border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold">
            2️⃣ Ceny a akce
          </h2>

          {/* Základní cena */}
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Základní cena (Kč){" "}
                <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={handleChange("price")}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Např. 900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Délka služby (volitelné)
              </label>
              <input
                type="text"
                value={form.duration}
                onChange={handleChange("duration")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="Např. 60 min"
              />
            </div>
          </div>

          {/* Více cenových variant */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Více cenových variant (volitelné)
            </label>
            <textarea
              value={form.priceVariants}
              onChange={handleChange("priceVariants")}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Např. 30 min – 500 Kč | 60 min – 900 Kč"
            />
          </div>

          {/* Bonusy / akce */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Bonusy / akce (volitelné)
            </label>
            <input
              type="text"
              value={form.bonusText}
              onChange={handleChange("bonusText")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Např. První návštěva -20 %"
            />
          </div>
        </section>

        {/* DETAILY NABÍDKY */}
        <section className="space-y-4 rounded-md border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold">
            4️⃣ Detaily nabídky
          </h2>

          {/* Co je zahrnuto v ceně */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Co je zahrnuto v ceně
            </label>
            <textarea
              value={form.included}
              onChange={handleChange("included")}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="✔ Konzultace&#10;✔ Ošetření&#10;✔ Závěrečná maska"
            />
          </div>

          {/* Podmínky / omezení */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Podmínky / omezení
            </label>
            <textarea
              value={form.conditions}
              onChange={handleChange("conditions")}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Např. Pouze pro nové klienty, nelze kombinovat s jinou akcí"
            />
          </div>

          {/* Pro koho je nabídka vhodná */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Pro koho je nabídka vhodná
            </label>
            <input
              type="text"
              value={form.suitableFor}
              onChange={handleChange("suitableFor")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Např. ženy, muži, páry, sportovci…"
            />
          </div>
        </section>

        {/* DOSTUPNOST */}
        <section className="space-y-4 rounded-md border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold">
            5️⃣ Dostupnost
          </h2>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Poznámka k dostupnosti (volitelné)
            </label>
            <textarea
              value={form.availabilityNote}
              onChange={handleChange("availabilityNote")}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Např. Každý čtvrtek 18:00, nebo dle domluvy."
            />
            <p className="mt-1 text-xs text-gray-500">
              Plnohodnotný kalendář a rezervace budou řešeny v samostatném
              úkolu.
            </p>
          </div>
        </section>

        {/* AKCE FORMULÁŘE */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            onClick={() => setSubmitStatus("draft")}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm"
          >
            Uložit koncept
          </button>
          <button
            type="submit"
            onClick={() => setSubmitStatus("published")}
            className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Publikovat
          </button>
          <button
            type="button"
            onClick={() => router.push("/account/offers")}
            className="rounded-md px-4 py-2 text-sm text-gray-700"
          >
            Zrušit
          </button>
        </div>
      </form>
    </div>
  );
}

// END BLOCK: OFFER_NEW_PAGE