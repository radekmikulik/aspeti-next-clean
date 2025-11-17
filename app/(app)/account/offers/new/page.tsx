"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadOffers, saveOffers, type Offer } from "@/lib/offers-storage";

export default function NewOfferPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    category: "Beauty & Wellbeing",
    city: "",
    price: "",
    description: "",
    vipHighlight: false,
    publishImmediately: false,
  });

  const handleSubmit = (status: "draft" | "published") => {
    if (!formData.title.trim()) {
      alert("Vyplňte název nabídky");
      return;
    }

    const newOffer: Offer = {
      id: Date.now().toString(),
      title: formData.title,
      category: formData.category,
      city: formData.city || "Nespecifikováno",
      price: formData.price || "Cena na dotaz",
      status: formData.publishImmediately ? "published" : status,
      createdAt: new Date().toISOString(),
    };

    const existingOffers = loadOffers();
    const updatedOffers = [...existingOffers, newOffer];
    saveOffers(updatedOffers);

    router.push("/account/offers");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold text-blue-900">Přidat nabídku</h1>

      <div className="rounded-md border border-[#D2DED8] bg-white p-6 shadow-sm">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Název nabídky *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#D2DED8] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="např. Relaxační masáž 60 min"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategorie
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#D2DED8] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Beauty & Wellbeing</option>
              <option>Gastro</option>
              <option>Ubytování</option>
              <option>Reality</option>
              <option>Řemesla</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Město/pobočka
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#D2DED8] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="např. Praha 2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cena
            </label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#D2DED8] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="např. 590 Kč"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Popis
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-[#D2DED8] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Popište vaši nabídku..."
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.vipHighlight}
                onChange={(e) =>
                  setFormData({ ...formData, vipHighlight: e.target.checked })
                }
                className="w-4 h-4 text-blue-900 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">VIP zvýraznění</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.publishImmediately}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    publishImmediately: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-900 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                Okamžitě publikovat
              </span>
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              className="px-6 py-2 border border-[#D2DED8] text-blue-900 rounded-md hover:bg-[#E7EFEA] transition-colors"
            >
              Uložit koncept
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("published")}
              className="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
            >
              Publikovat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
