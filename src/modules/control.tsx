import * as React from 'react';
import styles from '../styles/styles.module.css';
import { useYouTubeStore } from '../store/store';
import { Popup } from './utilities';

interface Track {
    id: string;
    title: string;
    subPlaylist?: string;
}

export const Controls: React.FC = () => {
    const {
        isPlaying, isVideoMode, isFavorite, isPastOrClear,
        repeat, playlist, videoId, videoUrl,
        setIsPlaying, setIsVideoMode, setIsFavorite, setRepeat, setPlaylist, setIsPastOrClear, setVideoUrl
    } = useYouTubeStore();
    const [isSubPlaylistPopupOpen, setIsSubPlaylistPopupOpen] = React.useState(false);
    const [selectedSubPlaylist, setSelectedSubPlaylist] = React.useState('');

    const togglePlayPause = () => setIsPlaying(!isPlaying);
    const toggleMode = () => {
        if (!videoId) {
            setIsVideoMode(false);
            return
        }
        setIsVideoMode(!isVideoMode);
    }
    const toggleRepeat = () => setRepeat(!repeat);
    const toggleFavorite = () => {
        if (!videoId) {
            console.log("Invalid video ID. Cannot toggle favorite.");
            return;
        }
        const subPlaylists = ['**Untrack**', 'Main Playlist', ...playlist.filter(track => track.subPlaylist && track.id.includes('subplaylist')).map(track => track.subPlaylist)];
        if (subPlaylists.length > 2) {
            setIsSubPlaylistPopupOpen(true);
        } else {
            addToSubPlaylist('Main Playlist');
            setIsFavorite(true);
        }
    };

    const handleSubPlaylistSelect = (subPlaylist: string) => {
        setSelectedSubPlaylist(subPlaylist);
        if (subPlaylist === '**Untrack**') {
            removeFromPlaylist();
        } else {
            addToSubPlaylist(subPlaylist);
        }
        setIsSubPlaylistPopupOpen(false);
    };

    const addToSubPlaylist = (subPlaylist: string) => {
        if (!videoId) return;
        fetchVideoTitle(videoId).then(videoTitle => {
            if (videoTitle) {
                const newTrack: Track = { id: videoId, title: videoTitle, subPlaylist };
                const existingTrackIndex = playlist.findIndex(track => track.id === videoId);
                if (existingTrackIndex === -1) {
                    const updatedPlaylist = [...playlist, newTrack];
                    setPlaylist(updatedPlaylist);
                    setIsFavorite(true);
                } else {
                    const updatedPlaylist = [...playlist];
                    updatedPlaylist[existingTrackIndex].subPlaylist = subPlaylist;
                    setPlaylist(updatedPlaylist);
                    setIsFavorite(true);
                    console.log('Track subplaylist updated.');
                }
            } else {
                console.log("Could not retrieve video title. Track not added.");
            }
        });
    };

    const removeFromPlaylist = () => {
        if (!videoId) return;
        const updatedPlaylist = playlist.filter(track => track.id !== videoId);
        setPlaylist(updatedPlaylist);
        setIsFavorite(false);
    };

    const handlePasteOrClear = () => {
        if (isPastOrClear) {
            if (!navigator.clipboard) {
                alert('Clipboard is not available in this browser.');
                return;
            }

            navigator.clipboard.readText()
                .then(text => {
                    if (!text) {
                        alert('Clipboard is empty or unavailable.');
                        return;
                    }
                    console.log('Pasted Text:', text);
                    setVideoUrl(text);
                    setIsPastOrClear(false);
                })
                .catch(err => {
                    console.error('Failed to read clipboard contents: ', err);
                    alert('Failed to read from clipboard. Please paste manually.');
                });
        } else {
            setVideoUrl('');
            setIsPastOrClear(true);
        }
    };

    const fetchVideoTitle = async (videoId: string) => {
        if (!videoId) {
            throw new Error("Invalid video ID");
        }

        const apiKey = 'AIzaSyDdU1x8lE37fnPvySQS87VD68Z72zMnixI';
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching video data: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.items.length === 0) {
                throw new Error("No video found for the given ID");
            }

            const videoTitle = data.items[0].snippet.title;
            return videoTitle;
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    };

    React.useEffect(() => {
        if (videoUrl) {
            setIsPastOrClear(false);
        } else {
            setIsPastOrClear(true);
        }
    }, [videoUrl]);

    const subPlaylists = ['**Untrack**', 'Main Playlist', ...playlist.filter(track => track.subPlaylist && track.id.includes('subplaylist')).map(track => track.subPlaylist)];

    return (
        <div className={styles.controls}>
            <button type="button" className={`${styles.iconButton} ${styles.playPauseButton}`} onClick={togglePlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </button>
            <button className={`${styles.iconButton} ${styles.audioVideoToggleButton}`} onClick={toggleMode} aria-label={isVideoMode ? "Switch to audio mode" : "Switch to video mode"}>
                <i className={`fas ${isVideoMode ? 'fa-video' : 'fa-volume-up'}`}></i>
            </button>
            <button className={`${styles.iconButton} ${styles.repeatButton}`} onClick={toggleRepeat} aria-label={repeat ? "Turn off repeat" : "Turn on repeat"}>
                <i className={`fas ${repeat ? 'fa-sync-alt' : 'fa-redo'}`}></i>
            </button>
            <button className={`${styles.iconButton} ${styles.favoriteButton}`} onClick={toggleFavorite} aria-label={isFavorite ? "Remove from playlist" : "Add to playlist"}>
                <i className={`${isFavorite ? 'fas fa-star' : 'far fa-star'}`}></i>
            </button>
            <button className={`${styles.iconButton} ${styles.pasteOrClearButton}`} onClick={handlePasteOrClear} aria-label={isPastOrClear ? "Paste" : "Clear"}>
                <i className={`${isPastOrClear ? 'fas fa-paste' : 'fas fa-times'}`}></i>
            </button>
            <Popup isOpen={isSubPlaylistPopupOpen} onClose={() => setIsSubPlaylistPopupOpen(false)}>
                <h2>Select Subplaylist</h2>
                {subPlaylists.length > 2 && (
                    <>
                        <select className={styles.subPlaylistSelect} value={selectedSubPlaylist} onChange={(e) => setSelectedSubPlaylist(e.target.value)}>
                            {subPlaylists.map(subPlaylist => (
                                <option key={subPlaylist} value={subPlaylist}>{subPlaylist}</option>
                            ))}
                        </select>
                        <div className={styles.popupButtons}>
                            <button onClick={() => handleSubPlaylistSelect(selectedSubPlaylist)}>OK</button>
                            <button onClick={() => setIsSubPlaylistPopupOpen(false)}>Cancel</button>
                        </div>
                    </>
                )}
            </Popup>
        </div>
    );
};
