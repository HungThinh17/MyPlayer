import React from 'react';
import styles from '../styles/trackInfo.module.css';
import { useYouTubeStore } from '../store/store';

export const TrackInfo: React.FC = () => {
  const { currentVideo } = useYouTubeStore();

  if (!currentVideo) {
    return <div className={styles.trackInfoContainer}>No track playing</div>;
  }

  return (
    <div className={styles.trackInfoContainer}>
      <h3>{currentVideo.title}</h3>
      {/* Removed the <p>ID: {currentVideo.id}</p> line */}
    </div>
  );
};
