import { Box } from '@react-three/drei'
import {  CuboidCollider, RigidBody } from '@react-three/rapier';
import { useEffect, useRef } from 'react';
import * as THREE from 'three'

const mazeData: MazeCell[][] = [
  [
    {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}
  ],
  [
    {"type": "wall"}, {"type": "path", "isStart": true}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}
  ],
  [
    {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}
  ],
  [
    {"type": "wall"}, {"type": "path", "isPortal": true}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}
  ],
  [
    {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}
  ],
  [
    {"type": "wall"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}
  ],
  [
    {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}
  ],
  [
    {"type": "wall"}, {"type": "path"}, {"type": "path"}, {"type": "path", "isHazard": true}, {"type": "path", "isHazard": true}, {"type": "path", "isHazard": true}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}
  ],
  [
    {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}
  ],
  [
    {"type": "wall"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}
  ],
  [
    {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}
  ],
  [
    {"type": "wall"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}
  ],
  [
    {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}
  ],
  [
    {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}
  ],
  [
    {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}
  ],
  [
    {"type": "wall"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "wall"}, {"type": "path"}, {"type": "path"}, {"type": "path"}, {"type": "path", "isEnd": true}, {"type": "path"}, {"type": "wall"}
  ],
  [
    {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "wall"}, {"type": "path"}, {"type": "wall"}
  ]
]
// 1. Import the new JSON data file

// 2. Define a TypeScript interface for a maze cell for type safety
interface MazeCell {
  type: 'wall' | 'path';
  isStart?: boolean;
  isEnd?: boolean;
  isHazard?: boolean;
  isPortal?: boolean;
}

// The maze data is now an array of MazeCell arrays
const maze = mazeData as MazeCell[][];

export const Maze = ({ mazeRef }: { mazeRef: React.RefObject<THREE.Group> }) => {
  const boundingBox = useRef<THREE.Box3>(new THREE.Box3())
 
  useEffect(() => {
    const maze = mazeRef.current
    if(!maze || !boundingBox.current) return
    maze.traverse((child) => {
      if(child instanceof THREE.Mesh) {
        boundingBox.current.expandByObject(child)
      }
    })
    console.log(boundingBox.current)
  },[mazeRef])
  return (
    <group ref={mazeRef}>
      {maze.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          // 3. Render based on the 'type' property
          if (cell.type === 'wall') {
            return (      
              <RigidBody type="fixed" friction={2} restitution={0.5} > 
              <Box
                position={[colIndex, 0.5, rowIndex]} // Standard 1x1x1 cube
                args={[1, 1, 1]}
              >
                <meshStandardMaterial color="#555555" />
              </Box>
              </RigidBody>
            );
          }
          
          if (cell.isStart) {
            return (
              <Box
                name='start'
                key={`${rowIndex}-${colIndex}-start`}
                position={[colIndex, 0.01, rowIndex]}
                args={[1, 0.02, 1]}
              >
                <meshStandardMaterial color="limegreen" emissive="green" />
              </Box>
            );
          }

          if (cell.isEnd) {
            return (
              <Box
                key={`${rowIndex}-${colIndex}-end`}
                position={[colIndex, 0.01, rowIndex]}
                args={[1, 0.02, 1]}
              >
                <meshStandardMaterial color="dodgerblue" emissive="blue" />
              </Box>
            );
          }

          if (cell.isHazard) {
            return (
              <Box
                key={`${rowIndex}-${colIndex}-hazard`}
                position={[colIndex, 0.01, rowIndex]}
                args={[1, 0.02, 1]}
              >
                <meshStandardMaterial color="red" emissive="darkred" />
              </Box>
            );
          }

          if (cell.isPortal) {
            return (
              <Box
                key={`${rowIndex}-${colIndex}-portal`}
                position={[colIndex, 0.01, rowIndex]}
                args={[1, 0.02, 1]}
              >
                <meshStandardMaterial color="purple" emissive="indigo" />
              </Box>
            );
          }

          // It's just a regular path, so render nothing
          return (
              <Box
                position={[colIndex, 0.01, rowIndex]}
                args={[1, 0.02, 1]}
              >
                <meshStandardMaterial color="white" emissive="white" />
              </Box>
          )
        })
      )}
      <CuboidCollider args={[16,2,16]} position={[0, -2, 0]} />

    </group>
  );
};


