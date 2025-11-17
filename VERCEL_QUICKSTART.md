# VERCEL DEPLOYMENT - RYCHLÝ NÁVOD

## ✅ Kód je na GitHubu
**Repository:** https://github.com/radekmikulik/aspeti-next-clean  
**Branch:** main

---

## 🚀 Nasazení na Vercel (5 minut)

### 1. Import projektu
1. Přejít na https://vercel.com
2. Kliknout **"Add New Project"**
3. Vybrat **"Import Git Repository"**
4. Najít a importovat `radekmikulik/aspeti-next-clean`

### 2. Konfigurace
```
Project Name:     aspeti-next-clean
Framework:        Next.js (auto-detected)
Root Directory:   ./
Node.js Version:  20.x  ⚠️ CRITICAL - MUSÍ BÝT 20.x!
```

Ostatní nastavení ponechat výchozí (Next.js je automaticky rozpoznán).

### 3. Deploy
- Kliknout **"Deploy"**
- Čekat 2-3 minuty na build
- Po dokončení získat production URL (např. `https://aspeti-next-clean.vercel.app`)

---

## ✅ Verifikace po nasazení

### HTTP Status Kódy
- `GET /` → 200
- `GET /account` → 200
- `GET /account/offers` → 200
- `GET /account/offers/new` → 200

### Funkční testy
1. **Homepage** (`/`): Kliknout "Přejít do účtu"
2. **Dashboard** (`/account`): Zkontrolovat 3 KPI karty + "Co zlepšit"
3. **Nabídky** (`/account/offers`): Zobrazit tabulku s 2 demo nabídkami
4. **Přidat nabídku** (`/account/offers/new`):
   - Vyplnit formulář
   - Kliknout "Publikovat"
   - Ověřit redirect na `/account/offers` s novou nabídkou
5. **localStorage persistence**:
   - Refresh stránky (F5)
   - Nová nabídka stále v tabulce ✅
6. **Akce s nabídkami**:
   - Kliknout "Pozastavit" → stav změní na "Pozastaveno"
   - Refresh → stav zůstává ✅
   - Kliknout "Smazat" → nabídka zmizí
   - Refresh → stále smazána ✅

---

## 📋 DOM Checklist (8 bodů)

- [ ] /account zobrazuje "Můj účet", 3 KPI karty a blok "Co zlepšit"
- [ ] Všechny účetní stránky mají AccountTopbar s "poskytovatelský účet" a vlevo sidebar
- [ ] /account/offers zobrazuje tabulku s demo nabídkami (min. 2 řádky)
- [ ] Tlačítko "Přidat nabídku" → /account/offers/new
- [ ] Formulář /account/offers/new + po "Publikovat" se nabídka objeví v tabulce
- [ ] Po refreshi /account/offers zůstávají přidané nabídky (localStorage persistence)
- [ ] Akce "Pozastavit/Obnovit" mění stav v tabulce a ukládá se
- [ ] Akce "Smazat" odstraní nabídku a zůstane smazana po refresh

**Po otestování všechny body označit jako splněné.**

---

## ⚠️ Řešení problémů

### Build Failed: Node Version
**Problém:** `You are using Node.js 18.x. For Next.js, Node.js version ">=20.9.0" is required.`  
**Řešení:** V Vercel Project Settings → General → Node.js Version → změnit na **20.x**

### Build Failed: pnpm not found
**Problém:** Vercel nerozpoznal pnpm  
**Řešení:** V Project Settings → General → Install Command → změnit na `npm install`

---

## 📄 Další dokumentace

- **S03_FINAL_REPORT.md** - Kompletní report projektu
- **DEPLOYMENT.md** - Detailní deployment instrukce
- **README.md** - Projekt dokumentace

---

**MiniMax Agent** | 2025-11-18
