import { create } from 'zustand'

type Controls = {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  jump: boolean
  shift: boolean
}

type Store = {
  playerDirection: number
  controls: Controls
  setPlayerDirection: (direction: number) => void
  setControl: (key: keyof Controls, value: boolean) => void
  resetControls: () => void
}

export interface Step {
  activeStep: number
  1: {
    mazeName: string
    mazeSize: [number, number]
  }
}

export const useStore = create<Store>()((set) => ({
  playerDirection: 0,
  controls: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    shift: false,
  },
  setPlayerDirection: (direction: number) => set({ playerDirection: direction }),
  setControl: (key, value) =>
    set((state) => ({
      controls: {
        ...state.controls,
        [key]: value,
      },
    })),
  resetControls: () =>
    set(() => ({
      controls: {
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
        shift: false,
      },
    })),
}))
