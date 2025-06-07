import { create } from 'zustand';

const useStore = create((set) => ({
  state: 0,
  score: 0,
  maxCombo: 0,
  accuracy: 0,
  hits: 0,
  total: 0,
  misses: 0, // ✅ 加入 Miss 計數

  updateState: (newState) => set(() => ({ state: newState })),
  updateScore: (score) => set(() => ({ score })),
  updateMaxCombo: (maxCombo) => set(() => ({ maxCombo })),
  updateAccuracy: (accuracy) => set(() => ({ accuracy })),
  updateHits: () => set((state) => ({ hits: state.hits + 1 })),
  updateTotal: () => set((state) => ({ total: state.total + 1 })),
  updateMisses: () => set((state) => ({ misses: state.misses + 1 })), // ✅ 新增

  isGameOver: false,
  setGameOver: (value) => set({ isGameOver: value }),

  reset: () =>
    set(() => ({
      state: 0,
      score: 0,
      maxCombo: 0,
      accuracy: 0,
      hits: 0,
      total: 0,
      misses: 0, // ✅ 重設
    })),
}));

export { useStore };