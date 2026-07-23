import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as PaperProvider } from "react-native-paper";
import { PokemonListScreen } from "./src/screens/PokemonListScreen";
import { PokemonDetailScreen } from "./src/screens/PokemonDetailScreen";
import { FormattedPokemon } from "./src/interfaces/pokemon";
import "./global.css";

// Create TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});

export default function App() {
  const [selectedPokemon, setSelectedPokemon] = useState<FormattedPokemon | null>(null);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider>
          <View style={styles.container}>
            {selectedPokemon ? (
              <PokemonDetailScreen
                pokemon={selectedPokemon}
                onBack={() => setSelectedPokemon(null)}
              />
            ) : (
              <PokemonListScreen
                onSelectPokemon={(pokemon) => setSelectedPokemon(pokemon)}
              />
            )}
          </View>
        </PaperProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A50E2",
  },
});
