import * as React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
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

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      const startX = touch.clientX;

      const handleTouchMove = (moveEvent: TouchEvent) => {
        const moveTouch = moveEvent.touches[0];
        const endX = moveTouch.clientX;
        const diffX = startX - endX;
        if (diffX > 50 && !isSidebarOpen) {
          toggleSidebar();
        }
        moveEvent.preventDefault();
      };

      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    },
    [isSidebarOpen, toggleSidebar]
  );

  const handleMouseOver = useCallback(
    (e: MouseEvent) => {
      if (e.clientX < 50 && !isSidebarOpen) {
        toggleSidebar();
      }
    },
    [isSidebarOpen, toggleSidebar]
  );

  useEffect(() => {
    const appElement = appRef.current;
    if (!appElement) {
      return;
    }

    appElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    appElement.addEventListener('mouseover', handleMouseOver);

    return () => {
      appElement.removeEventListener('touchstart', handleTouchStart);
      appElement.removeEventListener('mouseover', handleMouseOver);
    };
  }, [handleTouchStart, handleMouseOver]);

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
