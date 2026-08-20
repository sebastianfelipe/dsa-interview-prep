import { useEffect, useId, useRef } from 'react';
import { FOCUS_TRACKS } from '../focus-tracks';
import { useFocusAudio } from '../focus-audio-context';

export function FocusMusicToggle() {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const {
    track,
    volume,
    playing,
    panelOpen,
    setPanelOpen,
    togglePanel,
    toggle,
    setTrackId,
    setVolume,
  } = useFocusAudio();

  useEffect(() => {
    if (!panelOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setPanelOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPanelOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [panelOpen, setPanelOpen]);

  return (
    <div className="focus-audio" ref={rootRef}>
      <div className="focus-audio-toggle-group">
        <button
          type="button"
          className={`theme-toggle focus-audio-toggle${playing ? ' is-playing' : ''}`}
          aria-pressed={playing}
          aria-label={playing ? `Pause focus music (${track.title})` : 'Start focus music'}
          title={playing ? `Pause · ${track.title}` : 'Focus music'}
          onClick={() => toggle()}
        >
          <span className="focus-audio-icon" aria-hidden="true" />
          <span className="theme-toggle-label">{playing ? track.title : 'Focus'}</span>
        </button>
        <button
          type="button"
          className="focus-audio-menu-btn"
          aria-expanded={panelOpen}
          aria-controls={panelId}
          aria-label="Focus music options"
          title="Focus options"
          onClick={() => togglePanel()}
        >
          ▾
        </button>
      </div>

      {panelOpen && (
        <div className="focus-audio-panel" id={panelId} role="region" aria-label="Focus music">
          <div className="focus-audio-panel-head">
            <strong>Deep focus</strong>
            <button
              type="button"
              className="focus-audio-close"
              aria-label="Close focus panel"
              onClick={() => setPanelOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="focus-audio-controls">
            <button type="button" className="focus-audio-play" onClick={() => toggle()}>
              {playing ? 'Pause' : 'Play'}
            </button>
            <label className="focus-audio-volume">
              <span>Volume</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
              />
            </label>
          </div>

          <ul className="focus-audio-tracks">
            {FOCUS_TRACKS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`focus-audio-track${item.id === track.id ? ' is-active' : ''}`}
                  onClick={() => setTrackId(item.id)}
                >
                  <span className="focus-audio-track-title">{item.title}</span>
                  <span className="focus-audio-track-sub">{item.subtitle}</span>
                </button>
              </li>
            ))}
          </ul>

          {track.license && <p className="focus-audio-credit muted">{track.license}</p>}
        </div>
      )}
    </div>
  );
}
