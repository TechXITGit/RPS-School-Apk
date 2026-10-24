import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

// Local asset: 9MB WebM campus tour video
const videoAsset = require('../../assets/virtual_tour.webm');

export default function CampusTourPlayer({ isVisible = true }) {
  const player = useVideoPlayer(videoAsset, (p) => {
    p.loop = true;
    p.muted = false;
    if (isVisible) {
      p.play();
    }
  });

  useEffect(() => {
    if (player) {
      if (isVisible) {
        player.play();
      } else {
        player.pause();
      }
    }
  }, [isVisible, player]);

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen={true}
        allowsPictureInPicture={true}
        nativeControls={true}
        contentFit="cover"
        surfaceType="textureView"
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
  video: {
    width: '100%',
    height: '100%',
  },
});
