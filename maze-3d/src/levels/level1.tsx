import * as THREE from 'three'

const LevelOne = () => {
  return (
    <>
    <mesh>
        <boxGeometry args={[100,1000,100]}/>
        <meshBasicMaterial side={THREE.DoubleSide}/>
    </mesh>
    </>
  )
}

export default LevelOne
