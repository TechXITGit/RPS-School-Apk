import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';

export default function CampusTourPlayer({ isVisible = true }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVisible]);

  return (
    <View style={styles.container}>
      <video
        ref={videoRef}
        src="https://rudrapurpublicschool.com/RPS%20photos/main_vid.webm"
        controls
        autoPlay
        playsInline
        loop
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 18,
          backgroundColor: '#000000',
          objectFit: 'cover',
          outline: 'none',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
});
