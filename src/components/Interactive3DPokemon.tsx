import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  PanResponder,
  StyleSheet,
} from "react-native";

interface Interactive3DPokemonProps {
  imageUri: string;
  pokemonName: string;
  size?: number;
}

export const Interactive3DPokemon: React.FC<Interactive3DPokemonProps> = ({
  imageUri,
  pokemonName,
  size = 140,
}) => {
  // Animated values for 3D tilt
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;
  const shadowOpacity = useRef(new Animated.Value(0.15)).current;

  // PanResponder to intercept drag gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        Animated.spring(scale, {
          toValue: 1.15,
          friction: 5,
          useNativeDriver: false,
        }).start();
        Animated.timing(shadowOpacity, {
          toValue: 0.35,
          duration: 150,
          useNativeDriver: false,
        }).start();
      },

      onPanResponderMove: (evt, gestureState) => {
        // Clamp touch distance to +/- 60px
        const maxOffset = 60;
        const clampedX = Math.max(-maxOffset, Math.min(maxOffset, gestureState.dx));
        const clampedY = Math.max(-maxOffset, Math.min(maxOffset, gestureState.dy));

        pan.setValue({ x: clampedX, y: clampedY });
      },

      onPanResponderRelease: () => {
        // Spring recoil back to center position
        Animated.parallel([
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            tension: 40,
            useNativeDriver: false,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 5,
            useNativeDriver: false,
          }),
          Animated.timing(shadowOpacity, {
            toValue: 0.15,
            duration: 250,
            useNativeDriver: false,
          }),
        ]).start();
      },
    })
  ).current;

  // Interpolate pan offsets to 3D rotation angles
  const rotateY = pan.x.interpolate({
    inputRange: [-60, 60],
    outputRange: ["-35deg", "35deg"],
    extrapolate: "clamp",
  });

  const rotateX = pan.y.interpolate({
    inputRange: [-60, 60],
    outputRange: ["35deg", "-35deg"],
    extrapolate: "clamp",
  });

  const shineTranslateX = pan.x.interpolate({
    inputRange: [-60, 60],
    outputRange: [-40, 40],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.outerContainer}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card3DContainer,
          {
            width: size,
            height: size,
            transform: [
              { perspective: 800 },
              { scale },
              { rotateX },
              { rotateY },
            ],
          },
        ]}
      >
        {/* Dynamic 3D Ground Drop Shadow */}
        <Animated.View
          style={[
            styles.dropShadow,
            {
              width: size * 0.75,
              height: 14,
              opacity: shadowOpacity,
            },
          ]}
        />

        {/* High-Res Pokémon Sprite */}
        <Image
          source={{ uri: imageUri }}
          style={{ width: size - 10, height: size - 10 }}
          resizeMode="contain"
        />

        {/* Dynamic Holographic Light Reflective Sheen Layer */}
        <Animated.View
          style={[
            styles.shineOverlay,
            {
              transform: [{ translateX: shineTranslateX }],
            },
          ]}
          pointerEvents="none"
        />
      </Animated.View>

      {/* Interactive Helper Label */}
      <View style={styles.hintBadge}>
        <Text style={styles.hintBadgeText}>🎮 Touch & Drag 3D</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  card3DContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  dropShadow: {
    position: "absolute",
    bottom: 2,
    backgroundColor: "#000000",
    borderRadius: 50,
  },
  shineOverlay: {
    position: "absolute",
    top: -20,
    left: -20,
    width: "160%",
    height: "160%",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    transform: [{ rotate: "25deg" }],
    borderRadius: 30,
  },
  hintBadge: {
    marginTop: 6,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  hintBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1D4ED8",
  },
});
