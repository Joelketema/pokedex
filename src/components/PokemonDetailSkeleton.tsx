import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

export const PokemonDetailSkeleton: React.FC = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View style={styles.container}>
      {/* Card 1: Main Stats Skeleton Card */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View>
            <Animated.View style={[styles.skeletonId, { opacity }]} />
            <Animated.View style={[styles.skeletonTitle, { opacity }]} />
          </View>
          <View style={styles.badgeRow}>
            <Animated.View style={[styles.skeletonBadge, { opacity }]} />
            <Animated.View style={[styles.skeletonBadge, { opacity }]} />
          </View>
        </View>

        <View style={styles.statsBodyRow}>
          <View style={styles.statsColumn}>
            {[1, 2, 3, 4].map((item) => (
              <View key={item} style={styles.statRow}>
                <Animated.View style={[styles.skeletonStatLabel, { opacity }]} />
                <Animated.View style={[styles.skeletonStatBar, { opacity }]} />
              </View>
            ))}
          </View>

          <View style={styles.artworkColumn}>
            <Animated.View style={[styles.skeletonArtwork, { opacity }]} />
          </View>
        </View>
      </View>

      {/* Card 2: Breeding Skeleton Card */}
      <View style={styles.card}>
        <Animated.View style={[styles.skeletonSectionTitle, { opacity }]} />
        <View style={styles.breedingRow}>
          <Animated.View style={[styles.skeletonBreedingBox, { opacity }]} />
          <Animated.View style={[styles.skeletonBreedingBox, { opacity }]} />
        </View>
      </View>

      {/* Card 3: Moves Skeleton Card */}
      <View style={styles.card}>
        <Animated.View style={[styles.skeletonSectionTitle, { opacity }]} />
        <View style={styles.movesRow}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Animated.View key={item} style={[styles.skeletonMoveChip, { opacity }]} />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  skeletonId: {
    width: 40,
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 6,
  },
  skeletonTitle: {
    width: 120,
    height: 24,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
  },
  badgeRow: {
    flexDirection: "row",
  },
  skeletonBadge: {
    width: 55,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    marginLeft: 6,
  },
  statsBodyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsColumn: {
    flex: 1,
    paddingRight: 12,
  },
  statRow: {
    marginBottom: 12,
  },
  skeletonStatLabel: {
    width: 60,
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 4,
  },
  skeletonStatBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 5,
  },
  artworkColumn: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  skeletonArtwork: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#F3F4F6",
  },
  skeletonSectionTitle: {
    width: 90,
    height: 18,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 14,
  },
  breedingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skeletonBreedingBox: {
    flex: 1,
    height: 44,
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    marginHorizontal: 4,
  },
  movesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skeletonMoveChip: {
    width: 75,
    height: 28,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
});
