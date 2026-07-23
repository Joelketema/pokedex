import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetPokemonList, fetchPokemonDetail } from "../services/queries/pokemonQueries";
import { PokemonCard } from "../components/PokemonCard";
import { PokeballHeader } from "../components/PokeballHeader";
import { PokemonSkeleton } from "../components/PokemonSkeleton";
import { FormattedPokemon } from "../interfaces/pokemon";

interface PokemonListScreenProps {
  onSelectPokemon: (pokemon: FormattedPokemon) => void;
}

export const PokemonListScreen: React.FC<PokemonListScreenProps> = ({
  onSelectPokemon,
}) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedPokemon, setSearchedPokemon] = useState<FormattedPokemon | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPokemonList(20);

  // Calculate safe top padding dynamically
  const topPadding = (insets.top > 0 ? insets.top : (StatusBar.currentHeight || 20)) + 12;

  // Flatten infinite query pages
  const allPokemon = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.results);
  }, [data]);

  // Handle GO button search execution
  const handleSearch = async () => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) {
      setSearchedPokemon(null);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const result = await fetchPokemonDetail(trimmed);
      setSearchedPokemon(result);
    } catch (err) {
      setSearchedPokemon(null);
      setSearchError(`No Pokémon found matching "${searchQuery}"`);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchedPokemon(null);
    setSearchError(null);
  };

  // Determine list items to render
  const displayList = searchedPokemon ? [searchedPokemon] : allPokemon;

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />

      {/* Top Banner with Safe Area Inset & Pokeball Watermark */}
      <View style={[styles.headerBanner, { paddingTop: topPadding }]}>
        <PokeballHeader size={200} opacity={0.22} />

        <Text style={styles.titleText}>Who are you{"\n"}looking for?</Text>

        {/* Search Pill Input with GO Button */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="E.g. Pikachu"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              if (!text) clearSearch();
            }}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.goButton}
            activeOpacity={0.8}
            onPress={handleSearch}
          >
            <Text style={styles.goButtonText}>GO</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Body / Pokémon Grid Section */}
      <View style={styles.contentContainer}>
        {isLoading || isSearching ? (
          /* Render Skeleton Loader instead of spinner */
          <PokemonSkeleton />
        ) : isError ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>Failed to load Pokémon list.</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : searchError ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{searchError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={clearSearch}>
              <Text style={styles.retryButtonText}>Show All Pokémon</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={displayList}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            renderItem={({ item }) => (
              <PokemonCard pokemon={item} onPress={onSelectPokemon} />
            )}
            contentContainerStyle={styles.gridContent}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage && !searchedPokemon) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="small" color="#1A50E2" />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#1A50E2",
  },
  headerBanner: {
    backgroundColor: "#1A50E2",
    paddingHorizontal: 24,
    paddingBottom: 24,
    position: "relative",
    overflow: "hidden",
  },
  titleText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 34,
    marginBottom: 18,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    paddingVertical: Platform.OS === "ios" ? 8 : 4,
  },
  goButton: {
    backgroundColor: "#27272A",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  goButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    overflow: "hidden",
  },
  gridContent: {
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 15,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
  },
  retryButton: {
    backgroundColor: "#1A50E2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
