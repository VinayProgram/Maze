import { Canvas } from '@react-three/fiber'
import { KeyboardControls, OrbitControls, Sky, type KeyboardControlsEntry } from '@react-three/drei'
import React, { useRef } from 'react'
import {Maze} from './levels/maze'
import { ControlsEnum } from './store/constants'
import { Player, ThirdPersonCamera } from './player/player'
import * as THREE from 'three'
import { Physics, RapierRigidBody } from '@react-three/rapier'

const Editor = () => {
  const map = React.useMemo<KeyboardControlsEntry<ControlsEnum>[]>(()=>[
    { name: ControlsEnum.forward, keys: ['ArrowUp', 'KeyW'] },
    { name: ControlsEnum.back, keys: ['ArrowDown', 'KeyS'] },
    { name: ControlsEnum.left, keys: ['ArrowLeft', 'KeyA'] },
    { name: ControlsEnum.right, keys: ['ArrowRight', 'KeyD'] }, 
    { name: ControlsEnum.jump, keys: ['Space'] },
  ], [])
  const playerRef = useRef<THREE.Group>(null!)
  const mazeRef = useRef<THREE.Group>(null!)
  const rigidRef = useRef<RapierRigidBody>(null!)
  return (
    <div className='w-full h-screen'>
      <KeyboardControls
        map={map}>
        <Canvas >
          <Physics  >
          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={1} />
          <directionalLight position={[5, 10, 5]} />
          <Player RigidRef={rigidRef} playerRef={playerRef} />
          <ThirdPersonCamera rigidBody={rigidRef} mazeRef={mazeRef} />
          <Maze mazeRef={mazeRef}/>
          <OrbitControls />
          </Physics>
        </Canvas>
      </KeyboardControls>
    </div>
  )
}

export default Editor


