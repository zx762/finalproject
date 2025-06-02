import { create } from 'zustand'

const useStore = create((set) => ({
  state: 0, // 0: start, 0.5: preview, 1: game, 2: result
  score: 0,
  maxCombo: 0,
  accuracy: 0,
  updateState: (newState) => set(() => ({ state: newState })),
  updateScore: (score) => set(() => ({ score })),
  updateMaxCombo: (maxCombo) => set(() => ({ maxCombo })),
  updateAccuracy: (accuracy) => set(() => ({ accuracy })),
  reset: () => set(() => ({
    state: 0,
    score: 0,
    maxCombo: 0,
    accuracy: 0,
  })),
}));

export { useStore };