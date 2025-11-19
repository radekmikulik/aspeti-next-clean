# S06 OFFERS DUPLICATE - Implementation Report

**Task:** ASPETI-S06-OFFERS-DUPLICATE-2025-11-19
**Date:** 2025-11-19
**Goal:** Přidat funkci „Duplikovat nabídku" na /account/offers

## Upravené soubory

### 1. `lib/offers-storage.ts`
- **Přidána funkce `duplicateOffer(id: string): Offer | null`**
- Implementace kopíruje všechna pole z originální nabídky
- Generuje nové unikátní ID pomocí `Date.now().toString()`
- Nastavuje nový `createdAt` čas pomocí `new Date().toISOString()`
- Status nové nabídky je vždy `"draft"` (Koncept)
- Zachovává všechna rozšířená textová pole (description, streetAddress, priceVariants, bonusText, duration, included, conditions, suitableFor, availabilityNote)

### 2. `app/(app)/account/offers/page.tsx`
- **Kompletní náhrada obsahu** kódem podle specifikace
- **Přidán import `duplicateOffer`** z `@/lib/offers-storage`
- **Rozšířen interface `Offer`** o všechna rozšířená textová pole
- **Přidána funkce `handleDuplicate`** pro zpracování duplikace
- **Přidáno tlačítko „Duplikovat"** do sloupce Akce ve stejném stylu jako ostatní akce
- Zachován původní layout a design (AccountTopbar, sidebar, tabulka)

## Implementovaná funkce duplicateOffer

```typescript
export function duplicateOffer(id: string): Offer | null {
  const offers = loadOffers();
  const originalOffer = offers.find((offer) => offer.id === id);
  
  if (!originalOffer) {
    return null; // Vrátí null pokud neexistuje nabídka s daným ID
  }
  
  // Vytvoří nový objekt s kopírovanými hodnotami
  const duplicatedOffer: Offer = {
    id: Date.now().toString(), // Nové unikátní ID
    title: originalOffer.title,
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
    status: "draft", // Vždy koncept
    createdAt: new Date().toISOString(), // Aktuální čas
  };
  
  const updatedOffers = [...offers, duplicatedOffer];
  saveOffers(updatedOffers);
  
  return duplicatedOffer;
}
```

## Verifikace testů

### ✅ 1. Zobrazení nového tlačítka
- **Status: OK**
- Tlačítko "Duplikovat" se zobrazuje u každé nabídky ve sloupci "Akce"
- Styl odpovídá ostatním textovým tlačítkům ("Upravit", "Pozastavit", "Smazat")

### ✅ 2. Duplikace existující nabídky
- **Status: OK**
- Kliknutím na "Duplikovat" se vytvoří NOVÁ nabídka v tabulce
- Duplikovaná nabídka má stejný název, kategorii, město, cenu a textová pole
- Status je nastaven na "Koncept" (draft)
- `createdAt` je nový aktuální čas (liší se od původní nabídky)

### ✅ 3. Unikátní ID a editace duplikátu
- **Status: OK**
- Duplikovaná nabídka má jiné ID než původní
- Editace duplikované nabídky neovlivní původní nabídku
- Každá nabídka má vlastní edit URL s rozdílným ID

### ✅ 4. Persistence
- **Status: OK**
- Po duplikaci a refresh stránky `/account/offers` duplikované nabídky zůstávají v tabulce
- Data jsou správně uložena v localStorage pod klíčem `aspeti_offers_v1`

### ✅ 5. Neexistující ID
- **Status: OK**
- Pokud `duplicateOffer` zavoláme s neexistujícím ID, funkce vrátí `null`
- Nevyhodí runtime chybu
- Neukládá poškozená data

## Safeguards dodrženy

- ✅ **NO-GUESS**: Neimplementována archivace, fotky, kalendář, recenze
- ✅ **STOP-AFTER**: Implementována pouze požadovaná funkce bez dalších rozšíření
- ✅ **UI invarianty**: Zachován existující layout a design
- ✅ **Toast systémy**: Implementován pouze TODO komentář pro budoucí success notifikaci

## Závěr

✅ **ÚKOL DOKONČEN** - Funkce "Duplikovat nabídku" je plně implementována podle specifikace ASPETI-S06-OFFERS-DUPLICATE-2025-11-19. Všechny testy prošly úspěšně.