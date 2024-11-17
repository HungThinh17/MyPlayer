import * as React from 'react';
import styles from '../styles/playlist.module.css';
import { useYouTubeStore } from '../store/store';
import { Popup } from './utilities';

interface PlaylistProps {
    onClose?: () => void;
}

export const Playlist: React.FC<PlaylistProps> = ({ onClose }) => {
    const { playlist, setVideoId, setIsPlaying, setPlaylist } = useYouTubeStore();
    const [newSubPlaylistName, setNewSubPlaylistName] = React.useState('');
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);
    const [expandedSubPlaylists, setExpandedSubPlaylists] = React.useState<{ [key: string]: boolean }>({});

    const selectTrack = (id: string) => {
        setVideoId(id);
        setTimeout(() => {
            setIsPlaying(true);
        }, 600);
        onClose && onClose();
    };

    const addSubPlaylist = () => {
        if (newSubPlaylistName.trim() !== '') {
            setPlaylist([...playlist, { id: 'subplaylist', title: newSubPlaylistName, subPlaylist: newSubPlaylistName }]);
            setNewSubPlaylistName('');
            setIsPopupOpen(false);
        }
    };

    const groupedPlaylist: { [key: string]: { id: string; title: string; subPlaylist?: string }[] } = {};
    playlist.forEach(track => {
        const subPlaylist = track.subPlaylist || 'Main Playlist';
        if (!groupedPlaylist[subPlaylist]) {
            groupedPlaylist[subPlaylist] = [];
        }
        groupedPlaylist[subPlaylist].push(track);
    });

    const toggleSubPlaylist = (subPlaylistName: string) => {
        setExpandedSubPlaylists({
            ...expandedSubPlaylists,
            [subPlaylistName]: !expandedSubPlaylists[subPlaylistName],
        });
    };

    return (
        <div className={styles.playlistContainer}>
            <div className={styles.playlistHeader}>
                <h2 className={styles.playlistTitle}>Playlist</h2>
                <button className={styles.addSubPlaylistButton} onClick={() => setIsPopupOpen(true)}>+</button>
                <Popup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                    <input type="text" value={newSubPlaylistName} onChange={e => setNewSubPlaylistName(e.target.value)} placeholder="New Sub Playlist Name" className={styles.popupInput} />
                    <div className={styles.popupButtons}>
                        <button onClick={addSubPlaylist}>Save</button>
                        <button onClick={() => setIsPopupOpen(false)}>Cancel</button>
                    </div>
                </Popup>
            </div>
            {Object.entries(groupedPlaylist).map(([subPlaylistName, tracks]) => {
                if (subPlaylistName !== 'Main Playlist') {
                    return (
                        <div key={subPlaylistName}>
                            <div className={styles.subPlaylistHeader} onClick={() => toggleSubPlaylist(subPlaylistName)}>
                                <h3>{subPlaylistName}</h3>
                                <span className={styles.expandIcon}>{expandedSubPlaylists[subPlaylistName] ? '-' : '+'}</span>
                            </div>
                            {expandedSubPlaylists[subPlaylistName] && (
                                <ul className={styles.playlistList}>
                                    {tracks
                                        .filter(track => {
                                            // You can add more conditions here if needed
                                            return track.id !== 'subplaylist';
                                        })
                                        .map(track => (
                                            <li
                                                key={track.id}
                                                onClick={() => selectTrack(track.id)}
                                                className={styles.trackItem}
                                            >
                                                {track.title}
                                            </li>
                                        ))
                                    }
                                </ul>
                            )}
                        </div>
                    );
                }
                return (
                    <ul className={styles.playlistList} key="Main Playlist">
                        {tracks.map(track => (
                            <li key={track.id} onClick={() => selectTrack(track.id)}>{track.title}</li>
                        ))}
                    </ul>
                );
            })}
        </div>
    );
};
