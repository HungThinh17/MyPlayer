import * as React from 'react';
import styles from '../styles/styles.module.css';
import { useYouTubeStore } from '../store/store';

export const Controls: React.FC = () => {
    const { isPlaying, isVideoMode, repeat, setIsPlaying, setIsVideoMode, setRepeat } = useYouTubeStore();

    const togglePlayPause = () => setIsPlaying(!isPlaying);
    const toggleMode = () => setIsVideoMode(!isVideoMode);
    const toggleRepeat = () => setRepeat(!repeat);
    const toggleFavorite = () => {
        // Implement favorite toggling logic here
    };
    const handlePasteOrClear = () => {
        // Implement paste or clear logic here
    };

    return (
        <div className={styles.controls}>
            <button type="button" className={`${styles.iconButton} ${styles.playPauseButton}`} onClick={togglePlayPause}>
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </button>
            <button className={`${styles.iconButton} ${styles.audioVideoToggleButton}`} onClick={toggleMode}>
                <i className={`fas ${isVideoMode ? 'fa-video' : 'fa-volume-up'}`}></i>
            </button>
            <button className={`${styles.iconButton} ${styles.repeatButton}`} onClick={toggleRepeat}>
                <i className={`fas ${repeat ? 'fa-sync-alt' : 'fa-redo'}`}></i>
            </button>
            <button className={`${styles.iconButton} ${styles.favoriteButton}`} onClick={toggleFavorite}>
                <i className="far fa-star"></i>
            </button>
            <button className={`${styles.iconButton} ${styles.pasteOrClearButton}`} onClick={handlePasteOrClear}>
                <i className="fas fa-paste"></i>
            </button>
        </div>
    );
};