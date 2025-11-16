 Lost & Found App – React Native (Expo + Firebase)

Aplikacion mobil për raportimin e sendeve të humbura, sendeve të gjetura, dhe gjetjen e përputhjeve të mundshme mes tyre duke përdorur Firestore dhe një algoritëm inteligjent krahasimi.

Ky projekt është zhvilluar si pjesë e Faza 2 – Programim, dhe përfshin funksionalitete reale të një sistemi të avancuar Lost & Found.

Funksionalitetet Kryesore
🔹 1. Raportimi i Sendeve të Humbura

Përdoruesi mund të:

shtojë një send të humbur

vendos emër, përshkrim, kategori

përzgjedh lokacionin (manual + GPS)

ngarkojë fotografi (Kamera ose Galeri)

ruajë koordinatat e GPS

fshijë sendet e tij

shohë listën e sendeve të humbura në Firestore

🔹 2. Raportimi i Sendeve të Gjetura

Përdoruesi mund të:

shtojë një send të gjetur

vendos lokacionin ku është gjetur

ngarkojë fotografi

ruajë kategorinë dhe datën

shohë sendet që ka gjetur vetë

🔹 3. Algoritmi i Përputhjes (Matching)

Aplikacioni përdor një algoritëm që llogarit pikë përputhjeje duke analizuar:

✔️ Ngjashmërinë e emrit

✔️ Ngjyrat/kategorinë

✔️ Ngjashmërinë e lokacionit

✔️ Distancën mes fjalëve

Çdo send i humbur krahasohet me sendet e gjetura të përdoruesve tjerë.
Përputhjet renditen sipas rezultatëve të pikëve (score descending).

Autentikimi

Aplikacioni përdor Firebase Authentication për:

regjistrim / login

ruajtjen e user.uid

ndarjen e të dhënave të përdoruesve

bllokimin e ekraneve pa hyrje

Menaxhimi bëhet me AuthContext.

Sistemi i Temave (Light & Dark Mode)

Aplikacioni përdor ThemeProvider, i cili ofron:

zbulim automatik të temës së telefonit

mundësi për ta ndryshuar temën manualisht

ngjyra dinamike për:

sfond

tekst

karta

butona

borderat

Krejt stilet gjenerohen me:

const styles = createStyles(theme);

Lokacioni & GPS

Përdoret Expo Location për:

marrjen e lokacionit aktual

konvertimin e koordinatave → adresë (reverse geocoding)

fallback automatik në koordinata nëse adresa nuk gjendet

Përdoruesi merr njoftim kur lokacioni vendoset me sukses.

📸 Fotografitë

Duke përdorur Expo ImagePicker, aplikacioni mund:

të hap kamerën

të hapë galerine e telefonit

të editojë foton

të ruajë uri në Firestore

të shfaqë preview

të heqë fotografinë

🛠 Teknologjitë e Përdorura
Frontend

React Native (Expo)

Expo Router

Expo ImagePicker

Expo Location

React Navigation

Context API

Backend

Firebase Auth

Firebase Firestore

Firestore Queries (where, orderBy)

Firestore Aggregation (getCountFromServer)

Sherbimet Firestore (services/firestoreService.js)

Përfshin:

Për Sendet e Humbura

addLostItem()

getUserLostItems()

getUserLostItemsCount()

deleteItem()

Për Sendet e Gjetura

addFoundItem()

getUserFoundItems()

getUserFoundItemsCount()

Përputhjet

getPotentialMatches()

getPotentialMatchesOptimized()

Algoritmi përdor funksione ndihmëse:

calculateMatchScore()

stringSimilarity()

checkLocationSimilarity()

getMatchReason()

📁 Struktura e Projektit
FAZA2-PROGRAMIM/
 ├─ app/
 │   ├─ _layout.jsx
 │   ├─ about.jsx
 │   ├─ add-Item.jsx
 │   ├─ found-Item.jsx
 │   ├─ login.jsx
 │   ├─ matches.jsx
 │   ├─ settings.jsx
 │   └─ index.jsx
 │
 ├─ assets/
 │   ├─ adaptive-icon.png
 │   ├─ favicon.png
 │   ├─ icon.png
 │   ├─ no-image.jpg
 │   └─ splash-icon.png
 │
 ├─ components/
 │   ├─ CategorySelector.jsx
 │   ├─ ItemCard.jsx
 │   └─ NavBar.jsx
 │
 ├─ config/
 │   └─ firebase.js
 │
 ├─ contexts/
 │   ├─ AuthContext.jsx
 │   └─ ThemeContext.jsx
 │
 ├─ services/
 │   ├─ firestoreService.js
 │   └─ weatherService.js
 │
 ├─ app.json
 ├─ index.js
 ├─ package.json
 ├─ package-lock.json
 └─ README.md


✅ Përfundim

Aplikacioni ofron një sistem të plotë Lost & Found, duke përfshirë raportim, menaxhim, krahasim të të dhënave dhe ndërfaqe moderne me temë dinamike.

Anetaret e grupit:
- Aurela Hasanaj
- Delvina Elshani
- Jon Rexha
- Leart Balidemaj
- Mehmed Kocinaj
