import React from "react";
import { View, StyleSheet } from "react-native";

interface PokeballHeaderProps {
  size?: number;
  opacity?: number;
}

export const PokeballHeader: React.FC<PokeballHeaderProps> = ({
  size = 140,
  opacity = 0.2,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          opacity,
          right: -size * 0.2,
          top: -size * 0.2,
        },
      ]}
      pointerEvents="none"
    >
      <View style={[styles.outerCircle, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={styles.centerBand} />
        <View style={[styles.innerButtonOuter, { width: size * 0.35, height: size * 0.35, borderRadius: (size * 0.35) / 2 }]}>
          <View style={[styles.innerButtonInner, { width: size * 0.18, height: size * 0.18, borderRadius: (size * 0.18) / 2 }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  outerCircle: {
    borderWidth: 16,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  centerBand: {
    position: "absolute",
    width: "120%",
    height: 12,
    backgroundColor: "#FFFFFF",
  },
  innerButtonOuter: {
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: "#1A50E2",
    zIndex: 2,
  },
  innerButtonInner: {
    backgroundColor: "#1A50E2",
  },
});
