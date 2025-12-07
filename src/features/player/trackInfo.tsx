import React from 'react';
import styles from '../../styles/trackInfo.module.css';
import { useYouTubeStore } from '../../store/store';

export const TrackInfo: React.FC = () => {
  const { currentVideo, setIsPlaying, playNextTrack, playPreviousTrack } = useYouTubeStore();

  React.useEffect(() => {
    if (!('mediaSession' in navigator)) {
      return;
    }

    const mediaSession = (navigator as any).mediaSession;

    if (currentVideo && (window as any).MediaMetadata) {
      mediaSession.metadata = new (window as any).MediaMetadata({
        title: currentVideo.title,
        artist: 'YouTube',
        album: 'MyPlayer',
      });
    }

    mediaSession.setActionHandler('play', () => setIsPlaying(true));
    mediaSession.setActionHandler('pause', () => setIsPlaying(false));
    mediaSession.setActionHandler('previoustrack', () => playPreviousTrack());
    mediaSession.setActionHandler('nexttrack', () => playNextTrack());

    return () => {
      mediaSession.setActionHandler('play', null);
      mediaSession.setActionHandler('pause', null);
      mediaSession.setActionHandler('previoustrack', null);
      mediaSession.setActionHandler('nexttrack', null);
    };
  }, [currentVideo, setIsPlaying, playNextTrack, playPreviousTrack]);

  if (!currentVideo) {
    return (
      <div className={styles.trackInfoContainer}>
        <div className={styles.trackInfoTitle}>No track playing</div>
      </div>
    );
  }

  return (
    <div className={styles.trackInfoContainer}>
      <div className={styles.trackInfoLabel}>Now Playing</div>
      <div className={styles.trackInfoTitle}>{currentVideo.title}</div>
    </div>
  );
};
