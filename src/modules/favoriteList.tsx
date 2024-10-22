import * as React from 'react';
import styles from '../styles/favorite.module.css';
import { useYouTubeStore } from '../store/store';

export const FavoriteList: React.FC = () => {
    const { favorites, setVideoId, setIsPlaying } = useYouTubeStore();

    const selectFavorite = (id: string) => {
        setVideoId(id);
        setTimeout(() => {
            setIsPlaying(true);
        }, 600);
    };

    return (
        <div className={styles.favoriteListContainer}>
            <h2 className={styles.favoritesTitle}>Favorites</h2>
            <ul className={styles.favoriteList}>
                {favorites.map(fav => (
                    <li key={fav.id} onClick={() => selectFavorite(fav.id)}>{fav.title}</li>
                ))}
            </ul>
        </div>
    );
};