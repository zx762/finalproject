import { create } from 'zustand';

const useStore = create((set) => ({
  state: 0,
  score: 0,
  maxCombo: 0,
  accuracy: 0,
  hits: 0,
  total: 0,
  updateState: (newState) => set(() => ({ state: newState })),
  updateScore: (score) => set(() => ({ score })),
  updateMaxCombo: (maxCombo) => set(() => ({ maxCombo })),
  updateAccuracy: (accuracy) => set(() => ({ accuracy })),
  updateHits: () => set((state) => ({ hits: state.hits + 1 })), // ✅ 改為增量函數
  updateTotal: () => set((state) => ({ total: state.total + 1 })),
  reset: () =>
    set(() => ({
      state: 0,
      score: 0,
      maxCombo: 0,
      accuracy: 0,
      hits: 0,
      total: 0,
    })),
}));

export { useStore };