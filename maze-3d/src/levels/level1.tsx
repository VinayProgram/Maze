import { Box } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

const maze = [
  [1, 1, 1, 1, 1,1,1],
  [1, 0, 0, 0, 0,0,1],
  [1, 0, 1, 0, 1,0,1],
  [0, 0, 1, 0, 1,0,0],
  [1, 1, 1, 1, 1,1,1],
]

const Maze = () => {
   
    const mazeRef = useRef<THREE.Group>(null)
    
    return (
    <group ref={mazeRef}>
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
    </group>
  )
}

export default Maze
