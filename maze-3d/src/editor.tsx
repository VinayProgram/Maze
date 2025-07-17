import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

const Editor = () => {
  return (
    <Canvas>
        <mesh>
            <boxGeometry/>
            <meshBasicMaterial color="red" />
        </mesh>
        <OrbitControls/>
    </Canvas>
  )
}

export default Editor
