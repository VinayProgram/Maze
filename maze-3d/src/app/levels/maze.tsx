import { Box } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useEffect, useRef } from 'react';
import * as THREE from 'three'

export const mazeData: MazeCell[][] = [
  [
    { "id": "0-0", "type": "wall" }, { "id": "0-1", "type": "wall" }, { "id": "0-2", "type": "wall" }, { "id": "0-3", "type": "wall" }, { "id": "0-4", "type": "wall" }, { "id": "0-5", "type": "wall" }, { "id": "0-6", "type": "wall" }, { "id": "0-7", "type": "wall" }, { "id": "0-8", "type": "wall" }, { "id": "0-9", "type": "path", isEnd: true }, { "id": "0-10", "type": "wall" }
  ],
  [
    { "id": "1-0", "type": "wall" }, { "id": "1-1", "type": "path", "isStart": true }, { "id": "1-2", "type": "path" }, { "id": "1-3", "type": "path" }, { "id": "1-4", "type": "wall" }, { "id": "1-5", "type": "path" }, { "id": "1-6", "type": "path" }, { "id": "1-7", "type": "path" }, { "id": "1-8", "type": "wall" }, { "id": "1-9", "type": "path" }, { "id": "1-10", "type": "wall" }
  ],
  [
    { "id": "2-0", "type": "wall" }, { "id": "2-1", "type": "wall" }, { "id": "2-2", "type": "wall" }, { "id": "2-3", "type": "path" }, { "id": "2-4", "type": "wall" }, { "id": "2-5", "type": "path" }, { "id": "2-6", "type": "wall" }, { "id": "2-7", "type": "path" }, { "id": "2-8", "type": "wall" }, { "id": "2-9", "type": "path" }, { "id": "2-10", "type": "wall" }
  ],
  [
    { "id": "3-0", "type": "wall" }, { "id": "3-1", "type": "path" }, { "id": "3-2", "type": "path" }, { "id": "3-3", "type": "path" }, { "id": "3-4", "type": "path" }, { "id": "3-5", "type": "path" }, { "id": "3-6", "type": "wall" }, { "id": "3-7", "type": "path" }, { "id": "3-8", "type": "path" }, { "id": "3-9", "type": "path" }, { "id": "3-10", "type": "wall" }
  ],
  [
    { "id": "4-0", "type": "wall" }, { "id": "4-1", "type": "path" }, { "id": "4-2", "type": "wall" }, { "id": "4-3", "type": "wall" }, { "id": "4-4", "type": "wall" }, { "id": "4-5", "type": "path" }, { "id": "4-6", "type": "wall" }, { "id": "4-7", "type": "wall" }, { "id": "4-8", "type": "wall" }, { "id": "4-9", "type": "path" }, { "id": "4-10", "type": "wall" }
  ],
  [
    { "id": "5-0", "type": "wall" }, { "id": "5-1", "type": "path", "isPortal": true }, { "id": "5-2", "type": "path" }, { "id": "5-3", "type": "path" }, { "id": "5-4", "type": "path" }, { "id": "5-5", "type": "path" }, { "id": "5-6", "type": "path" }, { "id": "5-7", "type": "path" }, { "id": "5-8", "type": "path" }, { "id": "5-9", "type": "path" }, { "id": "5-10", "type": "wall" }
  ],
  [
    { "id": "6-0", "type": "wall" }, { "id": "6-1", "type": "wall" }, { "id": "6-2", "type": "wall" }, { "id": "6-3", "type": "wall" }, { "id": "6-4", "type": "wall" }, { "id": "6-5", "type": "wall" }, { "id": "6-6", "type": "wall" }, { "id": "6-7", "type": "wall" }, { "id": "6-8", "type": "wall" }, { "id": "6-9", "type": "path" }, { "id": "6-10", "type": "wall" }
  ],
  [
    { "id": "7-0", "type": "wall" }, { "id": "7-1", "type": "path" }, { "id": "7-2", "type": "path", "isHazard": true }, { "id": "7-3", "type": "path", "isHazard": true }, { "id": "7-4", "type": "path" }, { "id": "7-5", "type": "path" }, { "id": "7-6", "type": "path" }, { "id": "7-7", "type": "path" }, { "id": "7-8", "type": "wall" }, { "id": "7-9", "type": "path" }, { "id": "7-10", "type": "wall" }
  ],
  [
    { "id": "8-0", "type": "wall" }, { "id": "8-1", "type": "path" }, { "id": "8-2", "type": "wall" }, { "id": "8-3", "type": "wall" }, { "id": "8-4", "type": "wall" }, { "id": "8-5", "type": "wall" }, { "id": "8-6", "type": "wall" }, { "id": "8-7", "type": "path" }, { "id": "8-8", "type": "wall" }, { "id": "8-9", "type": "path" }, { "id": "8-10", "type": "wall" }
  ],
  [
    { "id": "9-0", "type": "wall" }, { "id": "9-1", "type": "path" }, { "id": "9-2", "type": "path" }, { "id": "9-3", "type": "path" }, { "id": "9-4", "type": "path" }, { "id": "9-5", "type": "path" }, { "id": "9-6", "type": "path" }, { "id": "9-7", "type": "path" }, { "id": "9-8", "type": "path" }, { "id": "9-9", "type": "path" }, { "id": "9-10", "type": "wall" }
  ],
  [
    { "id": "10-0", "type": "wall" }, { "id": "10-1", "type": "wall" }, { "id": "10-2", "type": "wall" }, { "id": "10-3", "type": "wall" }, { "id": "10-4", "type": "wall" }, { "id": "10-5", "type": "wall" }, { "id": "10-6", "type": "wall" }, { "id": "10-7", "type": "wall" }, { "id": "10-8", "type": "wall" }, { "id": "10-9", "type": "wall" }, { "id": "10-10", "type": "wall" }
  ]
]
export interface MazeCell {
  type: 'wall' | 'path';
  isStart?: boolean;
  isEnd?: boolean;
  isHazard?: boolean;
  isPortal?: boolean;
  id: string;
}

// The maze data is now an array of MazeCell arrays
export const maze = mazeData as MazeCell[][];

export const Maze = ({ mazeRef }: { mazeRef: React.RefObject<THREE.Group> }) => {


  return (
    <group ref={mazeRef}>
      {maze.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          // 3. Render based on the 'type' property
          if (cell.type === 'wall') {
            return (
              <RigidBody type="fixed" key={`${rowIndex}-${colIndex}-wall`}>
                <Box
                  onClick={() => {
                    console.log(cell.id)
                  }}
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
              key={`${rowIndex}-${colIndex}-path`}
              position={[colIndex, 0.01, rowIndex]}
              args={[1, 0.02, 1]}
            >
              <meshStandardMaterial color="white" emissive="white" />
            </Box>
          )
        })
      )}
      <CuboidCollider
        friction={2}
        args={[maze[0].length / 2, 1, maze.length / 2]}
        position={[maze[0].length / 2 - 0.5, -1, maze.length / 2 - 0.5]}
      />

    </group>
  );
};


