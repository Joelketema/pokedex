import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, TouchableOpacity } from "react-native";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: "error" | "info" | "success";
  onDismiss: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = "error",
  onDismiss,
  duration = 4000,
}) => {
  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        dismiss();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      dismiss();
    }
  }, [visible]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -80,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!visible && (opacity as any)._value === 0) return null;

  const getBgColor = () => {
    switch (type) {
      case "error":
        return "#EF4444";
      case "success":
        return "#10B981";
      case "info":
      default:
        return "#3B82F6";
    }
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          backgroundColor: getBgColor(),
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.toastIcon}>
        {type === "error" ? "⚠️" : type === "success" ? "✅" : "ℹ️"}
      </Text>
      <Text style={styles.toastMessage}>{message}</Text>
      <TouchableOpacity style={styles.dismissButton} onPress={dismiss}>
        <Text style={styles.dismissText}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    zIndex: 9999,
  },
  toastIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  toastMessage: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  dismissButton: {
    paddingLeft: 10,
    paddingVertical: 2,
  },
  dismissText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
