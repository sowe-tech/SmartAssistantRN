import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

const TypingAnimation = ({color}: {color: string}) => {
  const dot1Opacity = useRef(new Animated.Value(0)).current;
  const dot2Opacity = useRef(new Animated.Value(0)).current;
  const dot3Opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            delay
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
            delay
          }),
        ]),
        { iterations: -1}
      ).start();
    };

    animateDot(dot1Opacity, 0);
    animateDot(dot2Opacity, 200);
    animateDot(dot3Opacity, 400);
  }, [dot1Opacity, dot2Opacity, dot3Opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { opacity: dot1Opacity }, {backgroundColor: color}]} />
      <Animated.View style={[styles.dot, { opacity: dot2Opacity }, {backgroundColor: color}]} />
      <Animated.View style={[styles.dot, { opacity: dot3Opacity }, {backgroundColor: color}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default TypingAnimation;
