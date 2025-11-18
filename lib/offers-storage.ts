export type Offer = {
  id: string;
  title: string;
  category: string;
  city: string;
  price: string;
  status: "draft" | "published" | "paused";
  createdAt: string;
};

export type NewOfferInput = {
  title: string;
  category: string;
  city: string;
  price: string;
  status?: "draft" | "published" | "paused";
  createdAt?: string;
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

// CRUD API Functions

/**
 * Načte všechny nabídky z localStorage
 */
export function getAllOffers(): Offer[] {
  return loadOffers();
}

/**
 * Načte konkrétní nabídku podle ID
 */
export function getOffer(id: string): Offer | null {
  const offers = loadOffers();
  return offers.find((offer) => offer.id === id) || null;
}

/**
 * Vytvoří novou nabídku
 */
export function createOffer(input: NewOfferInput): Offer {
  const newOffer: Offer = {
    id: Date.now().toString(),
    title: input.title,
    category: input.category,
    city: input.city,
    price: input.price,
    status: input.status || "draft",
    createdAt: input.createdAt || new Date().toISOString(),
  };

  const offers = loadOffers();
  const updated = [...offers, newOffer];
  saveOffers(updated);

  return newOffer;
}

/**
 * Aktualizuje existující nabídku
 */
export function updateOffer(id: string, patch: Partial<Offer>): Offer | null {
  const offers = loadOffers();
  const index = offers.findIndex((offer) => offer.id === id);

  if (index === -1) {
    console.error(`Nabídka s ID ${id} nebyla nalezena`);
    return null;
  }

  const updatedOffer = { ...offers[index], ...patch, id };
  const updated = [...offers];
  updated[index] = updatedOffer;
  saveOffers(updated);

  return updatedOffer;
}

/**
 * Smaže nabídku podle ID
 */
export function deleteOffer(id: string): void {
  const offers = loadOffers();
  const filtered = offers.filter((offer) => offer.id !== id);
  saveOffers(filtered);
}

/**
 * Změní stav nabídky (published/paused)
 */
export function setStatus(
  id: string,
  status: "published" | "paused" | "draft"
): Offer | null {
  return updateOffer(id, { status });
}
