import * as React from 'react';
import styles from '../styles/styles.module.css';
import { useYouTubeStore } from '../store/store';

export const VideoForm: React.FC = () => {
    const { videoUrl, setVideoUrl, setVideoId, setIsPlaying } = useYouTubeStore();

    const extractVideoId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=|watch\?.*v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const id = extractVideoId(videoUrl);
        if (id) {
            setVideoId(id);
            setIsPlaying(true);
        } else {
            alert('Invalid YouTube URL');
        }
    };

    return (
        <form className={styles.videoForm} onSubmit={handleSubmit}>
            <input
                type="text"
                className={styles.youtubeUrl}
                placeholder="Enter YouTube URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
            />
            <button type="submit" className={styles.submitButton} aria-label="Submit">
                <i className="fas fa-arrow-right"></i>
            </button>
        </form>
    );
};