import * as React from 'react';
import styles from '../styles/playlist.module.css';
import { useYouTubeStore } from '../store/store';

interface PlaylistProps {
  onClose: () => void;
}

export const Playlist: React.FC<PlaylistProps> = ({ onClose }) => {
    const { playlist, setVideoId, setIsPlaying } = useYouTubeStore();

    const selectTrack = (id: string) => {
        setVideoId(id);
        setTimeout(() => {
            setIsPlaying(true);
        }, 600);
    };

    return (
        <div className={styles.playlistContainer} onClick={onClose}> {/* Added onClick */}
            <h2 className={styles.playlistTitle}>Playlist</h2>
            <ul className={styles.playlistList}>
                {playlist.map(track => (
                    <li key={track.id} onClick={() => selectTrack(track.id)}>{track.title}</li>
                ))}
            </ul>
        </div>
    );
};
