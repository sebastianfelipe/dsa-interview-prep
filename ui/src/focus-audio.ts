import { FOCUS_DEFAULT_VOLUME, FOCUS_TRACKS, focusTrackById } from './focus-tracks';

const STORAGE_KEY = 'dsa-studio-focus-audio';

export type FocusAudioPrefs = {
  trackId: string;
  volume: number;
};

const DEFAULT_PREFS: FocusAudioPrefs = {
  trackId: FOCUS_TRACKS[0]?.id ?? 'faraway',
  volume: FOCUS_DEFAULT_VOLUME,
};

function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return FOCUS_DEFAULT_VOLUME;
  return Math.min(1, Math.max(0, value));
}

export function readFocusAudioPrefs(): FocusAudioPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    const parsed = JSON.parse(raw) as Partial<FocusAudioPrefs & { enabled?: boolean }>;
    const trackId =
      typeof parsed.trackId === 'string' && focusTrackById(parsed.trackId)
        ? parsed.trackId
        : DEFAULT_PREFS.trackId;
    return {
      trackId,
      volume: clampVolume(
        typeof parsed.volume === 'number' ? parsed.volume : DEFAULT_PREFS.volume,
      ),
    };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function writeFocusAudioPrefs(prefs: FocusAudioPrefs) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        trackId: prefs.trackId,
        volume: clampVolume(prefs.volume),
      }),
    );
  } catch {
    /* ignore quota / private mode */
  }
}
