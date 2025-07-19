import { Box } from '@react-three/drei'
import * as THREE from 'three'

const mazeData = [
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
  return (
    <group ref={mazeRef}>
      {maze.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          // 3. Render based on the 'type' property
          if (cell.type === 'wall') {
            return (
              // Wall
              <Box
                key={`${rowIndex}-${colIndex}`}
                position={[colIndex, 0.5, rowIndex]} // Standard 1x1x1 cube
                args={[1, 1, 1]}
              >
                <meshStandardMaterial color="#555555" />
              </Box>
            );
          }
          
          // 4. If it's a path, check for special zones and render a visual cue
          // These are flat planes on the ground to mark the zone.
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
          return null;
        })
      )}
    </group>
  );
};


