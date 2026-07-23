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
import { useGetPokemonDetail } from "../services/queries/pokemonQueries";
import { PokeballHeader } from "../components/PokeballHeader";
import { TypeBadge } from "../components/TypeBadge";
import { StatBar } from "../components/StatBar";
import { Interactive3DPokemon } from "../components/Interactive3DPokemon";
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
  const { data: detailData } = useGetPokemonDetail(initialPokemon.name);
  const pokemon = detailData || initialPokemon;

  const topPadding = (insets.top > 0 ? insets.top : (StatusBar.currentHeight || 20)) + 8;

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />

      {/* Top Blue Header Bar with Safe Area Top Inset & Pokeball Watermark */}
      <View style={[styles.headerBar, { paddingTop: topPadding, height: 60 + topPadding }]}>
        <PokeballHeader size={110} opacity={1.0} topOffset={topPadding - 2} rightOffset={-10} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Detail Content Scroll Area */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card 1: Main Stats Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.idText}>{pokemon.formattedId}</Text>
              <Text style={styles.nameText}>{pokemon.displayName}</Text>
            </View>

            {/* Type Badges */}
            <View style={styles.typeBadgeContainer}>
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type} size="md" />
              ))}
            </View>
          </View>

          {/* Stats & Interactive 360° Pokémon Artwork Layout */}
          <View style={styles.statsBodyRow}>
            {/* Left Column: Stat Bars */}
            <View style={styles.statsColumn}>
              <StatBar label="HP" value={pokemon.stats.hp} color="#47D1B1" />
              <StatBar label="Attack" value={pokemon.stats.attack} color="#FB6C6C" />
              <StatBar label="Defense" value={pokemon.stats.defense} color="#F8D030" />
              <StatBar label="Speed" value={pokemon.stats.speed} color="#FF9D55" />
            </View>

            {/* Right Column: Interactive 3D Pokémon Artwork */}
            <View style={styles.artworkColumn}>
              <Interactive3DPokemon
                imageUri={pokemon.image}
                pokemonName={pokemon.displayName}
                size={140}
              />
            </View>
          </View>
        </View>

        {/* Card 2: Breeding Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Breeding</Text>

          <View style={styles.breedingRow}>
            {/* Height Box */}
            <View style={styles.breedingItem}>
              <Text style={styles.breedingLabel}>Height</Text>
              <View style={styles.breedingValuePill}>
                <Text style={styles.breedingValueText}>
                  {pokemon.heightFormatted}
                </Text>
              </View>
            </View>

            {/* Weight Box */}
            <View style={styles.breedingItem}>
              <Text style={styles.breedingLabel}>Weight</Text>
              <View style={styles.breedingValuePill}>
                <Text style={styles.breedingValueText}>
                  {pokemon.weightFormatted}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Card 3: Moves Card */}
        <View style={styles.card}>
          <View style={styles.movesHeaderRow}>
            <Text style={styles.sectionTitle}>Moves</Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              activeOpacity={0.8}
              onPress={() => setShowAllMoves(!showAllMoves)}
            >
              <Text style={styles.seeAllText}>
                {showAllMoves ? "Show less" : "See all"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Moves Tags */}
          <View style={styles.movesContainer}>
            {(showAllMoves ? pokemon.moves : pokemon.moves.slice(0, 6)).map(
              (move) => (
                <View key={move} style={styles.moveChip}>
                  <Text style={styles.moveChipText}>
                    {move.replace("-", " ").toUpperCase()}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  moveChipText: {
    fontSize: 11,
    color: "#4B5563",
    fontWeight: "600",
  },
});
