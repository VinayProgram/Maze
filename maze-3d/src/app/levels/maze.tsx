import { useMazeCellStore } from '@/store/mazeStore';
import { Box } from '@react-three/drei'
import { useLoader } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import React from 'react';
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib';

export interface MazeCell {
  type: 'wall' | 'path';
  isStart?: boolean;
  isEnd?: boolean;
  isHazard?: boolean;
  isPortal?: boolean;
  id: string;
  props?:{
    url:string
  }
}


export const Maze = ({ mazeRef }: { mazeRef: React.RefObject<THREE.Group> }) => {
  const maze = useMazeCellStore((state) => state.level)

  const [diffuse, normal,rough] = useLoader(THREE.TextureLoader, [
    '/textures/rock_wall_13_diff_1k.jpg',
    '/textures/rock_wall_13_nor_gl_1k.jpg',
    '/textures/rock_wall_13_rough_1k.jpg',
  ]);
  [diffuse, normal].forEach((tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
  });

  const [diffuse2, normal2,rough2] = useLoader(THREE.TextureLoader, [
    '/textures/brick_crosswalk_diff_1k.jpg',
    '/textures/brick_crosswalk_nor_gl_1k.jpg',
    '/textures/brick_crosswalk_rough_1k.jpg',
  ]);
  [diffuse2, normal2].forEach((tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
  });
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
                   <meshPhysicalMaterial map={diffuse} normalMap={normal} roughnessMap={rough} roughness={0.5} metalness={0.5}/>
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

          if(cell.props){
           return(
            <PropLoader url={cell.props.url} position={[colIndex, 0.01, rowIndex]}  key={`${rowIndex}-${colIndex}-prop`} />
           ) 
          }
          return (
            <Box
              key={`${rowIndex}-${colIndex}-path`}
              position={[colIndex, 0.01, rowIndex]}
              args={[1, 0.02, 1]}
            >
               <meshPhysicalMaterial map={diffuse2} normalMap={normal2} roughnessMap={rough2} roughness={0.5} metalness={0.5}/>
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


const PropLoader=({url,position}:{
  url:string,
  position:[number,number,number],
})=>{
  const modelLoader = useLoader(GLTFLoader,url)
  const clone = React.useMemo(() => modelLoader.scene.clone(true), [modelLoader]);

  return(
    <mesh scale={0.1} position={position}>
    <primitive object={clone}  />
    </mesh>
  )
}


