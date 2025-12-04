"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createOffer, type NewOfferInput } from "@/lib/offers-storage";

export default function NewOfferPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<NewOfferInput>({
    title: "",
    category: "Krása a pohoda",
    city: "",
    price: "",
    description: "",
    streetAddress: "",
    mainCategoryLabel: "Krása a pohoda",
    subcategoriesLabels: [],
  });

  const categories = [
    { label: "Krása a pohoda", value: "Krása a pohoda" },
    { label: "Masáže", value: "Masáže" },
    { label: "Wellness", value: "Wellness" },
    { label: "Lékařské služby", value: "Lékařské služby" },
    { label: "Sport a fitness", value: "Sport a fitness" },
    { label: "Jiné služby", value: "Jiné služby" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title.trim()) {
        alert("Název nabídky je povinný");
        return;
      }
      if (!formData.city.trim()) {
        alert("Město je povinné");
        return;
      }
      if (!formData.price.trim()) {
        alert("Cena je povinná");
        return;
      }

      createOffer({
        ...formData,
        status: "draft",
      });

      alert("Nabídka byla úspěšně vytvořena jako koncept");
      router.push("/account");
    } catch (error) {
      console.error("Chyba při vytváření nabídky:", error);
      alert("Došlo k chybě při vytváření nabídky");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof NewOfferInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Přidat novou nabídku</h1>
          <p className="text-sm text-gray-600 mt-1">
            Vytvořte novou nabídku služeb pro klienty
          </p>
        </div>
        <Link
          href="/account"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
        >
          Zpět
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Základní informace</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Název nabídky *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="např. Relax masáž 45 min"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Kategorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Město *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="např. Praha 1"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Cena *
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="např. 590 Kč"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Adresa
              </label>
              <input
                type="text"
                value={formData.streetAddress}
                onChange={(e) => handleInputChange("streetAddress", e.target.value)}
                placeholder="např. Wenceslas Square 1"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Popis služby</h2>
          
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Detailní popis
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Popište vaši službu, co obsahuje, jak probíhá..."
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Délka trvání
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                placeholder="např. 45 minut"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Co je zahrnuto
              </label>
              <input
                type="text"
                value={formData.included}
                onChange={(e) => handleInputChange("included", e.target.value)}
                placeholder="např. masážní olej, ručník"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-end">
          <Link
            href="/account"
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50"
          >
            Zrušit
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-emerald-700 rounded-full hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Vytváření..." : "Vytvořit nabídku"}
          </button>
        </div>
      </form>
    </div>
  );
}