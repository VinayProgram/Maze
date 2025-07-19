import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three-stdlib'

const Player=()=>{
    const fbx=useLoader(FBXLoader, '/Walking.fbx')
    return(
        <mesh position={[0,0,0]} rotation={[0,0,0]} scale={[1,1,1]}>
        <primitive object={fbx} />
        </mesh>
    )
}

export default Player;