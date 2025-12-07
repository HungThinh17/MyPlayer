import * as React from 'react';
import { useState } from 'react';
import styles from '../styles/styles.module.css';
import { YouTubeProvider, useYouTubeStore } from '../store/store';
import { Footer, Header, QRCodeModal } from '../components/layout/headerFooter';
import { VideoForm } from '../features/player/videoform';
import { Controls } from '../features/player/control';
import { YouTubePlayer } from '../features/player/youtubePlayer';
import { TrackInfo } from '../features/player/trackInfo';
import { Playlist } from '../features/playlist/playList';

const PlaylistPanel: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { clearPlaylist, playlist, setPlaylist } = useYouTubeStore();

  const handleClearPlaylist = () => {
    if (!playlist || playlist.length === 0) {
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmClear = () => {
    clearPlaylist();
    setShowConfirm(false);
  };

  const handleCancelClear = () => {
    setShowConfirm(false);
  };

  const handleExportPlaylist = () => {
    if (!playlist || playlist.length === 0) {
      return;
    }

    const data = JSON.stringify(playlist, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'myplayer-playlist.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportPlaylist = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          setPlaylist(parsed);
        }
      } catch {
        // Ignore invalid files
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <section className={styles.playlistSection}>
      <div className={styles.playlistActions}>
        <button className={styles.playlistActionButton} onClick={handleClearPlaylist}>
          Clear Playlist
        </button>
        <button
          className={styles.playlistActionButton}
          onClick={handleExportPlaylist}
          disabled={!playlist || playlist.length === 0}
        >
          Export
        </button>
        <label className={styles.playlistActionButton}>
          Import
          <input
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={handleImportPlaylist}
          />
        </label>
      </div>
      {showConfirm && (
        <div className={styles.playlistConfirm}>
          <p>Are you sure you want to clear the playlist?</p>
          <div className={styles.playlistConfirmButtons}>
            <button onClick={handleConfirmClear}>Yes</button>
            <button onClick={handleCancelClear}>No</button>
          </div>
        </div>
      )}
      <div className={styles.playlistScrollArea}>
        <Playlist />
      </div>
    </section>
  );
};

const App: React.FC = () => {
  return (
    <YouTubeProvider>
      <div className={styles.app}>
        <Header />
        <main className={styles.mainLayout}>
          <div className={styles.leftColumn}>
            <div className={styles.formContainer}>
              <VideoForm />
              <Controls />
            </div>
            <section className={styles.playerSection}>
              <YouTubePlayer />
              <TrackInfo />
            </section>
          </div>
          <PlaylistPanel />
        </main>
        <Footer />
        <QRCodeModal />
      </div>
    </YouTubeProvider>
  );
};

export default App;
