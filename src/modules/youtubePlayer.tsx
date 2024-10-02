import * as React from 'react';
import styles from '../styles/player.module.css';
import { useYouTubeStore } from '../store/store';
import SpinningDiskEffect from './visualEffect';

/// <reference types="youtube" />

export const YouTubePlayer: React.FC = () => {
    const { videoUrl, isVideoMode, videoId, isPlaying, repeat, setIsPlaying } = useYouTubeStore();
    const playerRef = React.useRef<any>(null);
    const repeatRef = React.useRef(repeat);

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
                        if (event.data === (window as any).YT.PlayerState.ENDED && repeatRef.current) {
                            event.target.playVideo();
                        } else if (event.data === (window as any).YT.PlayerState.PAUSED) {
                            setTimeout(() => {
                                if (document.visibilityState === 'visible') {
                                    setIsPlaying(false);
                                } else if (document.visibilityState === 'hidden') {
                                    event.target.playVideo();
                                }
                            }, 300);
                        } else if (event.data === (window as any).YT.PlayerState.PLAYING) {
                            setIsPlaying(true);
                        }
                    }
                }
            });
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
    }, [videoId]);

    React.useEffect(() => {
        repeatRef.current = repeat;

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
        <div>
            <div id="youtubePlayer" className={styles.youtubePlayer} ></div>
            <SpinningDiskEffect id="audioVisualizer" className={styles.audioVisualizer} />
        </div>
    );
};