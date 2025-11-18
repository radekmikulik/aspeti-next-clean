# S04 APP OFFERS ACTIONS - Report implementace

## Přehled změn

Tento dokument popisuje implementaci kompletní CRUD funkcionalitysprávy nabídek v aplikaci aspeti-next-clean podle specifikace S04.

## 1. Rozšíření lib/offers-storage.ts

### Přidané typy

```typescript
export type NewOfferInput = {
  title: string;
  category: string;
  city: string;
  price: string;
  status?: "draft" | "published" | "paused";
  createdAt?: string;
};
```

### Nové CRUD API funkce

#### getAllOffers(): Offer[]
Načte všechny nabídky z localStorage. Wrapper nad loadOffers() pro konzistentní API.

**Použití:**
```typescript
const offers = getAllOffers();
```

#### getOffer(id: string): Offer | null
Načte konkrétní nabídku podle ID.

**Použití:**
```typescript
const offer = getOffer("123");
if (offer) {
  console.log(offer.title);
}
```

**Návratová hodnota:** 
- `Offer` objekt pokud existuje
- `null` pokud nabídka nebyla nalezena

#### createOffer(input: NewOfferInput): Offer
Vytvoří novou nabídku a uloží ji do localStorage.

**Použití:**
```typescript
const newOffer = createOffer({
  title: "Masáž",
  category: "Beauty & Wellbeing",
  city: "Praha",
  price: "500 Kč",
  status: "published"  // volitelné, default "draft"
});
```

**Funkce:**
- Automaticky generuje ID (timestamp)
- Nastaví createdAt na aktuální datum (pokud není poskytnuto)
- Uloží do localStorage
- Vrací vytvořený Offer objekt

#### updateOffer(id: string, patch: Partial<Offer>): Offer | null
Aktualizuje existující nabídku s částečnými daty.

**Použití:**
```typescript
const updated = updateOffer("123", {
  title: "Nový název",
  price: "600 Kč"
});
```

**Funkce:**
- Zachovává ID (nelze měnit)
- Merguje poskytnutá data s existujícími
- Vrací `null` pokud nabídka neexistuje
- Loguje chybu do console při nenalezení

#### deleteOffer(id: string): void
Smaže nabídku podle ID.

**Použití:**
```typescript
deleteOffer("123");
```

**Funkce:**
- Odfiltruje nabídku z listu
- Aktualizuje localStorage
- Bezpečné - nehodí chybu pokud ID neexistuje

#### setStatus(id: string, status: "published" | "paused" | "draft"): Offer | null
Změní stav nabídky.

**Použití:**
```typescript
const updated = setStatus("123", "paused");
```

**Funkce:**
- Wrapper nad updateOffer() pro změnu statusu
- Vrací aktualizovanou nabídku nebo `null`

## 2. Nová komponenta Toast

**Soubor:** `components/Toast.tsx`

Jednoduchá toast notifikace pro uživatelský feedback.

### Props
```typescript
type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;  // default 3000ms
};
```

### Funkce
- Auto-close po 3 sekundách (konfigurovatelné)
- Animovaný slide-up efekt
- 3 typy: success (zelená), error (červená), info (modrá)
- Manuální zavření tlačítkem

### Použití
```typescript
const [toast, setToast] = useState(null);

// Zobrazit toast
setToast({ message: "Úspěch", type: "success" });

// V JSX
{toast && (
  <Toast
    message={toast.message}
    type={toast.type}
    onClose={() => setToast(null)}
  />
)}
```

## 3. Nová route: /account/offers/[id]/edit

**Soubor:** `app/(app)/account/offers/[id]/edit/page.tsx`

Stránka pro úpravu existující nabídky.

### Funkce
- Načte nabídku podle ID z URL parametru
- Předvyplní formulář existujícími daty
- Validace (název je povinný)
- Error handling pro neexistující nabídky
- Toast notifikace po úspěšné/neúspěšné úpravě
- Auto-redirect na /account/offers po uložení
- Loading stav během načítání

### Flow
1. useEffect načte nabídku pomocí getOffer(params.id)
2. Pokud neexistuje → error toast → redirect po 2s
3. Formulář se předvyplní daty
4. Po submitu → updateOffer() → success toast → redirect po 1.5s
5. Tlačítko "Zrušit" → přímý redirect bez změn

### Validace
- Název nabídky je povinný (required + validace)
- Město a cena mají fallbacky ("Nespecifikováno", "Cena na dotaz")

## 4. Upgrade app/(app)/account/offers/page.tsx

### Změny
1. **Import nových CRUD funkcí:**
   ```typescript
   import { getAllOffers, deleteOffer, setStatus } from "@/lib/offers-storage";
   ```

2. **Toast state:**
   ```typescript
   const [toast, setToast] = useState(null);
   ```

3. **handleEdit() - plně funkční:**
   ```typescript
   const handleEdit = (id: string) => {
     router.push(`/account/offers/${id}/edit`);
   };
   ```
   - Přijímá ID nabídky (ne prázdná funkce)
   - Naviguje na edit route

4. **handleToggleStatus() - používá CRUD API:**
   ```typescript
   const handleToggleStatus = (id: string, currentStatus: string) => {
     const newStatus = currentStatus === "published" ? "paused" : "published";
     const result = setStatus(id, newStatus);
     if (result) {
       setOffers(getAllOffers());
       setToast({ message: "...", type: "success" });
     }
   };
   ```
   - Používá `setStatus()` místo manuální manipulace
   - Toast feedback

5. **handleDelete() - používá CRUD API:**
   ```typescript
   const handleDelete = (id: string, title: string) => {
     if (confirm(`Opravdu chcete smazat...`)) {
       deleteOffer(id);
       setOffers(getAllOffers());
       setToast({ message: "Nabídka byla smazána", type: "success" });
     }
   };
   ```
   - Používá `deleteOffer()` místo filter/save
   - Toast feedback

6. **Toast komponenta v JSX:**
   ```jsx
   {toast && <Toast ... />}
   ```

## 5. Upgrade app/(app)/account/offers/new/page.tsx

### Změny
1. **Používá createOffer() API:**
   ```typescript
   const newOffer = createOffer({
     title: formData.title,
     category: formData.category,
     city: formData.city || "Nespecifikováno",
     price: formData.price || "Cena na dotaz",
     status: formData.publishImmediately ? "published" : status,
   });
   ```

2. **Toast notifikace:**
   - "Nabídka publikována" / "Koncept uložen"
   - Error handling
   - Auto-redirect po 1.5s

## 6. Styling - globals.css

Přidána keyframe animace pro toast:

```css
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
```

## Testovací checklist

### 1. Přidání nabídky
- [ ] Otevřít /account/offers/new
- [ ] Vyplnit název: "Test nabídka"
- [ ] Vybrat kategorii: "Gastro"
- [ ] Vyplnit město: "Brno"
- [ ] Vyplnit cenu: "350 Kč"
- [ ] Kliknout "Publikovat"
- [ ] **Očekávaný výsledek:** Toast "Nabídka publikována", redirect, nabídka se objeví v tabulce

### 2. Editace nabídky
- [ ] V tabulce kliknout "Upravit" u jakékoliv nabídky
- [ ] **Očekávaný výsledek:** Formulář s předvyplněnými daty
- [ ] Změnit název na "Upravená nabídka"
- [ ] Změnit cenu na "999 Kč"
- [ ] Kliknout "Uložit změny"
- [ ] **Očekávaný výsledek:** Toast "Nabídka byla úspěšně upravena", redirect, změny viditelné v tabulce

### 3. Pozastavení nabídky
- [ ] U publikované nabídky kliknout "Pozastavit"
- [ ] **Očekávaný výsledek:** 
  - Toast "Nabídka pozastavena"
  - Badge změní barvu na žlutou s textem "Pozastaveno"
  - Tlačítko se změní na "Obnovit"

### 4. Obnovení nabídky
- [ ] U pozastavené nabídky kliknout "Obnovit"
- [ ] **Očekávaný výsledek:**
  - Toast "Nabídka obnovena"
  - Badge změní barvu na zelenou s textem "Publikováno"
  - Tlačítko se změní na "Pozastavit"

### 5. Smazání nabídky
- [ ] Kliknout "Smazat" u jakékoliv nabídky
- [ ] Potvrdit v dialogu
- [ ] **Očekávaný výsledek:** 
  - Toast "Nabídka byla smazána"
  - Nabídka zmizí z tabulky

### 6. Persistence (localStorage)
- [ ] Provést libovolné změny (přidat, upravit, smazat)
- [ ] Obnovit stránku (F5 / Ctrl+R)
- [ ] **Očekávaný výsledek:** Všechny změny zůstaly zachovány

### 7. Edge cases
- [ ] Zkusit editovat neexistující ID (např. /account/offers/999999/edit)
- [ ] **Očekávaný výsledek:** Error toast "Nabídka nebyla nalezena", redirect
- [ ] Zkusit vytvořit nabídku bez názvu
- [ ] **Očekávaný výsledek:** Error toast "Vyplňte název nabídky"

### 8. UX/UI
- [ ] Toast se automaticky zavře po 3 sekundách
- [ ] Toast lze zavřít manuálně tlačítkem ×
- [ ] Animace slide-up funguje plynule
- [ ] Všechny tlačítka mají hover efekt
- [ ] Formuláře mají focus stavy (modrý ring)

## Příklady použití CRUD API

### Vytvoření nabídky
```typescript
import { createOffer } from "@/lib/offers-storage";

const offer = createOffer({
  title: "Relaxační masáž",
  category: "Beauty & Wellbeing",
  city: "Praha",
  price: "590 Kč",
  status: "published"
});
console.log(offer.id); // "1732004361000"
```

### Načtení všech nabídek
```typescript
import { getAllOffers } from "@/lib/offers-storage";

const offers = getAllOffers();
console.log(offers.length);
```

### Načtení jedné nabídky
```typescript
import { getOffer } from "@/lib/offers-storage";

const offer = getOffer("123");
if (offer) {
  console.log(offer.title);
} else {
  console.log("Nenalezeno");
}
```

### Aktualizace nabídky
```typescript
import { updateOffer } from "@/lib/offers-storage";

const updated = updateOffer("123", {
  title: "Nový název",
  price: "650 Kč"
});
```

### Změna stavu
```typescript
import { setStatus } from "@/lib/offers-storage";

setStatus("123", "paused");  // Pozastaví nabídku
setStatus("123", "published");  // Obnoví nabídku
```

### Smazání nabídky
```typescript
import { deleteOffer } from "@/lib/offers-storage";

deleteOffer("123");
```

## Zachované funkce z předchozí verze

- ✅ Formulář /account/offers/new plně funkční
- ✅ localStorage persistence pod klíčem `aspeti_offers_v1`
- ✅ Vizuální design (sage paleta, barvy, layout)
- ✅ SSR kompatibilita (typeof window guards)
- ✅ Route struktura /account/offers
- ✅ Tabulka s řazením a statusy
- ✅ Placeholder nabídky při prvním načtení

## Nové funkce

- ✅ Kompletní CRUD API v lib/offers-storage.ts
- ✅ Editace nabídek na /account/offers/[id]/edit
- ✅ Toast notifikace pro všechny akce
- ✅ Error handling pro neexistující nabídky
- ✅ Loading stavy
- ✅ Konzistentní UX feedback

## Technické detaily

### localStorage struktura
```json
{
  "aspeti_offers_v1": [
    {
      "id": "1",
      "title": "Lash lifting + brow shape",
      "category": "Beauty & Wellbeing",
      "city": "Praha 1",
      "price": "690 Kč",
      "status": "published",
      "createdAt": "2025-11-15T10:30:00.000Z"
    }
  ]
}
```

### ID generování
- Používá `Date.now().toString()` pro unikátní ID
- Příklad: "1732004361000"
- Dostatečně unikátní pro localStorage aplikaci

### Error handling
- Všechny CRUD funkce mají try/catch
- Console logging pro debugging
- Graceful fallbacks (getInitialOffers)
- Null/undefined checks

## Soubory změněny

1. `lib/offers-storage.ts` - CRUD API
2. `components/Toast.tsx` - NOVÝ soubor
3. `app/globals.css` - animace
4. `app/(app)/account/offers/page.tsx` - upgrade tabulky
5. `app/(app)/account/offers/new/page.tsx` - upgrade formuláře
6. `app/(app)/account/offers/[id]/edit/page.tsx` - NOVÝ soubor

## Závěr

Všechny požadované funkce z S04 specifikace byly implementovány:
- ✅ Kompletní CRUD API
- ✅ Editace nabídek
- ✅ Toast notifikace
- ✅ Error handling
- ✅ Zachování všech existujících funkcí
- ✅ localStorage persistence

Aplikace je připravena k testování a deployment.
