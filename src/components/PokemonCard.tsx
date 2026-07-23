import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Card, Surface } from "react-native-paper";
import { FormattedPokemon } from "../interfaces/pokemon";
import { TypeBadge } from "./TypeBadge";

interface PokemonCardProps {
  pokemon: FormattedPokemon;
  onPress: (pokemon: FormattedPokemon) => void;
}

const PokemonCardComponent: React.FC<PokemonCardProps> = ({ pokemon, onPress }) => {
  return (
    <Card
      style={styles.card}
      className="flex-1 bg-white rounded-2xl p-3 m-2 min-h-[185px] justify-between shadow-md elevation-4"
      onPress={() => onPress(pokemon)}
    >
      <Surface style={styles.surface} className="flex-1 bg-white justify-between rounded-2xl" elevation={0}>
        {/* Top Header Row: Name & Formatted ID */}
        <View style={styles.headerRow} className="flex-row justify-between items-center mb-2">
          <Text numberOfLines={1} style={styles.nameText} className="text-sm font-bold text-blue-600 flex-1 mr-1">
            {pokemon.displayName}
          </Text>
          <Text style={styles.idText} className="text-xs font-semibold text-gray-500">
            {pokemon.formattedId}
          </Text>
        </View>

        {/* Center Image */}
        <View style={styles.imageContainer} className="items-center justify-center my-1 h-[90px]">
          <Image
            source={{ uri: pokemon.image }}
            style={styles.image}
            className="w-[85px] h-[85px]"
            resizeMode="contain"
          />
        </View>

        {/* Bottom Row: Type Badges */}
        <View style={styles.typeRow} className="flex-row flex-wrap mt-1">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} size="sm" />
          ))}
        </View>
      </Surface>
    </Card>
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
    elevation: 4,
    minHeight: 185,
    justifyContent: "space-between",
  },
  surface: {
    flex: 1,
    backgroundColor: "transparent",
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

