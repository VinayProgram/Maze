import { Box, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

const maze = [
  [1, 1, 1, 1, 1,1,1],
  [1, 0, 0, 0, 0],
  [1, 0, 1, 0, 1],
  [0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
]

const Maze = () => {
  return (
    <>
      {maze.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (cell === 1) {
            return (
              <Box
                key={`${rowIndex}-${colIndex}`}
                position={[colIndex, 0.5, rowIndex]}
                args={[1, 1, 1]}
              >
                <meshStandardMaterial color="gray" />
              </Box>
            )
          }
          return null
        })
      )}
    </>
  )
}

export default Maze
