export interface FocusTrack {
  id: string;
  title: string;
  subtitle: string;
  /** Local path under `public/`. */
  src: string;
  license?: string;
}

/** Default volume on first visit (0–1). */
export const FOCUS_DEFAULT_VOLUME = 0.35;

export const FOCUS_TRACKS: FocusTrack[] = [
  {
    id: 'space-ambient',
    title: 'Space Ambient',
    subtitle: 'Osmic · ~10 min',
    src: '/audio/focus/ambient-01.mp3',
    license: 'CC-BY 3.0 · Osmic',
  },
  {
    id: 'november-snow',
    title: 'November Snow',
    subtitle: 'Cynic Project · ~6 min',
    src: '/audio/focus/ambient-02.mp3',
    license: 'CC0 · cynicmusic.com / pixelsphere.org',
  },
  {
    id: 'hypnotic-chill',
    title: 'Hypnotic Chill',
    subtitle: 'Cynic Project · ~4 min',
    src: '/audio/focus/ambient-03.mp3',
    license: 'cynicmusic.com / pixelsphere.org',
  },
];

export function focusTrackById(id: string): FocusTrack | undefined {
  return FOCUS_TRACKS.find((t) => t.id === id);
}

export function focusTrackLabel(track: FocusTrack): string {
  return track.title;
}
