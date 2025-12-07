const API_BASE_URL = 'https://www.googleapis.com/youtube/v3/videos';

const getApiKey = (): string | undefined => {
  const key = process.env.YT_API_KEY;
  if (!key || key.trim() === '') {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('YT_API_KEY is not configured; video titles will not be fetched.');
    }
    return undefined;
  }
  return key;
};

export const getVideoTitle = async (videoId: string): Promise<string | null> => {
  if (!videoId) {
    throw new Error('Invalid video ID');
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  const url = `${API_BASE_URL}?id=${encodeURIComponent(videoId)}&key=${encodeURIComponent(apiKey)}&part=snippet`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching video data: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      throw new Error('No video found for the given ID');
    }

    const videoTitle = data.items[0]?.snippet?.title;
    return typeof videoTitle === 'string' ? videoTitle : null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching video title:', error);
    return null;
  }
};

