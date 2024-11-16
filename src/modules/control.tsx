import * as React from 'react';
import styles from '../styles/styles.module.css';
import { useYouTubeStore } from '../store/store';

export const Controls: React.FC = () => {
    const {
        isPlaying, isVideoMode, isFavorite, isPastOrClear,
        repeat, playlist, videoId, videoUrl, // Changed to playlist
        setIsPlaying, setIsVideoMode, setIsFavorite, setRepeat, setPlaylist, setIsPastOrClear, setVideoUrl // Changed to setPlaylist
    } = useYouTubeStore();

    const togglePlayPause = () => setIsPlaying(!isPlaying);
    const toggleMode = () => setIsVideoMode(!isVideoMode);
    const toggleRepeat = () => setRepeat(!repeat);
    const toggleFavorite = () => {
        // Check if videoId is valid
        if (!videoId) {
            console.log("Invalid video ID. Cannot toggle favorite.");
            return; // Do nothing if videoId is not valid
        }

        // Check if the videoId is already in the playlist
        const isAlreadyInPlaylist = playlist.some(track => track.id === videoId);

        if (isAlreadyInPlaylist) {
            // Remove from playlist
            const updatedPlaylist = playlist.filter(track => track.id !== videoId);
            setPlaylist(updatedPlaylist);
            setIsFavorite(false);
        } else {
            // Fetch the video title
            fetchVideoTitle(videoId).then(videoTitle => {
                if (videoTitle) {
                    // Add to playlist
                    const newTrack = { id: videoId, title: videoTitle };
                    const updatedPlaylist = [...playlist, newTrack];
                    setPlaylist(updatedPlaylist);
                    setIsFavorite(true);
                } else {
                    console.log("Could not retrieve video title. Track not added.");
                }
            });
        }
    };

    const handlePasteOrClear = () => {
        if (isPastOrClear) {
            if (navigator.clipboard) { 
                navigator.clipboard.readText().then(text => {
                    if (text) {
                        console.log('Pasted Text:', text); 
                        setVideoUrl(text);
                        setIsPastOrClear(false); 
                    }
                }).catch(err => {
                    console.error('Failed to read clipboard contents: ', err);
                });
            } else {
                // Do nothing if Clipboard API is not supported
            }
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
            <button className={`${styles.iconButton} ${styles.favoriteButton}`} onClick={toggleFavorite} aria-label={isFavorite ? "Remove from playlist" : "Add to playlist"}> {/* Changed label */}
                <i className={`${isFavorite ? 'fas fa-star' : 'far fa-star'}`}></i>
            </button>
            <button className={`${styles.iconButton} ${styles.pasteOrClearButton}`} onClick={handlePasteOrClear} aria-label={isPastOrClear ? "Paste" : "Clear"} disabled={!navigator.clipboard}>
                <i className={`${isPastOrClear ? 'fas fa-paste' : 'fas fa-times'}`}></i>
            </button>
        </div>
    );
};
