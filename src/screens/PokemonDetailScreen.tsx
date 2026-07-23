import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Surface, Chip } from "react-native-paper";
import { useGetPokemonDetail } from "../services/queries/pokemonQueries";
import { PokeballHeader } from "../components/PokeballHeader";
import { TypeBadge } from "../components/TypeBadge";
import { StatBar } from "../components/StatBar";
import { Interactive3DPokemon } from "../components/Interactive3DPokemon";
import { PokemonDetailSkeleton } from "../components/PokemonDetailSkeleton";
import { FormattedPokemon } from "../interfaces/pokemon";

interface PokemonDetailScreenProps {
  pokemon: FormattedPokemon;
  onBack: () => void;
}

export const PokemonDetailScreen: React.FC<PokemonDetailScreenProps> = ({
  pokemon: initialPokemon,
  onBack,
}) => {
  const insets = useSafeAreaInsets();
  const [showAllMoves, setShowAllMoves] = useState(false);

  // Fetch full details if needed, or fallback to initial
  const { data: detailData, isLoading } = useGetPokemonDetail(initialPokemon.name);
  const pokemon = detailData || initialPokemon;

  const topPadding = (insets.top > 0 ? insets.top : (StatusBar.currentHeight || 20)) + 8;

  return (
    <View style={styles.rootContainer} className="flex-1 bg-[#1A50E2]">
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />

      {/* Top Blue Header Bar with Safe Area Top Inset & Pokeball Watermark */}
      <View style={[styles.headerBar, { paddingTop: topPadding, height: 60 + topPadding }]} className="bg-[#1A50E2] flex-row items-center px-5 relative overflow-hidden">
        <PokeballHeader size={110} opacity={1.0} topOffset={topPadding - 2} rightOffset={-10} />
        <TouchableOpacity
          style={styles.backButton}
          className="w-10 h-10 justify-center items-center z-10"
          onPress={onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backArrowText} className="text-2xl text-white font-bold">←</Text>
        </TouchableOpacity>
      </View>

      {/* Detail Content Scroll Area */}
      <ScrollView
        style={styles.container}
        className="flex-1 bg-gray-100 rounded-t-3xl"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <PokemonDetailSkeleton />
        ) : (
          <>
            {/* Card 1: Main Stats Card */}
            <Surface style={styles.card} className="bg-white rounded-2xl p-4.5 mb-4 shadow-sm elevation-3" elevation={3}>
              <View style={styles.cardHeaderRow} className="flex-row justify-between items-start mb-3">
                <View>
                  <Text style={styles.idText} className="text-xs font-semibold text-gray-500 mb-0.5">{pokemon.formattedId}</Text>
                  <Text style={styles.nameText} className="text-2xl font-extrabold text-blue-900">{pokemon.displayName}</Text>
                </View>

                {/* Type Badges */}
                <View style={styles.typeBadgeContainer} className="flex-row items-center">
                  {pokemon.types.map((type) => (
                    <TypeBadge key={type} type={type} size="md" />
                  ))}
                </View>
              </View>

              {/* Stats & Interactive 360° Pokémon Artwork Layout */}
              <View style={styles.statsBodyRow} className="flex-row items-center mt-2">
                {/* Left Column: Stat Bars */}
                <View style={styles.statsColumn} className="flex-1 pr-2">
                  <StatBar label="HP" value={pokemon.stats.hp} color="#47D1B1" />
                  <StatBar label="Attack" value={pokemon.stats.attack} color="#FB6C6C" />
                  <StatBar label="Defense" value={pokemon.stats.defense} color="#F8D030" />
                  <StatBar label="Speed" value={pokemon.stats.speed} color="#FF9D55" />
                </View>

                {/* Right Column: Interactive 3D Pokémon Artwork */}
                <View style={styles.artworkColumn} className="w-[140px] items-center justify-center">
                  <Interactive3DPokemon
                    imageUri={pokemon.image}
                    pokemonName={pokemon.displayName}
                    size={140}
                  />
                </View>
              </View>
            </Surface>

            {/* Card 2: Breeding Card */}
            <Surface style={styles.card} className="bg-white rounded-2xl p-4.5 mb-4 shadow-sm elevation-3" elevation={3}>
              <Text style={styles.sectionTitle} className="text-lg font-bold text-gray-800 mb-3">Breeding</Text>

              <View style={styles.breedingRow} className="flex-row justify-between">
                {/* Height Box */}
                <View style={styles.breedingItem} className="flex-1 mx-1 items-center">
                  <Text style={styles.breedingLabel} className="text-xs text-gray-500 font-medium mb-1.5">Height</Text>
                  <Surface style={styles.breedingValuePill} className="bg-gray-100 rounded-xl py-2.5 px-3 w-full items-center" elevation={0}>
                    <Text style={styles.breedingValueText} className="text-xs font-semibold text-gray-700">
                      {pokemon.heightFormatted}
                    </Text>
                  </Surface>
                </View>

                {/* Weight Box */}
                <View style={styles.breedingItem} className="flex-1 mx-1 items-center">
                  <Text style={styles.breedingLabel} className="text-xs text-gray-500 font-medium mb-1.5">Weight</Text>
                  <Surface style={styles.breedingValuePill} className="bg-gray-100 rounded-xl py-2.5 px-3 w-full items-center" elevation={0}>
                    <Text style={styles.breedingValueText} className="text-xs font-semibold text-gray-700">
                      {pokemon.weightFormatted}
                    </Text>
                  </Surface>
                </View>
              </View>
            </Surface>

            {/* Card 3: Moves Card */}
            <Surface style={styles.card} className="bg-white rounded-2xl p-4.5 mb-4 shadow-sm elevation-3" elevation={3}>
              <View style={styles.movesHeaderRow} className="flex-row justify-between items-center mb-3">
                <Text style={styles.sectionTitle} className="text-lg font-bold text-gray-800 mb-0">Moves</Text>
                <TouchableOpacity
                  style={styles.seeAllButton}
                  className="bg-zinc-900 rounded-full px-4 py-1.5"
                  activeOpacity={0.8}
                  onPress={() => setShowAllMoves(!showAllMoves)}
                >
                  <Text style={styles.seeAllText} className="text-white text-xs font-semibold">
                    {showAllMoves ? "Show less" : "See all"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Moves Tags using React Native Paper Chip */}
              <View style={styles.movesContainer} className="flex-row flex-wrap">
                {(showAllMoves ? pokemon.moves : pokemon.moves.slice(0, 6)).map(
                  (move) => (
                    <Chip
                      key={move}
                      style={styles.moveChip}
                      className="bg-gray-100 rounded-lg mr-1.5 mb-1.5"
                      textStyle={styles.moveChipText}
                      compact
                    >
                      {move.replace("-", " ").toUpperCase()}
                    </Chip>
                  )
                )}
              </View>
            </Surface>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#1A50E2",
  },
  headerBar: {
    backgroundColor: "#1A50E2",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    position: "relative",
    overflow: "hidden",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backArrowText: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  idText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 2,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E3A8A",
  },
  typeBadgeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsBodyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  statsColumn: {
    flex: 1,
    paddingRight: 8,
  },
  artworkColumn: {
    width: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  breedingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  breedingItem: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  breedingLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 6,
  },
  breedingValuePill: {
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: "100%",
    alignItems: "center",
  },
  breedingValueText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  movesHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllButton: {
    backgroundColor: "#18181B",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  seeAllText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  movesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  moveChip: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
    height: "auto",
  },
  moveChipText: {
    fontSize: 11,
    color: "#4B5563",
    fontWeight: "600",
    marginHorizontal: 0,
    marginVertical: 0,
  },
});

