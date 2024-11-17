import * as React from 'react';
import styles from './styles/styles.module.css';
import { YouTubeProvider } from './store/store';
import { Footer, Header, QRCodeModal } from './modules/headerFooter';
import { VideoForm } from './modules/videoform';
import { Controls } from './modules/control';
import { YouTubePlayer } from './modules/youtubePlayer';
import Sidebar, { SidebarProps } from './modules/sidebar';
import { useState, useRef, useEffect } from 'react';
import { TrackInfo } from './modules/trackInfo';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const appRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const endX = touch.clientX;
      const diffX = startX - endX;
      if (diffX > 50 && !isSidebarOpen) {
        toggleSidebar();
      }
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  useEffect(() => {
    if (appRef.current) {
      appRef.current.addEventListener('touchstart', handleTouchStart);
      appRef.current.addEventListener('mouseover', (e: MouseEvent) => {
        if (e.clientX < 50 && !isSidebarOpen) {
          toggleSidebar();
        }
      });
      return () => {
        appRef.current.removeEventListener('touchstart', handleTouchStart);
        appRef.current.removeEventListener('mouseover', (e: MouseEvent) => {
          if (e.clientX < 50 && !isSidebarOpen) {
            toggleSidebar();
          }
        });
      };
    }
  }, []);

  return (
    <YouTubeProvider>
      <div className={styles.app} ref={appRef} onClick={() => setIsSidebarOpen(false)}>
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} /> 
        <Header />
        <div className={styles.formContainer}>
          <VideoForm />
          <Controls />
        </div>
        <YouTubePlayer />
        <TrackInfo /> 
        <Footer />
        <QRCodeModal />
      </div>
    </YouTubeProvider>
  );
};

export default App;
