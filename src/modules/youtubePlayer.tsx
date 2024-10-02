import * as React from 'react';
import styles from '../styles/styles.module.css';
import { useYouTubeStore } from '../store/store';

/// <reference types="youtube" />

export const YouTubePlayer: React.FC = () => {
    const { videoId, isPlaying, repeat } = useYouTubeStore();
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
                    rel: 0
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

    return <div id="youtubePlayer" className={styles.youtubePlayer}></div>;
};