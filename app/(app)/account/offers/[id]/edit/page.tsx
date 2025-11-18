"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOffer, updateOffer, type Offer } from "@/lib/offers-storage";
import Toast from "@/components/Toast";

type EditOfferPageProps = {
  params: {
    id: string;
  };
};

export default function EditOfferPage({ params }: EditOfferPageProps) {
  const router = useRouter();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Beauty & Wellbeing",
    city: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    const loadedOffer = getOffer(params.id);
    
    if (!loadedOffer) {
      setToast({ message: "Nabídka nebyla nalezena", type: "error" });
      setTimeout(() => router.push("/account/offers"), 2000);
      return;
    }

    setOffer(loadedOffer);
    setFormData({
      title: loadedOffer.title,
      category: loadedOffer.category,
      city: loadedOffer.city,
      price: loadedOffer.price,
      description: "",
    });
    setLoading(false);
  }, [params.id, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setToast({ message: "Vyplňte název nabídky", type: "error" });
      return;
    }

    const result = updateOffer(params.id, {
      title: formData.title,
      category: formData.category,
      city: formData.city,
      price: formData.price,
    });

    if (result) {
      setToast({ message: "Nabídka byla úspěšně upravena", type: "success" });
      setTimeout(() => router.push("/account/offers"), 1500);
    } else {
      setToast({ message: "Chyba při ukládání nabídky", type: "error" });
    }
  };

  const handleCancel = () => {
    router.push("/account/offers");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Načítání...</div>
      </div>
    );
  }

  if (!offer) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold text-blue-900">Upravit nabídku</h1>

      <div className="rounded-md border border-[#D2DED8] bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-[#D2DED8] text-blue-900 rounded-md hover:bg-[#E7EFEA] transition-colors"
            >
              Zrušit
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
            >
              Uložit změny
            </button>
          </div>
        </form>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
