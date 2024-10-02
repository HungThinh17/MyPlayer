import * as React from 'react';
import styles from '../styles/styles.module.css';
import { useYouTubeStore } from '../store/store';

/// <reference types="youtube" />

export const YouTubePlayer: React.FC = () => {
    const { isVideoMode, videoId, isPlaying, repeat } = useYouTubeStore();
    const playerRef = React.useRef<any>(null);

    React.useEffect(() => {
        // Load YouTube IFrame API
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        // Initialize player when API is ready
        (window as any).onYouTubeIframeAPIReady = () => {
            playerRef.current = new (window as any).YT.Player('youtubePlayer', {
                height: '360',
                width: '640',
                videoId: videoId || '',
                playerVars: {
                    autoplay: 1,
                    controls: 1,
                    modestbranding: 1,
                    showinfo: 0,
                    fs: 0,
                    rel: 0,
                    playsinline: 1
                },
                events: {
                    onStateChange: (event: any) => {
                        if (event.data === (window as any).YT.PlayerState.ENDED && repeat) {
                            event.target.playVideo();
                        }
                    }
                }
            });
        };

        document.addEventListener('visibilitychange', function () {
            if (playerRef.current && document.visibilityState === 'hidden') {
                // Optionally resume playback if the tab is visible
                 // Check if the player is muted and unmute if necessary
                 if (playerRef.current.isMuted()) {
                    playerRef.current.unMute();
                    console.log('Player unmuted');
                }

                // Check if the player is paused and resume if necessary
                const playerState = playerRef.current.getPlayerState();
                if (playerState === (window as any).YT.PlayerState.PAUSED) {
                    playerRef.current.playVideo();
                    console.log('Resumed playing');
                }
            }
        });

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, []);

    React.useEffect(() => {
        if (playerRef.current && videoId) {
            playerRef.current.loadVideoById(videoId);
        }
    }, [videoId]);

    React.useEffect(() => {
        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.playVideo();
            } else {
                playerRef.current.pauseVideo();
            }
        }
    }, [isPlaying]);

    React.useEffect(() => {
        const player = document.getElementById('youtubePlayer');
        if (player) {
            player.style.display = isVideoMode ? 'block' : 'none';
        }
    }, [isVideoMode]);

    return <div id="youtubePlayer" className={styles.youtubePlayer}></div>;
};