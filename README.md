⚠️ ARCHIVE WARNING
====================
Tento repozitář je označen jako **ARCHIVNÍ** a není nadále aktivně udržován.

**ℹ️ Aktuální oficiální repozitář pro ASPETI aplikaci je:**
👉 https://github.com/radekmikulik/aspeti-next-app

**🔗 Pro aktuální produkční deployment použijte:**
👉 Vercel: `aspeti-next-clean-prod`

**📖 Detailní informace:** Čtěte `INFRA_SINGLE_SOURCE_OF_TRUTH.md` v hlavním repozitáři

---

> **Tento repozitář může být v budoucnu archivován nebo smazán.**  
> **Pro nový vývoj používjte pouze oficiální repozitář:** `radekmikulik/aspeti-next-app`

---

# aspeti-next-clean

Poskytovatel služeb ČSNěk Aplikace pro ASPETi - Next.js App Router projekt s localStorage

## 🗂️ Přehled

Toto je projekt aplikace ASPETi pro správnu nabídkovky s poskytovateli.
Projekt obsahuje:

- Dashboard s KPI metrikami
- Správa nabídek s localStorage perzistencí
- Formulář pro nové nabídky
- 7 studií stranek pro budoucí funkce
- ASPETi sage design palety (#F5F7F6, #CAD0D0, #D2DED8, #C8D6CF, #E7EFEA)

## 🔧 Technologie

- **Next.js** 16.0.3 (App Router)
- **React** 19.2.0
- **TypeScript** 5.9.3
- **Tailwind CSS** 4.1.17
- **Node.js** >=20.9.0 (REQUIRED)

## 📂 Struktura projektu

```bash
app/
  (app)/
    account/
      page.tsx                    # Route group pro poskytovatelské stránky
      layout.tsx                  # AccountTopbar + level sidebar
      page.tsx                    # Dashboard s KPI
      offers/
        page.tsx                  # Tabulka nabídek (localStorage)
        new/page.tsx              # Formulář nové nabídky
        [7 stub stráněk]          # messages, reservations, vip, stats, billing, profile, settings
    
    layout.tsx                    # Root layout (cs-CZ)
    page.tsx                      # Homepage
    globals.css                   # Sage bartry

components/
  AccountTopbar.tsx               # Top navigace
  AccountSidebar.tsx              # Levé menu (9 položek)

lib/
  offers-storage.ts               # localStorage API (aspeti_offers_v1)
```

## 🚀 Funkce

### 📊 Dashboard (/account)
- 3 KPI karty: Zobrazení (480), Kličky (97), Rezervace (3)
- Blok "Co zlepšit" s 3 doporučeními

### 📝 Správa nabídek (/account/offers)
- Tabulka s demo nabídkami
- Akce: Upráhvit, Pozastavit/Obnosit, Smazat
- localStorage perzistence

### 🆕 Formulář (/account/offers/new)
- Vstupy: Názeh, Kategorie, Město, Cena, Čekboxy (VIP známe, Obrátěk pověst), Telefon (kontakt)
- Submit/Reset

### 👨‍💻 Lokální development

```bash
# Instalace závislostí
npm install

# Development server
npm run dev

# Build (vyžaduje Node >=20.9.0)
npm run build

# Production server
npm start
```

> **Požadovaná verze:** Node.js 20.x nebo novější.

## 🛠️ Deployment na Vercel

### 🚀 Automatický deployment (vercel credentials)

```bash
# Nastavte environment proměnné
export GITHUB_TOKEN="ghp_..."
export VERCEL_TOKEN="..."
export VERCEL_USER_ID="..."

# Spustí deployment skript
python3 deploy.py
```

### 📦 Manuel deployment

1. **GitHub:**
   ```bash
   git remote add origin https://github.com/radekmikulik/aspeti-next-clean.git
   git branch -M main
   git push -u origin main
   ```

2. **Vercel:**
   - Import repo z GitHub
   - Framework Preset: **Next.js**
   - Node.js Version: **20.x** (KRITICKÉ!)
   - Build Command: `next build` (default)
   - Output Directory: `.next` (default)

Detaily instrukce: viz [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📝 localStorage Schema

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

## 🗺️ Demo nabídky

Projekt obsahuje 2 demo nabídky:
1. "Lash lifting + brow shape" - Praha 1, 690 Kč
2. "Masáž zad 45 min" - Brno, 590 Kč

## 🎨 Design palety

- **Background:** #F5F7F6
- **Sage borders:** #D2DED8, #CAD0D0, #C8D6CF
- **Sage highlights:** #E7EFEA
- **Text:** Navy blue (#1e3a8a)

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 📜 Licence

Privátní projekt - ASPETi

## 👤 Autor

MiniMax Agent | 2025-11-18
