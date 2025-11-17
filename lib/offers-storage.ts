export type Offer = {
  id: string;
  title: string;
  category: string;
  city: string;
  price: string;
  status: "draft" | "published" | "paused";
  createdAt: string;
};

const STORAGE_KEY = "aspeti_offers_v1";

export function getInitialOffers(): Offer[] {
  return [
    {
      id: "1",
      title: "Lash lifting + brow shape",
      category: "Beauty & Wellbeing",
      city: "Praha 1",
      price: "690 Kč",
      status: "published",
      createdAt: new Date("2025-11-15T10:30:00").toISOString(),
    },
    {
      id: "2",
      title: "Masáž zad 45 min",
      category: "Beauty & Wellbeing",
      city: "Brno",
      price: "590 Kč",
      status: "published",
      createdAt: new Date("2025-11-16T14:20:00").toISOString(),
    },
  ];
}

export function loadOffers(): Offer[] {
  if (typeof window === "undefined") return getInitialOffers();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const initial = getInitialOffers();
      saveOffers(initial);
      return initial;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Chyba při načítání nabídek:", error);
    return getInitialOffers();
  }
}

export function saveOffers(offers: Offer[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));
  } catch (error) {
    console.error("Chyba při ukládání nabídek:", error);
  }
}
