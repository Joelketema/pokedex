import React, { useState, useMemo, useCallback } from "react";
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
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGetPokemonList, fetchPokemonDetail } from "../services/queries/pokemonQueries";
import { PokemonCard } from "../components/PokemonCard";
import { PokeballHeader } from "../components/PokeballHeader";
import { PokemonSkeleton } from "../components/PokemonSkeleton";
import { Toast } from "../components/Toast";
import { FormattedPokemon } from "../interfaces/pokemon";

// Custom vector sort icons (pure React Native primitives)
const NumberSortIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <View style={[styles.iconBox, active && styles.iconBoxActive]}>
    <Text style={[styles.iconBoxText, active && styles.iconBoxTextActive]}>#</Text>
  </View>
);

const AZSortIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <View style={[styles.iconBox, active && styles.iconBoxActive]}>
    <Text style={[styles.iconBoxText, active && styles.iconBoxTextActive]}>AZ↓</Text>
  </View>
);

const ZASortIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <View style={[styles.iconBox, active && styles.iconBoxActive]}>
    <Text style={[styles.iconBoxText, active && styles.iconBoxTextActive]}>ZA↑</Text>
  </View>
);

interface PokemonListScreenProps {
  onSelectPokemon: (pokemon: FormattedPokemon) => void;
}

type SortOption = "id" | "az" | "za";

export const PokemonListScreen: React.FC<PokemonListScreenProps> = ({
  onSelectPokemon,
}) => {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedPokemon, setSearchedPokemon] = useState<FormattedPokemon | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("id");
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  // Predictive search suggestions filter
  const suggestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return allPokemon
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.formattedId.toLowerCase().includes(query)
      )
      .slice(0, 5); // Limit top 5 suggestions
  }, [allPokemon, searchQuery]);

  // Sort Pokemon list based on selected option
  const sortedPokemonList = useMemo(() => {
    const list = searchedPokemon ? [searchedPokemon] : [...allPokemon];
    if (searchedPokemon) return list;

    if (sortBy === "az") {
      return list.sort((a, b) => a.displayName.localeCompare(b.displayName));
    } else if (sortBy === "za") {
      return list.sort((a, b) => b.displayName.localeCompare(a.displayName));
    } else {
      return list.sort((a, b) => a.id - b.id);
    }
  }, [allPokemon, searchedPokemon, sortBy]);

  // Handle search execution
  const handleSearch = async (overrideQuery?: string) => {
    const queryToSearch = (overrideQuery !== undefined ? overrideQuery : searchQuery)
      .trim()
      .toLowerCase();

    if (!queryToSearch) {
      setSearchedPokemon(null);
      setSearchError(null);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setShowSuggestions(false);

    try {
      const result = await fetchPokemonDetail(queryToSearch);
      setSearchedPokemon(result);
    } catch (err) {
      setSearchedPokemon(null);
      setSearchError(`No Pokémon found matching "${queryToSearch}"`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSuggestion = (item: FormattedPokemon) => {
    setSearchQuery(item.displayName);
    setShowSuggestions(false);
    setSearchedPokemon(item);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchedPokemon(null);
    setSearchError(null);
    setShowSuggestions(false);
  };

  // Performance-optimized renderItem for FlatList
  const renderItem = useCallback(
    ({ item }: { item: FormattedPokemon }) => (
      <PokemonCard pokemon={item} onPress={onSelectPokemon} />
    ),
    [onSelectPokemon]
  );

  const keyExtractor = useCallback((item: FormattedPokemon) => item.id.toString(), []);

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />

      {/* Floating Error Toast Notification */}
      <Toast
        visible={!!searchError}
        message={searchError || ""}
        type="error"
        onDismiss={() => setSearchError(null)}
      />

      {/* Top Banner with Safe Area Inset & Pokeball Watermark */}
      <View style={[styles.headerBanner, { paddingTop: topPadding }]}>
        <PokeballHeader size={125} opacity={1.0} topOffset={topPadding - 8} rightOffset={-10} />

        <Text style={styles.titleText}>Who are you{"\n"}looking for?</Text>

        {/* Search Input Container */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="E.g. Pikachu or Pi-"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setShowSuggestions(text.trim().length > 0);
                if (!text) clearSearch();
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setShowSuggestions(true);
              }}
              onSubmitEditing={() => handleSearch()}
              returnKeyType="search"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.goButton}
              activeOpacity={0.8}
              onPress={() => handleSearch()}
            >
              <Text style={styles.goButtonText}>GO</Text>
            </TouchableOpacity>
          </View>

          {/* Predictive Search Suggestions Dropdown Overlay */}
          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.suggestionItem}
                  activeOpacity={0.7}
                  onPress={() => handleSelectSuggestion(item)}
                >
                  <Text style={styles.suggestionName}>{item.displayName}</Text>
                  <Text style={styles.suggestionId}>{item.formattedId}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Body / Pokémon Grid Section */}
      <View style={styles.contentContainer}>
        {/* Alphabetical & ID Sorting Control Bar */}
        {!isLoading && !isSearching && !isError && !searchError && (
          <View style={styles.sortBar}>
            <Text style={styles.sortLabel}>Sort by:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.sortChip, sortBy === "id" && styles.sortChipActive]}
                onPress={() => setSortBy("id")}
                activeOpacity={0.8}
              >
                <NumberSortIcon active={sortBy === "id"} />
                <Text style={[styles.sortChipText, sortBy === "id" && styles.sortChipTextActive]}>
                  Number #
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sortChip, sortBy === "az" && styles.sortChipActive]}
                onPress={() => setSortBy("az")}
                activeOpacity={0.8}
              >
                <AZSortIcon active={sortBy === "az"} />
                <Text style={[styles.sortChipText, sortBy === "az" && styles.sortChipTextActive]}>
                  A - Z
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.sortChip, sortBy === "za" && styles.sortChipActive]}
                onPress={() => setSortBy("za")}
                activeOpacity={0.8}
              >
                <ZASortIcon active={sortBy === "za"} />
                <Text style={[styles.sortChipText, sortBy === "za" && styles.sortChipTextActive]}>
                  Z - A
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {isLoading || isSearching ? (
          /* Render Animated Skeleton Loader */
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
            data={sortedPokemonList}
            keyExtractor={keyExtractor}
            numColumns={2}
            renderItem={renderItem}
            contentContainerStyle={styles.gridContent}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage && !searchedPokemon) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            // Performance optimizations for large lists
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={5}
            removeClippedSubviews={Platform.OS === "android"}
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
    zIndex: 10,
  },
  titleText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 34,
    marginBottom: 18,
  },
  searchWrapper: {
    position: "relative",
    zIndex: 50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
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
  suggestionsContainer: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 6,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    zIndex: 100,
  },
  suggestionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  suggestionName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  suggestionId: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    overflow: "hidden",
  },
  sortBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  sortLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4B5563",
    marginRight: 8,
  },
  sortChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sortIcon: {
    marginRight: 5,
  },
  iconBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginRight: 6,
  },
  iconBoxActive: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  iconBoxText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#4B5563",
  },
  iconBoxTextActive: {
    color: "#FFFFFF",
  },
  sortChipActive: {
    backgroundColor: "#1A50E2",
    borderColor: "#1A50E2",
  },
  sortChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  sortChipTextActive: {
    color: "#FFFFFF",
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
