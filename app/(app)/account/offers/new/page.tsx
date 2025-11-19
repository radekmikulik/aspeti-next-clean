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

// Konfigurace kategorií a podkategorií ASPETi
const MAIN_CATEGORIES = [
  { value: "beauty",        label: "Krása a pohoda" },
  { value: "gastro",        label: "Gastro" },
  { value: "accommodation", label: "Ubytování" },
  { value: "realestate",    label: "Reality" },
  { value: "crafts",        label: "Řemesla" },
] as const;

type MainCategoryValue = (typeof MAIN_CATEGORIES)[number]["value"];

const SUBCATEGORIES: Record<
  MainCategoryValue,
  { value: string; label: string }[]
> = {
  beauty: [
    { value: "kosmetika",   label: "Kosmetika" },
    { value: "wellness",    label: "Wellness" },
    { value: "masaze",      label: "Masáže" },
    { value: "kadernictvi", label: "Kadeřnictví" },
    { value: "nehty",       label: "Nehty" },
    { value: "lashbrow",    label: "Lash & Brow" },
  ],
  gastro: [
    { value: "restaurace",  label: "Restaurace" },
    { value: "kavarna",     label: "Kavárna" },
    { value: "bistro",      label: "Bistro" },
    { value: "bar",         label: "Bar" },
    { value: "cukrarna",    label: "Cukrárna" },
  ],
  accommodation: [
    { value: "hotel",       label: "Hotel" },
    { value: "penzion",     label: "Penzion" },
    { value: "apartman",    label: "Apartmán" },
  ],
  realestate: [
    { value: "prodej",      label: "Prodej" },
    { value: "pronajem",    label: "Pronájem" },
    { value: "komercni",    label: "Komerční prostory" },
  ],
  crafts: [
    { value: "elektrikar",  label: "Elektrikář" },
    { value: "instalater",  label: "Instalatér" },
    { value: "malir",       label: "Malíř / Natěrač" },
    { value: "uklid",       label: "Úklidové služby" },
  ],
};

function getMainCategoryLabel(value: MainCategoryValue | ""): string | undefined {
  return MAIN_CATEGORIES.find((c) => c.value === value)?.label;
}

function getMainCategoryValueFromLabel(
  label?: string | null
): MainCategoryValue | "" {
  if (!label) return "";
  const found = MAIN_CATEGORIES.find((c) => c.label === label);
  return found ? found.value : "";
}

// BLOCK: OFFER_NEW_PAGE
// PURPOSE: Formulář pro vytvoření nové nabídky na /account/offers/new

export default function OfferNewPage() {
  const router = useRouter();
  const [submitStatus, setSubmitStatus] = useState<OfferStatus>("draft");

  // Stav pro strukturované kategorie
  const [mainCategoryValue, setMainCategoryValue] =
    useState<MainCategoryValue | "">("");
  const [selectedSubcategoryValues, setSelectedSubcategoryValues] =
    useState<string[]>([]);

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

    const mainCategoryLabel =
      getMainCategoryLabel(mainCategoryValue) ?? "Nezařazeno";

    const subcategoriesLabels =
      mainCategoryValue === ""
        ? []
        : SUBCATEGORIES[mainCategoryValue]
            .filter((sub) => selectedSubcategoryValues.includes(sub.value))
            .map((sub) => sub.label);

    // Předpoklad: createOffer(data) vytvoří nabídku, vygeneruje id a createdAt.
    createOffer({
      title: form.title,
      category: mainCategoryLabel,
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
      // ADD(2025-11-19): Strukturované kategorie
      mainCategoryLabel,
      subcategoriesLabels,
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

          {/* Kategorie */}
          {/* BLOCK: OFFER_CATEGORIES_NEW */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              Kategorie <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-600">
              Vyberte hlavní kategorii a případně jednu nebo více podkategorií.
            </p>

            {/* Hlavní kategorie */}
            <select
              value={mainCategoryValue}
              onChange={(e) => {
                const value = e.target.value as MainCategoryValue | "";
                setMainCategoryValue(value);
                setSelectedSubcategoryValues([]);
              }}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              required
            >
              <option value="">Vyberte kategorii…</option>
              {MAIN_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Podkategorie */}
            {mainCategoryValue && (
              <div className="mt-2 space-y-1">
                <div className="text-xs font-medium text-gray-700">
                  Podkategorie (volitelné)
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUBCATEGORIES[mainCategoryValue].map((sub) => {
                    const checked = selectedSubcategoryValues.includes(sub.value);
                    return (
                      <label
                        key={sub.value}
                        className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-800 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="h-3 w-3 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                          checked={checked}
                          onChange={() => {
                            setSelectedSubcategoryValues((prev) =>
                              checked
                                ? prev.filter((v) => v !== sub.value)
                                : [...prev, sub.value]
                            );
                          }}
                        />
                        <span>{sub.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {/* END BLOCK: OFFER_CATEGORIES_NEW */}

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