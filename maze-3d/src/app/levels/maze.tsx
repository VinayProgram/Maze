import { useMazeCellStore } from '@/store/mazeStore';
import { Box, Plane } from '@react-three/drei'
import { useFrame, useLoader } from '@react-three/fiber';
import { CuboidCollider, RapierRigidBody, RigidBody, type IntersectionEnterPayload } from '@react-three/rapier';
import { useParams, useRouter } from '@tanstack/react-router';
import React from 'react';
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib';
import { useAnimations } from '@react-three/drei';
import { DialogContext } from '@/components/portalcustom/custom-portal-context';
import SavePlayerRatings from '../player/components/save-player-ratings';
import { toast } from 'sonner';
import PortalLevelLogic from './design-components/PortalLevelLogic';
import { useTimer } from '@/hooks/use-timer';

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


export const Maze = ({ mazeRef, RigidRef }: { mazeRef: React.RefObject<THREE.Group>, RigidRef?: React.RefObject<RapierRigidBody> }) => {
  const maze = useMazeCellStore((state) => state.level)
  const timer = useTimer()
  React.useEffect(() => {
    if(RigidRef?.current){
      timer.start()
    }
    return ()=>{
      timer.reset()
    }
  }, [RigidRef])
  
  const navigate = useRouter()
  const id = useParams({ from: '/game/$id', shouldThrow: false })
  const DailogContext = React.useContext(DialogContext)
  const [isLost, setIsLost] = React.useState<'lost' | 'won' | 'idle'>("idle")
  const ghostRef = React.useRef<THREE.Mesh>(null!)
  const winnerRef = React.useRef<THREE.Mesh>(null!)
  const [portalLock, setPortalLock] = React.useState(false)
  const onLost = (payload: IntersectionEnterPayload) => {
    payload.rigidBodyObject?.scale.set(0, 0, 0)
    setIsLost("lost")
    toast.error("You Lost")
    setTimeout(() => {
      navigate.navigate({ to: "/level" })
    }, 10000)

  }

  const onWon = (_payload: IntersectionEnterPayload) => {
    setIsLost("won")
    DailogContext.setComponent(<SavePlayerRatings time={timer.seconds} levelId={id?.id + ""} />)
  }

  const onPortal = (_payload: IntersectionEnterPayload, currentid: string) => {
    if (portalLock) {
      toast.warning("Portal is locked")
      return
    }
    DailogContext.setComponent(
      <PortalLevelLogic id={currentid} cb={(id) => {
        const splitID = id.split("-")
        if (_payload.rigidBodyObject) {
          RigidRef?.current?.setTranslation({ x: Number(splitID[1]), y: Number(0.01), z: Number(splitID[0]) }, true)
          DailogContext.setComponent(null)
          setPortalLock(true)
          setTimeout(() => {
            setPortalLock(false)
          }, 5000)
        }
      }} />
    )
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

                {isLost === "won" ?
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

                {isLost === "lost" ?
                  <React.Suspense>
                    <PropLoader url={'/ghost_kitty.glb'} position={[colIndex, 0.01, rowIndex]} scale={0.3} ref={ghostRef}></PropLoader>
                  </React.Suspense> :
                  <TypeRender key={`${rowIndex}-${colIndex}`} rowIndex={rowIndex} colIndex={colIndex} cell={cell} />}
              </RigidBody>
            );
          }

          if (cell.isPortal) {
            return (
              <React.Suspense fallback={<Box args={[1, 1, 1]} position={[colIndex, 0.5, rowIndex]}></Box>}>
                <RigidBody type="fixed" colliders={false} key={`${rowIndex}-${colIndex}-portal`}>
                  <PropLoader url={'/door.glb'} position={[colIndex, 0.01, rowIndex]} scale={20} >
                  </PropLoader>
                  <CuboidCollider
                    sensor
                    args={[0.5, 0.5, 0.5]}
                    position={[colIndex, 0.1, rowIndex]}
                    onIntersectionEnter={(payload: IntersectionEnterPayload) => {
                      onPortal(payload, cell.id)
                    }}
                  />
                </RigidBody>
              </React.Suspense>
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
  const { diffuse2, normal2, rough2, rockDiffuse, rockNormal, rockRough } = useCustomMaterialHook()

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
                <meshPhysicalMaterial map={rockDiffuse} normalMap={rockNormal} roughnessMap={rockRough} />
              </Box>
              <CuboidCollider
                args={[0.5, 0.5, 0.5]} // X, Y, Z half-sizes → 1x1x1 cube
                position={[colIndex, 0.5, rowIndex]}
              />
            </RigidBody>
          )
        }
      }
    case 'path': {
      return (
        <Box
          key={`${rowIndex}-${colIndex}-path`}
          position={[colIndex, 0.01, rowIndex]}
          args={[1, 0.02, 1]}
        >
          <meshPhysicalMaterial emissiveIntensity={0.1} emissive={'green'} map={diffuse2} normalMap={normal2} roughnessMap={rough2}
            roughness={1} sheenRoughness={0.5} />
        </Box>
      )
    }
    case 'prop': {
      if (cell.type.props) {
        return (
          <React.Fragment key={`${rowIndex}-${colIndex}-prop`}>
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
  const { diffuse2, normal2, rough2 } = useCustomMaterialHook()
  // Combine internal and external refs
  React.useEffect(() => {
    if (externalRef && groupRef.current) {
      (externalRef as React.RefObject<THREE.Object3D>).current = groupRef.current
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
    <>

      <Plane
        args={[1, 1]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[position[0], 0.02, position[2]]}
      >

        <meshPhysicalMaterial emissiveIntensity={0.1} emissive={'green'} map={diffuse2} normalMap={normal2} roughnessMap={rough2}
          roughness={1} sheenRoughness={0.5} />
      </Plane>
      <primitive
        ref={groupRef}
        object={clonedScene}
        position={position}
        scale={scale}
      />
    </>

  )
}


const useCustomMaterialHook = () => {
  const [diffuse2, normal2, rough2] = useLoader(THREE.TextureLoader, [
    '/textures/aerial_grass_rock_diff_1k.jpg',
    '/textures/aerial_grass_rock_nor_gl_1k.jpg',
    '/textures/aerial_grass_rock_rough_1k.jpg',
  ]);
  [diffuse2, normal2].forEach((tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
  });

  const [rockDiffuse, rockNormal, rockRough] = useLoader(THREE.TextureLoader, [
    '/textures/rock_wall_13_diff_1k.jpg',
    '/textures/rock_wall_13_nor_gl_1k.jpg',
  ]);
  [rockDiffuse, rockNormal].forEach((tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
  });
  return { diffuse2, normal2, rough2, rockDiffuse, rockNormal, rockRough }
}
