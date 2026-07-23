import React from "react";
import { View, StyleSheet } from "react-native";

interface PokeballHeaderProps {
  size?: number;
  opacity?: number;
}

export const PokeballHeader: React.FC<PokeballHeaderProps> = ({
  size = 180,
  opacity = 0.85,
}) => {
  const borderWidth = Math.max(size * 0.05, 5);
  const bandHeight = Math.max(size * 0.09, 8);
  const outerButtonSize = size * 0.38;
  const middleButtonSize = size * 0.25;
  const innerButtonSize = size * 0.12;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          opacity,
          right: -size * 0.15,
          top: -size * 0.12,
        },
      ]}
      pointerEvents="none"
    >
      {/* Outer Ball Container */}
      <View
        style={[
          styles.ballContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: borderWidth,
            borderColor: "#122262",
          },
        ]}
      >
        {/* Top Maroon/Purple Hemisphere */}
        <View style={styles.topHemisphere} />

        {/* Bottom Soft Blue/Periwinkle Hemisphere */}
        <View style={styles.bottomHemisphere} />

        {/* Horizontal Center Dark Line */}
        <View style={[styles.centerLine, { height: bandHeight }]} />

        {/* Center Button Assembly */}
        <View
          style={[
            styles.outerButton,
            {
              width: outerButtonSize,
              height: outerButtonSize,
              borderRadius: outerButtonSize / 2,
              backgroundColor: "#122262",
            },
          ]}
        >
          {/* Middle Button Ring (Light Blue) */}
          <View
            style={[
              styles.middleButton,
              {
                width: middleButtonSize,
                height: middleButtonSize,
                borderRadius: middleButtonSize / 2,
                backgroundColor: "#798CE4",
                borderWidth: borderWidth * 0.7,
                borderColor: "#122262",
              },
            ]}
          >
            {/* Inner Core Ring */}
            <View
              style={[
                styles.innerButton,
                {
                  width: innerButtonSize,
                  height: innerButtonSize,
                  borderRadius: innerButtonSize / 2,
                  backgroundColor: "#798CE4",
                  borderWidth: borderWidth * 0.6,
                  borderColor: "#122262",
                },
              ]}
            />
          </View>
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
  ballContainer: {
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  topHemisphere: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "#591E42", // Dark maroon/purple top half matching screenshot
  },
  bottomHemisphere: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "#798CE4", // Soft light blue bottom half matching screenshot
  },
  centerLine: {
    position: "absolute",
    width: "140%",
    backgroundColor: "#122262", // Dark navy center band matching screenshot
    zIndex: 1,
  },
  outerButton: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  middleButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  innerButton: {},
});
