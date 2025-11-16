import React, { useState } from 'react';
import styles from '../styles/sidebar.module.css';
import { Playlist } from './playList';
import { useYouTubeStore } from '../store/store';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { clearPlaylist, playlist, setPlaylist } = useYouTubeStore();

  const handleClearPlaylist = () => {
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
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`} onClick={e => e.stopPropagation()}>
      <div className={styles.sidebarContent}>
        <Playlist onClose={onClose} />
        {showConfirm && (
          <div className={styles.confirmPopup}>
            <p>Are you sure you want to clear the playlist?</p>
            <button onClick={handleConfirmClear}>Yes</button>
            <button onClick={handleCancelClear}>No</button>
          </div>
        )}
      </div>
      <div className={styles.sidebarActions}>
        <button className={styles.clearButton} onClick={handleClearPlaylist}>
          Clear Playlist
        </button>
        <button className={styles.clearButton} onClick={handleExportPlaylist}>
          Export
        </button>
        <label className={styles.clearButton}>
          Import
          <input
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={handleImportPlaylist}
          />
        </label>
      </div>
    </div>
  );
};

export default Sidebar;
