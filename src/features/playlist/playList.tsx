import * as React from 'react';
import styles from '../../styles/playlist.module.css';
import { useYouTubeStore, PlaylistTrack } from '../../store/store';
import { Popup } from '../../components/common/Popup';
import {
  getPlayableTracks,
  getSubPlaylists,
  groupBySubPlaylist,
  MAIN_PLAYLIST_NAME,
  SUBPLAYLIST_MARKER_ID,
  SubPlaylistName,
} from '../../store/playlistHelpers';

interface PlaylistProps {
  onClose?: () => void;
}

export const Playlist: React.FC<PlaylistProps> = ({ onClose }) => {
  const { playlist, setVideoId, setIsPlaying, setPlaylist, videoId, currentVideo } = useYouTubeStore();

  const [newSubPlaylistName, setNewSubPlaylistName] = React.useState('');
  const [isNewSubPlaylistPopupOpen, setIsNewSubPlaylistPopupOpen] = React.useState(false);

  const [expandedSubPlaylists, setExpandedSubPlaylists] = React.useState<{ [key: string]: boolean }>({});

  const [isTrackActionsOpen, setIsTrackActionsOpen] = React.useState(false);
  const [selectedTrackId, setSelectedTrackId] = React.useState<string | null>(null);
  const [selectedTrackSubPlaylist, setSelectedTrackSubPlaylist] = React.useState('Main Playlist');

  const [isSubPlaylistActionsOpen, setIsSubPlaylistActionsOpen] = React.useState(false);
  const [selectedSubPlaylistName, setSelectedSubPlaylistName] = React.useState<string | null>(null);

  const availableSubPlaylists = React.useMemo(
    () => [MAIN_PLAYLIST_NAME, ...getSubPlaylists<PlaylistTrack>(playlist)],
    [playlist]
  );

  const groupedPlaylist: Record<SubPlaylistName, PlaylistTrack[]> = React.useMemo(
    () => groupBySubPlaylist<PlaylistTrack>(playlist),
    [playlist]
  );

  const selectTrack = (id: string) => {
    setVideoId(id);
    setTimeout(() => {
      setIsPlaying(true);
    }, 600);
    if (onClose) {
      onClose();
    }
  };

  const addSubPlaylist = () => {
    if (newSubPlaylistName.trim() === '') {
      return;
    }
    const marker: PlaylistTrack = {
      id: SUBPLAYLIST_MARKER_ID,
      title: newSubPlaylistName,
      subPlaylist: newSubPlaylistName,
    };
    setPlaylist([...playlist, marker]);
    setNewSubPlaylistName('');
    setIsNewSubPlaylistPopupOpen(false);
  };

  const toggleSubPlaylist = (subPlaylistName: string) => {
    setExpandedSubPlaylists((prev) => ({
      ...prev,
      [subPlaylistName]: !prev[subPlaylistName],
    }));
  };

  const openTrackActions = (event: React.MouseEvent<HTMLLIElement>, trackId: string) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedTrackId(trackId);
    const track = playlist.find((t: PlaylistTrack) => t.id === trackId);
    setSelectedTrackSubPlaylist(track?.subPlaylist || 'Main Playlist');
    setIsTrackActionsOpen(true);
  };

  const handleMoveTrack = () => {
    if (!selectedTrackId) return;
    const updated = playlist.map((track: PlaylistTrack) => {
      if (track.id === selectedTrackId) {
        return {
          ...track,
          subPlaylist: selectedTrackSubPlaylist === 'Main Playlist' ? undefined : selectedTrackSubPlaylist,
        };
      }
      return track;
    });
    setPlaylist(updated);
    setIsTrackActionsOpen(false);
  };

  const handleRemoveTrack = () => {
    if (!selectedTrackId) return;
    if (!window.confirm('Remove this track from the playlist?')) {
      return;
    }
    const updated = playlist.filter((track: PlaylistTrack) => track.id !== selectedTrackId);
    setPlaylist(updated);
    setIsTrackActionsOpen(false);
  };

  const moveTrackByOffset = (offset: number) => {
    if (!selectedTrackId) return;
    const index = playlist.findIndex(
      (track: PlaylistTrack) => track.id === selectedTrackId && track.id !== SUBPLAYLIST_MARKER_ID
    );
    if (index === -1) {
      return;
    }
    const newIndex = Math.max(0, Math.min(playlist.length - 1, index + offset));
    if (newIndex === index) {
      return;
    }
    const updated = [...playlist];
    const [item] = updated.splice(index, 1);
    updated.splice(newIndex, 0, item);
    setPlaylist(updated);
  };

  const openSubPlaylistActions = (event: React.MouseEvent<HTMLDivElement>, subPlaylistName: string) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedSubPlaylistName(subPlaylistName);
    setIsSubPlaylistActionsOpen(true);
  };

  const moveSubPlaylistToMain = (subPlaylistName: string) => {
    const updated = playlist
      .filter(
        (track: PlaylistTrack) =>
          !(
            track.id === SUBPLAYLIST_MARKER_ID &&
            track.subPlaylist === subPlaylistName &&
            track.title === subPlaylistName
          )
      )
      .map((track: PlaylistTrack) => {
        if (track.subPlaylist === subPlaylistName && track.id !== SUBPLAYLIST_MARKER_ID) {
          const { subPlaylist, ...rest } = track;
          return { ...rest, subPlaylist: undefined };
        }
        return track;
      });
    setPlaylist(updated);
    setExpandedSubPlaylists((prev) => {
      const next = { ...prev };
      delete next[subPlaylistName];
      return next;
    });
  };

  const deleteSubPlaylistWithTracks = (subPlaylistName: string) => {
    const updated = playlist.filter(
      (track: PlaylistTrack) =>
        !(
          track.subPlaylist === subPlaylistName ||
          (track.id === SUBPLAYLIST_MARKER_ID &&
            track.subPlaylist === subPlaylistName &&
            track.title === subPlaylistName)
        )
    );
    setPlaylist(updated);
    setExpandedSubPlaylists((prev) => {
      const next = { ...prev };
      delete next[subPlaylistName];
      return next;
    });
  };

  const totalTracks = React.useMemo(
    () => getPlayableTracks<PlaylistTrack>(playlist).length,
    [playlist]
  );

  return (
    <div className={styles.playlistContainer}>
      <div className={styles.playlistHeader}>
        <h2 className={styles.playlistTitle}>Playlist ({totalTracks})</h2>
        <button className={styles.addSubPlaylistButton} onClick={() => setIsNewSubPlaylistPopupOpen(true)}>
          +
        </button>
        <Popup isOpen={isNewSubPlaylistPopupOpen} onClose={() => setIsNewSubPlaylistPopupOpen(false)}>
          <input
            type="text"
            value={newSubPlaylistName}
            onChange={(e) => setNewSubPlaylistName(e.target.value)}
            placeholder="New Sub Playlist Name"
            className={styles.popupInput}
          />
          <div className={styles.popupButtons}>
            <button onClick={addSubPlaylist}>Save</button>
            <button onClick={() => setIsNewSubPlaylistPopupOpen(false)}>Cancel</button>
          </div>
        </Popup>
      </div>
      {Object.entries(groupedPlaylist).map(([subPlaylistName, tracks]) => {
        if (subPlaylistName !== MAIN_PLAYLIST_NAME) {
          return (
            <div key={subPlaylistName}>
              <div
                className={styles.subPlaylistHeader}
                onClick={() => toggleSubPlaylist(subPlaylistName)}
                onContextMenu={(e) => openSubPlaylistActions(e, subPlaylistName)}
              >
                <h3 className={styles.subPlaylistTitle} title={subPlaylistName}>{subPlaylistName}</h3>
                <div className={styles.subPlaylistHeaderActions}>
                  <span className={styles.expandIcon}>{expandedSubPlaylists[subPlaylistName] ? '-' : '+'}</span>
                </div>
              </div>
              {expandedSubPlaylists[subPlaylistName] && (
                <ul className={styles.playlistList}>
                  {tracks
                    .filter((track: PlaylistTrack) => track.id !== SUBPLAYLIST_MARKER_ID)
                    .map((track: PlaylistTrack) => {
                      const isCurrent = track.id === videoId || track.id === currentVideo?.id;
                      return (
                        <li
                          key={track.id}
                          onClick={() => selectTrack(track.id)}
                          onContextMenu={(e) => openTrackActions(e, track.id)}
                          className={`${styles.trackItem} ${isCurrent ? styles.currentTrackItem : ''}`}
                        >
                          <span className={styles.playlistItemTitle}>{track.title}</span>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
          );
        }
        return (
          <ul className={styles.playlistList} key={subPlaylistName}>
            {tracks
              .filter((track: PlaylistTrack) => track.id !== SUBPLAYLIST_MARKER_ID)
              .map((track: PlaylistTrack) => {
                const isCurrent = track.id === videoId || track.id === currentVideo?.id;
                return (
                  <li
                    key={track.id}
                    onClick={() => selectTrack(track.id)}
                    onContextMenu={(e) => openTrackActions(e, track.id)}
                    className={`${styles.trackItem} ${isCurrent ? styles.currentTrackItem : ''}`}
                  >
                    <span className={styles.playlistItemTitle}>{track.title}</span>
                  </li>
                );
              })}
          </ul>
        );
      })}
      <Popup isOpen={isTrackActionsOpen} onClose={() => setIsTrackActionsOpen(false)}>
        <h3>Manage track</h3>
        <div>
          <label>
            Move to:
            <select
              value={selectedTrackSubPlaylist}
              onChange={(e) => setSelectedTrackSubPlaylist(e.target.value)}
              className={styles.popupInput}
            >
              {availableSubPlaylists.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.popupButtons}>
          <button onClick={handleMoveTrack}>Move</button>
          <button onClick={() => moveTrackByOffset(-1)}>Move Up</button>
          <button onClick={() => moveTrackByOffset(1)}>Move Down</button>
          <button onClick={handleRemoveTrack}>Remove</button>
        </div>
      </Popup>
      <Popup isOpen={isSubPlaylistActionsOpen} onClose={() => setIsSubPlaylistActionsOpen(false)}>
        <h3>Manage subplaylist</h3>
        <p>{selectedSubPlaylistName}</p>
        <div className={styles.popupButtons}>
          <button
            onClick={() => {
              if (!selectedSubPlaylistName) return;
              moveSubPlaylistToMain(selectedSubPlaylistName);
              setIsSubPlaylistActionsOpen(false);
            }}
          >
            Move tracks to Main
          </button>
          <button
            onClick={() => {
              if (!selectedSubPlaylistName) return;
              if (!window.confirm('Remove this subplaylist and all its tracks?')) {
                return;
              }
              deleteSubPlaylistWithTracks(selectedSubPlaylistName);
              setIsSubPlaylistActionsOpen(false);
            }}
          >
            Remove subplaylist & tracks
          </button>
        </div>
      </Popup>
    </div>
  );
};
