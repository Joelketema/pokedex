import React, { useRef, useEffect } from "react";
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
  backImageUri?: string;
  pokemonName: string;
  size?: number;
}

export const Interactive3DPokemon: React.FC<Interactive3DPokemonProps> = ({
  imageUri,
  size = 140,
}) => {
  // Core tilt values (clamped, not full 360)
  const tiltX = useRef(new Animated.Value(0)).current; // -1 to 1
  const tiltY = useRef(new Animated.Value(0)).current; // -1 to 1
  const liftScale = useRef(new Animated.Value(1)).current;
  const hintOpacity = useRef(new Animated.Value(0.7)).current;
  const isPressed = useRef(false);

  // Gentle pulse animation for the interactive hint badge
  useEffect(() => {
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(hintOpacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(hintOpacity, {
          toValue: 0.5,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnim.start();
    return () => pulseAnim.stop();
  }, [hintOpacity]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        isPressed.current = true;
        // Lift up on press
        Animated.spring(liftScale, {
          toValue: 1.12,
          friction: 6,
          tension: 100,
          useNativeDriver: false,
        }).start();
      },

      onPanResponderMove: (_evt, gesture) => {
        // Map gesture to -1..1 range (80px full travel)
        const maxDrag = 80;
        const nx = Math.max(-1, Math.min(1, gesture.dx / maxDrag));
        const ny = Math.max(-1, Math.min(1, gesture.dy / maxDrag));
        tiltX.setValue(nx);
        tiltY.setValue(ny);
      },

      onPanResponderRelease: () => {
        isPressed.current = false;
        // Spring back to resting position
        Animated.parallel([
          Animated.spring(tiltX, {
            toValue: 0,
            friction: 5,
            tension: 60,
            useNativeDriver: false,
          }),
          Animated.spring(tiltY, {
            toValue: 0,
            friction: 5,
            tension: 60,
            useNativeDriver: false,
          }),
          Animated.spring(liftScale, {
            toValue: 1,
            friction: 6,
            tension: 80,
            useNativeDriver: false,
          }),
        ]).start();
      },
    })
  ).current;

  // ── Derived interpolations ──

  // Perspective rotations (max ±25deg)
  const rotateY = tiltX.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-25deg", "25deg"],
  });
  const rotateX = tiltY.interpolate({
    inputRange: [-1, 1],
    outputRange: ["25deg", "-25deg"],
  });

  // Shadow shifts opposite to tilt for grounded feel
  const shadowOffsetX = tiltX.interpolate({
    inputRange: [-1, 1],
    outputRange: [8, -8],
  });
  const shadowOffsetY = tiltY.interpolate({
    inputRange: [-1, 1],
    outputRange: [-4, 12],
  });
  const shadowScale = tiltY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0.65, 0.8, 0.95],
  });
  const shadowOpacity = tiltY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0.08, 0.18, 0.28],
  });

  // Specular highlight moves with tilt
  const highlightX = tiltX.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-50%", "50%"],
  });
  const highlightY = tiltY.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-40%", "60%"],
  });
  const highlightOpacity = tiltX.interpolate({
    inputRange: [-1, -0.2, 0, 0.2, 1],
    outputRange: [0.3, 0.08, 0.04, 0.08, 0.3],
  });

  // Slight translucent edge glow color shift
  const edgeGlowOpacity = tiltX.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0.25, 0, 0.25],
  });

  const platformSize = size * 0.65;

  return (
    <View style={styles.outerWrapper}>
      <View style={[styles.wrapper, { width: size + 10, height: size + 10 }]}>
        {/* ── Ground Shadow (ellipse below the pokemon) ── */}
        <Animated.View
          style={[
            styles.groundShadow,
            {
              width: platformSize,
              height: 14,
              bottom: 4,
              opacity: shadowOpacity,
              transform: [
                { translateX: shadowOffsetX },
                { translateY: shadowOffsetY },
                { scaleX: shadowScale },
              ],
            },
          ]}
        />

        {/* ── 3D Tilting Container ── */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.tiltContainer,
            {
              width: size,
              height: size,
              transform: [
                { perspective: 600 },
                { scale: liftScale },
                { rotateX },
                { rotateY },
              ],
            },
          ]}
        >
          {/* Pokémon Image */}
          <Image
            source={{ uri: imageUri }}
            style={{ width: size - 8, height: size - 8 }}
            resizeMode="contain"
          />

          {/* ── Specular Highlight Overlay ── */}
          <Animated.View
            style={[
              styles.specularHighlight,
              {
                left: highlightX,
                top: highlightY,
                opacity: highlightOpacity,
              },
            ]}
            pointerEvents="none"
          />

          {/* ── Edge Rim Light ── */}
          <Animated.View
            style={[
              styles.edgeRimLight,
              {
                opacity: edgeGlowOpacity,
              },
            ]}
            pointerEvents="none"
          />
        </Animated.View>
      </View>

      {/* ── Interactive Hint Badge ── */}
      <Animated.View style={[styles.hintBadge, { opacity: hintOpacity }]}>
        <Text style={styles.hintBadgeText}>Touch & Drag 3D</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  groundShadow: {
    position: "absolute",
    backgroundColor: "#1A2050",
    borderRadius: 50,
    alignSelf: "center",
  },
  tiltContainer: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    position: "relative",
  },
  specularHighlight: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  edgeRimLight: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  hintBadge: {
    marginTop: 4,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 9,
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
