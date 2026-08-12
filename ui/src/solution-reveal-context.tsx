import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { readSolutionsRevealed, writeSolutionsRevealed } from './solution-reveal';

type SolutionRevealContextValue = {
  revealed: boolean;
  setRevealed: (revealed: boolean) => void;
  toggle: () => void;
};

const SolutionRevealContext = createContext<SolutionRevealContextValue | null>(null);

export function SolutionRevealProvider({ children }: { children: ReactNode }) {
  const [revealed, setRevealedState] = useState(() => readSolutionsRevealed());

  const setRevealed = useCallback((next: boolean) => {
    writeSolutionsRevealed(next);
    setRevealedState(next);
  }, []);

  const toggle = useCallback(() => {
    setRevealed(!revealed);
  }, [revealed, setRevealed]);

  const value = useMemo(() => ({ revealed, setRevealed, toggle }), [revealed, setRevealed, toggle]);

  return createElement(SolutionRevealContext.Provider, { value }, children);
}

export function useSolutionReveal() {
  const ctx = useContext(SolutionRevealContext);
  if (!ctx) throw new Error('useSolutionReveal must be used within SolutionRevealProvider');
  return ctx;
}
