import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface AnimatedSplashScreenProps {
  onFinish: () => void;
}

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({
  onFinish,
}) => {
  // Animation values
  const textScale = useRef(new Animated.Value(0.3)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(-10)).current;

  const pokeballScale = useRef(new Animated.Value(0.2)).current;
  const pokeballOpacity = useRef(new Animated.Value(0)).current;
  const pokeballRotate = useRef(new Animated.Value(0)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const splashOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Sequence of Splash Animations
    Animated.sequence([
      // 1. Pokeball appears at exact center
      Animated.parallel([
        Animated.timing(pokeballOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(pokeballScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),

      // 2. App Name "PokéDex" Spells out & Pops in above Pokeball
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(textScale, {
          toValue: 1,
          friction: 5,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      // 3. Pause briefly for visual impact
      Animated.delay(650),

      // 4. Pokeball Spins & Text Gets Sucked Directly Into Pokeball Center
      Animated.parallel([
        // Pokeball 720 degree spin
        Animated.timing(pokeballRotate, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        // Text shrinks & translates down into the exact center of Pokeball
        Animated.timing(textScale, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 140, // Sucked down into center Pokeball
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // 5. White Flash / Catch Pulse
      Animated.sequence([
        Animated.timing(flashOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(flashOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),

      // 6. Smooth Fade out to main application
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  const spin = pokeballRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"],
  });

  return (
    <Animated.View style={[styles.container, { opacity: splashOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor="#1A50E2" translucent />

      {/* Decorative Background Concentric Rings */}
      <View style={styles.bgRingContainer}>
        <View style={styles.bgRingOuter} />
        <View style={styles.bgRingInner} />
      </View>

      {/* Center Screen Stage holding Text and Pokeball centered together */}
      <View style={styles.centerStage}>
        {/* Animated PokéDex Title above Pokeball */}
        <Animated.View
          style={[
            styles.textWrapper,
            {
              opacity: textOpacity,
              transform: [
                { scale: textScale },
                { translateY: textTranslateY },
              ],
            },
          ]}
        >
          <Text style={styles.appTitle}>PokéDex</Text>
          <Text style={styles.subtitle}>GOTTA CATCH 'EM ALL!</Text>
        </Animated.View>

        {/* Center Pokeball Suction Core */}
        <Animated.View
          style={[
            styles.pokeballWrapper,
            {
              opacity: pokeballOpacity,
              transform: [
                { scale: pokeballScale },
                { rotate: spin },
              ],
            },
          ]}
        >
          <View style={styles.ballOuter}>
            <View style={styles.topRed} />
            <View style={styles.bottomWhite} />
            <View style={styles.blackBand} />
            <View style={styles.buttonRing}>
              <View style={styles.buttonCore} />
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Flash Catch Glow Effect */}
      <Animated.View
        style={[styles.flashOverlay, { opacity: flashOpacity }]}
        pointerEvents="none"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#1A50E2",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  bgRingContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  bgRingOuter: {
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  bgRingInner: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  centerStage: {
    alignItems: "center",
    justifyContent: "center",
  },
  textWrapper: {
    alignItems: "center",
    marginBottom: 28,
    zIndex: 10,
  },
  appTitle: {
    fontSize: 46,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFD86F",
    letterSpacing: 3,
    marginTop: 6,
  },
  pokeballWrapper: {
    width: 130,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  ballOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: "#101C50",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  topRed: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "#EE1515", // Classic Pokemon Go Red
  },
  bottomWhite: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "#FFFFFF", // Classic Pokeball White
  },
  blackBand: {
    position: "absolute",
    width: "140%",
    height: 12,
    backgroundColor: "#101C50",
    zIndex: 1,
  },
  buttonRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 5,
    borderColor: "#101C50",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  buttonCore: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#101C50",
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
    zIndex: 99,
  },
});
