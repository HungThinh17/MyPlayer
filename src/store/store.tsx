import * as React from 'react';

interface YouTubeState {
  videoUrl: string | null;
  videoId: string | null;
  isPlaying: boolean;
  isVideoMode: boolean;
  isFavorite: boolean;
  isPastOrClear: boolean;
  repeat: boolean;
  playlist: Array<{ id: string; title: string; subPlaylist?: string }>;
  isQRCodeModalVisible: boolean;
  currentVideo: { id: string; title: string } | null;
}

interface YouTubeActions {
  setVideoUrl: (url: string | null) => void;
  setVideoId: (id: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsVideoMode: (isVideoMode: boolean) => void;
  setIsFavorite: (isFavorite: boolean) => void;
  setIsPastOrClear: (isPastOrClear: boolean) => void;
  setRepeat: (repeat: boolean) => void;
  setPlaylist: (playlist: Array<{ id: string; title: string; subPlaylist?: string }>) => void;
  setIsQRCodeModalVisible: (isVisible: boolean) => void;
  setCurrentVideo: (video: { id: string; title: string } | null) => void;
  clearPlaylist: () => void;
}

const YouTubeContext = React.createContext<YouTubeState & YouTubeActions | null>(null);

export const YouTubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState: YouTubeState = {
    videoUrl: null,
    videoId: null,
    isPlaying: false,
    isVideoMode: false,
    isFavorite: false,
    isPastOrClear: true,
    repeat: false,
    playlist: [],
    isQRCodeModalVisible: false,
    currentVideo: null,
  };

  const [state, setState] = React.useState<YouTubeState>(initialState);
  // Flag to prevent initial save
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  // Load playlist on mount
  React.useEffect(() => {
    const savedPlaylist = localStorage.getItem('youtubePlaylist');
    if (savedPlaylist) {
      const parsedPlaylist = JSON.parse(savedPlaylist);
      setState(prevState => ({
        ...prevState,
        playlist: parsedPlaylist
      }));
    }
    setIsInitialLoad(false);
  }, []); // Runs only on mount

  // Save playlist changes to localStorage
  React.useEffect(() => {
    // Skip saving on initial load
    if (!isInitialLoad) {
      localStorage.setItem('youtubePlaylist', JSON.stringify(state.playlist));
    }
  }, [state.playlist, isInitialLoad]);

  const actions: YouTubeActions = {
    setVideoUrl: (url: string | null) => setState((prev) => ({ ...prev, videoUrl: url })),
    setVideoId: (id: string | null) => setState((prev) => ({ ...prev, videoId: id })),
    setIsPlaying: (isPlaying: boolean) => setState((prev) => ({ ...prev, isPlaying })),
    setIsVideoMode: (isVideoMode: boolean) => setState((prev) => ({ ...prev, isVideoMode })),
    setIsFavorite: (isFavorite: boolean) => setState((prev) => ({ ...prev, isFavorite })),
    setIsPastOrClear: (isPastOrClear: boolean) => setState((prev) => ({ ...prev, isPastOrClear })),
    setRepeat: (repeat: boolean) => setState((prev) => ({ ...prev, repeat })),
    setPlaylist: (playlist: Array<{ id: string; title: string; subPlaylist?: string }>) => setState((prev) => ({ ...prev, playlist })),
    setIsQRCodeModalVisible: (isVisible: boolean) => setState((prev) => ({ ...prev, isQRCodeModalVisible: isVisible })),
    setCurrentVideo: (video: { id: string; title: string } | null) => setState((prev) => ({ ...prev, currentVideo: video })),
    clearPlaylist: () => setState((prev) => ({ ...prev, playlist: [] })),
  };

  return (
    <YouTubeContext.Provider value={{ ...state, ...actions }}>
      {children}
    </YouTubeContext.Provider>
  );
};

export const useYouTubeStore = (): YouTubeState & YouTubeActions => {
  const context = React.useContext(YouTubeContext);
  if (context === null) {
    throw new Error('useYouTubeStore must be used within a YouTubeProvider');
  }
  return context;
};
