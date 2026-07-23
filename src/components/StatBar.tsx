import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color?: string;
}

export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  max = 150,
  color,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 5), 100);

  // Default color mappings based on label if color is not explicitly passed
  const getBarColor = (): string => {
    if (color) return color;
    switch (label.toLowerCase()) {
      case "hp":
        return "#47D1B1"; // Green
      case "attack":
        return "#FB6C6C"; // Coral / Red
      case "defense":
        return "#F8D030"; // Light Yellow / Orange
      case "speed":
        return "#FF9D55"; // Orange
      default:
        return "#60A5FA";
    }
  };

  const barColor = getBarColor();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${percentage}%`, backgroundColor: barColor },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: "100%",
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  track: {
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
  },
});
