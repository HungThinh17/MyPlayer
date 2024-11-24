import * as React from 'react';
import styles from '../styles/player.module.css';
import { useYouTubeStore } from '../store/store';
import SpinningDiskEffect from './visualEffect';

/// <reference types="youtube" />

export const YouTubePlayer: React.FC = () => {
    const { isVideoMode, videoId, isPlaying, repeat, setIsPlaying, setCurrentVideo } = useYouTubeStore();
    const [savedVolume, setSavedVolume] = React.useState<number>(100);
    const playerRef = React.useRef<any>(null);
    const repeatRef = React.useRef(repeat);
    const isPlayingRef = React.useRef(isPlaying);

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
                    autoplay: 0,
                    controls: 1,
                    modestbranding: 1,
                    showinfo: 0,
                    fs: 1,
                    rel: 0,
                    playsinline: 1,
                    volume: savedVolume
                },
                events: {
                    onReady: (event: any) => {
                        console.log('Player Ready', event.target.getVideoData());
                    },
                    onStateChange: (event: any) => {
                        switch (event.data) {
                            case (window as any).YT.PlayerState.ENDED:
                                if (repeatRef.current) {
                                    event.target.playVideo();
                                }
                                break;
                            case (window as any).YT.PlayerState.PAUSED:
                                setTimeout(() => {
                                    if (document.visibilityState === 'visible') {
                                        setIsPlaying(false);
                                    }
                                }, 300);
                                break;
                            case (window as any).YT.PlayerState.PLAYING:
                                setIsPlaying(true);
                                // If the video is playing and it's muted, unmute it
                                if (event.target.isMuted()) {
                                    event.target.unMute();
                                }

                                const videoData = event.target.getVideoData();
                                setCurrentVideo({ id: videoId || '', title: videoData.title });

                                const currentVolume = playerRef.current.getVolume();
                                setSavedVolume(currentVolume);
                                break;
                        }
                    }

                }
            });

            document.onvisibilitychange = () => {
                if (document.visibilityState === 'hidden') {
                    trackingPlayerState();
                }
            };

            function trackingPlayerState() {
                let attemptCount = 0;
                const maxAttempts = 10;

                const intervalId = setInterval(() => {
                    if (attemptCount >= maxAttempts) {
                        clearInterval(intervalId);
                        return;
                    }

                    if (playerRef.current && isPlayingRef.current) {
                        const currentState = playerRef.current.getPlayerState();

                        // Check if player is stuck or in an unexpected state
                        if (currentState !== (window as any).YT.PlayerState.PLAYING) {
                            try {
                                const currentTime = playerRef.current.getCurrentTime();
                                playerRef.current.seekTo(currentTime, true);
                                playerRef.current.playVideo();
                            } catch (error) {
                                console.warn('Error refreshing player:', error);
                            }
                        }

                        // Enhanced recovery logic
                        if (playerRef.current.isMuted()) {
                            playerRef.current.unMute();
                        }
                        playerRef.current.setVolume(savedVolume);
                    }

                    attemptCount++;
                }, 1000);

                return () => clearInterval(intervalId);
            }
        };

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

        // Add a periodic check for player health
        const healthCheckInterval = setInterval(() => {
            if (playerRef.current && isPlayingRef.current) {
                try {
                    const state = playerRef.current.getPlayerState();
                    if (state === -1 || state === (window as any).YT.PlayerState.UNSTARTED) {
                        // Reload the video if player is in an error state
                        playerRef.current.loadVideoById(videoId,
                            playerRef.current.getCurrentTime());
                    }
                } catch (error) {
                    console.warn('Player health check failed:', error);
                }
            }
        }, 5000);

        return () => clearInterval(healthCheckInterval);
    }, [videoId]);

    React.useEffect(() => {
        repeatRef.current = repeat;
        isPlayingRef.current = isPlaying;

        if (playerRef.current) {
            if (isPlaying) {
                playerRef.current.playVideo();
            } else {
                playerRef.current.pauseVideo();
            }
        }
    }, [isPlaying, repeat]);

    React.useEffect(() => {
        const player = document.getElementById('youtubePlayer');
        if (player) {
            player.style.display = isVideoMode ? 'block' : 'none';
        }

        const audioVisualizer = document.getElementById('audioVisualizer');
        if (audioVisualizer) {
            audioVisualizer.style.display = isVideoMode ? 'none' : 'block';
        }
    }, [isVideoMode]);

    return (
        <div className={styles.playerContainer}>
            <div id="youtubePlayer" className={styles.youtubePlayer}></div>
            <SpinningDiskEffect id="audioVisualizer" className={styles.audioVisualizer} />
        </div>
    );
};
