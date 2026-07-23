# 📱 PokéDex - Senior Developer Assessment App (Expo & React Native)

A premium, production-ready Pokémon mobile application built with **Expo**, **TypeScript**, **React Native Paper**, **NativeWind (Tailwind CSS)**, and **TanStack React Query**.

Designed with clean architecture, interactive 3D perspective artwork, custom animated splash screens, predictive search autofill, alphabetical sorting, skeleton loading states, and robust error handling.

---

## ⚠️ Important Note on Expo Go Compatibility

> **Note for Testers & Reviewers:**
> This application is built with the latest Expo SDK release. Because the store-distributed **Expo Go** app on iOS and Android runs on an older locked SDK runtime, running via plain `npx expo start` in standard Expo Go may report an SDK mismatch.
>
> **Recommended Way to Run:**
> Use an **Expo Development Build** or build a standalone **Android APK**:
> ```bash
> # 1. Start with Development Client support
> npx expo start --dev-client
>
> # 2. Or build a standalone Android APK with EAS Cloud Build
> npx eas-cli build -p android --profile preview
> ```

---

## ✨ Features Highlight

- 🎨 **Modern & Premium UI Design**: Customized Pokéball watermarks, vibrant type color palettes, card drop shadows, and glassmorphism headers.
- 🎬 **Animated Pokeball Catch Splash Screen**: Custom opening animation where app title and tagline bounce and get sucked into a spinning Pokéball.
- 🕹️ **Interactive 3D Perspective Pokémon Artwork**:
  - Touch & drag gestures tilt the artwork in real 3D perspective (`rotateX`, `rotateY`, `perspective: 600`).
  - Dynamic ground drop-shadow and moving specular light highlight reflection.
  - Smooth spring-recoil physics snap the Pokémon back to default rest position when released.
  - Pulsating `✨ Touch & Drag 3D` hint badge.
- 🔍 **Predictive Search Autofill**: Live autocomplete suggestion overlay appears as you type (e.g. typing `Pi-` suggests `Pikachu`, `Pidgey`, etc.).
- 🔤 **Alphabetical & ID Sorting Bar**: Instant single-tap sorting control bar (`🔢 Number #`, `🔤 A - Z`, `🔤 Z - A`).
- ⚡ **FlatList VirtualizedList Performance**: Memoized card items (`React.memo`), windowing optimizations, clipped subview recycling, and fixed row layout.
- 💀 **Skeleton Loading States**: Smooth animated pulsing card grid skeletons for the list screen and detail screen placeholders instead of generic spinners.
- ⚠️ **Floating Toast Error Notifications**: Non-intrusive floating toast notifications for API network errors and search failures.
- 🏗️ **Clean Architecture Services Layer**:
  - Strongly typed `ApiClient<T>` interface.
  - Custom Axios client wrapper matching production blueprints.
  - Axios interceptors for request tracing (`UUID v4`), headers, and centralized error logging.
  - TanStack React Query for cached infinite pagination and auto-retry logic.
- 🧪 **Automated Unit Tests**: Comprehensive Jest test suite covering API client, query hooks, and transformers.

---

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 57) with [TypeScript](https://www.typescriptlang.org/)
- **State & Data Fetching**: [TanStack React Query v5](https://tanstack.com/query/latest)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Styling**: [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS) & [React Native Paper](https://callstack.github.io/react-native-paper/)
- **Safe Area & Layout**: `react-native-safe-area-context`
- **Testing**: [Jest](https://jestjs.io/) & `@testing-library/react-native`

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed
- npm or yarn
- Expo CLI (`npx expo`)

### 2. Installation

Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/pokedex-expo-app.git
cd pokedex-expo-app
npm install
```

### 3. Running the App

#### Option A: Run with Expo Development Client (Recommended)
```bash
npx expo start --dev-client
```

#### Option B: Build a Standalone Android APK (EAS Build)
Generate a downloadable `.apk` file to install on any Android phone directly:
```bash
npx eas-cli build -p android --profile preview
```

### 4. Running Unit Tests

Run the test suite via Jest:
```bash
npm test
```

---

## 📁 Project Architecture & Folder Structure

```
Pokémon/
├── assets/                  # App icons, splash artwork, & adaptive icons
│   ├── icon.png             # 3D Pokéball app icon
│   └── splash-icon.png
├── src/
│   ├── components/          # Reusable UI Components
│   │   ├── AnimatedSplashScreen.tsx  # Custom Pokéball suction opening animation
│   │   ├── Interactive3DPokemon.tsx  # 3D tilt artwork with specular light & spring recoil
│   │   ├── PokeballHeader.tsx        # Styled Pokéball watermark header
│   │   ├── PokemonCard.tsx           # Memoized card item for list grid
│   │   ├── PokemonDetailSkeleton.tsx # Skeleton loader for detail view
│   │   ├── PokemonSkeleton.tsx       # Skeleton loader grid for list view
│   │   ├── StatBar.tsx               # Color-coded stat progress bar
│   │   ├── Toast.tsx                 # Floating toast error banner
│   │   └── TypeBadge.tsx             # Pokémon element type pill badge
│   ├── interfaces/          # TypeScript Types & Contracts
│   │   ├── ApiClient.ts              # Generic request wrapper contract
│   │   └── pokemon.ts                # PokéAPI & domain interfaces
│   ├── screens/             # Application Views
│   │   ├── PokemonListScreen.tsx     # List screen with search, sort, & grid
│   │   └── PokemonDetailScreen.tsx   # Detailed Pokémon view with stats & breeding
│   ├── services/            # Services Layer
│   │   ├── api/
│   │   │   └── apiClient.ts          # Custom Axios request wrapper
│   │   ├── interceptors/
│   │   │   └── apiInterceptor.ts     # Axios request tracing & error interceptor
│   │   ├── queries/
│   │   │   └── pokemonQueries.ts     # TanStack query hooks & data transformers
│   │   └── mutations/
│   │       └── index.ts
│   └── const.ts             # Global constants & type color mappings
├── App.tsx                  # Root entry with QueryClient & SafeArea providers
├── eas.json                 # EAS build profile configurations for APK output
├── jest.config.js           # Test runner configuration
├── tailwind.config.js       # NativeWind styling configuration
└── package.json
```

---

## 🧪 Unit Testing

Unit tests verify the API service layer and data transformation helpers:
- `apiClient.test.ts`: Verifies generic request handling and baseURL construction.
- `pokemonQueries.test.ts`: Verifies format transformers (`formatPokemonId`, `formatDimensions`, `transformPokemonDetail`).

To execute tests:
```bash
npm test
```

---

## 📄 License

This project is licensed under the MIT License.
