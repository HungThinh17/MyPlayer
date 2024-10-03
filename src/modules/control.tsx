import * as React from 'react';
import styles from '../styles/styles.module.css';
import { useYouTubeStore } from '../store/store';

export const Controls: React.FC = () => {
    const {
        isPlaying, isVideoMode, isFavorite, isPastOrClear,
        repeat, favorites, videoId, videoUrl,
        setIsPlaying, setIsVideoMode, setIsFavorite, setRepeat, setFavorites, setIsPastOrClear, setVideoUrl
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

        // Check if the videoId is already in the favorites list
        const isAlreadyFavorite = favorites.some(favorite => favorite.id === videoId);

        if (isAlreadyFavorite) {
            // Remove from favorites
            const updatedFavorites = favorites.filter(favorite => favorite.id !== videoId);
            setFavorites(updatedFavorites);
            setIsFavorite(false);
        } else {
            // Fetch the video title
            fetchVideoTitle(videoId).then(videoTitle => {
                if (videoTitle) {
                    // Add to favorites
                    const newFavorite = { id: videoId, title: videoTitle };
                    const updatedFavorites = [...favorites, newFavorite];
                    setFavorites(updatedFavorites);
                    setIsFavorite(true);
                } else {
                    console.log("Could not retrieve video title. Favorite not added.");
                }
            });
        }
    };

    const handlePasteOrClear = () => {
        if (isPastOrClear) {
            navigator.clipboard.readText().then(text => {
                if (text) {
                    setVideoUrl(text);
                    setIsPastOrClear(false); // Switch to clear mode
                }
            }).catch(err => {
                console.error('Failed to read clipboard contents: ', err);
            });
        } else {
            setVideoUrl(''); // Clear the URL
            setIsPastOrClear(true); // Switch back to paste mode
        }
    };


    const fetchVideoTitle = async (videoId: string) => {
        if (!videoId) {
            throw new Error("Invalid video ID");
        }

        const apiKey = 'AIzaSyDdU1x8lE37fnPvySQS87VD68Z72zMnixI'; // Replace with your actual API key
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
            return null; // or throw error based on your error handling strategy
        }
    };

    React.useEffect(() => {
        if (videoUrl) {
            setIsPastOrClear(false); // Switch to clear mode
        } else {
            setIsPastOrClear(true); // Switch back to paste mode
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
            <button className={`${styles.iconButton} ${styles.favoriteButton}`} onClick={toggleFavorite} aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                <i className={`${isFavorite ? 'fas fa-star' : 'far fa-star'}`}></i>
            </button>
            <button className={`${styles.iconButton} ${styles.pasteOrClearButton}`} onClick={handlePasteOrClear} aria-label={isPastOrClear ? "Paste" : "Clear"}>
                <i className={`${isPastOrClear ? 'fas fa-paste' : 'fas fa-times'}`}></i>
            </button>
        </div>

    );
};