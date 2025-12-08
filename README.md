# 🎬 Filmotéka

Mobilní aplikace pro správu filmů a seriálů postavená na Ionic Framework (Angular) s Firebase backend.

> ⚠️ **DŮLEŽITÉ UPOZORNĚNÍ**: Tato aplikace je **školní projekt** určený pouze pro demonstrační a vzdělávací účely. API klíče jsou zahrnuti pro usnadnění testování, ale **PROSÍM NEZNEUŽÍVEJTE JE**. Jakékoliv zneužití může vést k zablokování služeb. Děkuji za pochopení a respekt.

<img width="200" height="200" alt="logo-square" src="https://github.com/user-attachments/assets/89c62ccd-973c-4f3b-b8c4-ad2809fefd7f" />

## 📱 O aplikaci

Filmotéka je moderní mobilní aplikace, která umožňuje uživatelům procházet databázi filmů a seriálů, organizovat je do vlastních seznamů a sledovat svou sledovanost. Aplikace využívá **TMDB API** pro získání informací o filmech a **Firebase** pro autentizaci a ukládání dat.

### ✨ Hlavní funkce

- 🎥 **Procházení filmů a seriálů** - populární, nejlépe hodnocené, nadcházející
- 📖 **Detailní informace** - popis, hodnocení, herci, štáb
- 🔍 **Vyhledávání** - rychlé vyhledávání s debounce
- 📋 **Vlastní seznamy** - vytváření a správa vlastních seznamů
- ✅ **Výchozí seznamy** - "Zhlédnuto" a "Chci vidět"
- 🌙 **Tmavý režim** - přepínání mezi světlým a tmavým tématem
- 🔐 **Autentizace** - přihlášení, registrace, změna hesla
- 📱 **Responzivní design** - optimalizováno pro různé velikosti obrazovek
- ♾️ **Infinite scroll** - plynulé načítání dalších filmů

## 🚀 Technologie

- **Framework**: Ionic 8 + Angular 20
- **Jazyk**: TypeScript
- **Backend**: Firebase (Authentication + Firestore)
- **API**: TMDB (The Movie Database)
- **Styling**: SCSS + CSS variables
- **Build**: Capacitor 7 (pro Android/iOS)

## 📋 Požadavky

- **Node.js** >= 18.x
- **npm** nebo **yarn**
- **Angular CLI** >= 20.x
- **Ionic CLI** >= 7.x

### Volitelné (pro mobilní build):
- **Android Studio** (pro Android build)
- **Xcode** (pro iOS build, pouze macOS)

## 🔧 Instalace

### 1. Klonování repozitáře
```bash
git clone https://github.com/Mikydosh/AP5PM_Filmoteka.git
cd .\AP5PM_Filmoteka\
```

### 2. Instalace závislostí
```bash
npm install
```

### 3. Konfigurace API klíčů

> ⚠️ **ŠKOLNÍ PROJEKT - PROSÍM O RESPEKT**: API klíče níže jsou sdíleny **POUZE** pro usnadnění testování a plug and play spuštění tohoto školního projektu. **NEZNEUŽÍVEJTE JE, PROSÍM**. Při zneužití budou klíče deaktivovány a projekt přestane fungovat.

Soubor `src/environments/environment.ts` je již nakonfigurován s těmito hodnotami:
```typescript
export const environment = {
  production: false,
  tmdbApiKey: '0d147ba1d4464d1ceec758e2a54e450e',
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p',
  
  firebase: {
    apiKey: "AIzaSyA227g1cTb4D52aPSFENRuXph8HY79Q0Ns",
    authDomain: "filmoteka-ebe17.firebaseapp.com",
    projectId: "filmoteka-ebe17",
    storageBucket: "filmoteka-ebe17.firebasestorage.app",
    messagingSenderId: "880867438842",
    appId: "1:880867438842:web:abca5fc6419972e8085943"
  }
};
```

> 📝 **Poznámka**: Tyto konfigurace jsou již zahrnuty v repozitáři. Nemusíš nic měnit pro základní fungování aplikace a stačí pokračovat bodem č. **5**. 

> **Pro svůj vlastní účet doporučuji požádat o vlastní API klíče: [Jak získat vlastní API klíče](#jak-získat-vlastní-api-klíče)**
- **TMDB API**: Registruj se na [themoviedb.org](https://www.themoviedb.org/) a získej API klíč v nastavení účtu (je potřeba vyplnit formulář a zdůraznit, že se jedná o vlastní potřebu, školní projekt atd.
- **Firebase**: Vytvoř projekt na [firebase.google.com](https://firebase.google.com/) a zkopíruj konfiguraci:

### 4. Firebase nastavení

1. Vytvoř Firebase projekt
2. Aktivuj **Authentication** (Email/Password provider)
3. Vytvoř **Firestore Database**
4. Nastav Firestore pravidla:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
## 🏃 Spuštění

### Vývojový server (web) - pouze webová aplikace
```bash
ionic serve
```

Aplikace poběží na `http://localhost:8100`

### První přihlášení

Můžeš si vytvořit nový účet přímo v aplikaci pomocí:
1. Klikni na "Registrovat se"
2. Zadej email a heslo (min. 6 znaků)
3. Po registraci budeš automaticky přihlášen

### Build pro Android
```bash
ctrl+C // pro zastavení serveru (pokud byl spuštěn příkaz ionic serve)
ionic build
ionic cap add android // -> V na githubu už je, není potřeba psát. Jinak přepíše složku /android, kde jsou vlastní ikony atd.
ionic cap sync android
ionic cap open android
```

Otevře se Android Studio → spusť na emulátoru nebo fyzickém zařízení.

### Android studio
1. Počkat, až se všechno načte
2. Pokud bude nahoře šedá ikona ▶️ a text "Edit Configurations":
   - Kliknout na ikonu **Slona s šipkou** (Sync Project with Gradle Files)
   - Pokud ani to nepomůže, je nutné nastavit konfiguraci

**Kofigurace:**
- Klikni na "Edit Configurations..."
- Klikni na „+“ (Add New Configuration) a vyber Android Application.
- V poli Module vyber `app` (nebo název modulu)
- Dej konfiguraci nějaké jméno (např. „app“)
- Apply -> OK

## 📁 Struktura projektu
```
filmoteka/
├── src/
│   ├── app/
│   │   ├── guards/           # Auth guard
│   │   ├── models/           # TypeScript interfaces
│   │   ├── pages/            # Stránky aplikace
│   │   │   ├── movies/       # Seznam filmů
│   │   │   ├── series/       # Seznam seriálů
│   │   │   ├── lists/        # Uživatelské seznamy
│   │   │   ├── settings/     # Nastavení
│   │   │   ├── login/        # Přihlášení
│   │   │   ├── movie-detail/ # Detail filmu
│   │   │   ├── series-detail/# Detail seriálu
│   │   │   └── list-detail/  # Detail seznamu
│   │   ├── services/         # Services (API, Firebase)
│   │   └── tabs/             # Tab navigace
│   ├── environments/         # Environment konfigurace
│   ├── theme/                # SCSS styly a CSS variables
│   └── assets/               # Obrázky, loga
├── android/                  # Android build
├── ios/                      # iOS build (na macOS)
└── capacitor.config.ts       # Capacitor konfigurace
```

## 🎨 Screenshoty
> Screenshoty jsou pořízené z emulátoru pro telefon Google Pixel 9 Pro, tvůj vzhled se může lišit v závislosti na typu zařízení, rozlišení, poměru stran atd.

<img width="300" alt="login" src="https://github.com/user-attachments/assets/7db8c259-bf9f-4e9a-96fe-0eb5ab78b0b2" />
<img width="300" alt="filmy" src="https://github.com/user-attachments/assets/d4f61626-8232-4be8-a091-6a60c589cfa0" />
<img width="300"  alt="detail" src="https://github.com/user-attachments/assets/4e0d3c9f-f2e3-4571-b961-659ae5c14366" />
<img width="300"  alt="seznamy" src="https://github.com/user-attachments/assets/4b59af68-15da-42ab-aa96-8b9154012c68" />
<img width="300"  alt="nastaveni" src="https://github.com/user-attachments/assets/b2c46609-dd9a-4b85-be3e-37b8a3028041" />

## 🔑 Klíčové funkce aplikace

### Autentizace
- Registrace nového uživatele
- Přihlášení pomocí emailu a hesla
- Změna hesla
- Reset hesla emailem
- Odhlášení

### Filmy a seriály
- 3 kategorie: Populární, Nejlépe hodnocené, Nadcházející/Vysílané
- Infinite scroll pro plynulé načítání
- Vyhledávání s debounce (300ms)
- Detail s informacemi, herci, štábem
- Rating s barevným kruhovým indikátorem

### Seznamy
- 2 výchozí seznamy: "Zhlédnuto" a "Chci vidět"
- Vytváření vlastních seznamů
- Přidávání/odebírání filmů a seriálů
- Vizuální indikace (checkmarky) kde je film uložen
- Možnost smazání vlastních seznamů

### Nastavení
- Přepínání tmavého/světlého režimu
- Změna hesla
- Vymazání všech dat
- Odhlášení


## 📝 Poznámky

- **TMDB API** má rate limit 50 requestů/sekundu
- **Firebase** má free tier limit (50k reads/day)
- Aplikace používá **localStorage** pro uložení preference dark mode
- **Firestore** ukládá data pod strukturou `users/{userId}/lists/{listId}`

## ⚠️ Důležité upozornění o API klíčích

> **ŠKOLNÍ PROJEKT**: Tento repozitář obsahuje API klíče **POUZE** pro účely demonstrace a testování školního projektu. Klíče jsou sdíleny s důvěrou, že nebudou zneužity.
> 
> **PROSÍM:**
> - ❌ Nepoužívejte tyto klíče pro vlastní komerční projekty
> - ❌ Nesdílejte tyto klíče dále
> - ❌ Neprovádějte nadměrné množství requestů
> - ✅ Používejte aplikaci pouze pro testování a vzdělávací účely
> - ✅ Pokud chcete vlastní verzi, vytvořte si vlastní TMDB a Firebase účty
>
> Při zneužití budou klíče **okamžitě deaktivovány** a aplikace přestane fungovat pro všechny. Děkuji za pochopení a respekt! 🙏

### Jak získat vlastní API klíče

Pokud chceš vytvořit vlastní verzi:

1. **TMDB API**: 
   - Registruj se na [themoviedb.org](https://www.themoviedb.org/)
   - Jdi do Settings → API
   - Požádej o API klíč (zdarma)

2. **Firebase**: 
   - Vytvoř projekt na [firebase.google.com](https://firebase.google.com/)
   - Aktivuj Authentication (Email/Password)
   - Vytvoř Firestore Database
   - Zkopíruj konfiguraci do `environment.ts`

## 👤 Autor

**Michal Dolanský**
- UTB FAI, SWI, 3. ročník
