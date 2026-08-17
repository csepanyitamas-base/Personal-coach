# FitCoach – személyes fitness coach

Kérdőív alapján összeállított, személyre szabott edzésterv, edzésnapi emlékeztetők, edzéskövetés (tracking), haladás-grafikonok és motiváció – mind egyetlen, kliens-oldali webalkalmazásban. Nincs szükség szerverre vagy fiókra: minden adat a böngésződben, a `localStorage`-ban tárolódik.

## Funkciók

- **Kérdőíves onboarding** – cél (fogyás / izomépítés / erő / állóképesség / általános fittség), edzésszint, elérhető edzésnapok, felszerelés, fókuszterületek és sérülések/korlátozások alapján generál egyedi edzéstervet.
- **Szabály alapú tervgenerátor** – a válaszok alapján automatikusan választ edzésfelosztást (teljes test / húzó-toló-láb / felső-alsó test stb.), gyakorlatokat, szett- és ismétlésszámokat.
- **Edzésnapi emlékeztetők** – a böngésző Notification API-ján keresztül, a beállított időpontban, ha aznap még nem végeztél edzést.
- **Edzéskövetés** – szettenkénti ismétlés- és súlynaplózás, haladásjelző, hangulat-visszajelzés edzés után.
- **Haladás és motiváció** – jelenlegi és leghosszabb sorozat (streak), heti edzésszám és terhelés grafikonok, testsúly-napló, feloldható jelvények, napi motivációs idézetek.

## Technológia

- [Vite](https://vite.dev/) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) a designhoz
- [React Router](https://reactrouter.com/) (hash-alapú routing, statikus hosztolásra is alkalmas)
- [Recharts](https://recharts.org/) a grafikonokhoz
- [lucide-react](https://lucide.dev/) ikonokhoz
- Adattárolás: böngésző `localStorage` (nincs backend)

## Fejlesztés

```bash
npm install
npm run dev
```

Az alkalmazás ezután elérhető a megjelenő helyi címen (alapértelmezetten `http://localhost:5173`).

### Build

```bash
npm run build
npm run preview
```

A `npm run build` egy statikus `dist/` mappát hoz létre, amit bármilyen statikus fájl-hosztingon (Netlify, Vercel, GitHub Pages stb.) el lehet helyezni.

## Megjegyzés az emlékeztetőkről

Az emlékeztetők a böngésző Notification API-ját használják, amíg az alkalmazás lapja meg van nyitva (vagy háttérben fut a böngészőben). Mivel nincs szerver oldali push-szolgáltatás, teljesen bezárt böngésző esetén nem érkezik értesítés – nyisd meg az appot a nap folyamán, hogy időben figyelmeztessen.

## Adatvédelem

Minden adat (profil, edzésterv, edzésnapló, testsúly) kizárólag a saját böngésződ `localStorage`-ában tárolódik, semmi nem kerül elküldésre külső szerverre. A Beállítások oldalon bármikor törölhető.
