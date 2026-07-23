import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TYPE_COLORS } from "../const";

interface TypeBadgeProps {
  type: string;
  size?: "sm" | "md";
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, size = "sm" }) => {
  const normalizedType = type.toLowerCase();
  const colors = TYPE_COLORS[normalizedType] || { bg: "#A8A77A", text: "#FFFFFF" };
  const capitalized = type.charAt(0).toUpperCase() + type.slice(1);

  const isSmall = size === "sm";

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg },
        isSmall ? styles.badgeSm : styles.badgeMd,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: colors.text },
          isSmall ? styles.textSm : styles.textMd,
        ]}
      >
        {capitalized}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
    marginBottom: 4,
  },
  badgeSm: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeMd: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  text: {
    fontWeight: "600",
  },
  textSm: {
    fontSize: 11,
  },
  textMd: {
    fontSize: 13,
  },
});
