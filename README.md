# aspeti-next-clean

Poskytovatelský účet ASPETi - Next.js App Router projekt s localStorage

## Přehled

Toto je aplikační část ASPETi pro správu nabídek poskytovatelů. Projekt obsahuje:

- Dashboard s KPI metrikami
- Správa nabídek s localStorage persistence
- Formulář pro přidání nových nabídek
- 7 stub stránek pro budoucí funkce
- ASPETi sage design paleta (#F5F7F6, #CAD8D0, #D2DED8, #C8D6CF, #E7EFEA)

## Technologie

- **Next.js** 16.0.3 (App Router)
- **React** 19.2.0
- **TypeScript** 5.9.3
- **Tailwind CSS** 4.1.17
- **Node.js** >=20.9.0 (REQUIRED)

## Struktura projektu

```
app/
├── (app)/account/          # Route group pro poskytovatelský účet
│   ├── layout.tsx          # AccountTopbar + levý sidebar
│   ├── page.tsx            # Dashboard s KPI
│   ├── offers/
│   │   ├── page.tsx        # Tabulka nabídek (localStorage)
│   │   └── new/page.tsx    # Formulář nové nabídky
│   └── [7 stub stránek]    # messages, reservations, vip, stats, billing, profile, settings
├── layout.tsx              # Root layout (cs-CZ)
├── page.tsx                # Homepage
└── globals.css             # Sage barvy

components/
├── AccountTopbar.tsx       # Top navigace
└── AccountSidebar.tsx      # Levé menu (9 položek)

lib/
└── offers-storage.ts       # localStorage API (aspeti_offers_v1)
```

## Funkce

### Dashboard (/account)
- 3 KPI karty: Zobrazení (482), Kliky (97), Rezervace (3)
- Blok "Co zlepšit" se 3 doporučeními

### Správa nabídek (/account/offers)
- Tabulka s demo nabídkami
- Akce: Upravit, Pozastavit/Obnovit, Smazat
- localStorage persistence

### Formulář (/account/offers/new)
- Vstupy: Název, Kategorie, Město, Cena, Popis
- Checkboxy: VIP zvýraznění, Okamžitě publikovat
- Tlačítka: Uložit koncept, Publikovat

## Lokální development

```bash
# Instalace závislostí
pnpm install

# Development server
pnpm dev

# Build (vyžaduje Node >=20.9.0)
pnpm build

# Production server
pnpm start
```

**POZNÁMKA:** Lokální build vyžaduje Node.js 20.x nebo vyšší.

## Deployment na Vercel

### Automatický deployment (vyžaduje credentials)

```bash
# Nastavit environment variables
export GITHUB_TOKEN="ghp_..."
export VERCEL_TOKEN="..."
export VERCEL_USER_ID="..."

# Spustit deployment skript
python3 deploy.py
```

### Manuální deployment

1. **GitHub:**
   ```bash
   git remote add origin https://github.com/radekmikulik/aspeti-next-clean.git
   git branch -M main
   git push -u origin main
   ```

2. **Vercel:**
   - Importovat repo z GitHubu
   - Framework Preset: **Next.js**
   - Node.js Version: **20.x** (CRITICAL!)
   - Build Command: `next build` (default)
   - Output Directory: `.next` (default)

Detailní instrukce: viz [DEPLOYMENT.md](./DEPLOYMENT.md)

## localStorage Schema

```typescript
// Key: aspeti_offers_v1
interface Offer {
  id: string;
  title: string;
  category: string;
  city: string;
  price: string;
  status: "draft" | "published" | "paused";
  createdAt: string; // ISO 8601
}
```

## Demo nabídky

Projekt obsahuje 2 demo nabídky:
1. "Lash lifting + brow shape" - Praha 1, 690 Kč
2. "Masáž zad 45 min" - Brno, 590 Kč

## Design paleta

- **Background:** #F5F7F6
- **Sage borders:** #D2DED8, #CAD8D0, #C8D6CF
- **Sage highlights:** #E7EFEA
- **Text:** Navy blue (#1e3a8a)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

Private project - ASPETi

## Autor

MiniMax Agent | 2025-11-18
