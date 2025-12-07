export const SUBPLAYLIST_MARKER_ID = 'subplaylist';
export const MAIN_PLAYLIST_NAME = 'Main Playlist';
export const UNTRACK_LABEL = '**Untrack**';

export type SubPlaylistName = string;

export interface PlaylistItem {
  id: string;
  title: string;
  subPlaylist?: string;
}

export const getPlayableTracks = <T extends PlaylistItem>(playlist: T[]): T[] =>
  playlist.filter(track => track.id !== SUBPLAYLIST_MARKER_ID);

export const getSubPlaylists = <T extends PlaylistItem>(playlist: T[]): SubPlaylistName[] => {
  const names = new Set<string>();

  playlist.forEach(track => {
    if (track.id === SUBPLAYLIST_MARKER_ID && track.subPlaylist) {
      names.add(track.subPlaylist);
    }
  });

  return Array.from(names);
};

export const groupBySubPlaylist = <T extends PlaylistItem>(playlist: T[]): Record<SubPlaylistName, T[]> => {
  const groups: Record<string, T[]> = {};

  playlist.forEach(track => {
    const sub = track.subPlaylist || MAIN_PLAYLIST_NAME;
    if (!groups[sub]) {
      groups[sub] = [];
    }
    groups[sub].push(track);
  });

  return groups;
};

