export type FocusTrackKind = 'file' | 'stream';

export interface FocusTrack {
  id: string;
  title: string;
  subtitle: string;
  kind: FocusTrackKind;
  /** Local path under `public/` or an HTTPS stream URL. */
  src: string;
  license?: string;
}

/** Default volume on first visit (0–1). */
export const FOCUS_DEFAULT_VOLUME = 0.35;

export const FOCUS_TRACKS: FocusTrack[] = [
  {
    id: 'faraway',
    title: 'Faraway',
    subtitle: 'Ambient · local',
    kind: 'file',
    src: '/audio/focus/ambient-01.mp3',
    license: 'Public domain · Gichco',
  },
  {
    id: 'drone-zone',
    title: 'Drone Zone',
    subtitle: 'SomaFM · deep ambient',
    kind: 'stream',
    src: 'https://ice1.somafm.com/dronezone-128-mp3',
    license: 'Stream · somafm.com',
  },
  {
    id: 'groove-salad',
    title: 'Groove Salad',
    subtitle: 'SomaFM · mellow beats',
    kind: 'stream',
    src: 'https://ice1.somafm.com/groovesalad-128-mp3',
    license: 'Stream · somafm.com',
  },
];

export function focusTrackById(id: string): FocusTrack | undefined {
  return FOCUS_TRACKS.find((t) => t.id === id);
}

export function focusTrackLabel(track: FocusTrack): string {
  return track.title;
}
