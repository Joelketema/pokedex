import React from "react";
import { StyleSheet } from "react-native";
import { Chip } from "react-native-paper";
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
    <Chip
      style={[
        styles.badge,
        { backgroundColor: colors.bg },
        isSmall ? styles.badgeSm : styles.badgeMd,
      ]}
      textStyle={[
        styles.text,
        { color: colors.text },
        isSmall ? styles.textSm : styles.textMd,
      ]}
      className={`rounded-xl mr-1 mb-1 justify-center items-center ${
        isSmall ? "px-2 py-0.5" : "px-3 py-1"
      }`}
      compact
    >
      {capitalized}
    </Chip>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
    marginBottom: 4,
    height: "auto",
    minHeight: 0,
  },
  badgeSm: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  badgeMd: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    fontWeight: "600",
    marginHorizontal: 0,
    marginVertical: 0,
  },
  textSm: {
    fontSize: 11,
    lineHeight: 14,
  },
  textMd: {
    fontSize: 13,
    lineHeight: 16,
  },
});

