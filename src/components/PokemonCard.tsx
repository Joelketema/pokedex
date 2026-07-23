import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FormattedPokemon } from "../interfaces/pokemon";
import { TypeBadge } from "./TypeBadge";

interface PokemonCardProps {
  pokemon: FormattedPokemon;
  onPress: (pokemon: FormattedPokemon) => void;
}

const PokemonCardComponent: React.FC<PokemonCardProps> = ({ pokemon, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => onPress(pokemon)}
    >
      {/* Top Header Row: Name & Formatted ID */}
      <View style={styles.headerRow}>
        <Text numberOfLines={1} style={styles.nameText}>
          {pokemon.displayName}
        </Text>
        <Text style={styles.idText}>{pokemon.formattedId}</Text>
      </View>

      {/* Center Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: pokemon.image }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Row: Type Badges */}
      <View style={styles.typeRow}>
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} size="sm" />
        ))}
      </View>
    </TouchableOpacity>
  );
};

export const PokemonCard = React.memo(PokemonCardComponent);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 12,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    minHeight: 185,
    justifyContent: "space-between",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  nameText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2563EB",
    flex: 1,
    marginRight: 4,
  },
  idText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
    height: 90,
  },
  image: {
    width: 85,
    height: 85,
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
});
