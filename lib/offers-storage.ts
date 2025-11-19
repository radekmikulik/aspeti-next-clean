export type Offer = {
  id: string;
  title: string;
  category: string;
  city: string;
  price: string;
  status: "draft" | "published" | "paused";
  createdAt: string;
  // UPDATE(2025-11-19): Rozšíření Offer o detailní textová pole
  description?: string;
  streetAddress?: string;
  priceVariants?: string;
  bonusText?: string;
  duration?: string;
  included?: string;
  conditions?: string;
  suitableFor?: string;
  availabilityNote?: string;
};

export type NewOfferInput = {
  title: string;
  category: string;
  city: string;
  price: string;
  status?: "draft" | "published" | "paused";
  createdAt?: string;
  // UPDATE(2025-11-19): Rozšíření NewOfferInput o detailní textová pole
  description?: string;
  streetAddress?: string;
  priceVariants?: string;
  bonusText?: string;
  duration?: string;
  included?: string;
  conditions?: string;
  suitableFor?: string;
  availabilityNote?: string;
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
    // UPDATE(2025-11-19): Rozšíření Offer o detailní textová pole
    description: input.description,
    streetAddress: input.streetAddress,
    priceVariants: input.priceVariants,
    bonusText: input.bonusText,
    duration: input.duration,
    included: input.included,
    conditions: input.conditions,
    suitableFor: input.suitableFor,
    availabilityNote: input.availabilityNote,
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

  // UPDATE(2025-11-19): Zachování původních polí (id, createdAt) + aplikace patch
  const existing = offers[index];
  const updatedOffer = { 
    ...existing, 
    ...patch, 
    id: existing.id, // Zachovat původní ID
    createdAt: existing.createdAt, // Zachovat původní createdAt
  };
  const updated = [...offers];
  updated[index] = updatedOffer;
  saveOffers(updated);

  return updatedOffer;
}

/**
 * Smaže nabídku podle ID
 */
export function deleteOffer(id: string): void {
  // UPDATE(2025-11-19): Přidán debug log pro sledování delete operace
  console.log(`[DEBUG] deleteOffer called with id: ${id}`);
  const offers = loadOffers();
  const filtered = offers.filter((offer) => offer.id !== id);
  console.log(`[DEBUG] Filtered offers count: ${filtered.length} (was ${offers.length})`);
  saveOffers(filtered);
}

/**
 * Změní stav nabídky (published/paused)
 */
export function setStatus(
  id: string,
  status: "published" | "paused" | "draft"
): Offer | null {
  // UPDATE(2025-11-19): Přidán debug log pro sledování změny statusu
  console.log(`[DEBUG] setStatus called with id: ${id}, status: ${status}`);
  const result = updateOffer(id, { status });
  console.log(`[DEBUG] setStatus result:`, result ? 'success' : 'failed');
  return result;
}

// ADD(2025-11-19): duplicateOffer - vytvoření kopie nabídky jako koncept
export function duplicateOffer(id: string): Offer | null {
  // UPDATE(2025-11-19): Přidán debug log + vylepšená identifikace duplikátu
  console.log(`[DEBUG] duplicateOffer called with id: ${id}`);
  const offers = loadOffers();
  const originalOffer = offers.find((offer) => offer.id === id);
  
  if (!originalOffer) {
    console.error(`[ERROR] Original offer with id ${id} not found`);
    return null;
  }
  
  console.log(`[DEBUG] Original offer found:`, originalOffer.title);
  
  const duplicatedOffer: Offer = {
    id: Date.now().toString(),
    // UPDATE(2025-11-19): Přidán "(kopie)" suffix pro lepší identifikaci
    title: `${originalOffer.title} (kopie)`,
    category: originalOffer.category,
    city: originalOffer.city,
    streetAddress: originalOffer.streetAddress,
    price: originalOffer.price,
    description: originalOffer.description,
    priceVariants: originalOffer.priceVariants,
    bonusText: originalOffer.bonusText,
    duration: originalOffer.duration,
    included: originalOffer.included,
    conditions: originalOffer.conditions,
    suitableFor: originalOffer.suitableFor,
    availabilityNote: originalOffer.availabilityNote,
    status: "draft",
    createdAt: new Date().toISOString(),
  };
  
  const updatedOffers = [...offers, duplicatedOffer];
  saveOffers(updatedOffers);
  console.log(`[DEBUG] Duplicated offer saved with id: ${duplicatedOffer.id}`);
  
  return duplicatedOffer;
}
