# Deployment instrukce - aspeti-next-clean

## GitHub Repository

1. Vytvořit nový repozitář: `radekmikulik/aspeti-next-clean`
   - Visibility: Private
   - Branch: `main`
   - ŽÁDNÝ README, .gitignore, license (už jsou v projektu)

2. Push lokálního projektu:
```bash
cd /workspace/aspeti-next-clean
git remote add origin https://github.com/radekmikulik/aspeti-next-clean.git
git branch -M main
git push -u origin main
```

## Vercel Deployment

### Vytvoření projektu

1. Přihlásit se na https://vercel.com
2. Kliknout "Add New Project"
3. Import Git Repository: `radekmikulik/aspeti-next-clean`

### Konfigurace buildu

| Setting | Value |
|---------|-------|
| **Project Name** | aspeti-next-clean |
| **Framework Preset** | Next.js |
| **Root Directory** | `.` (default) |
| **Build Command** | `next build` (default) |
| **Install Command** | `pnpm install` nebo `npm install` |
| **Output Directory** | `.next` (default) |
| **Node.js Version** | **20.x** (CRITICAL!) |

### Environment Variables

ŽÁDNÉ environment variables nejsou potřeba - projekt je čistě frontend s localStorage.

### Deploy

1. Kliknout "Deploy"
2. Počkat na build (očekávaný čas: 2-3 minuty)
3. Build by měl být úspěšný s Node 20.x

## Expected Build Log

```
Cloning radekmikulik/aspeti-next-clean...
Installing dependencies with pnpm...
Building Next.js application...
Route (app)                     Size     First Load JS
┌ ○ /                          142 B          87.3 kB
├ ○ /_not-found                873 B          86.1 kB
└ ƒ /account                   ...
  ├ ƒ /account/offers          ...
  └ ƒ /account/offers/new      ...

○  (Static)  prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

Build completed successfully
```

## Verifikace po deployment

### HTTP Status Codes
- `GET /` → 200
- `GET /account` → 200
- `GET /account/offers` → 200
- `GET /account/offers/new` → 200
- `GET /account/messages` → 200
- `GET /account/settings` → 200

### Funkční testy
1. Otevřít production URL
2. Kliknout "Přejít do účtu"
3. Přidat novou nabídku přes formulář
4. Refresh stránky → nabídka zůstává (localStorage)
5. Pozastavit nabídku → stav se uloží
6. Smazat nabídku → zmizí i po refreshi

## Troubleshooting

### Build Failed: Node Version
**Problém:** `You are using Node.js 18.x. For Next.js, Node.js version ">=20.9.0" is required.`  
**Řešení:** V Vercel Project Settings → General → Node.js Version → změnit na **20.x**

### Build Failed: pnpm not found
**Problém:** Vercel nerozpoznal pnpm  
**Řešení:** V Project Settings → General → Install Command → změnit na `npm install`

### Runtime Error: localStorage not defined
**Problém:** localStorage není dostupný při SSR  
**Řešení:** Zkontrolovat `lib/offers-storage.ts` - mělo by obsahovat `if (typeof window === "undefined")`

## Next.js Config

Výchozí konfigurace je správná:

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ŽÁDNÉ output: 'export' - používáme SSR/CSR
};

export default nextConfig;
```

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

## Očekávaná Production URL

```
https://aspeti-next-clean.vercel.app
```

nebo

```
https://aspeti-next-clean-<hash>.vercel.app
```

---

**POZNÁMKA:** Lokální build selhává kvůli Node 18, ale Vercel build s Node 20.x bude fungovat správně.
