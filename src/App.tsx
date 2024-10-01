import * as React from 'react';
import styles from './styles.module.css';

const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <h1 className={styles.title}>My YouTube Player</h1>
      <div className={styles.formContainer}>
        <form className={styles.videoForm}>
          <input type="text" className={styles.youtubeUrl} placeholder="Enter YouTube URL" required />
        </form>
        <div className={styles.controls}>
          <button type="button" className={`${styles.iconButton} ${styles.playPauseButton}`} disabled>
            <i className="fas fa-play"></i>
          </button>
          <button className={`${styles.iconButton} ${styles.audioVideoToggleButton}`}>
            <i className="fas fa-video"></i>
          </button>
          <button className={`${styles.iconButton} ${styles.repeatButton}`}>
            <i className="fas fa-redo"></i>
          </button>
          <button className={`${styles.iconButton} ${styles.favoriteButton}`}>
            <i className="far fa-star"></i>
          </button>
          <button className={`${styles.iconButton} ${styles.pasteOrClearButton}`}>
            <i className="fas fa-paste"></i>
          </button>
        </div>        
      </div>
      <div className={styles.youtubePlayer}></div>
      <div className={styles.favoriteListContainer} style={{display: 'none'}}>
        <h2 className={styles.favoritesTitle}>Favorites</h2>
        <ul className={styles.favoriteList}></ul>
      </div>
      <footer className={styles.footer}>
        <p>HungTi - nphung75@gmail.com | <span className={styles.qrCodeTrigger}>Show QR Code</span></p>
      </footer>
      <div className={styles.qrCodeModal} style={{display: 'none'}}>
        <div className={styles.qrCodeContent}>
          <img className={styles.qrCodeImage} src="resources/download.png" alt="QR Code" />
          <button className={styles.closeQrCode}>Close</button>
        </div>
      </div>
    </div>
  );
};
export default App;
