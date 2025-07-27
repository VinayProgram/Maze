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

const DesignLevel = ({ currentStep }: { currentStep: Step }) => {
  const mazeSize = currentStep[1].mazeSize
  const mazeRef = React.useRef<THREE.Group>(null!)
  const mazeSelectecdType = useMazeCellStore((state) => state.selectedCell)
  const navigation = useRouter()
  const setLevel = useMazeCellStore((state) => state.setLevel)
  const mazeData = mazeSize.split("x").map((size) => parseInt(size))
  const columns = mazeData[0]
  const rows = mazeData[1]
  const maze = Array.from({ length: rows }, (_, rowIndex) =>
    Array.from({ length: columns }, (_, colIndex) => {
      return {
        id: `${rowIndex}-${colIndex}`,
        type: "path",
        isStart: false,
        isEnd: false,
        isHazard: false,
        isPortal: false,
      } as MazeCell
    })
  )
  const [mazeState, setMazeState] = React.useState<MazeCell[][]>(maze)

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
    console.log(mazeState)
  }

  const selectColor = (cell: MazeCell) => {
    switch (cell.type) {
      case "wall":
        return "bg-amber-400"
      case "path":
        if(cell.isStart){
          return "bg-green-400"
        }
        if(cell.isEnd){
          return "bg-red-400"
        }
        if(cell.isHazard){
          return "bg-red-400"
        }
        if(cell.isPortal){
          return "bg-blue-400"
        }
        return "bg-white"
      default:
        return "bg-white"
    }
  }
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger/>
        <main>
          {mazeState.map((row, rowIndex) => {
            return (
              <section className="flex" key={rowIndex}>
                {row.map((cell, colIndex) => {
                  return (
                    <div
                    onMouseEnter={() => {
                      updateMaze(rowIndex,colIndex)
                    }}
                    onClick={() => {
                      updateMaze(rowIndex,colIndex)
                    }}
                    key={colIndex}
                    className={`
                      w-12 
                      h-12 border 
                      border-gray-500 
                      flex items-center 
                      justify-center 
                      text-sm font-semibold 
                      ${selectColor(cell)}
                     hover:bg-gray-100 transition`}
                  >
                    {cell.type}
                  </div>
                  );
                })}
              </section>
            )
          }
          )}
          <button onClick={() => {
            setLevel(mazeState)

          }}>Save</button>
            <button onClick={() => {
            navigation.navigate({to:'/game'})

          }}>Play</button>
        </main>
        <div className="w-full h-screen">
        <Canvas>
          <Physics>
            <ambientLight intensity={0.5} />
            <directionalLight position={[1, 1, 1]} intensity={0.5} />
            <OrbitControls />
          <Maze mazeRef={mazeRef} />
          </Physics>
        </Canvas>
        </div>
      </SidebarProvider>
    </div>
  )
}



export default DesignLevel