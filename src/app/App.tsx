import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import styles from '../styles/styles.module.css';
import { YouTubeProvider } from '../store/store';
import { Footer, Header, QRCodeModal } from '../components/layout/headerFooter';
import { VideoForm } from '../features/player/videoform';
import { Controls } from '../features/player/control';
import { YouTubePlayer } from '../features/player/youtubePlayer';
import Sidebar from '../features/playlist/sidebar';
import { TrackInfo } from '../features/player/trackInfo';

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

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  useEffect(() => {
    if (appRef.current) {
      appRef.current.addEventListener('touchstart', handleTouchStart, { passive: false });
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
      <div className={styles.app} ref={appRef} onClick={() => setIsSidebarOpen(false)} onDoubleClick={()=>setIsSidebarOpen(true)}>
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} /> 
        <Header onToggleSidebar={toggleSidebar} />
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
