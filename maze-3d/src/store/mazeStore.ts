// store/mazeCellStore.ts
import type { MazeCell } from '@/app/levels/maze'
import { create } from 'zustand'

interface MazeCellStore {
  selectedCell: MazeCell
  setSelectedCell: (cell: Partial<MazeCell>) => void
  level: MazeCell[][]
  setLevel: (level: MazeCell[][]) => void
}

const mazeData: MazeCell[][] = [
  [
    {
      "id": "0-0", "type": {
        type: "wall"
      }
    }, {
      "id": "0-1", "type": {
        type: "wall"
      }
    }, {
      "id": "0-2", "type": {
        type: "wall"
      }
    }, {
      "id": "0-3", "type": {
        type: "wall",
        
      }
    }, {
      "id": "0-4", "type": {
        type: "wall",
        
      }
    }, {
      "id": "0-5", "type": {
        type: "wall"
      }
    }, {
      "id": "0-6", "type": {
        type: "wall"
      }
    }, {
      "id": "0-7", "type": {
        type: "wall"
      }
    }, {
      "id": "0-8", "type": {
        type: "wall",
        
      }
    }, {
      "id": "0-9", "type": {
        type: "path"
      }, isEnd: true
    }, {
      "id": "0-10", "type": {
        type: "wall"
      }
    }
  ],
  [
    {
      "id": "1-0", "type": {
        type: "wall"
      }
    }, {
      "id": "1-1", "type": {
        type: "path"
      }, "isStart": true
    }, {
      "id": "1-2", "type": {
        type: "path"
      }
    }, {
      "id": "1-3", "type": {
        type: "path",
        
      }
    }, {
      "id": "1-4", "type": {
        type: "wall"
      }
    }, {
      "id": "1-5", "type": {
        type: "path"
      }
    }, {
      "id": "1-6", "type": {
        type: "path"
      }
    }, {
      "id": "1-7", "type": {
        type: "path"
      }
    }, {
      "id": "1-8", "type": {
        type: "wall"
      }
    }, {
      "id": "1-9", "type": {
        type: "path"
      }
    }, {
      "id": "1-10", "type": {
        type: "wall"
      }
    }
  ],
  [
    {
      "id": "2-0", "type": {
        type: "wall"
      }
    }, {
      "id": "2-1", "type": {
        type: "wall"
      }
    }, {
      "id": "2-2", "type": {
        type: "wall"
      }
    }, {
      "id": "2-3", "type": {
        type: "path"
      }
    }, {
      "id": "2-4", "type": {
        type: "wall"
      }
    }, {
      "id": "2-5", "type": {
        type: "path"
      }
    }, {
      "id": "2-6", "type": {
        type: "wall"
      }
    }, {
      "id": "2-7", "type": {
        type: "path"
      }
    }, {
      "id": "2-8", "type": {
        type: "wall"
      }
    }, {
      "id": "2-9", "type": {
        type: "path"
      }
    }, {
      "id": "2-10", "type": {
        type: "wall"
      }
    }
  ],
  [
    {
      "id": "3-0", "type": {
        type: "wall"
      }
    }, {
      "id": "3-1", "type": {
        type: "path"
      }
    }, {
      "id": "3-2", "type": {
        type: "path"
      }
    }, {
      "id": "3-3", "type": {
        type: "path"
      }
    }, {
      "id": "3-4", "type": {
        type: "path"
      }
    }, {
      "id": "3-5", "type": {
        type: "path"
      }
    }, {
      "id": "3-6", "type": {
        type: "wall"
      }
    }, {
      "id": "3-7", "type": {
        type: "path"
      }
    }, {
      "id": "3-8", "type": {
        type: "path"
      }
    }, {
      "id": "3-9", "type": {
        type: "path"
      }
    }, {
      "id": "3-10", "type": {
        type: "wall"
      }
    }
  ],
  [
    {
      "id": "4-0", "type": {
        type: "wall"
      }
    }, {
      "id": "4-1", "type": {
        type: "path"
      }
    }, {
      "id": "4-2", "type": {
        type: "wall"
      }
    }, {
      "id": "4-3", "type": {
        type: "wall"
      }
    }, {
      "id": "4-4", "type": {
        type: "wall"
      }
    }, {
      "id": "4-5", "type": {
        type: "path"
      }
    }, {
      "id": "4-6", "type": {
        type: "wall"
      }
    }, {
      "id": "4-7", "type": {
        type: "wall"
      }
    }, {
      "id": "4-8", "type": {
        type: "wall"
      }
    }, {
      "id": "4-9", "type": {
        type: "path"
      }
    }, {
      "id": "4-10", "type": {
        type: "wall"
      }
    }
  ],
  [
    {
      "id": "5-0", "type": {
        type: "wall"
      }
    }, {
      "id": "5-1", "type": {
        type: "path"
      }, "isPortal": true
    }, {
      "id": "5-2", "type": {
        type: "path"
      }
    }, {
      "id": "5-3", "type": {
        type: "path"
      }
    }, {
      "id": "5-4", "type": {
        type: "path"
      }
    }, {
      "id": "5-5", "type": {
        type: "path"
      }
    }, {
      "id": "5-6", "type": {
        type: "path"
      }
    }, {
      "id": "5-7", "type": {
        type: "path"
      }
    }, {
      "id": "5-8", "type": {
        type: "path"
      }
    }, {
      "id": "5-9", "type": {
        type: "path"
      }
    }, {
      "id": "5-10", "type": {
        type: "wall"
      }
    }
  ],
  [
    {
      "id": "6-0", "type": {
        type: "wall"
      }
    }, {
      "id": "6-1", "type": {
        type: "wall"
      }
    }, {
      "id": "6-2", "type": {
        type: "wall"
      }
    }, {
      "id": "6-3", "type": {
        type: "wall"
      }
    }, {
      "id": "6-4", "type": {
        type: "wall"
      }
    }, {
      "id": "6-5", "type": {
        type: "wall"
      }
    }, {
      "id": "6-6", "type": {
        type: "wall"
      }
    }, {
      "id": "6-7", "type": {
        type: "wall"
      }
    }, {
      "id": "6-8", "type": {
        type: "wall"
      }
    }, {
      "id": "6-9", "type": {
        type: "path"
      }
    }, {
      "id": "6-10", "type": {
        type: "wall"
      }
    }
  ],
  [
    {
      "id": "7-0", "type": {
        type: "wall"
      }
    }, {
      "id": "7-1", "type": {
        type: "path"
      }
    }, {
      "id": "7-2", "type": {
        type: "path"
      }, "isHazard": true
    }, {
      "id": "7-3", "type": {
        type: "path"
      }, "isHazard": true
    }, {
      "id": "7-4", "type": {
        type: "path"
      }
    }, {
      "id": "7-5", "type": {
        type: "path"
      }
    }, {
      "id": "7-6", "type": {
        type: "path"
      }
    }, {
      "id": "7-7", "type": {
        type: "path"
      }
    }, {
      "id": "7-8", "type": {
        type: "wall"
      }
    }, {
      "id": "7-9", "type": {
        type: "path"
      }
    }, {
      "id": "7-10", "type": {
        type: "wall"
      }
    }
  ],
  [
    {
      "id": "8-0", "type": {
        type: "wall"
      }
    }, {
      "id": "8-1", "type": {
        type: "path"
      }
    }, {
      "id": "8-2", "type": {
        type: "wall"
      }
    }, {
      "id": "8-3", "type": {
        type: "wall"
      }
    }, {
      "id": "8-4", "type": {
        type: "wall"
      }
    }, {
      "id": "8-5", "type": {
        type: "wall"
      }
    }, {
      "id": "8-6", "type": {
        type: "wall"
      }
    }, {
      "id": "8-7", "type": {
        type: "path"
      }
    }, {
      "id": "8-8", "type": {
        type: "wall"
      }
    }, {
      "id": "8-9", "type": {
        type: "path"
      }
    }, {
      "id": "8-10", "type": {
        type: "wall"
      }
    }
  ],
  [
    {
      "id": "9-0", "type": {
        type: "wall"
      }
    }, {
      "id": "9-1", "type": {
        type: "path"
      }
    }, {
      "id": "9-2", "type": {
        type: "path"
      }
    }, {
      "id": "9-3", "type": {
        type: "path"
      }
    }, {
      "id": "9-4", "type": {
        type: "path"
      }
    }, {
      "id": "9-5", "type": {
        type: "path"
      }
    }, {
      "id": "9-6", "type": {
        type: "path"
      }
    }, {
      "id": "9-7", "type": {
        type: "path"
      }
    }, {
      "id": "9-8", "type": {
        type: "path"
      }
    }, {
      "id": "9-9", "type": {
        type: "path"
      }
    }, {
      "id": "9-10", "type": {
        type: "wall"
      }
    }
  ],
  [
    {
      "id": "10-0", "type": {
        type: "wall"
      }
    }, {
      "id": "10-1", "type": {
        type: "wall"
      }
    }, {
      "id": "10-2", "type": {
        type: "wall"
      }
    }, {
      "id": "10-3", "type": {
        type: "wall"
      }
    }, {
      "id": "10-4", "type": {
        type: "wall"
      }
    }, {
      "id": "10-5", "type": {
        type: "wall"
      }
    }, {
      "id": "10-6", "type": {
        type: "wall"
      }
    }, {
      "id": "10-7", "type": {
        type: "wall"
      }
    }, {
      "id": "10-8", "type": {
        type: "wall"
      }
    }, {
      "id": "10-9", "type": {
        type: "wall"
      }
    }, {
      "id": "10-10", "type": {
        type: "wall"
      }
    }
  ]
]


export const useMazeCellStore = create<MazeCellStore>((set) => ({
  selectedCell: {
    id: '',
    type: {
      type: "wall",
      props: undefined
    },
    isStart: false,
    isEnd: false,
    isHazard: false,
    isPortal: false,
  },
  setSelectedCell: (cell) =>
    set((state) => ({
      selectedCell: {
        ...state.selectedCell,
        ...cell,
      },
    })),
  level: mazeData,
  setLevel: (level: MazeCell[][]) => set(() => ({
    level: level
  }))
}))
