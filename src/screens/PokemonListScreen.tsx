import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Searchbar, Surface, Chip } from "react-native-paper";
import { useGetPokemonList, fetchPokemonDetail } from "../services/queries/pokemonQueries";
import { PokemonCard } from "../components/PokemonCard";
import { PokeballHeader } from "../components/PokeballHeader";
import { PokemonSkeleton } from "../components/PokemonSkeleton";
import { Toast } from "../components/Toast";
import { FormattedPokemon } from "../interfaces/pokemon";

// Custom vector sort icons (pure React Native primitives)
const NumberSortIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <View style={[styles.iconBox, active && styles.iconBoxActive]} className={`px-1 py-0.5 rounded mr-1.5 ${active ? 'bg-white/25' : 'bg-gray-200'}`}>
    <Text style={[styles.iconBoxText, active && styles.iconBoxTextActive]} className={`text-[10px] font-extrabold ${active ? 'text-white' : 'text-gray-600'}`}>#</Text>
  </View>
);

const AZSortIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <View style={[styles.iconBox, active && styles.iconBoxActive]} className={`px-1 py-0.5 rounded mr-1.5 ${active ? 'bg-white/25' : 'bg-gray-200'}`}>
    <Text style={[styles.iconBoxText, active && styles.iconBoxTextActive]} className={`text-[10px] font-extrabold ${active ? 'text-white' : 'text-gray-600'}`}>AZ↓</Text>
  </View>
);

const ZASortIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <View style={[styles.iconBox, active && styles.iconBoxActive]} className={`px-1 py-0.5 rounded mr-1.5 ${active ? 'bg-white/25' : 'bg-gray-200'}`}>
    <Text style={[styles.iconBoxText, active && styles.iconBoxTextActive]} className={`text-[10px] font-extrabold ${active ? 'text-white' : 'text-gray-600'}`}>ZA↑</Text>
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
    <View style={styles.rootContainer} className="flex-1 bg-[#1A50E2]">
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />

      {/* Floating Error Toast Notification */}
      <Toast
        visible={!!searchError}
        message={searchError || ""}
        type="error"
        onDismiss={() => setSearchError(null)}
      />

      {/* Top Banner with Safe Area Inset & Pokeball Watermark */}
      <View style={[styles.headerBanner, { paddingTop: topPadding }]} className="bg-[#1A50E2] px-6 pb-6 relative z-10">
        <PokeballHeader size={125} opacity={1.0} topOffset={topPadding - 8} rightOffset={-10} />

        <Text style={styles.titleText} className="text-3xl font-extrabold text-white leading-9 mb-4.5">
          Who are you{"\n"}looking for?
        </Text>

        {/* Search Input Container using React Native Paper Searchbar */}
        <View style={styles.searchWrapper} className="relative z-50">
          <Searchbar
            placeholder="E.g. Pikachu or Pi-"
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
            style={styles.searchBar}
            className="bg-white rounded-full flex-1 elevation-4 shadow-md h-12"
            inputStyle={styles.searchInput}
            placeholderTextColor="#9CA3AF"
            right={() => (
              <TouchableOpacity
                style={styles.goButton}
                className="bg-zinc-800 rounded-full px-4 py-1.5 justify-center items-center mr-1"
                activeOpacity={0.8}
                onPress={() => handleSearch()}
              >
                <Text style={styles.goButtonText} className="text-white font-bold text-xs">GO</Text>
              </TouchableOpacity>
            )}
          />

          {/* Predictive Search Suggestions Dropdown Overlay */}
          {showSuggestions && suggestions.length > 0 && (
            <Surface style={styles.suggestionsContainer} className="absolute top-14 left-0 right-0 bg-white rounded-2xl py-1.5 z-50 elevation-4 shadow-lg" elevation={4}>
              {suggestions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.suggestionItem}
                  className="flex-row justify-between items-center px-4 py-2.5 border-b border-gray-100"
                  activeOpacity={0.7}
                  onPress={() => handleSelectSuggestion(item)}
                >
                  <Text style={styles.suggestionName} className="text-sm font-semibold text-gray-800">{item.displayName}</Text>
                  <Text style={styles.suggestionId} className="text-xs font-semibold text-gray-500">{item.formattedId}</Text>
                </TouchableOpacity>
              ))}
            </Surface>
          )}
        </View>
      </View>

      {/* Body / Pokémon Grid Section */}
      <Surface style={styles.contentContainer} className="flex-1 bg-gray-100 rounded-t-3xl pt-3 overflow-hidden" elevation={0}>
        {/* Alphabetical & ID Sorting Control Bar */}
        {!isLoading && !isSearching && !isError && !searchError && (
          <View style={styles.sortBar} className="flex-row items-center px-4 pb-2.5">
            <Text style={styles.sortLabel} className="text-xs font-bold text-gray-600 mr-2">Sort by:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Chip
                selected={sortBy === "id"}
                onPress={() => setSortBy("id")}
                style={[styles.sortChip, sortBy === "id" && styles.sortChipActive]}
                className={`mr-2 rounded-xl border ${sortBy === "id" ? 'bg-[#1A50E2] border-[#1A50E2]' : 'bg-white border-gray-200'}`}
                textStyle={[styles.sortChipText, sortBy === "id" && styles.sortChipTextActive]}
                compact
              >
                <NumberSortIcon active={sortBy === "id"} />
                Number #
              </Chip>

              <Chip
                selected={sortBy === "az"}
                onPress={() => setSortBy("az")}
                style={[styles.sortChip, sortBy === "az" && styles.sortChipActive]}
                className={`mr-2 rounded-xl border ${sortBy === "az" ? 'bg-[#1A50E2] border-[#1A50E2]' : 'bg-white border-gray-200'}`}
                textStyle={[styles.sortChipText, sortBy === "az" && styles.sortChipTextActive]}
                compact
              >
                <AZSortIcon active={sortBy === "az"} />
                A - Z
              </Chip>

              <Chip
                selected={sortBy === "za"}
                onPress={() => setSortBy("za")}
                style={[styles.sortChip, sortBy === "za" && styles.sortChipActive]}
                className={`mr-2 rounded-xl border ${sortBy === "za" ? 'bg-[#1A50E2] border-[#1A50E2]' : 'bg-white border-gray-200'}`}
                textStyle={[styles.sortChipText, sortBy === "za" && styles.sortChipTextActive]}
                compact
              >
                <ZASortIcon active={sortBy === "za"} />
                Z - A
              </Chip>
            </ScrollView>
          </View>
        )}

        {isLoading || isSearching ? (
          /* Render Animated Skeleton Loader */
          <PokemonSkeleton />
        ) : isError ? (
          <View style={styles.centerContainer} className="flex-1 justify-center items-center p-6">
            <Text style={styles.errorText} className="text-sm text-red-500 text-center mb-4 font-medium">Failed to load Pokémon list.</Text>
            <TouchableOpacity style={styles.retryButton} className="bg-[#1A50E2] px-5 py-2.5 rounded-full" onPress={() => refetch()}>
              <Text style={styles.retryButtonText} className="text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : searchError ? (
          <View style={styles.centerContainer} className="flex-1 justify-center items-center p-6">
            <Text style={styles.errorText} className="text-sm text-red-500 text-center mb-4 font-medium">{searchError}</Text>
            <TouchableOpacity style={styles.retryButton} className="bg-[#1A50E2] px-5 py-2.5 rounded-full" onPress={clearSearch}>
              <Text style={styles.retryButtonText} className="text-white font-semibold">Show All Pokémon</Text>
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
                <View style={styles.footerLoader} className="py-4 items-center">
                  <ActivityIndicator size="small" color="#1A50E2" />
                </View>
              ) : null
            }
          />
        )}
      </Surface>
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
  searchBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    height: 48,
    elevation: 4,
  },
  searchInput: {
    fontSize: 15,
    color: "#1F2937",
    minHeight: 0,
    alignSelf: "center",
  },
  goButton: {
    backgroundColor: "#27272A",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
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
    top: 54,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 6,
    elevation: 8,
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
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginRight: 8,
    height: "auto",
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

