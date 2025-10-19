# Find Lost Things

Find Lost Things është një aplikacion mobil i zhvilluar me React Native (Expo), i cili synon të ndihmojë përdoruesit të raportojnë dhe të gjejnë sende të humbura në mënyrë të shpejtë, të lehtë dhe të organizuar.
Ky projekt synon të lehtësojë procesin e gjetjes së sendeve të humbura, duke ofruar një ndërfaqe miqësore dhe intuitive ku përdoruesit mund të raportojnë, kërkojnë dhe menaxhojnë informacionin për sendet e tyre me lehtësi.

```
Struktura e aplikacionit:
📁 Find-Lost-Things/
├── app/
│ ├── _layout.jsx
│ ├── index.jsx
│ ├── addItem.jsx
│ ├── foundItem.jsx
│ ├── profile.jsx
│ └── about.jsx
│
├── components/
│ ├── CategorySelector.jsx
│ ├── ItemCard.jsx
│ └── NavBar.jsx
│
├── assets/
│
├── App.js
├── package.json
└── README.md
```

Aplikacioni përbëhet nga disa ekrane kryesore:

- **Home (index.jsx)**  
  Ekrani kryesor; përdoruesi mund të navigojë drejt faqeve të tjera: raportimi i sendeve, sendet e gjetura, profili dhe faqja për informacion.
- **AddItem (addItem.jsx)**  
  Ekran për raportimin e sendeve të humbura; përdoruesi plotëson emrin, përshkrimin, lokacionin dhe kategorinë.
- **FoundItem (foundItem.jsx)**  
  Ekran për raportimin e sendeve të gjetura dhe për kërkim/filter në listë.
- **Profile (profile.jsx)**  
  Menaxhimi i profileve të përdoruesve, me mundësi shtimi dhe fshirjeje.
- **About (about.jsx)**  
  Përshkruan qëllimin e projektit, misionin, kategoritë dhe jep informata kontaktuese.

Teknologjitë e përdorura

- React Native dhe Expo Router për navigim
- SafeAreaView, ScrollView, FlatList për strukturë dhe shfaqje të dhënash
- Ionicons për ikona
- Komponentë të personalizuar: NavBar, CategorySelector, ItemCard

Udhëzime për nisjen e projektit

# Parakushtet

- Node.js i instaluar
- Expo CLI
- Aplikacioni Expo Go në telefon _(opsional)_

---

## 1. Instalo Expo CLI

npm install -g expo-cli

## 2. Instalo Dependencies

npm install

## 3. Nise serverin

npm install dhe skano QR-code me Expo Go

Zhvilluesit:

- Aurela Hasanaj
- Delvina Elshani
- Jon Rexha
- Leart Balidemaj
- Mehmed Kocinaj
