import { useMazeCellStore } from '@/store/mazeStore';
import { Box, Plane } from '@react-three/drei'
import { useFrame, useLoader } from '@react-three/fiber';
import { CuboidCollider, RigidBody, type IntersectionEnterPayload } from '@react-three/rapier';
import { useRouter } from '@tanstack/react-router';
import React from 'react';
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib';
import { useAnimations } from '@react-three/drei';

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
  const navigate = useRouter()

  const [isLost, setIsLost] = React.useState<'lost' | 'won' | 'idle'>("idle")
  const ghostRef = React.useRef<THREE.Mesh>(null!)
  const winnerRef = React.useRef<THREE.Mesh>(null!)
  const onLost = (payload: IntersectionEnterPayload) => {
    payload.rigidBodyObject?.scale.set(0, 0, 0)
    setIsLost("lost")
    setTimeout(() => {
      navigate.navigate({ to: "/level" })
    }, 5000)

  }

  const onWon = (_payload: IntersectionEnterPayload) => {
    setIsLost("won")
  }

  useFrame(() => {
    if (isLost === "lost" && ghostRef.current) {
      ghostRef.current.rotation.y += 0.01 // rotate continuously around Y axis
    }
    if (isLost === "won" && winnerRef.current) {
      winnerRef.current.rotation.y += 0.01 // rotate continuously around Y axis
    }
  })


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
              <RigidBody type="fixed" colliders={false} key={`${rowIndex}-${colIndex}-hazard`}>
              <CuboidCollider
                sensor
                args={[0.5, 0.5, 0.5]}
                position={[colIndex, 0.1, rowIndex]}
                onIntersectionEnter={(payload: IntersectionEnterPayload) => {
                  onWon(payload)
                }}
              />

              {isLost==="won" ?
                <React.Suspense>
                  <PropLoader url={'/dancer_girl.glb'} position={[colIndex, 0.1, rowIndex]} scale={1} ref={winnerRef}></PropLoader>
                </React.Suspense> :
                <Box
                key={`${rowIndex}-${colIndex}-end`}
                position={[colIndex, 0.01, rowIndex]}
                args={[1, 0.02, 1]}
              >
                <meshStandardMaterial color="dodgerblue" emissive="blue" />
              </Box>}
            </RigidBody>
              
            );
          }

          if (cell.isHazard) {
            return (
              <RigidBody type="fixed" colliders={false} key={`${rowIndex}-${colIndex}-hazard`}>
                <CuboidCollider
                  sensor
                  args={[0.5, 0.5, 0.5]}
                  position={[colIndex, 0.1, rowIndex]}
                  onIntersectionEnter={(payload: IntersectionEnterPayload) => {
                    onLost(payload)
                  }}
                />

                {isLost==="lost" ?
                  <React.Suspense>
                    <PropLoader url={'/ghost_kitty.glb'} position={[colIndex, 0.01, rowIndex]} scale={0.3} ref={ghostRef}></PropLoader>
                  </React.Suspense> :
                  <TypeRender key={`${rowIndex}-${colIndex}`} rowIndex={rowIndex} colIndex={colIndex} cell={cell} />}
              </RigidBody>
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
            <TypeRender key={`${rowIndex}-${colIndex}`} rowIndex={rowIndex} colIndex={colIndex} cell={cell} />

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

const TypeRender = ({ rowIndex, colIndex, cell }: { rowIndex: number, colIndex: number, cell: MazeCell }) => {

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
    tex.repeat.set(1, 1);
  });

  switch (cell.type.type) {
    case 'wall':
      {
        const props = cell.type.props
        if (props) {
          return (
            <RigidBody type="fixed" colliders={false} key={`${rowIndex}-${colIndex}-wall`}>
              <PropLoader url={props.url} position={[colIndex, props.positionY, rowIndex]} scale={props.scale} />
              <CuboidCollider
                args={[0.5, 0.5, 0.5]} // X, Y, Z half-sizes → 1x1x1 cube
                position={[colIndex, 0.5, rowIndex]}
              />
              <Plane
                args={[1, 1]}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[colIndex, 0.01, rowIndex]}
              >
                <meshPhysicalMaterial emissiveIntensity={0.1} emissive={'green'} map={diffuse2} normalMap={normal2} roughnessMap={rough2}
                  roughness={1} sheenRoughness={0.5} />
              </Plane>
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
        }
      }
    case 'path':
      return <Box
        key={`${rowIndex}-${colIndex}-path`}
        position={[colIndex, 0.01, rowIndex]}
        args={[1, 0.02, 1]}
      >
        <meshPhysicalMaterial emissiveIntensity={0.1} emissive={'green'} map={diffuse2} normalMap={normal2} roughnessMap={rough2}
          roughness={1} sheenRoughness={0.5} />
      </Box>
    case 'prop': {
      if (cell.type.props) {
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
      return <Plane
        args={[1, 1]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[colIndex, 0.01, rowIndex]}
      >
        <meshPhysicalMaterial emissiveIntensity={0.1} emissive={'green'} map={diffuse2} normalMap={normal2} roughnessMap={rough2}
          roughness={1} sheenRoughness={0.5} />
      </Plane>
  }
}

export const PropLoader = ({
  url,
  position,
  scale = 0.1,
  ref: externalRef
}: {
  url: string
  position: [number, number, number]
  scale?: number
  ref?: React.RefObject<THREE.Object3D>
}) => {
  const model = useLoader(GLTFLoader, url)
  const clonedScene = React.useMemo(() => model.scene.clone(true), [model.scene])
  const groupRef = React.useRef<THREE.Group>(null)

  // Combine internal and external refs
  React.useEffect(() => {
    if (externalRef && groupRef.current) {
      (externalRef as React.MutableRefObject<THREE.Object3D>).current = groupRef.current
    }
  }, [externalRef])

  const { actions, mixer } = useAnimations(model.animations, groupRef)

  React.useEffect(() => {
    const action = actions[model.animations[0]?.name]
    action?.play()
  }, [actions, model.animations])

  // Update mixer (advance animation)
  useFrame((_, delta) => {
    mixer?.update(delta)
  })

  return (
    <primitive
      ref={groupRef}
      object={clonedScene}
      position={position}
      scale={scale}
    />
  )
}


