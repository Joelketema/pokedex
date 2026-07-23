import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export const SkeletonCard: React.FC = () => {
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
    <View style={styles.card}>
      {/* Header Row Skeleton */}
      <View style={styles.headerRow}>
        <Animated.View style={[styles.skeletonLineShort, { opacity }]} />
        <Animated.View style={[styles.skeletonId, { opacity }]} />
      </View>

      {/* Image Block Skeleton */}
      <View style={styles.imageContainer}>
        <Animated.View style={[styles.skeletonCircle, { opacity }]} />
      </View>

      {/* Type Pills Row Skeleton */}
      <View style={styles.typeRow}>
        <Animated.View style={[styles.skeletonBadge, { opacity }]} />
        <Animated.View style={[styles.skeletonBadge, { opacity, width: 45 }]} />
      </View>
    </View>
  );
};

export const PokemonSkeleton: React.FC = () => {
  const skeletonItems = [1, 2, 3, 4, 6];

  return (
    <View style={styles.gridContainer}>
      {skeletonItems.map((item) => (
        <SkeletonCard key={item} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 12,
    margin: 8,
    minHeight: 185,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skeletonLineShort: {
    width: 70,
    height: 14,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
  },
  skeletonId: {
    width: 32,
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
  },
  skeletonCircle: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: "#F3F4F6",
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  skeletonBadge: {
    width: 50,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    marginRight: 6,
  },
});
