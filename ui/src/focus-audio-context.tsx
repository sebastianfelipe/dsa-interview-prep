import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { FOCUS_TRACKS, focusTrackById, type FocusTrack } from './focus-tracks';
import { readFocusAudioPrefs, writeFocusAudioPrefs } from './focus-audio';

type FocusAudioContextValue = {
  track: FocusTrack;
  volume: number;
  playing: boolean;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;
  togglePanel: () => void;
  toggle: () => void;
  play: () => void;
  playTrack: (trackId: string) => void;
  pause: () => void;
  setTrackId: (trackId: string) => void;
  setVolume: (volume: number) => void;
};

const FocusAudioContext = createContext<FocusAudioContextValue | null>(null);

function trackUrl(src: string): string {
  return new URL(src, window.location.origin).href;
}

export function FocusAudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prefsRef = useRef(readFocusAudioPrefs());
  /** User intent — keep playing through route/view changes unless they pause. */
  const wantPlayingRef = useRef(false);
  const [trackId, setTrackIdState] = useState(prefsRef.current.trackId);
  const [volume, setVolumeState] = useState(prefsRef.current.volume);
  const [playing, setPlaying] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const track = focusTrackById(trackId) ?? FOCUS_TRACKS[0];

  const persist = useCallback((nextTrackId: string, nextVolume: number) => {
    writeFocusAudioPrefs({ trackId: nextTrackId, volume: nextVolume });
    prefsRef.current = { trackId: nextTrackId, volume: nextVolume };
  }, []);

  const assignTrack = useCallback((audio: HTMLAudioElement, nextTrack: FocusTrack) => {
    const nextSrc = trackUrl(nextTrack.src);
    if (audio.src !== nextSrc) {
      audio.src = nextSrc;
    }
    audio.loop = true;
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    wantPlayingRef.current = true;
    assignTrack(audio, track);
    audio.volume = volume;
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      wantPlayingRef.current = false;
      setPlaying(false);
    }
  }, [assignTrack, track, volume]);

  const pause = useCallback(() => {
    wantPlayingRef.current = false;
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (wantPlayingRef.current || playing) pause();
    else void play();
  }, [pause, play, playing]);

  const playTrack = useCallback(
    async (nextId: string) => {
      const nextTrack = focusTrackById(nextId);
      if (!nextTrack) return;
      setTrackIdState(nextId);
      persist(nextId, volume);
      const audio = audioRef.current;
      if (!audio) return;
      wantPlayingRef.current = true;
      assignTrack(audio, nextTrack);
      audio.volume = volume;
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        wantPlayingRef.current = false;
        setPlaying(false);
      }
    },
    [assignTrack, persist, volume],
  );

  const setTrackId = useCallback(
    (nextId: string) => {
      const nextTrack = focusTrackById(nextId);
      if (!nextTrack) return;
      setTrackIdState(nextId);
      persist(nextId, volume);
      const audio = audioRef.current;
      if (!audio) return;
      assignTrack(audio, nextTrack);
      audio.volume = volume;
      if (wantPlayingRef.current) {
        void audio.play().then(() => setPlaying(true)).catch(() => {
          wantPlayingRef.current = false;
          setPlaying(false);
        });
      }
    },
    [assignTrack, persist, volume],
  );

  const setVolume = useCallback(
    (next: number) => {
      const clamped = Math.min(1, Math.max(0, next));
      setVolumeState(clamped);
      if (audioRef.current) audioRef.current.volume = clamped;
      persist(trackId, clamped);
    },
    [persist, trackId],
  );

  const togglePanel = useCallback(() => {
    setPanelOpen((open) => !open);
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audioRef.current = audio;

    const onPlay = () => setPlaying(true);
    const onPause = () => {
      if (wantPlayingRef.current) {
        void audio.play().catch(() => {
          wantPlayingRef.current = false;
          setPlaying(false);
        });
        return;
      }
      setPlaying(false);
    };
    const onEnded = () => {
      if (wantPlayingRef.current && audio.loop) {
        void audio.play().catch(() => setPlaying(false));
        return;
      }
      if (!audio.loop) setPlaying(wantPlayingRef.current);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      wantPlayingRef.current = false;
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    assignTrack(audio, track);
    audio.volume = volume;
  }, [assignTrack, track, volume]);

  const value = useMemo(
    () => ({
      track,
      volume,
      playing,
      panelOpen,
      setPanelOpen,
      togglePanel,
      toggle,
      play,
      playTrack,
      pause,
      setTrackId,
      setVolume,
    }),
    [
      track,
      volume,
      playing,
      panelOpen,
      togglePanel,
      toggle,
      play,
      playTrack,
      pause,
      setTrackId,
      setVolume,
    ],
  );

  return createElement(FocusAudioContext.Provider, { value }, children);
}

export function useFocusAudio() {
  const ctx = useContext(FocusAudioContext);
  if (!ctx) throw new Error('useFocusAudio must be used within FocusAudioProvider');
  return ctx;
}
