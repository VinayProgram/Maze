import { useMazeCellStore } from '@/store/mazeStore';
import { Box } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import * as THREE from 'three'

export interface MazeCell {
  type: 'wall' | 'path';
  isStart?: boolean;
  isEnd?: boolean;
  isHazard?: boolean;
  isPortal?: boolean;
  id: string;
}


export const Maze = ({ mazeRef }: { mazeRef: React.RefObject<THREE.Group> }) => {
  const maze = useMazeCellStore((state) => state.level)

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


