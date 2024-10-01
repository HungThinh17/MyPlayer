/// <reference types="youtube" />

interface ElementIds {
    YOUTUBE_PLAYER: string;
    YOUTUBE_URL: string;
    PLAY_PAUSE_BUTTON: string;
    REPEAT_BUTTON: string;
    VIDEO_FORM: string;
    FAVORITE_BUTTON: string;
    FAVORITE_LIST: string;
    FAVORITE_LIST_CONTAINER: string;
    AUDIO_VIDEO_TOGGLE_BUTTON: string;
    PASTE_CLEAN_URL: string;
  }
  
  const ELEMENT_IDS: ElementIds = {
    YOUTUBE_PLAYER: 'youtubePlayer',
    YOUTUBE_URL: 'youtubeUrl',
    PLAY_PAUSE_BUTTON: 'playPauseButton',
    REPEAT_BUTTON: 'repeatButton',
    VIDEO_FORM: 'videoForm',
    FAVORITE_BUTTON: 'favoriteButton',
    FAVORITE_LIST: 'favoriteList',
    FAVORITE_LIST_CONTAINER: 'favoriteListContainer',
    AUDIO_VIDEO_TOGGLE_BUTTON: 'audioVideoToggleButton',
    PASTE_CLEAN_URL: 'pasteOrClearButton'
  };
  
  let player: YT.Player;
  let repeat: boolean = false;
  let favorites: Array<{ id: string; title: string }> = JSON.parse(localStorage.getItem('favorites') || '[]');
  let isVideoMode: boolean = true;
  let isPlaying: boolean = false;
  
  function onYouTubeIframeAPIReady(): void {
    player = new YT.Player(ELEMENT_IDS.YOUTUBE_PLAYER, {
      playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        showinfo: 0,
        fs: 0,
        rel: 0
      },
      events: {
        'onStateChange': onPlayerStateChange,
        'onReady': onPlayerReady
      }
    });
  }
  
  function onPlayerReady(event: YT.PlayerEvent): void {
    event.target.unMute();
    event.target.playVideo();
  }
  
  function onPlayerStateChange(event: YT.OnStateChangeEvent): void {
    if (event.data === YT.PlayerState.ENDED && repeat) {
      player.playVideo();
    }
  }
  
  function extractVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=|watch\?.*v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  
  function loadVideo(event: Event): void {
    event.preventDefault();
    const url = (document.getElementById(ELEMENT_IDS.YOUTUBE_URL) as HTMLInputElement).value.trim();
    const videoId = extractVideoId(url);
    if (videoId) {
      try {
        player.loadVideoById(videoId);
        player.playVideo();
        isPlaying = true;
        (document.getElementById(ELEMENT_IDS.PLAY_PAUSE_BUTTON) as HTMLElement).innerHTML = '<i class="fas fa-pause"></i>';
      } catch (error) {
        alert('An error occurred while loading the video. Please try again.');
      }
    } else {
      alert('Invalid YouTube URL');
    }
  }
  
  function toggleMode(mode: string): void {
    const playerElement = document.getElementById('youtubePlayer');
    if (mode === 'audio') {
      playerElement!.style.width = "0";
      playerElement!.style.height = "0";
    } else {
      playerElement!.style.width = "100%";
      playerElement!.style.height = "200px";
    }
  }
  
  function togglePlayPause(): void {
    const url = (document.getElementById(ELEMENT_IDS.YOUTUBE_URL) as HTMLInputElement).value.trim();
    if (url === '') {
      alert('Please enter a YouTube URL to play or pause.');
      return;
    }
    try {
      const state = player.getPlayerState();
      if (state === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        isPlaying = false;
        (document.getElementById(ELEMENT_IDS.PLAY_PAUSE_BUTTON) as HTMLElement).innerHTML = '<i class="fas fa-play"></i>';
      } else {
        player.playVideo();
        isPlaying = true;
        (document.getElementById(ELEMENT_IDS.PLAY_PAUSE_BUTTON) as HTMLElement).innerHTML = '<i class="fas fa-pause"></i>';
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  }
  
  function toggleRepeat(): void {
    repeat = !repeat;
    const repeatButton = document.getElementById(ELEMENT_IDS.REPEAT_BUTTON);
    repeatButton!.innerHTML = repeat ? '<i class="fas fa-sync-alt"></i>' : '<i class="fas fa-redo"></i>';
  }
  
  // Export functions that need to be accessed from other files
  export { loadVideo, toggleMode, togglePlayPause, toggleRepeat };
  
  // Attach functions to window object for global access
  (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
  (window as any).loadVideo = loadVideo;
  (window as any).toggleMode = toggleMode;
  (window as any).togglePlayPause = togglePlayPause;
  (window as any).toggleRepeat = toggleRepeat;
  