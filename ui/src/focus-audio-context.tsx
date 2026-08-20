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
  pause: () => void;
  setTrackId: (trackId: string) => void;
  setVolume: (volume: number) => void;
};

const FocusAudioContext = createContext<FocusAudioContextValue | null>(null);

export function FocusAudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prefsRef = useRef(readFocusAudioPrefs());
  const [trackId, setTrackIdState] = useState(prefsRef.current.trackId);
  const [volume, setVolumeState] = useState(prefsRef.current.volume);
  const [playing, setPlaying] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const track = focusTrackById(trackId) ?? FOCUS_TRACKS[0];

  const persist = useCallback((nextTrackId: string, nextVolume: number) => {
    writeFocusAudioPrefs({ trackId: nextTrackId, volume: nextVolume });
    prefsRef.current = { trackId: nextTrackId, volume: nextVolume };
  }, []);

  const applyTrackToAudio = useCallback(
    (audio: HTMLAudioElement, nextTrack: FocusTrack) => {
      if (audio.src !== new URL(nextTrack.src, window.location.origin).href) {
        audio.src = nextTrack.src;
        audio.load();
      }
      audio.loop = nextTrack.kind === 'file';
      audio.volume = volume;
    },
    [volume],
  );

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    applyTrackToAudio(audio, track);
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }, [applyTrackToAudio, track]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (playing) pause();
    else void play();
  }, [pause, play, playing]);

  const setTrackId = useCallback(
    (nextId: string) => {
      const nextTrack = focusTrackById(nextId);
      if (!nextTrack) return;
      setTrackIdState(nextId);
      persist(nextId, volume);
      const audio = audioRef.current;
      if (!audio) return;
      const wasPlaying = playing;
      audio.pause();
      applyTrackToAudio(audio, nextTrack);
      if (wasPlaying) void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    },
    [applyTrackToAudio, persist, playing, volume],
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
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
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
    applyTrackToAudio(audio, track);
  }, [applyTrackToAudio, track]);

  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio || !playing) return;
      if (document.hidden) audio.pause();
      else void audio.play().catch(() => undefined);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [playing]);

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
