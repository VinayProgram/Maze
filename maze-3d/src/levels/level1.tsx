import { Box, useKeyboardControls } from '@react-three/drei'
import type { ControlsEnum } from '../store/constants'
import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

const maze = [
  [1, 1, 1, 1, 1,1,1],
  [1, 0, 0, 0, 0,0,1],
  [1, 0, 1, 0, 1,0,1],
  [0, 0, 1, 0, 1,0,0],
  [1, 1, 1, 1, 1,1,1],
]

const Maze = () => {
    const forwardPressed = useKeyboardControls<ControlsEnum>(state=>state.ArrowUp)
    const backwardPressed = useKeyboardControls<ControlsEnum>(state=>state.ArrowDown)
    const leftPressed = useKeyboardControls<ControlsEnum>(state=>state.ArrowLeft)
    const rightPressed = useKeyboardControls<ControlsEnum>(state=>state.ArrowRight)
    const jumpPressed = useKeyboardControls<ControlsEnum>(state=>state.Space)
    const mazeRef = useRef<THREE.Group>(null)
    useFrame((state, delta) => {
        const speed = 2
        if (mazeRef.current) {
          // Move forward/backward in the direction it's facing
          const direction = new THREE.Vector3()
      
          if (forwardPressed) direction.z -= 1
          if (backwardPressed) direction.z += 1
      
          // Apply rotation direction to movement
          if (direction.length() > 0) {
            direction.normalize()
            direction.applyQuaternion(mazeRef.current.quaternion)
            mazeRef.current.position.addScaledVector(direction, delta * speed)
          }
      
          // Y-axis rotation (left/right turning)
          if (leftPressed) {
            mazeRef.current.rotation.y += 1 * delta
          }
          if (rightPressed) {
            mazeRef.current.rotation.y -= 1 * delta
          }
      
          // Jumping up (for fun)
          if (jumpPressed) {
            mazeRef.current.position.y += 1 * delta
          }
        }
      })
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
