import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { Colors, Shadows, Radius } from '../theme/colors';

const camaleonSource = require('../../assets/Camaleon.json');

export default function SideChameleon() {
  const { isHindi } = useLanguage();
  const [isBubbleVisible, setIsBubbleVisible] = useState(false);
  const [bubbleMessageIndex, setBubbleMessageIndex] = useState(0);

  // Floating gentle bobbing animation
  const bobAnim = useRef(new Animated.Value(0)).current;
  // Tap scale bounce
  const scaleAnim = useRef(new Animated.Value(1)).current;
  // Speech bubble fade and slide
  const bubbleFade = useRef(new Animated.Value(0)).current;

  const messages = isHindi
    ? [
        'नमस्ते! 🦎 आरपीएस में आपका स्वागत है!',
        'सत्र 2026–27 प्रवेश खुले हैं! 🎒',
        'हमारे आधुनिक कैंपस को एक्सप्लोर करें! 🏫',
        'सीबीएसई संबद्ध • श्रेष्ठ शिक्षा 🌟',
      ]
    : [
        'Hi there! 🦎 Welcome to RPS!',
        'Admission Open 2026–27 (Nursery – V)! 🎒',
        'Explore our vibrant green campus! 🏫',
        'Excellence & Values since 2024 🌟',
      ];

  useEffect(() => {
    // Gentle floating loop animation
    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bobAnim, {
          toValue: -7,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(bobAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );
    bobLoop.start();

    return () => bobLoop.stop();
  }, [bobAnim]);

  const handleTap = () => {
    // Tap bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Toggle or rotate bubble message
    if (isBubbleVisible) {
      setBubbleMessageIndex((prev) => (prev + 1) % messages.length);
    } else {
      setIsBubbleVisible(true);
      Animated.timing(bubbleFade, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    if (isBubbleVisible) {
      const timer = setTimeout(() => {
        Animated.timing(bubbleFade, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsBubbleVisible(false);
        });
      }, 3600);
      return () => clearTimeout(timer);
    }
  }, [isBubbleVisible, bubbleMessageIndex, bubbleFade]);

  return (
    <View style={styles.anchorContainer} pointerEvents="box-none">
      {/* Interactive Speech Bubble */}
      {isBubbleVisible && (
        <Animated.View
          style={[
            styles.speechBubble,
            {
              opacity: bubbleFade,
              transform: [
                {
                  translateX: bubbleFade.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.bubbleText}>
            {messages[bubbleMessageIndex % messages.length]}
          </Text>
          <View style={styles.bubbleArrow} />
        </Animated.View>
      )}

      {/* Chameleon Animated Mascot Perched on Side Branch */}
      <Animated.View
        style={[
          styles.mascotWrapper,
          {
            transform: [
              { translateY: bobAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleTap}
          activeOpacity={0.88}
          style={styles.touchTarget}
        >
          <LottieView
            source={camaleonSource}
            autoPlay
            loop
            style={styles.lottie}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchorContainer: {
    position: 'absolute',
    right: -4,
    bottom: 410,
    zIndex: 999,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  mascotWrapper: {
    width: 105,
    height: 105,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchTarget: {
    width: 105,
    height: 105,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 105,
    height: 105,
  },
  speechBubble: {
    position: 'absolute',
    right: 95,
    bottom: 30,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.lg,
    maxWidth: 165,
    borderWidth: 1.5,
    borderColor: 'rgba(58, 104, 77, 0.25)',
    ...Shadows.md,
  },
  bubbleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#214F37',
    lineHeight: 16,
  },
  bubbleArrow: {
    position: 'absolute',
    right: -6,
    bottom: 12,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderTopColor: 'transparent',
    borderBottomWidth: 6,
    borderBottomColor: 'transparent',
    borderLeftWidth: 7,
    borderLeftColor: '#FFFFFF',
  },
});
