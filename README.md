# 📱 Senior Developer Pokémon Mobile App (Expo & Clean Architecture)

A production-grade, beautifully designed React Native mobile application built with **Expo**, **TypeScript**, **NativeWind (Tailwind CSS)**, **React Native Paper**, and **TanStack React Query** with a custom **Axios Client & Interceptor Architecture**.

---

## 🎨 UI & Features

- 📱 **Pokémon List Screen**:
  - Deep blue header banner with custom SVG Pokeball watermark decoration.
  - Search bar input with `"E.g. Pikachu"` placeholder and `"GO"` search button.
  - 2-Column responsive grid layout displaying formatted ID (e.g. `#001`), Pokémon name, high-resolution official artwork, and color-coded type pills.
  - Infinite scroll / pagination loading capabilities.
- 🔍 **Search & Filtering**:
  - Search Pokémon dynamically by name or ID.
  - Graceful fallback & error message if no Pokémon matches the search criteria.
- 📊 **Pokémon Detail Screen**:
  - Interactive top bar with back navigation and decorative Pokeball header.
  - **Main Stats Card**: Muted `#001` ID, bold Pokémon title, type badges, stat progress bars (**HP**, **Attack**, **Defense**, **Speed**), and large overlay artwork.
  - **Breeding Card**: Formatted height (e.g., `2'04" (0.7m)`) and weight (e.g., `15.2 lbs (6.9 kg)`).
  - **Moves Card**: Scrollable move chips with an expandable *"See all"* button.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Expo](https://expo.dev) SDK 51+ (React Native 0.74+)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS) & [React Native Paper](https://callstack.github.io/react-native-paper/)
- **Data Fetching & State**: [TanStack React Query v5](https://tanstack.com/query) + [Axios](https://axios-http.com/)
- **Testing**: [Jest](https://jestjs.io/) & `jest-expo`

### 🏗️ Project Architecture

```
Pokémon/
├── assets/                       # Static app graphics & icons
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── PokeballHeader.tsx    # Decorative SVG Pokeball watermark
│   │   ├── PokemonCard.tsx       # 2-column grid card matching mockup
│   │   ├── StatBar.tsx           # Color-coded stat progress bar
│   │   └── TypeBadge.tsx         # Type badge pill component
│   ├── const.ts                  # Base API URL & Type color mappings
│   ├── interfaces/               # Strong TypeScript interfaces
│   │   ├── ApiClient.ts          # Generic API request option interface
│   │   └── pokemon.ts            # PokéAPI models & FormattedPokemon types
│   ├── screens/                  # Application views
│   │   ├── PokemonListScreen.tsx # List view with search & pagination
│   │   └── PokemonDetailScreen.tsx # Detail view matching mockup
│   ├── services/                 # Clean Services Architecture Layer
│   │   ├── api/
│   │   │   └── apiClient.ts      # Shared custom Axios client wrapper
│   │   ├── interceptors/
│   │   │   └── apiInterceptor.ts # Request tracing, headers, & error handling
│   │   ├── mutations/            # Mutation operations layer
│   │   └── queries/
│   │       └── pokemonQueries.ts # TanStack Query hooks & data transformers
│   └── __tests__/                # Automated test suite
│       └── services/             # Unit tests for API client & transformers
├── App.tsx                       # Root component with Providers
├── babel.config.js               # NativeWind babel plugin configuration
├── tailwind.config.js            # Tailwind color system extension
├── metro.config.js               # Metro bundler configuration
└── README.md
```

---

## 🔌 Services & API Layer Blueprint

The network layer uses a custom `apiClient` wrapper and `apiInterceptors` adhering to clean architecture principles:

- **`apiClient`**: Standardized wrapper accepting generic parameters and initializing isolated Axios instances per base route.
- **`apiInterceptor`**: Automatically injects trace headers (`X-REQUEST-ID`, `X-api-key`, `X-api-client-id`), handles JSON header injection, appends metadata to POST bodies, and handles network timeouts / 401 exceptions gracefully.
- **`pokemonQueries`**: High-level TanStack Query hooks (`useGetPokemonList`, `useGetPokemonDetail`) for caching, prefetching, and clean state handling.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Pokémon
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Press `a` for Android Emulator, `i` for iOS Simulator, or scan the QR code with the Expo Go app on your physical device.

---

## 🧪 Running Unit Tests

Run the Jest test suite:

```bash
npx jest
```

---

## 📜 Git Commit Log

```
* feat: bootstrap expo typescript app with nativewind and react-native-paper
* feat: implement clean architecture services layer with custom axios client, interceptors, and tanstack query
* feat: build UI components, pokemon list screen, detail screen, search functionality, and design matching mockup
* test: add unit tests for api client, queries, and components
* docs: add comprehensive README with setup instructions and architecture breakdown
```
