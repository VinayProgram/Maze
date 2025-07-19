import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Player from './player/player'
import * as THREE from 'three'
import LevelOne from './levels/level1'

const Editor = () => {
  return (
    <div className='w-full h-screen'>
    <Canvas >
      {/* <Environment background preset='sunset' ground/> */}
      <mesh rotation={[-Math.PI/2,0,0]}>
        <planeGeometry args={[100,100,100]}/>
        <meshBasicMaterial color='green' side={THREE.DoubleSide}/>
      </mesh>
        <Player/>
        <ambientLight intensity={1}/>
        <directionalLight position={[1,1,1]} intensity={1}/>
        <LevelOne/>
        <OrbitControls />
    </Canvas>
    </div>
  )
}

export default Editor
