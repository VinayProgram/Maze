import { useMazeCellStore } from '@/store/mazeStore';
import { Box, Plane } from '@react-three/drei'
import { useLoader } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import React from 'react';
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib';

export interface MazeCell {
  type: {
    type: 'wall' | 'path' | 'prop';
    props?: {
      scale: number,
      positionY: number,
      url: string
    }
  };
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
          
            return (
              <TypeRender rowIndex={rowIndex} colIndex={colIndex} cell={cell} />
            
            );
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

const TypeRender = ({ rowIndex, colIndex, cell}: {rowIndex: number, colIndex: number, cell: MazeCell}) => {

  const [diffuse, normal, rough] = useLoader(THREE.TextureLoader, [
    '/textures/rock_wall_13_diff_1k.jpg',
    '/textures/rock_wall_13_nor_gl_1k.jpg',
    '/textures/rock_wall_13_rough_1k.jpg',
  ]);
  [diffuse, normal].forEach((tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
  });

  const [diffuse2, normal2, rough2] = useLoader(THREE.TextureLoader, [
    '/textures/aerial_grass_rock_diff_1k.jpg',
    '/textures/aerial_grass_rock_nor_gl_1k.jpg',
    '/textures/aerial_grass_rock_rough_1k.jpg',
  ]);
  [diffuse2, normal2].forEach((tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
  });

  switch (cell.type.type) {
    case 'wall':
      { 
      const props = cell.type.props
      if(props) {
        return (
          <RigidBody type="fixed" colliders={false} key={`${rowIndex}-${colIndex}-wall`}>
          <PropLoader url={props.url} position={[colIndex, props.positionY, rowIndex]} scale={props.scale} />
          <CuboidCollider
            args={[0.5, 0.5, 0.5]} // X, Y, Z half-sizes → 1x1x1 cube
            position={[colIndex, 0.5, rowIndex]}
          />
         
          </RigidBody>
        )
      } else {
        return (
          <RigidBody type="fixed" colliders={false} key={`${rowIndex}-${colIndex}-wall`}>
          <Box
            onClick={() => {
              console.log(cell.id)
            }}
            position={[colIndex, 0.5, rowIndex]} // Standard 1x1x1 cube
            args={[1, 1, 1]}
          >
             <meshPhysicalMaterial map={diffuse} normalMap={normal} roughnessMap={rough} />
          </Box>
          <CuboidCollider
            args={[0.5, 0.5, 0.5]} // X, Y, Z half-sizes → 1x1x1 cube
            position={[colIndex, 0.5, rowIndex]}
          />
        </RigidBody>
        )
      } }
    case 'path':
      return <Box
        key={`${rowIndex}-${colIndex}-path`}
        position={[colIndex, 0.01, rowIndex]}
        args={[1, 0.02, 1]}
      >
        <meshPhysicalMaterial emissiveIntensity={0.1} emissive={'green'} map={diffuse2} normalMap={normal2} roughnessMap={rough2}
          roughness={1} sheenRoughness={0.5} />
      </Box>
    case 'prop':{
      if(cell.type.props) {
        return (
          <React.Fragment key={`${rowIndex}-${colIndex}-prop`}>
          <Plane
          args={[1, 1]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[colIndex, 0.01, rowIndex]}
        >
          <meshPhysicalMaterial emissiveIntensity={0.1} emissive={'green'} map={diffuse2} normalMap={normal2} roughnessMap={rough2}
        roughness={1} sheenRoughness={0.5} />
        </Plane> 
          <PropLoader url={cell.type.props.url} position={[colIndex, cell.type.props.positionY, rowIndex]} scale={cell.type.props.scale} key={`${rowIndex}-${colIndex}-prop`} />
          </React.Fragment>
        )
      }
      return null
    }
    default:
      return null
  }
}

const PropLoader = ({ url, position, scale = 0.1 }: {
  url: string,
  position: [number, number, number],
  scale?: number
}) => {
  const modelLoader = useLoader(GLTFLoader, url)
  const clone = React.useMemo(() => modelLoader.scene.clone(true), [modelLoader]);

  return (
    <mesh scale={scale} position={position}>
      <primitive object={clone} />
    </mesh>
  )
}


