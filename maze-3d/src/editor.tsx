import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import Player from './player/player'

const Editor = () => {
  return (
    <div className='w-full h-screen'>
    <Canvas >
        <Player/>
        <Environment background preset='forest'/>
        <ambientLight intensity={1}/>
        <directionalLight position={[1,1,1]} intensity={1}/>
        <OrbitControls/>
    </Canvas>
    </div>
  )
}

export default Editor
