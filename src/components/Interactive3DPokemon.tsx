import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  PanResponder,
  TouchableOpacity,
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
  backImageUri,
  pokemonName,
  size = 145,
}) => {
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [showBackView, setShowBackView] = useState(false);

  // Animated rotation values
  const rotateYAnim = useRef(new Animated.Value(0)).current;
  const rotateXAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Auto-spin animation reference
  const autoSpinAnim = useRef<Animated.CompositeAnimation | null>(null);

  // Previous touch position memory
  const lastX = useRef(0);
  const lastY = useRef(0);
  const currentDegY = useRef(0);
  const currentDegX = useRef(0);

  // Handle continuous rotation calculation & front/back flip detection
  const updateRotation = (degY: number, degX: number) => {
    currentDegY.current = degY;
    currentDegX.current = degX;

    rotateYAnim.setValue(degY);
    rotateXAnim.setValue(degX);

    // Normalize angle to 0-360 range to check front vs back
    const normalizedY = ((degY % 360) + 360) % 360;
    if (normalizedY > 90 && normalizedY < 270) {
      setShowBackView(true);
    } else {
      setShowBackView(false);
    }
  };

  // PanResponder for continuous 360° manual drag gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        if (isAutoSpinning) {
          stopAutoSpin();
        }
        Animated.spring(scaleAnim, {
          toValue: 1.15,
          friction: 5,
          useNativeDriver: false,
        }).start();
      },

      onPanResponderMove: (evt, gestureState) => {
        // Map 1px touch movement to 1.5 degrees rotation
        const deltaX = gestureState.dx - lastX.current;
        const deltaY = gestureState.dy - lastY.current;

        lastX.current = gestureState.dx;
        lastY.current = gestureState.dy;

        const nextDegY = currentDegY.current + deltaX * 1.5;
        const nextDegX = currentDegX.current - deltaY * 1.5;

        updateRotation(nextDegY, nextDegX);
      },

      onPanResponderRelease: () => {
        lastX.current = 0;
        lastY.current = 0;

        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  // Toggle Auto 360° Continuous Spin
  const toggleAutoSpin = () => {
    if (isAutoSpinning) {
      stopAutoSpin();
    } else {
      startAutoSpin();
    }
  };

  const startAutoSpin = () => {
    setIsAutoSpinning(true);

    autoSpinAnim.current = Animated.loop(
      Animated.timing(rotateYAnim, {
        toValue: currentDegY.current + 360,
        duration: 3500,
        useNativeDriver: false,
      })
    );

    // Track rotation angle to toggle back vs front sprite during auto-spin
    const listenerId = rotateYAnim.addListener(({ value }) => {
      const normalizedY = ((value % 360) + 360) % 360;
      if (normalizedY > 90 && normalizedY < 270) {
        setShowBackView(true);
      } else {
        setShowBackView(false);
      }
      currentDegY.current = value;
    });

    autoSpinAnim.current.start();
  };

  const stopAutoSpin = () => {
    if (autoSpinAnim.current) {
      autoSpinAnim.current.stop();
    }
    rotateYAnim.removeAllListeners();
    setIsAutoSpinning(false);
  };

  // Interpolate rotation angles into string degree values
  const rotateYString = rotateYAnim.interpolate({
    inputRange: [-36000, 36000],
    outputRange: ["-36000deg", "36000deg"],
  });

  const rotateXString = rotateXAnim.interpolate({
    inputRange: [-36000, 36000],
    outputRange: ["-36000deg", "36000deg"],
  });

  const activeImage = showBackView && backImageUri ? backImageUri : imageUri;

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
              { perspective: 900 },
              { scale: scaleAnim },
              { rotateX: rotateXString },
              { rotateY: rotateYString },
            ],
          },
        ]}
      >
        {/* Dynamic 3D Ground Drop Shadow */}
        <View style={[styles.dropShadow, { width: size * 0.7, height: 12 }]} />

        {/* High-Res Pokémon Sprite */}
        <Image
          source={{ uri: activeImage }}
          style={[
            { width: size - 10, height: size - 10 },
            showBackView && styles.backViewFlipped,
          ]}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Control Actions Row */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[styles.actionChip, isAutoSpinning && styles.actionChipActive]}
          activeOpacity={0.8}
          onPress={toggleAutoSpin}
        >
          <Text style={[styles.actionChipText, isAutoSpinning && styles.actionChipTextActive]}>
            {isAutoSpinning ? "⏸️ Pause 360°" : "🔄 Auto 360° Spin"}
          </Text>
        </TouchableOpacity>
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
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    borderRadius: 50,
  },
  backViewFlipped: {
    transform: [{ scaleX: -1 }], // Natural mirror flip for back view
  },
  controlsRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  actionChip: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  actionChipActive: {
    backgroundColor: "#1D4ED8",
    borderColor: "#1D4ED8",
  },
  actionChipText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1D4ED8",
  },
  actionChipTextActive: {
    color: "#FFFFFF",
  },
});
