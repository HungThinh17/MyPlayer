const ELEMENT_IDS = {
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

let player;
let repeat = false;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let isVideoMode = true;
let isPlaying = false;

function onYouTubeIframeAPIReady() {
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

function onPlayerReady(event) {
  event.target.unMute();
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED && repeat) {
    player.playVideo();
  }
}

function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=|watch\?.*v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function loadVideo(event) {
  event.preventDefault();
  const url = document.getElementById(ELEMENT_IDS.YOUTUBE_URL).value.trim();
  const videoId = extractVideoId(url);
  if (videoId) {
    try {
      player.loadVideoById(videoId);
      player.playVideo();
      isPlaying = true;
      document.getElementById(ELEMENT_IDS.PLAY_PAUSE_BUTTON).innerHTML = '<i class="fas fa-pause"></i>';
    } catch (error) {
      alert('An error occurred while loading the video. Please try again.');
    }
  } else {
    alert('Invalid YouTube URL');
  }
}

function toggleMode(mode) {
  const playerElement = document.getElementById('youtubePlayer');
  if (mode === 'audio') {
    playerElement.style.width = "0";
    playerElement.style.height = "0";
  } else {
    playerElement.style.width = "100%";
    playerElement.style.height = "200px";
  }
}

function togglePlayPause() {
  const url = document.getElementById(ELEMENT_IDS.YOUTUBE_URL).value.trim();
  if (url === '') {
    alert('Please enter a YouTube URL to play or pause.');
    return;
  }
  try {
    const state = player.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
      player.pauseVideo();
      isPlaying = false;
      document.getElementById(ELEMENT_IDS.PLAY_PAUSE_BUTTON).innerHTML = '<i class="fas fa-play"></i>';
    } else {
      player.playVideo();
      isPlaying = true;
      document.getElementById(ELEMENT_IDS.PLAY_PAUSE_BUTTON).innerHTML = '<i class="fas fa-pause"></i>';
    }
  } catch (error) {
    alert('An error occurred. Please try again.');
  }
}

function toggleRepeat() {
  repeat = !repeat;
  const repeatButton = document.getElementById(ELEMENT_IDS.REPEAT_BUTTON);
  repeatButton.innerHTML = repeat ? '<i class="fas fa-sync-alt"></i>' : '<i class="fas fa-redo"></i>';
}

function checkInput() {
  const url = document.getElementById(ELEMENT_IDS.YOUTUBE_URL).value.trim();
  const playPauseButton = document.getElementById(ELEMENT_IDS.PLAY_PAUSE_BUTTON);
  playPauseButton.disabled = url === '';
}

function addToFavorites(videoId) {
  fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyDdU1x8lE37fnPvySQS87VD68Z72zMnixI`)
    .then(response => response.json())
    .then(data => {
      if (data.items && data.items.length > 0) {
        const title = data.items[0].snippet.title;
        if (title && title.trim() !== '') {
          favorites.push({ id: videoId, title: title });
          localStorage.setItem('favorites', JSON.stringify(favorites));
          displayFavorites();
          document.getElementById(ELEMENT_IDS.FAVORITE_BUTTON).innerHTML = '<i class="fas fa-star"></i>';
        } else {
          alert('Unable to add to favorites: Invalid video title');
        }
      } else {
        alert('Unable to add to favorites: Invalid video');
      }
    })
    .catch(error => {
      alert('Unable to add to favorites: Error fetching video details');
    });
}

function toggleFavorite() {
  const url = document.getElementById(ELEMENT_IDS.YOUTUBE_URL).value.trim();
  if (url) {
    const videoId = extractVideoId(url);
    if (videoId) {
      const index = favorites.findIndex(fav => fav.id === videoId);
      if (index > -1) {
        favorites.splice(index, 1);
        document.getElementById(ELEMENT_IDS.FAVORITE_BUTTON).innerHTML = '<i class="far fa-star"></i>';
      } else {
        addToFavorites(videoId);
        document.getElementById(ELEMENT_IDS.FAVORITE_BUTTON).innerHTML = '<i class="fas fa-star"></i>';
      }
      localStorage.setItem('favorites', JSON.stringify(favorites));
      displayFavorites();
    }
  }
}

function displayFavorites() {
  const favoriteList = document.getElementById(ELEMENT_IDS.FAVORITE_LIST);
  favoriteList.innerHTML = '';
  favorites.forEach(fav => {
    const li = document.createElement('li');
    li.textContent = fav.title;
    li.onclick = () => {
      document.getElementById(ELEMENT_IDS.YOUTUBE_URL).value = `https://www.youtube.com/watch?v=${fav.id}`;
      loadVideo(new Event('submit'));
    };
    favoriteList.appendChild(li);
  });

  const container = document.getElementById(ELEMENT_IDS.FAVORITE_LIST_CONTAINER);
  container.style.display = favorites.length > 0 ? 'block' : 'none';
}

function toggleAudioVideoMode() {
  isVideoMode = !isVideoMode;
  const playerElement = document.getElementById('youtubePlayer');
  const toggleButton = document.getElementById(ELEMENT_IDS.AUDIO_VIDEO_TOGGLE_BUTTON);

  if (isVideoMode) {
    playerElement.style.width = "100%";
    playerElement.style.height = "200px";
    toggleButton.innerHTML = '<i class="fas fa-video"></i>';
  } else {
    playerElement.style.width = "0";
    playerElement.style.height = "0";
    toggleButton.innerHTML = '<i class="fas fa-volume-up"></i>';
  }
}

function handlePasteOrClear() {
  const urlInput = document.getElementById(ELEMENT_IDS.YOUTUBE_URL);
  const pasteOrClearButton = document.getElementById(ELEMENT_IDS.PASTE_CLEAN_URL);

  if (urlInput.value.trim() === '') {
    // If the input is empty, paste from clipboard
    navigator.clipboard.readText().then(text => {
      urlInput.value = text;
      pasteOrClearButton.innerHTML = '<i class="fas fa-times"></i>';
      checkInput();
    }).catch(err => {
      console.error('Failed to read clipboard contents: ', err);
    });
  } else {
    // If the input has content, clear it
    urlInput.value = '';
    pasteOrClearButton.innerHTML = '<i class="fas fa-paste"></i>';
    checkInput();
  }
}

function initializeEventListeners() {
  document.getElementById(ELEMENT_IDS.VIDEO_FORM).addEventListener('submit', loadVideo);
  document.getElementById(ELEMENT_IDS.PLAY_PAUSE_BUTTON).addEventListener('click', togglePlayPause);
  document.getElementById(ELEMENT_IDS.REPEAT_BUTTON).addEventListener('click', toggleRepeat);
  document.getElementById(ELEMENT_IDS.YOUTUBE_URL).addEventListener('input', checkInput);
  document.getElementById(ELEMENT_IDS.FAVORITE_BUTTON).addEventListener('click', toggleFavorite);
  document.getElementById(ELEMENT_IDS.AUDIO_VIDEO_TOGGLE_BUTTON).addEventListener('click', toggleAudioVideoMode);
  document.getElementById(ELEMENT_IDS.PASTE_CLEAN_URL).addEventListener('click', handlePasteOrClear);

  document.getElementById('qrCodeTrigger').addEventListener('click', function () {
    document.getElementById('qrCodeModal').style.display = 'block';
  });

  document.getElementById('closeQrCode').addEventListener('click', function () {
    document.getElementById('qrCodeModal').style.display = 'none';
  });

  document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && (event.key === '=' || event.key === '+' || (event.shiftKey && event.key === '='))) {
      event.preventDefault();
    }
    if ((event.ctrlKey || event.metaKey) && (event.key === '-' || (event.shiftKey && event.key === '-'))) {
      event.preventDefault();
    }
  });

  document.addEventListener('wheel', function (event) {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('touchmove', function (event) {
    if (event.scale !== 1) {
      event.preventDefault();
    }
  }, { passive: false });
}

function cleanInvalidFavorites() {
  favorites = favorites.filter(fav => {
    const videoId = extractVideoId(`https://www.youtube.com/watch?v=${fav.id}`);
    return videoId !== null;
  });
  localStorage.setItem('favorites', JSON.stringify(favorites));
  displayFavorites();
}

// Function to get URL parameters
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    url: params.get('url'),
    title: params.get('title'),
    text: params.get('text')
  };
}

function handleSharedLink() {
  const sharedData = getQueryParams();
  if (sharedData.url) {
    document.getElementById(ELEMENT_IDS.YOUTUBE_URL).value = sharedData.url;
    loadVideo(new Event('submit'));
  }
}

window.onload = () => {
  toggleMode('audio');
  checkInput();
  initializeEventListeners();
  cleanInvalidFavorites();
  displayFavorites();
  handleSharedLink();
};

window.addEventListener('unload', function () {
  if (player) {
    player.stopVideo();
  }
});

// Manage video playback when the tab visibility changes
document.addEventListener('visibilitychange', function () {
  if (player && isPlaying) {
    // Optionally resume playback if the tab is visible
    player.unMute();
    player.playVideo();
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceworker.js')
      .then(registration => {
        console.log('Service Worker registered successfully:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}
