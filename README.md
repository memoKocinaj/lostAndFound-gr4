Find Lost Things

Find Lost Things është një aplikacion mobil i zhvilluar me React Native (Expo), i cili synon të ndihmojë përdoruesit të raportojnë dhe të gjejnë sende të humbura në mënyrë të shpejtë, të lehtë dhe të organizuar.
Ky projekt synon të lehtësojë procesin e gjetjes së sendeve të humbura, duke ofruar një ndërfaqe miqësore dhe intuitive ku përdoruesit mund të raportojnë, kërkojnë dhe menaxhojnë informacionin për sendet e tyre me lehtësi.


Struktura e aplikacionit
📁 Find-Lost-Things/
├── app/
│   ├── _layout.jsx             – kontrollon navigimin kryesor (Stack Navigation) të aplikacionit, definon ekranet e tjera (Home, AddItem, FoundItem, Profile, About) dhe opsionet e navigimit.
│   ├── index.jsx               – ekrani Home që shfaq përmbajtjen dhe lejon përdoruesin të navigojë drejt faqeve të tjera (AddItem, FoundItem, Profile, About).
│   ├── addItem.jsx             – përdoret për të raportuar një send të humbur duke plotësuar emrin, përshkrimin, lokacionin dhe kategorinë.
│   ├── foundItem.jsx           – përdoret për të raportuar sende të gjetura dhe për të kërkuar në listë përmes filtrit të kërkimit.
│   ├── profile.jsx             – menaxhimi i profileve të përdoruesve me mundësi shtimi dhe fshirjeje.
│   └── about.jsx               – përshkruan qëllimin e projektit, misionin, kategoritë dhe jep informata kontaktuese.
│
├── components/
│   ├── CategorySelector.jsx    -lejon përdoruesin të zgjedhë kategorinë e një sendi.
│   ├── ItemCard.jsx            -paraqet një send të humbur/gjetur në formë kartele me foto, emër dhe përshkrim.
│   └── NavBar.jsx              -shfaq menunë e navigimit (ikonat për faqet: Home, Add, Profile, etj.)
│
├── assets/                     -ruan fotot, ikonat dhe materialet vizuale që përdor aplikacioni(p.sh. logo, imazhe background, apo foto të sendeve).
│
├── App.js                      -file kryesor i aplikacionit në React Native/Expo. Inicon strukturën, navigimin dhe e nis aplikacionin kur e hap me npm start ose expo start.
├── package.json                -përmban informacione për projektin dhe varësitë që duhen për ta ekzekutuar.
└── README.md

Teknologjitë e përdorura
- React Native dhe Expo Router për navigim
- SafeAreaView, ScrollView, FlatList për strukturë dhe shfaqje të dhënash
- Ionicons për ikona
- Komponentë të personalizuar: NavBar, CategorySelector, ItemCard

Zhvilluesit:
- Aurela Hasanaj
- Delvina Elshani
- Jon Rexha
- Leart Balidemaj
- Mehmed Kocinaj


# Welcome to your Expo app 

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
