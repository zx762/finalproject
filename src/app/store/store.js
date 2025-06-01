import { create } from 'zustand'

// 建立 store hook
const useStore = create((set) => ({
    // states and actions
  state: 0, // 0: start, 0.5: preview, 1: game, 2: result
  score: 0,
  updateState: (newState) => set( (state)=>({state:newState}) ),
  updateScore: (newState) => set( (state)=>({score:newState}) ),
  reset: () => set(() => ({ state: 0, score: 0 })),
}));

export { useStore }