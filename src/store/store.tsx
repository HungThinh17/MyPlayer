import * as React from 'react';

interface YouTubeState {
  videoUrl: string | null;
  videoId: string | null;
  isPlaying: boolean;
  isVideoMode: boolean;
  isFavorite: boolean;
  isPastOrClear: boolean;
  repeat: boolean;
  favorites: Array<{ id: string; title: string }>;
  isQRCodeModalVisible: boolean;
}

interface YouTubeStore extends YouTubeState {
  setVideoUrl: (url: string | null) => void;
  setVideoId: (id: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsVideoMode: (isVideoMode: boolean) => void;
  setIsFavorite: (isFavorite: boolean) => void;
  setIsPastOrClear: (isPastOrClear: boolean) => void;
  setRepeat: (repeat: boolean) => void;
  setFavorites: (favorites: Array<{ id: string; title: string }>) => void;
  setIsQRCodeModalVisible: (isVisible: boolean) => void;
}

const YouTubeContext = React.createContext<YouTubeStore | undefined>(undefined);

export const YouTubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState: YouTubeState = {
    videoUrl: null,
    videoId: null,
    isPlaying: false,
    isVideoMode: true,
    isFavorite: false,
    isPastOrClear: true,
    repeat: false,
    favorites: [],
    isQRCodeModalVisible: false,
  };

  // Load state from local storage
  const loadStateFromLocalStorage = () => {
    const savedState = localStorage.getItem('youtubeState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      return {
        ...initialState,  // Fallback for any missing properties
        ...parsedState,   // Override with saved values
        isPlaying: false  // Always set isPlaying to false
      };
    }
    return {
      ...initialState,
      isPlaying: false
    };
  };

  const [state, setState] = React.useState<YouTubeState>(loadStateFromLocalStorage());

  // Save state to local storage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('youtubeState', JSON.stringify(state));
  }, [state]);

  const store: YouTubeStore = {
    ...state,
    setVideoUrl: (url) => setState((prev) => ({ ...prev, videoUrl: url })),
    setVideoId: (id) => setState((prev) => ({ ...prev, videoId: id })),
    setIsPlaying: (isPlaying) => setState((prev) => ({ ...prev, isPlaying })),
    setIsVideoMode: (isVideoMode) => setState((prev) => ({ ...prev, isVideoMode })),
    setIsFavorite: (isFavorite) => setState((prev) => ({ ...prev, isFavorite })),
    setIsPastOrClear: (isPastOrClear) => setState((prev) => ({ ...prev, isPastOrClear })),
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