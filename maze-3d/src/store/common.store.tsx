import { create } from 'zustand'

type Store = {
  playerDirection: number
  setPlayerDirection: (direction: number) => void
}

export const useStore = create<Store>()((set) => ({
  playerDirection: 0,
  setPlayerDirection: (direction: number) => set({ playerDirection: direction }),
}))

