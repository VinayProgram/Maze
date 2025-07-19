import { Canvas } from '@react-three/fiber'
import { KeyboardControls, OrbitControls, Sky, type KeyboardControlsEntry } from '@react-three/drei'
import Player from './player/player'
import * as THREE from 'three'
import React from 'react'
import Maze from './levels/level1'

const Editor = () => {
  const map = React.useMemo<KeyboardControlsEntry<ControlsEnum>[]>(()=>[
    { name: ControlsEnum.forward, keys: ['ArrowUp', 'KeyW'] },
    { name: ControlsEnum.back, keys: ['ArrowDown', 'KeyS'] },
    { name: ControlsEnum.left, keys: ['ArrowLeft', 'KeyA'] },
    { name: ControlsEnum.right, keys: ['ArrowRight', 'KeyD'] },
    { name: ControlsEnum.jump, keys: ['Space'] },
  ], [])
  return (
    <div className='w-full h-screen'>
      <KeyboardControls
        map={map}>
        <Canvas >
          {/* <Environment background preset='sunset' ground/> */}
          {/* <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[100, 100, 100]} />
            <meshBasicMaterial color='green' side={THREE.DoubleSide} />
          </mesh> */}
          <Player />

          <Sky sunPosition={[100, 20, 100]} />
          <ambientLight intensity={1} />
          <directionalLight position={[1, 1, 1]} intensity={1} />
          <Maze/>
          <OrbitControls />
        </Canvas>
      </KeyboardControls>
    </div>
  )
}

export default Editor


export enum ControlsEnum {
  forward = 'ArrowUp',
  back = 'ArrowDown',
  left = 'ArrowLeft',
  right = 'ArrowRight',
  jump = 'Space',
}