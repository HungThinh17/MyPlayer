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
  const { clearPlaylist } = useYouTubeStore();

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

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`} onClick={e => e.stopPropagation()}>
      <Playlist onClose={onClose} />
      {showConfirm && (
        <div className={styles.confirmPopup}>
          <p>Are you sure you want to clear the playlist?</p>
          <button onClick={handleConfirmClear}>Yes</button>
          <button onClick={handleCancelClear}>No</button>
        </div>
      )}
      <button className={styles.clearButton} onClick={handleClearPlaylist}>
        Clear Playlist
      </button>
    </div>
  );
};

export default Sidebar;
