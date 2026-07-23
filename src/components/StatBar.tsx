import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ProgressBar } from "react-native-paper";

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
  const percentage = Math.min(Math.max(value / max, 0.05), 1);

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
    <View style={styles.container} className="my-1.5 w-full">
      <Text style={styles.label} className="text-xs text-gray-500 font-medium mb-1">
        {label}
      </Text>
      <ProgressBar
        progress={percentage}
        color={barColor}
        style={styles.track}
        className="h-1.5 rounded-full overflow-hidden w-full bg-gray-100"
      />
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
    borderRadius: 4,
    backgroundColor: "#F3F4F6",
  },
});

