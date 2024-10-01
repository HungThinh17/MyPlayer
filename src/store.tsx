// YouTubeStore.tsx
import * as React from 'react';

interface YouTubeState {
  videoId: string | null;
  isPlaying: boolean;
  isVideoMode: boolean;
  repeat: boolean;
  favorites: Array<{ id: string; title: string }>;
  isQRCodeModalVisible: boolean;
}

interface YouTubeStore extends YouTubeState {
  setVideoId: (id: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsVideoMode: (isVideoMode: boolean) => void;
  setRepeat: (repeat: boolean) => void;
  setFavorites: (favorites: Array<{ id: string; title: string }>) => void;
  setIsQRCodeModalVisible: (isVisible: boolean) => void;
}

const YouTubeContext = React.createContext<YouTubeStore | undefined>(undefined);

export const YouTubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = React.useState<YouTubeState>({
    videoId: null,
    isPlaying: false,
    isVideoMode: true,
    repeat: false,
    favorites: [],
    isQRCodeModalVisible: false,
  });

  const store: YouTubeStore = {
    ...state,
    setVideoId: (id) => setState((prev) => ({ ...prev, videoId: id })),
    setIsPlaying: (isPlaying) => setState((prev) => ({ ...prev, isPlaying })),
    setIsVideoMode: (isVideoMode) => setState((prev) => ({ ...prev, isVideoMode })),
    setRepeat: (repeat) => setState((prev) => ({ ...prev, repeat })),
    setFavorites: (favorites) => setState((prev) => ({ ...prev, favorites })),
    setIsQRCodeModalVisible: (isVisible) => setState((prev) => ({ ...prev, isQRCodeModalVisible: isVisible })),
  };

  return <YouTubeContext.Provider value={store}>{children}</YouTubeContext.Provider>;
};

export const useYouTubeStore = () => {
  const context = React.useContext(YouTubeContext);
  if (context === undefined) {
    throw new Error('useYouTubeStore must be used within a YouTubeProvider');
  }
  return context;
};
