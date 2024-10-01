import * as React from 'react';
import styles from './styles.module.css';
import { useYouTubeStore, YouTubeProvider } from './store';

/// <reference types="youtube" />

const Header: React.FC = () => (
  <h1 className={styles.title}>My YouTube Player</h1>
);

const VideoForm: React.FC = () => {
  const { setVideoId, setIsPlaying } = useYouTubeStore();
  const [url, setUrl] = React.useState('');

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=|watch\?.*v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(url);
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
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required 
      />
    </form>
  );
};

const Controls: React.FC = () => {
  const { isPlaying, isVideoMode, repeat, setIsPlaying, setIsVideoMode, setRepeat } = useYouTubeStore();

  const togglePlayPause = () => setIsPlaying(!isPlaying);
  const toggleMode = () => setIsVideoMode(!isVideoMode);
  const toggleRepeat = () => setRepeat(!repeat);
  const toggleFavorite = () => {
    // Implement favorite toggling logic here
  };
  const handlePasteOrClear = () => {
    // Implement paste or clear logic here
  };

  return (
    <div className={styles.controls}>
      <button type="button" className={`${styles.iconButton} ${styles.playPauseButton}`} onClick={togglePlayPause}>
        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
      </button>
      <button className={`${styles.iconButton} ${styles.audioVideoToggleButton}`} onClick={toggleMode}>
        <i className={`fas ${isVideoMode ? 'fa-video' : 'fa-volume-up'}`}></i>
      </button>
      <button className={`${styles.iconButton} ${styles.repeatButton}`} onClick={toggleRepeat}>
        <i className={`fas ${repeat ? 'fa-sync-alt' : 'fa-redo'}`}></i>
      </button>
      <button className={`${styles.iconButton} ${styles.favoriteButton}`} onClick={toggleFavorite}>
        <i className="far fa-star"></i>
      </button>
      <button className={`${styles.iconButton} ${styles.pasteOrClearButton}`} onClick={handlePasteOrClear}>
        <i className="fas fa-paste"></i>
      </button>
    </div>
  );
};

const YouTubePlayer: React.FC = () => {
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
const FavoriteList: React.FC = () => {
  const { favorites, setVideoId, setIsPlaying } = useYouTubeStore();

  const selectFavorite = (id: string) => {
    setVideoId(id);
    setIsPlaying(true);
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

const Footer: React.FC = () => {
  const { setIsQRCodeModalVisible } = useYouTubeStore();

  const handleShowQRCode = () => {
    setIsQRCodeModalVisible(true);
  };

  return (
    <footer className={styles.footer}>
      <p>
        HungTi - nphung75@gmail.com |{' '}
        <span className={styles.qrCodeTrigger} onClick={handleShowQRCode}>
          Show QR Code
        </span>
      </p>
    </footer>
  );
};

const QRCodeModal: React.FC = () => {
  const { isQRCodeModalVisible, setIsQRCodeModalVisible } = useYouTubeStore();

  const handleCloseQRCode = () => {
    setIsQRCodeModalVisible(false);
  };

  if (!isQRCodeModalVisible) {
    return null;
  }

  return (
    <div className={styles.qrCodeModal}>
      <div className={styles.qrCodeContent}>
        <img className={styles.qrCodeImage} src="resources/download.png" alt="QR Code" />
        <button className={styles.closeQrCode} onClick={handleCloseQRCode}>
          Close
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <YouTubeProvider>
      <div className={styles.app}>
        <Header />
        <div className={styles.formContainer}>
          <VideoForm />
          <Controls />
        </div>
        <YouTubePlayer />
        <FavoriteList />
        <Footer />
        <QRCodeModal />
      </div>
    </YouTubeProvider>
  );
};

export default App;