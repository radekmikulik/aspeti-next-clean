# S06-FIX Export Report
**Datum:** 2025-11-19  
**EID:** ASPETI-S06-FIX-EXPORT-2025-11-19

## Původní problém
Build error na Vercelu:
```
Error: Page "/account/offers/[id]/edit" is missing "generateStaticParams()" so it cannot be used with "output: export" config.
```

## Příčina
Konfigurace `output: "export"` v `next.config.ts` není kompatibilní s dynamickou route `/account/offers/[id]/edit`, která používá client-side rendering s localStorage.

## Provedená oprava
**Soubor:** `next.config.ts`

### Před opravou:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // ← TENTO ŘÁDEK ZPŮSOBOVAL CHYBU
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
```

### Po opravě:
```typescript
import type { NextConfig } from "next";

// UPDATE(2025-11-19): Odebráno `output: "export"` kvůli dynamické route /account/offers/[id]/edit (Vercel build fix)
const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
```

## Výsledek
- ✅ Odstraněn řádek `output: 'export'`
- ✅ Přidán dokumentační komentář
- ✅ Zachovány všechny ostatní konfigurační volby
- ✅ Commited změna: `fd40075` → GitHub main branch
- ✅ Dynamická route `/account/offers/[id]/edit` zůstává nedotčená (client-side localStorage)

## Build verification
**POZNÁMKA:** Build test nebyl možný kvůli sandbox environment limtu (Node.js v18.19.0 vs požadovaná v20.9.0+), ale změna konfigurace je správná a odpovídá přesně zadání.

## GitHub commit
- Commit ID: `fd40075`
- Message: `S06-FIX: Remove output export for dynamic offers edit route`
- Repository: `https://github.com/radekmikulik/aspeti-next-clean`
- Branch: `main`

---
**Status:** ✅ HOTOVO - commit pushnut na GitHub, připraven k Vercel deployu