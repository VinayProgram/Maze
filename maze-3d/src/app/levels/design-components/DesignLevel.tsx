import { AppSidebar } from "@/components/app-sidebar"
import type { Step } from "../level-design"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import React from "react"
import { Maze, type MazeCell } from "../maze"
import { useMazeCellStore } from "@/store/mazeStore"
import { useRouter } from "@tanstack/react-router"
import * as THREE from 'three'
import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import { OrbitControls } from "@react-three/drei"
import { BrickWall, DicesIcon, FlagIcon, ListStartIcon, MessageCircleQuestion, Play, RotateCcw, Save, Skull, SquareIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@radix-ui/react-separator"
import type { SaveLevelDTO } from "../services/dto/save-level"
import { saveMazeLevel } from "../services/save-level"
import { toast } from "sonner"

const DesignLevel = ({ currentStep }: { currentStep: Step }) => {
  const mazeSize = currentStep[1].mazeSize
  const mazeRef = React.useRef<THREE.Group>(null!)
  const mazeSelectecdType = useMazeCellStore((state) => state.selectedCell)
  const navigation = useRouter()
  const setLevel = useMazeCellStore((state) => state.setLevel)
  const level = useMazeCellStore((state) => state.level)
  const columns = mazeSize[0]
  const rows = mazeSize[1]
  const maze = Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: columns }, (_, colIndex) => {
      return {
        id: `${rowIndex}-${colIndex}`,
        type:{
          type:"path",
        },
        isStart: false,
        isEnd: false,
        isHazard: false,
        isPortal: false,
      } as MazeCell
    })
  )
  const [isDrawing, setIsDrawing] = React.useState(false)
  const [mazeState, setMazeState] = React.useState<MazeCell[][]>(level?level:maze)
  React.useEffect(() => {
    currentStep[1].mazeName=="view-only"?null:resetMaze()
  }, [])
  const updateMaze = (rowIndex: number, colIndex: number) => {
    const newMaze = [...mazeState]
    newMaze[rowIndex][colIndex]={
      id: `${rowIndex}-${colIndex}`,
      type: mazeSelectecdType.type,
      isStart: mazeSelectecdType.isStart,
      isEnd: mazeSelectecdType.isEnd,
      isHazard: mazeSelectecdType.isHazard,
      isPortal: mazeSelectecdType.isPortal,

    }
    setMazeState(newMaze)
  }

  const getCellStyles = (cell: MazeCell) => {
    const baseStyle = "aspect-square flex items-center justify-center rounded-md transition-all duration-150 ease-in-out cursor-pointer transform hover:scale-105"
    let colorStyle = "" // Default path

    if (cell.type.type === "wall") {
      colorStyle = "bg-slate-900 border-slate-600 shadow-inner"
    } else if (cell.isStart) {
      colorStyle = "bg-emerald-500/20 border-emerald-500"
    } else if (cell.isEnd) {
      colorStyle = "bg-rose-500/20 border-rose-500"
    } else if (cell.isHazard) {
      colorStyle = "bg-yellow-500/20 border-yellow-500"
    } else if (cell.isPortal) {
      colorStyle = "bg-violet-500/20 border-violet-500"
    }
    if(cell.type.type === "prop") {
      colorStyle = "bg-green-500/20 border-green-500"
    }
    
    return `${baseStyle} ${colorStyle}`
  }

   // Render icons inside cells for better clarity
   const renderCellIcon = (cell: MazeCell) => {
    const iconProps = { size: 24, className: "opacity-80" }
    if (cell.isStart) return <ListStartIcon {...iconProps} className="text-emerald-400" />
    if (cell.isEnd) return <FlagIcon {...iconProps} className="text-rose-400" />
    if (cell.isHazard) return <Skull {...iconProps} className="text-yellow-400" />
    if (cell.isPortal) return <MessageCircleQuestion {...iconProps} className="text-violet-400" />
    if (cell.type.type === 'wall') return <BrickWall {...iconProps} className="text-amber-800"/>
    if(cell.type.type === 'path') return <SquareIcon {...iconProps} className="text-slate-400"/>
    if(cell.type.type === 'prop') return <DicesIcon {...iconProps} className="text-green-400"/>
   
  }


  const resetMaze = () => {
    setMazeState(maze)
    setLevel(maze)
  }

  const onSave = (e:React.MouseEvent<HTMLButtonElement>) => {
    if(currentStep[1].mazeName==="view-only"){
      console.log("view-only")
      return toast("Please enter a maze name before saving.")
    }
    const saveLevelDTO:SaveLevelDTO = {
      id: mazeState[0][0].id,
      title: currentStep[1].mazeName,
      maze: JSON.stringify(mazeState),
      likes: 0,
      creatorName: "",
      createdAt: new Date().toISOString()
    }
    saveMazeLevel(saveLevelDTO)
    setLevel(mazeState)
  }

    return (
      <div className="flex h-screen w-full bg-slate-950 text-slate-50">
      <SidebarProvider>
        <AppSidebar />
         {/* ======== Left Panel: Editor ======== */}
         <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 space-y-6 overflow-y-auto">
          <header className="flex items-center gap-4">
            <SidebarTrigger className="flex items-center justify-center p-2 rounded-md hover:bg-slate-800 transition-colors"/>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                Maze Forge
              </h1>
              <p className="text-slate-400 text-sm md:text-base mt-1">
                Design your level. Current selection: <span className="font-semibold text-cyan-400">{mazeSelectecdType.type.type}</span>
              </p>
            </div>
          </header>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={onSave}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button variant="secondary" onClick={() => navigation.navigate({ to: '/game' })}>
              <Play className="mr-2 h-4 w-4" /> Play
            </Button>
            <Button variant="destructive" onClick={resetMaze}>
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
          
          <Separator className="bg-slate-800" />

          {/* ======== Maze Grid ======== */}
          <div className="flex-grow flex items-center justify-center">
            <div
              className="grid gap-1 bg-black/20 p-2 md:p-4 rounded-lg shadow-inner select-none"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
              onMouseDown={() => setIsDrawing(true)}
              onMouseUp={() => setIsDrawing(false)}
              onMouseLeave={() => setIsDrawing(false)} // Stop drawing if mouse leaves the grid
            >
              {mazeState.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <div
                      key={cell.id}
                      className={getCellStyles(cell)}
                      onMouseDown={() => updateMaze(rowIndex, colIndex)}
                      onMouseEnter={() => isDrawing && updateMaze(rowIndex, colIndex)}
                    >
                      {renderCellIcon(cell)}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </main>
        <div className="hidden lg:block lg:w-1/2 xl:w-1/3 border-l border-slate-800 h-full">
         <React.Suspense fallback={<div>Loading...</div>}>
        <Canvas fallback={<div>Loading...</div>}>
          <Physics>
            <ambientLight intensity={2} />
            <directionalLight position={[1, 1, 1]} intensity={2} />
            <OrbitControls />
            <Maze mazeRef={mazeRef} />
          </Physics>
        </Canvas>
        </React.Suspense>
      </div>
      </SidebarProvider>
    </div>
  )
}



export default DesignLevel