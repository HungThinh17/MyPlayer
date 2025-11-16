import * as React from 'react';

export interface PlaylistTrack {
  id: string;
  title: string;
  subPlaylist?: string;
}

interface YouTubeState {
  videoUrl: string | null;
  videoId: string | null;
  isPlaying: boolean;
  isVideoMode: boolean;
  isFavorite: boolean;
  isPastOrClear: boolean;
  repeat: boolean;
  playlist: PlaylistTrack[];
  isQRCodeModalVisible: boolean;
  currentVideo: { id: string; title: string } | null;
}

interface YouTubeActions {
  setVideoUrl: (url: string | null) => void;
  setVideoId: (id: string | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  setIsVideoMode: (isVideoMode: boolean) => void;
  setIsFavorite: (isFavorite: boolean) => void;
  setIsPastOrClear: (isPastOrClear: boolean) => void;
  setRepeat: (repeat: boolean) => void;
  setPlaylist: (playlist: PlaylistTrack[]) => void;
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

  const loadPlaylistFromStorage = (): PlaylistTrack[] => {
    try {
      const savedPlaylist = localStorage.getItem('youtubePlaylist');
      if (!savedPlaylist) {
        return [];
      }
      const parsed = JSON.parse(savedPlaylist);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed;
    } catch {
      return [];
    }
  };

  const savePlaylistToStorage = (playlist: PlaylistTrack[]) => {
    try {
      localStorage.setItem('youtubePlaylist', JSON.stringify(playlist));
    } catch {
      // Ignore storage errors
    }
  };

  // Load playlist on mount
  React.useEffect(() => {
    const storedPlaylist = loadPlaylistFromStorage();
    if (storedPlaylist.length > 0) {
      setState(prevState => ({
        ...prevState,
        playlist: storedPlaylist
      }));
    }
    setIsInitialLoad(false);
  }, []); // Runs only on mount

  // Save playlist changes to localStorage
  React.useEffect(() => {
    // Skip saving on initial load
    if (!isInitialLoad) {
      savePlaylistToStorage(state.playlist);
    }
  }, [state.playlist, isInitialLoad]);

  const actions: YouTubeActions = {
    setVideoUrl: (url: string | null) => setState((prev) => ({ ...prev, videoUrl: url })),
    setVideoId: (id: string | null) => setState((prev) => ({ ...prev, videoId: id })),
    setIsPlaying: (isPlaying: boolean) => setState((prev) => ({ ...prev, isPlaying })),
    playNextTrack: () =>
      setState((prev) => {
        const tracks = prev.playlist.filter((track) => track.id !== 'subplaylist');
        if (tracks.length === 0) {
          return prev;
        }

        const currentId = prev.videoId || prev.currentVideo?.id || tracks[0].id;
        const currentIndex = tracks.findIndex((track) => track.id === currentId);
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % tracks.length;
        const nextId = tracks[nextIndex].id;

        return {
          ...prev,
          videoId: nextId,
          isPlaying: true,
        };
      }),
    playPreviousTrack: () =>
      setState((prev) => {
        const tracks = prev.playlist.filter((track) => track.id !== 'subplaylist');
        if (tracks.length === 0) {
          return prev;
        }

        const currentId = prev.videoId || prev.currentVideo?.id || tracks[0].id;
        const currentIndex = tracks.findIndex((track) => track.id === currentId);
        const previousIndex =
          currentIndex === -1 ? 0 : (currentIndex - 1 + tracks.length) % tracks.length;
        const previousId = tracks[previousIndex].id;

        return {
          ...prev,
          videoId: previousId,
          isPlaying: true,
        };
      }),
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
