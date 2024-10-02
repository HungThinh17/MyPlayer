import * as React from 'react';
import styles from './styles/styles.module.css';
import { YouTubeProvider } from './store/store';
import { Footer, Header, QRCodeModal } from './modules/headerFooter';
import { VideoForm } from './modules/videoform';
import { Controls } from './modules/control';
import { YouTubePlayer } from './modules/youtubePlayer';
import { FavoriteList } from './modules/favoriteList';

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