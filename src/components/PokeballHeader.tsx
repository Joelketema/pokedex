import React from "react";
import { View, StyleSheet } from "react-native";

interface PokeballHeaderProps {
  size?: number;
  opacity?: number;
  color?: string;
}

export const PokeballHeader: React.FC<PokeballHeaderProps> = ({
  size = 180,
  opacity = 0.2,
  color = "#FFFFFF",
}) => {
  const borderWidth = Math.max(size * 0.08, 6);
  const bandHeight = Math.max(size * 0.07, 6);
  const outerButtonSize = size * 0.32;
  const innerButtonSize = size * 0.16;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          opacity,
          right: -size * 0.22,
          top: -size * 0.22,
        },
      ]}
      pointerEvents="none"
    >
      {/* Outer Main Circle */}
      <View
        style={[
          styles.outerCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: borderWidth,
            borderColor: color,
          },
        ]}
      >
        {/* Horizontal Center Band */}
        <View
          style={[
            styles.centerBand,
            {
              height: bandHeight,
              backgroundColor: color,
            },
          ]}
        />

        {/* Center Button Ring & Inner Circle */}
        <View
          style={[
            styles.outerButton,
            {
              width: outerButtonSize,
              height: outerButtonSize,
              borderRadius: outerButtonSize / 2,
              borderWidth: borderWidth * 0.8,
              borderColor: color,
            },
          ]}
        >
          <View
            style={[
              styles.innerButton,
              {
                width: innerButtonSize,
                height: innerButtonSize,
                borderRadius: innerButtonSize / 2,
                backgroundColor: color,
              },
            ]}
          />
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
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  centerBand: {
    position: "absolute",
    width: "140%",
    zIndex: 1,
  },
  outerButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 2,
  },
  innerButton: {
    zIndex: 3,
  },
});
