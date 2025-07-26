import { AppSidebar } from "@/components/app-sidebar"
import type { Step } from "../level-design"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import React from "react"
import { type MazeCell } from "../maze"

const DesignLevel = ({ currentStep }: { currentStep: Step }) => {
  const mazeSize = currentStep[1].mazeSize
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
    newMaze[rowIndex][colIndex].type = "wall"
    setMazeState(newMaze)
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
                    key={colIndex}
                    className={`w-12 h-12 border border-gray-500 flex items-center justify-center text-sm font-semibold bg-${cell.type=="wall"?"amber-300":"white"} hover:bg-gray-100 transition`}
                  >
                    {cell.type}
                  </div>
                  );
                })}
              </section>
            )
          }
          )}
        </main>
      </SidebarProvider>
    </div>
  )
}



export default DesignLevel